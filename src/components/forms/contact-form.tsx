"use client";

import { company, enquiryTypes } from "@/data/site";
import { Field, FormFeedback, Honeypot, Select, SubmitButton, TextArea, useEnquiry } from "./fields";

export function ContactForm() {
  const { status, error, onSubmit } = useEnquiry("contact");

  return (
    <form onSubmit={onSubmit} className="relative grid flex-1 gap-4 sm:grid-cols-2 lg:grid-rows-[auto_auto_auto_1fr_auto_auto]">
      <Honeypot />
      <Field label="Full Name" name="fullName" required autoComplete="name" className="sm:col-span-2" />
      <Field label="Email Address" name="email" type="email" required autoComplete="email" />
      <Field label="Phone Number" name="phone" type="tel" required autoComplete="tel" />
      <Select label="Type of Enquiry" name="enquiryType" options={enquiryTypes} />
      <Select label="Location" name="location" options={company.regions} />
      <TextArea label="Message" name="message" grow className="sm:col-span-2" />
      <div className="flex flex-col gap-3 pt-1 sm:col-span-2">
        <SubmitButton status={status} full>
          Book your appointment now
        </SubmitButton>
        <p className="text-center text-sm text-muted">By submitting, you consent to us contacting you about your enquiry.</p>
      </div>
      <div className="sm:col-span-2">
        <FormFeedback
          status={status}
          error={error}
          success={
            <>
              <p className="font-display font-semibold">Thank you — we&apos;ve received your enquiry.</p>
              <p className="text-sm">A member of our team will be in touch shortly. For anything urgent, call {company.phone.display}.</p>
            </>
          }
        />
      </div>
    </form>
  );
}
