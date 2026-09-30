// Lead email alert: sends each new contact-form lead to Amir's Gmail through Cloudflare Email Routing.
import { EmailMessage } from "cloudflare:email";

const FROM = "leads@amirmirsaeid.ca";
const TO = "amir.mirsaeed@gmail.com";

function oneLine(v) {
  return String(v ?? "").replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(v) {
  const s = oneLine(v);
  return /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`;
}

function base64Body(text) {
  const b = btoa(unescape(encodeURIComponent(text)));
  return b.replace(/.{1,76}/g, (m) => m + "\r\n");
}

export async function sendLeadAlert(env, lead, country) {
  if (!env.SEND_EMAIL) return;
  const name = oneLine(lead.name);
  const replyTo = oneLine(lead.email);
  const subject = `New lead: ${name}${lead.company ? " (" + oneLine(lead.company) + ")" : ""}`;
  const body = [
    "New message from the contact form on amirmirsaeid.ca",
    "",
    `Name:     ${name}`,
    `Email:    ${replyTo}`,
    `Company:  ${lead.company || "-"}`,
    `Website:  ${lead.website || "-"}`,
    `Service:  ${lead.service || "-"}`,
    `Country:  ${country || "-"}`,
    "",
    "Message:",
    lead.message,
    "",
    "Reply to this email to answer them directly.",
  ].join("\n");

  const raw = [
    `From: Amir website <${FROM}>`,
    `To: ${TO}`,
    `Reply-To: ${encodeHeader(name)} <${replyTo}>`,
    `Subject: ${encodeHeader(subject)}`,
    `Message-ID: <${crypto.randomUUID()}@amirmirsaeid.ca>`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Body(body),
  ].join("\r\n");

  await env.SEND_EMAIL.send(new EmailMessage(FROM, TO, raw));
}
