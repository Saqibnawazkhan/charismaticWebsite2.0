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

/* ---------------------------------------------------------------- Orb */

/** The assistant's living avatar: morphing gradient blobs inside a glossy sphere. */
export function Orb({ size = 40, active = false, className }: { size?: number; active?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn("relative isolate inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-navy-700", className)}
    >
      <span className={cn("absolute inset-[-10%] animate-morph bg-linear-to-br from-brand-400 via-brand-600 to-iris opacity-90", active && "[animation-duration:3s]")} />
      <span
        className={cn(
          "absolute inset-[8%] animate-morph bg-linear-to-tr from-blush/80 via-transparent to-navy-400/90 mix-blend-screen [animation-delay:-4s] [animation-direction:reverse]",
          active && "[animation-duration:2.5s]",
        )}
      />
      <span className="absolute top-[14%] left-[22%] h-[28%] w-[40%] rounded-full bg-white/45 blur-[3px]" />
      <span className={cn("absolute inset-0 rounded-full ring-1 ring-white/30 ring-inset", active && "animate-pulse")} />
    </span>
  );
}

/* ---------------------------------------------------------------- Launcher */

function Launcher({ open, teaser, onToggle, onDismissTeaser }: { open: boolean; teaser: boolean; onToggle: () => void; onDismissTeaser: () => void }) {
  return (
    <div className="relative">
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.45, ease }}
            className="absolute right-[calc(100%+0.9rem)] bottom-1 w-[min(15.5rem,calc(100vw-7rem))] rounded-2xl rounded-br-md bg-white p-4 shadow-[0_20px_50px_-15px_rgb(27_20_53/0.45)] ring-1 ring-brand-100"
          >
            <button
              type="button"
              onClick={onDismissTeaser}
              aria-label="Dismiss"
              className="absolute top-2 right-2 grid size-6 place-items-center rounded-full text-muted hover:bg-brand-50 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
            <p className="font-display text-sm font-semibold text-ink">Hi, I&apos;m {NAME} 👋</p>
            <p className="mt-1 pr-3 text-sm leading-snug text-muted">Questions about care? I can answer them or arrange a call back.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onToggle}
        aria-label={open ? `Close ${NAME}, the AI assistant` : `Chat with ${NAME}, our AI assistant`}
        aria-expanded={open}
        className="group relative grid size-16 place-items-center rounded-full shadow-glow transition-transform duration-500 hover:scale-105 active:scale-95"
      >
        {/* Rotating gradient ring */}
        <span className="absolute -inset-[3px] animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#9900cc,#7468f2,#f48fd8,#003399,#9900cc)] [animation-duration:6s]" />
        <span className="absolute inset-0 rounded-full bg-navy-950" />
        {!open && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/40" />}
        <span className="relative grid size-[3.4rem] place-items-center">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
                <X className="size-6 text-white" />
              </motion.span>
            ) : (
              <motion.span key="orb" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.3 }}>
                <Orb size={52} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        {!open && (
          <span className="absolute -top-1 -right-1 rounded-full bg-white px-1.5 py-0.5 font-display text-[0.6rem] font-bold tracking-wider text-brand-600 shadow-md ring-1 ring-brand-100">
            AI
          </span>
        )}
      </button>
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

  // Keep the newest message in view.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
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
          <Orb size={44} active={busy} />
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
    <div className="relative flex flex-col items-center pt-4 text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}>
        <Orb size={84} className="shadow-glow" />
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
      <div className="mt-6 grid w-full grid-cols-2 gap-2.5">
        {starters.map(({ icon: Icon, label }, i) => (
          <motion.button
            key={label}
            type="button"
            onClick={() => onPick(label)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.07, duration: 0.5, ease }}
            className="group flex flex-col items-start gap-3 rounded-2xl bg-white p-3.5 text-left shadow-card ring-1 ring-brand-100/70 transition-all hover:-translate-y-0.5 hover:ring-brand-300"
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
      <Orb size={28} active={item.streaming} className="mt-1" />
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
