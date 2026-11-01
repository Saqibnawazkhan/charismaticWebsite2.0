"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronDown, Loader2, Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { ease } from "@/components/ui/motion";

const control =
  "peer w-full rounded-2xl border border-brand-100 bg-white px-5 pt-6 pb-2.5 text-ink outline-none transition-all duration-300 placeholder:text-transparent hover:border-brand-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10";
const floatingLabel =
  "pointer-events-none absolute left-5 top-2 font-display text-[0.7rem] font-medium tracking-wide text-brand-600 uppercase transition-all duration-300 peer-placeholder-shown:top-[1.15rem] peer-placeholder-shown:text-[0.95rem] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted peer-focus:top-2 peer-focus:text-[0.7rem] peer-focus:uppercase peer-focus:tracking-wide peer-focus:text-brand-600";

type InputProps = { label: string; name: string; type?: string; required?: boolean; autoComplete?: string; className?: string };

export function Field({ label, name, type = "text", required, autoComplete, className }: InputProps) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} placeholder={label} className={control} />
      <label htmlFor={id} className={floatingLabel}>
        {label}
        {required && " *"}
      </label>
    </div>
  );
}

export function TextArea({ label, name, required, className, rows = 4, grow = false }: InputProps & { rows?: number; grow?: boolean }) {
  const id = useId();
  return (
    <div className={cn("relative", grow && "h-full", className)}>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        placeholder={label}
        className={cn(control, "resize-none", grow && "h-full min-h-32")}
      />
      <label htmlFor={id} className={floatingLabel}>
        {label}
        {required && " *"}
      </label>
    </div>
  );
}

export function Select({ label, name, options, required, className }: InputProps & { options: string[] }) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <select id={id} name={name} required={required} defaultValue="" className={cn(control, "appearance-none pr-12 invalid:text-muted")}>
        <option value="" disabled>
          Choose an option…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      <label htmlFor={id} className="pointer-events-none absolute top-2 left-5 font-display text-[0.7rem] font-medium tracking-wide text-brand-600 uppercase">
        {label}
        {required && " *"}
      </label>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-5 size-5 -translate-y-1/2 text-brand-500" />
    </div>
  );
}

export function FileField({ label, name, accept, required, className }: InputProps & { accept: string }) {
  const id = useId();
  const [fileName, setFileName] = useState<string>("");
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 px-5 py-4 transition-colors hover:border-brand-400 hover:bg-brand-50",
        className,
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
        <Paperclip className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold text-ink">
          {label}
          {required && " *"}
        </span>
        <span className="block truncate text-sm text-muted">{fileName || "PDF, DOC or DOCX — up to 5 MB"}</span>
      </span>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        required={required}
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        className="sr-only"
      />
    </label>
  );
}

/** Hidden field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

/** Shared submit logic: posts the form to /api/enquiry and tracks status. */
export function useEnquiry(formType: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("formType", formType);
    data.set("page", window.location.pathname);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiry/", { method: "POST", body: data });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return { status, error, onSubmit, reset: () => setStatus("idle") };
}

export function SubmitButton({ status, children, full = false }: { status: Status; children: ReactNode; full?: boolean }) {
  return (
    <Button type="submit" disabled={status === "sending"} className={full ? "w-full py-4!" : "w-full sm:w-auto"}>
      {status === "sending" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4" />}
      {status === "sending" ? "Sending…" : children}
    </Button>
  );
}

export function FormFeedback({ status, error, success }: { status: Status; error: string; success: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {status === "sent" && (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          role="status"
          className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-200"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>{success}</div>
        </motion.div>
      )}
      {status === "error" && (
        <motion.p
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="alert"
          className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
