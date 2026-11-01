import { company } from "@/data/site";
import { sendTeamEmail } from "@/lib/email";

/**
 * Receives the website's forms (contact, brochure request, job application).
 *
 * Emails are delivered through Resend (https://resend.com) when RESEND_API_KEY is set.
 * Without it the submission is logged to the server console, which is handy in development.
 * See .env.example for the available settings.
 */

const REQUIRED: Record<string, string[]> = {
  contact: ["fullName", "email", "phone"],
  brochure: ["firstName", "lastName", "email", "phone"],
  job: ["fullName", "email", "phone", "bio"],
};

const SUBJECTS: Record<string, string> = {
  contact: "New website enquiry",
  brochure: "Brochure request",
  job: "New job application",
};

const LABELS: Record<string, string> = {
  fullName: "Full name",
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  enquiryType: "Type of enquiry",
  location: "Location",
  message: "Message",
  heardAbout: "Where they heard about us",
  bio: "About the applicant",
  position: "Position",
  page: "Submitted from",
};

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_TYPES = /\.(pdf|doc|docx)$/i;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (form.get("website")) return Response.json({ ok: true });

  const formType = String(form.get("formType") ?? "contact");
  const required = REQUIRED[formType];
  if (!required) return Response.json({ ok: false, error: "Unknown form." }, { status: 400 });

  const fields: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string" && key !== "formType" && key !== "website") fields[key] = value.trim().slice(0, 5000);
  }

  const missing = required.filter((k) => !fields[k]);
  if (missing.length) {
    return Response.json({ ok: false, error: `Please complete: ${missing.map((k) => LABELS[k] ?? k).join(", ")}.` }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  }

  const attachments: { filename: string; content: string }[] = [];
  const cv = form.get("cv");
  if (formType === "job") {
    if (!(cv instanceof File) || cv.size === 0) {
      return Response.json({ ok: false, error: "Please attach your CV." }, { status: 422 });
    }
    if (!CV_TYPES.test(cv.name) || cv.size > MAX_CV_BYTES) {
      return Response.json({ ok: false, error: "Your CV must be a PDF, DOC or DOCX file under 5 MB." }, { status: 422 });
    }
    attachments.push({ filename: cv.name, content: Buffer.from(await cv.arrayBuffer()).toString("base64") });
  }

  const name = fields.fullName || `${fields.firstName ?? ""} ${fields.lastName ?? ""}`.trim();
  const subject = `${SUBJECTS[formType]} — ${name}`;
  const text = [
    `${SUBJECTS[formType]} from the Charismatic Care website`,
    "",
    ...Object.entries(fields).map(([k, v]) => `${LABELS[k] ?? k}: ${v}`),
    attachments.length ? `\nCV attached: ${attachments[0].filename}` : "",
  ].join("\n");

  const sent = await sendTeamEmail({ subject, text, replyTo: fields.email, attachments });
  if (!sent) {
    return Response.json(
      { ok: false, error: `Sorry, we couldn't send your message. Please call us on ${company.phone.display}.` },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
