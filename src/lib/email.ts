import { company } from "@/data/site";

export type Attachment = { filename: string; content: string };

/**
 * Sends a plain-text email to the Charismatic Care team through Resend (https://resend.com).
 * Without RESEND_API_KEY the message is printed to the server console instead, which is
 * handy in development. Returns false only when a configured send fails.
 */
export async function sendTeamEmail({
  subject,
  text,
  replyTo,
  attachments = [],
}: {
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: Attachment[];
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[email] ${subject}\n${text}`);
    return true;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM_EMAIL ?? "Charismatic Care Website <onboarding@resend.dev>",
      to: (process.env.ENQUIRY_TO_EMAIL ?? company.email).split(",").map((e) => e.trim()),
      reply_to: replyTo,
      subject,
      text,
      attachments: attachments.length ? attachments : undefined,
    }),
  });

  if (!res.ok) {
    console.error("[email] delivery failed", res.status, await res.text());
    return false;
  }
  return true;
}
