"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { heardAboutOptions } from "@/data/site";
import { getLenis } from "@/lib/lenis";
import { ease } from "@/components/ui/motion";
import { Field, FormFeedback, Honeypot, Select, SubmitButton, useEnquiry } from "./fields";

export function Modal({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-navy-950/70 p-4 backdrop-blur-md"
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-mist text-ink transition-colors hover:bg-brand-500 hover:text-white"
            >
              <X className="size-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function BrochureModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { status, error, onSubmit } = useEnquiry("brochure");

  return (
    <Modal open={open} onClose={onClose} label="Download our brochure">
      <div className="grid md:grid-cols-[0.8fr_1.2fr]">
        <div className="relative hidden bg-hero p-8 md:block">
          <div className="relative mx-auto mt-10 aspect-[1125/1410] w-full max-w-[240px]">
            <Image
              src="/images/misc/brochure.webp"
              alt="Charismatic Care brochure"
              fill
              sizes="240px"
              className="object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
            />
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Download Our Brochure</h2>
          <p className="mt-2 text-muted">
            Discover more about our services and how we can support your needs. Our brochure provides detailed information about what we offer,
            our approach, and how we can help you.
          </p>
          <form onSubmit={onSubmit} className="relative mt-6 grid gap-3 sm:grid-cols-2">
            <Honeypot />
            <Field label="First Name" name="firstName" required autoComplete="given-name" />
            <Field label="Last Name" name="lastName" required autoComplete="family-name" />
            <Field label="Email" name="email" type="email" required autoComplete="email" className="sm:col-span-2" />
            <Field label="Phone" name="phone" type="tel" required autoComplete="tel" className="sm:col-span-2" />
            <Select label="Where did you hear about us?" name="heardAbout" options={heardAboutOptions} className="sm:col-span-2" />
            <p className="text-xs text-muted sm:col-span-2">By submitting, you consent to us contacting you about your enquiry.</p>
            <div className="sm:col-span-2">
              <SubmitButton status={status}>Send me the brochure</SubmitButton>
            </div>
            <div className="sm:col-span-2">
              <FormFeedback
                status={status}
                error={error}
                success={<p className="text-sm">Thank you! Our team will send the Charismatic Care brochure to your email shortly.</p>}
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
