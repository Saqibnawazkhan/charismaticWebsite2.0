"use client";

import { Field, FileField, FormFeedback, Honeypot, SubmitButton, TextArea, useEnquiry } from "./fields";

export function JobApplicationForm({ position }: { position: string }) {
  const { status, error, onSubmit } = useEnquiry("job");

  return (
    <form onSubmit={onSubmit} className="relative grid gap-4">
      <Honeypot />
      <input type="hidden" name="position" value={position} />
      <Field label="Full Name" name="fullName" required autoComplete="name" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
      </div>
      <TextArea label="Tell us about yourself" name="bio" required rows={5} />
      <FileField label="Upload CV / Resume" name="cv" accept=".pdf,.doc,.docx" required />
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" required className="mt-1 size-4 accent-brand-500" />
        By using this form you agree with the storage and handling of your data by this website. *
      </label>
      <div>
        <SubmitButton status={status}>Submit application</SubmitButton>
      </div>
      <FormFeedback
        status={status}
        error={error}
        success={
          <>
            <p className="font-display font-semibold">Application received — thank you!</p>
            <p className="text-sm">Our recruitment team will review your application and be in touch.</p>
          </>
        }
      />
    </form>
  );
}
