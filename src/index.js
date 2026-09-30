// Amir SEO website: serves the static site from /public and handles the contact form.
// POST /api/contact  ->  validates the lead and stores it in the D1 database (binding: DB).

const MAX = { name: 120, email: 200, company: 160, website: 200, service: 80, message: 4000 };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function clean(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Please submit the form again." }, 400);
  }

  // Honeypot: real visitors never fill this hidden field, bots usually do.
  if (clean(data.company_url, 200)) return json({ ok: true });

  const lead = {
    name: clean(data.name, MAX.name),
    email: clean(data.email, MAX.email),
    company: clean(data.company, MAX.company),
    website: clean(data.website, MAX.website),
    service: clean(data.service, MAX.service),
    message: clean(data.message, MAX.message),
  };

  if (!lead.name || !lead.message) return json({ error: "Please add your name and your goals." }, 400);
  if (!EMAIL_RE.test(lead.email)) return json({ error: "Please enter a valid email address." }, 400);

  await env.DB.prepare(
    `INSERT INTO leads (name, email, company, website, service, message, country, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      lead.name,
      lead.email,
      lead.company || null,
      lead.website || null,
      lead.service || null,
      lead.message,
      request.cf?.country ?? null,
      clean(request.headers.get("User-Agent"), 300) || null
    )
    .run();

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      try {
        return await handleContact(request, env);
      } catch (err) {
        console.error("contact form error", err);
        return json({ error: "Your request could not be sent. Please try again in a moment." }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
