# Amir, SEO & AI Consultant

Website for Amir's SEO & AI consulting services, hosted on Cloudflare Workers.

- `public/`: the static site (`index.html`, `robots.txt`, `sitemap.xml`)
- `src/index.js`: a small Worker that serves the site and handles the contact form at `POST /api/contact`
- `wrangler.jsonc`: Cloudflare config, including the `amir-seo-leads` D1 database that stores leads
- `schema.sql`: the `leads` table (already created in the database)

## Deploy
In the Cloudflare dashboard: **Workers & Pages → Create → Import a repository**, pick this repo and deploy. Leave the build command empty. Cloudflare reads `wrangler.jsonc` automatically. Every push to `main` redeploys.

## View leads
Cloudflare dashboard → **Storage & Databases → D1 → amir-seo-leads → Console**, then run:

```sql
SELECT * FROM leads ORDER BY created_at DESC;
```
