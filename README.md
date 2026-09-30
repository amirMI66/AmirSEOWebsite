# Amir SEO

Website for Amir's SEO consulting services. A single static page (`index.html`) with no build step, deployed on Cloudflare.

## Deploy on Cloudflare
In the Cloudflare dashboard: **Workers & Pages → Create → Import a repository**, pick this repo, leave the build command empty and set the output directory to `/`. Every push to `main` then redeploys the site.
