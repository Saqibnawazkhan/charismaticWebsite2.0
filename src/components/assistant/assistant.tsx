"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUp,
  BookOpenText,
  Briefcase,
  Check,
  Copy,
  HeartHandshake,
  Loader2,
  MapPin,
  Mic,
  PhoneCall,
  RotateCcw,
  Square,
  Volume2,
  X,
} from "lucide-react";
import { company } from "@/data/site";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/lenis";
import { ease } from "@/components/ui/motion";
import { ChatMarkdown, toPlainText } from "./markdown";
import { CharisAvatar, ChatSparkleIcon } from "./icons";

const NAME = "Charis";
const STORAGE_KEY = "cc-assistant-v1";
const OPEN_EVENT = "cc:open-assistant";

type Item =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; text: string; streaming?: boolean; error?: boolean; tool?: "start" | "done" | "error" }
  | { id: string; role: "note"; text: string };

type Saved = { items: Item[]; history: unknown[]; easyRead: boolean; sentEasyRead: boolean };

const starters = [
  { icon: HeartHandshake, label: "What services do you offer?" },
  { icon: MapPin, label: "Do you cover my area?" },
  { icon: PhoneCall, label: "I'd like a call back" },
  { icon: Briefcase, label: "Are you hiring?" },
];
const chips = ["Arrange a call back", "How much does care cost?", "Which areas do you cover?", "How does supported living work?"];

/** Opens the assistant from anywhere on the site, optionally sending a question straight away. */
export function openAssistant(prompt?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { prompt } }));
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [easyRead, setEasyRead] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const history = useRef<unknown[]>([]);
  const sentEasyRead = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const pendingPrompt = useRef<string | null>(null);

  // Restore this tab's conversation.
  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as Saved | null;
      if (saved) {
        setItems(saved.items.filter((i) => !(i.role === "assistant" && i.streaming)));
        history.current = saved.history;
        setEasyRead(saved.easyRead);
        sentEasyRead.current = saved.sentEasyRead;
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted || busy) return;
    const saved: Saved = { items, history: history.current, easyRead, sentEasyRead: sentEasyRead.current };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {}
  }, [items, easyRead, busy, mounted]);

  // A friendly nudge, once per session.
  useEffect(() => {
    if (sessionStorage.getItem("cc-assistant-teased")) return;
    const t = setTimeout(() => {
      setTeaser(true);
      sessionStorage.setItem("cc-assistant-teased", "1");
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setTeaser(false);
      const replyId = uid();
      setItems((prev) => [...prev, { id: uid(), role: "user", text }, { id: replyId, role: "assistant", text: "", streaming: true }]);
      setBusy(true);

      const patch = (fn: (item: Extract<Item, { role: "assistant" }>) => Partial<Extract<Item, { role: "assistant" }>>) =>
        setItems((prev) => prev.map((it) => (it.id === replyId && it.role === "assistant" ? { ...it, ...fn(it) } : it)));

      const controller = new AbortController();
      abort.current = controller;
      const easyReadChanged = easyRead !== sentEasyRead.current;
      try {
        const res = await fetch("/api/assistant/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history: history.current, text, easyRead, easyReadChanged }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const err = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(err?.error ?? `Sorry, I couldn't connect. Please try again or call ${company.phone.display}.`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let afterTool = false;
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const e = JSON.parse(line) as
              | { t: "text"; d: string }
              | { t: "tool"; state: "start" | "done" | "error" }
              | { t: "turn"; messages: unknown[] }
              | { t: "error"; message: string };
            if (e.t === "text") {
              const sep = afterTool ? "\n\n" : "";
              afterTool = false;
              patch((it) => ({ text: it.text + (it.text && sep ? sep : "") + e.d }));
            } else if (e.t === "tool") {
              afterTool = true;
              patch(() => ({ tool: e.state }));
            } else if (e.t === "turn") {
              if (e.messages.length) {
                history.current = [...history.current, ...e.messages];
                if (easyReadChanged) sentEasyRead.current = easyRead;
              }
            } else if (e.t === "error") {
              patch((it) => ({ text: it.text ? `${it.text}\n\n${e.message}` : e.message, error: true }));
            }
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          patch(() => ({ text: err instanceof Error ? err.message : "Something went wrong.", error: true }));
        }
      } finally {
        patch((it) => ({ streaming: false, text: it.text || (controller.signal.aborted ? "Stopped." : it.text) }));
        setBusy(false);
        abort.current = null;
      }
    },
    [busy, easyRead],
  );

  // Open from elsewhere on the site (e.g. "Ask our assistant" buttons).
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      setTeaser(false);
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (prompt) pendingPrompt.current = prompt;
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);
  useEffect(() => {
    if (open && pendingPrompt.current && !busy) {
      const p = pendingPrompt.current;
      pendingPrompt.current = null;
      void send(p);
    }
  }, [open, busy, send]);

  const reset = () => {
    abort.current?.abort();
    history.current = [];
    sentEasyRead.current = false;
    setEasyRead(false);
    setItems([]);
  };

  const toggleEasyRead = () => {
    const next = !easyRead;
    setEasyRead(next);
    setItems((prev) =>
      prev.length
        ? [...prev, { id: uid(), role: "note", text: next ? "Easy Read is on — I'll use short, simple sentences." : "Easy Read is off." }]
        : prev,
    );
  };

  return (
    <>
      <Launcher open={open} teaser={teaser} onToggle={() => setOpen((v) => !v)} onDismissTeaser={() => setTeaser(false)} />
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <Panel
                items={items}
                busy={busy}
                easyRead={easyRead}
                onSend={send}
                onStop={() => abort.current?.abort()}
                onReset={reset}
                onToggleEasyRead={toggleEasyRead}
                onClose={() => setOpen(false)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

/* ---------------------------------------------------------------- Launcher */

function Launcher({ open, teaser, onToggle, onDismissTeaser }: { open: boolean; teaser: boolean; onToggle: () => void; onDismissTeaser: () => void }) {
  return (
    <div className="relative flex justify-end">
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.45, ease }}
            style={{ transformOrigin: "bottom right" }}
            className="absolute right-[calc(100%+0.75rem)] bottom-0 w-[min(15rem,calc(100vw-6.5rem))] rounded-2xl bg-white p-4 shadow-[0_24px_60px_-18px_rgb(27_20_53/0.5)] ring-1 ring-brand-100 sm:right-0 sm:bottom-[calc(100%+0.9rem)] sm:w-64"
          >
            <span aria-hidden className="absolute right-7 -bottom-1.5 hidden size-3 rotate-45 bg-white ring-1 ring-brand-100 [clip-path:polygon(100%_0,100%_100%,0_100%)] sm:block" />
            <button
              type="button"
              onClick={onDismissTeaser}
              aria-label="Dismiss"
              className="absolute top-2 right-2 grid size-6 place-items-center rounded-full text-muted hover:bg-brand-50 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <CharisAvatar size={36} />
              <div className="pr-3">
                <p className="font-display text-sm font-semibold text-ink">Hi, I&apos;m {NAME}!</p>
                <p className="mt-0.5 text-sm leading-snug text-muted">Questions about care? I can answer them or arrange a call back.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout" initial={false}>
        {open ? (
          <motion.button
            key="close"
            type="button"
            onClick={onToggle}
            aria-label={`Close ${NAME}, the AI assistant`}
            aria-expanded
            initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="grid size-14 place-items-center rounded-full bg-navy-950 text-white shadow-[0_18px_40px_-12px_rgb(10_13_51/0.7)] ring-1 ring-white/15 transition-colors hover:bg-brand-600"
          >
            <X className="size-6" />
          </motion.button>
        ) : (
          <motion.button
            key="open"
            type="button"
            onClick={onToggle}
            aria-label={`Chat with ${NAME}, our AI assistant`}
            aria-expanded={false}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="group relative"
          >
            {/* Soft breathing glow */}
            <span aria-hidden className="absolute -inset-1.5 animate-pulse rounded-full bg-linear-to-r from-brand-500 via-iris to-navy-500 opacity-50 blur-lg" />
            <span className="relative isolate flex h-14 items-center gap-3 overflow-hidden rounded-full p-2 text-white ring-1 ring-white/25 transition-transform duration-500 group-hover:-translate-y-0.5 group-active:scale-95 sm:pr-6">
              {/* Flowing brand gradient, gloss and a light sweep */}
              <span aria-hidden className="absolute inset-0 -z-10 animate-gradient-pan bg-[linear-gradient(115deg,#9900cc,#7468f2,#3c2fb8,#9900cc)] bg-[length:240%_100%]" />
              <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_25%_0%,rgb(255_255_255/0.32),transparent_55%)]" />
              <span aria-hidden className="absolute inset-y-0 left-0 -z-10 w-1/3 animate-shine bg-linear-to-r from-transparent via-white/30 to-transparent [animation-duration:4.5s]" />

              <span className="relative grid size-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/35 backdrop-blur-sm transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
                <ChatSparkleIcon className="size-[30px] translate-x-[1px] drop-shadow-[0_1px_2px_rgb(43_10_90/0.4)]" />
                <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[#5b2fd0]" />
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block font-display text-[0.97rem] font-semibold tracking-wide">Ask {NAME}</span>
                <span className="block text-[0.72rem] font-medium text-white/80">AI assistant · online</span>
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- Panel */

function Panel({
  items,
  busy,
  easyRead,
  onSend,
  onStop,
  onReset,
  onToggleEasyRead,
  onClose,
}: {
  items: Item[];
  busy: boolean;
  easyRead: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onReset: () => void;
  onToggleEasyRead: () => void;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState("");
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsPhone(mq.matches);
    input.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Full-screen on phones: pause the page behind.
    if (mq.matches) {
      getLenis()?.stop();
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      if (mq.matches) {
        getLenis()?.start();
        document.documentElement.style.overflow = "";
      }
    };
  }, [onClose]);

  // Keep the newest message in view (the welcome screen stays scrolled to the top).
  useEffect(() => {
    const el = scroller.current;
    if (el && items.length > 0) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [items]);

  const submit = (text = draft) => {
    if (!text.trim() || busy) return;
    onSend(text);
    setDraft("");
  };

  // On phones, following a link closes the chat so the page is visible.
  const onNavigate = () => isPhone && onClose();

  return (
    <motion.div
      role="dialog"
      aria-modal={isPhone}
      aria-label={`${NAME}, Charismatic Care's AI assistant`}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      style={{ transformOrigin: "bottom right" }}
      className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-mist sm:inset-auto sm:right-6 sm:bottom-28 sm:h-[min(680px,calc(100dvh-10rem))] sm:w-[420px] sm:rounded-[2rem] sm:shadow-[0_40px_120px_-30px_rgb(10_13_51/0.55)] sm:ring-1 sm:ring-brand-100"
    >
      {/* Header */}
      <div className="grain relative shrink-0 overflow-hidden bg-hero px-5 pt-5 pb-4 text-white">
        <div aria-hidden className="absolute -top-16 -right-10 size-48 animate-aurora rounded-full bg-brand-500/50 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <CharisAvatar size={44} active={busy} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg leading-tight font-semibold">{NAME}</p>
            <p className="flex items-center gap-1.5 text-xs text-white/70">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              {busy ? "Typing…" : "AI assistant · online"}
            </p>
          </div>
          <HeaderButton label="Call the team" href={company.phone.href}>
            <PhoneCall className="size-4" />
          </HeaderButton>
          {items.length > 0 && (
            <HeaderButton label="Start a new chat" onClick={onReset}>
              <RotateCcw className="size-4" />
            </HeaderButton>
          )}
          <HeaderButton label="Close" onClick={onClose}>
            <X className="size-5" />
          </HeaderButton>
        </div>
        <button
          type="button"
          onClick={onToggleEasyRead}
          aria-pressed={easyRead}
          className="relative mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/[0.08] px-3.5 py-2.5 text-left ring-1 ring-white/15 transition-colors hover:bg-white/[0.12]"
        >
          <BookOpenText className="size-4 shrink-0 text-brand-200" />
          <span className="flex-1 text-sm">
            <span className="font-semibold">Easy Read</span>
            <span className="text-white/60"> · short, simple answers</span>
          </span>
          <span className={cn("relative h-6 w-11 rounded-full transition-colors duration-300", easyRead ? "bg-emerald-400" : "bg-white/25")}>
            <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className={cn("absolute top-1 size-4 rounded-full bg-white shadow", easyRead ? "right-1" : "left-1")} />
          </span>
        </button>
      </div>

      {/* Conversation */}
      <div ref={scroller} data-lenis-prevent className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-5">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
        {items.length === 0 ? (
          <Welcome onPick={submit} />
        ) : (
          <ul className="relative flex flex-col gap-4" aria-live="polite">
            {items.map((item) => (
              <Message key={item.id} item={item} onNavigate={onNavigate} />
            ))}
          </ul>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-brand-100/70 bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {items.length > 0 && !busy && (
          <div data-lenis-prevent className="-mx-3 mb-2.5 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none]">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => submit(c)}
                className="shrink-0 rounded-full bg-mist px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100 transition-colors hover:bg-brand-500 hover:text-white"
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 rounded-[1.4rem] bg-mist p-1.5 ring-1 ring-brand-100 transition-shadow focus-within:ring-2 focus-within:ring-brand-400">
          <VoiceButton onResult={(t) => setDraft(t)} disabled={busy} />
          <textarea
            ref={input}
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={`Ask ${NAME} anything about our care…`}
            aria-label="Your message"
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-1 py-2.5 text-[0.95rem] text-ink outline-none placeholder:text-muted/70 [field-sizing:content]"
          />
          {busy ? (
            <button type="button" onClick={onStop} aria-label="Stop" className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform active:scale-90">
              <Square className="size-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => submit()}
              disabled={!draft.trim()}
              aria-label="Send"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-500 to-navy-500 text-white shadow-glow transition-all active:scale-90 disabled:opacity-40 disabled:shadow-none"
            >
              <ArrowUp className="size-5" />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[0.68rem] leading-tight text-muted">
          {NAME} is an AI assistant and can make mistakes. In an emergency call <strong>999</strong>.
        </p>
      </div>
    </motion.div>
  );
}

function HeaderButton({ label, onClick, href, children }: { label: string; onClick?: () => void; href?: string; children: ReactNode }) {
  const cls = "grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-navy-700";
  return href ? (
    <a href={href} aria-label={label} title={label} className={cls}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={cls}>
      {children}
    </button>
  );
}

function Welcome({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="relative flex flex-col items-center pt-5 text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}>
        <CharisAvatar size={72} halo />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease }}
        className="mt-5 font-display text-2xl font-semibold text-ink"
      >
        Hi, I&apos;m <span className="text-gradient">{NAME}</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5, ease }} className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
        I can answer questions about our care services, the areas we cover and careers — and I can arrange a call back with our team.
      </motion.p>
      <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
        {starters.map(({ icon: Icon, label }, i) => (
          <motion.button
            key={label}
            type="button"
            onClick={() => onPick(label)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.07, duration: 0.5, ease }}
            className="group flex flex-col items-start gap-2.5 rounded-2xl bg-white p-3 text-left shadow-card ring-1 ring-brand-100/70 transition-all hover:-translate-y-0.5 hover:ring-brand-300"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-linear-to-br group-hover:from-brand-500 group-hover:to-navy-500 group-hover:text-white">
              <Icon className="size-4" />
            </span>
            <span className="font-display text-[0.85rem] leading-snug font-medium text-ink">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Message({ item, onNavigate }: { item: Item; onNavigate: () => void }) {
  if (item.role === "note") {
    return (
      <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative self-center rounded-full bg-white px-3 py-1 text-xs text-muted ring-1 ring-brand-100">
        {item.text}
      </motion.li>
    );
  }

  if (item.role === "user") {
    return (
      <motion.li
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease }}
        className="relative max-w-[85%] self-end rounded-[1.4rem] rounded-br-md bg-linear-to-br from-brand-500 to-navy-500 px-4 py-2.5 text-[0.95rem] leading-relaxed whitespace-pre-wrap text-white shadow-[0_10px_30px_-12px_rgb(153_0_204/0.6)]"
      >
        {item.text}
      </motion.li>
    );
  }

  const waiting = item.streaming && !item.text && !item.tool;
  return (
    <motion.li initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }} className="relative flex max-w-[92%] items-start gap-2.5 self-start">
      <CharisAvatar size={30} active={item.streaming} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "rounded-[1.4rem] rounded-tl-md bg-white px-4 py-3 text-[0.95rem] leading-relaxed text-ink/85 shadow-card ring-1",
            item.error ? "ring-red-200" : "ring-brand-100/70",
          )}
        >
          {waiting ? (
            <span className="flex h-6 items-center gap-1.5" aria-label={`${NAME} is typing`}>
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="size-2 rounded-full bg-linear-to-br from-brand-500 to-iris"
                  animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </span>
          ) : (
            <>
              {item.tool && <ToolCard state={item.tool} />}
              {item.text && <ChatMarkdown text={item.text} onNavigate={onNavigate} />}
              {item.streaming && item.text && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-brand-500" />}
            </>
          )}
        </div>
        {!item.streaming && item.text && !item.error && <MessageActions text={item.text} />}
      </div>
    </motion.li>
  );
}

function ToolCard({ state }: { state: "start" | "done" | "error" }) {
  return (
    <div
      className={cn(
        "mb-3 flex items-center gap-3 rounded-2xl p-3 ring-1",
        state === "done" ? "bg-emerald-50 ring-emerald-200" : state === "error" ? "bg-red-50 ring-red-200" : "bg-brand-50 ring-brand-100",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl text-white",
          state === "done" ? "bg-emerald-500" : state === "error" ? "bg-red-500" : "bg-linear-to-br from-brand-500 to-navy-500",
        )}
      >
        {state === "start" ? <Loader2 className="size-4 animate-spin" /> : state === "done" ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" />}
      </span>
      <span className="text-sm leading-snug">
        <span className="block font-display font-semibold text-ink">
          {state === "start" ? "Sending your call-back request…" : state === "done" ? "Call-back requested" : "Couldn't send the request"}
        </span>
        <span className="text-muted">{state === "error" ? `Please call ${company.phone.display}` : "Our team will phone you soon"}</span>
      </span>
    </div>
  );
}

function MessageActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => () => void (canSpeak && speaking && window.speechSynthesis.cancel()), [canSpeak, speaking]);

  const speak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(toPlainText(text));
    u.lang = "en-GB";
    u.rate = 0.97;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang === "en-GB");
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const btn = "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.7rem] font-semibold text-muted transition-colors hover:bg-white hover:text-brand-600";
  return (
    <div className="mt-1 flex gap-1 pl-1">
      {canSpeak && (
        <button type="button" onClick={speak} className={btn} aria-pressed={speaking}>
          {speaking ? <Square className="size-3 fill-current" /> : <Volume2 className="size-3.5" />}
          {speaking ? "Stop" : "Listen"}
        </button>
      )}
      <button
        type="button"
        className={btn}
        onClick={() => {
          void navigator.clipboard?.writeText(toPlainText(text));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- Voice input */

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function VoiceButton({ onResult, disabled }: { onResult: (text: string) => void; disabled: boolean }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    setSupported(Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition));
    return () => rec.current?.stop();
  }, []);

  if (!supported) return <span className="w-1" />;

  const toggle = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "en-GB";
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => onResult(Array.from(e.results, (res) => res[0].transcript).join(""));
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    r.start();
    setListening(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      aria-label={listening ? "Stop voice input" : "Speak your question"}
      aria-pressed={listening}
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-full transition-colors disabled:opacity-40",
        listening ? "bg-red-500 text-white" : "text-brand-600 hover:bg-white",
      )}
    >
      {listening && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-500/50" />}
      <Mic className="relative size-5" />
    </button>
  );
}
