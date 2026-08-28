# devlog — a blog with a secure admin

A small blog built with [Eleventy](https://www.11ty.dev/) (a static site generator) and [Decap CMS](https://decapcms.org/) for a real, secure "create post" admin at `/admin` — no custom login code, no database. You log in with your GitHub account; every post you publish through the admin becomes a real git commit. Access is controlled entirely by GitHub repo permissions — only accounts with write access to the repo can ever log in.

## What's inside
- `src/` — the site source
  - `_layouts/base.njk` — shared header/nav/footer
  - `_layouts/post.njk` — article page shell
  - `index.njk`, `blog.njk`, `about.njk`, `contact.njk`, `privacy.njk` — pages
  - `posts/*.md` — blog posts (this is what the admin creates/edits)
  - `admin/` — the Decap CMS admin app (`index.html` + `config.yml`)
  - `style.css`, `script.js` — unchanged, site-wide styling and interactivity (theme toggle, search/filter, copy buttons, reading progress, typing hero)
- `.eleventy.js` — build config
- `netlify.toml` — build command + security headers for Netlify
- `_site/` — build output (generated, not committed)

## Local development
```bash
npm install
npm start        # builds + serves at http://localhost:8080 with live reload
npm run build     # one-off production build into _site/
```

## Writing a post (two ways)
**Through the admin (recommended, once deployed):** go to `yoursite.com/admin`, log in, click "New Post," fill in title/description/category/read time/date/body, and publish. It commits a new file under `src/posts/` straight to your repo, and Eleventy rebuilds the site automatically on the next deploy.

**By hand:** add a new `src/posts/your-slug.md` file with the same frontmatter fields as an existing post (see any file in `src/posts/`), write the body in Markdown, then commit. The homepage, `/blog.html`, and the version-tag numbering all update automatically — nothing else to edit by hand.

## Deploying and setting up the secure admin
This needs a few steps in your own GitHub/Netlify accounts — these are account-level actions, so they aren't something that can be done for you automatically.

> **Note:** Netlify's older "Identity + Git Gateway" combo (what a lot of Decap CMS tutorials still show) has Git Gateway deprecated for new setups — it no longer shows up in new sites' dashboards. This project uses Decap CMS's **GitHub backend** instead: Netlify only brokers the OAuth login, and GitHub itself controls who's allowed to publish (via repo write access) — no separate invite list to maintain, and nothing deprecated.

1. **Push to GitHub.** Already done — this repo is at `github.com/praveenMadanayake/devlog`.
2. **Connect Netlify.** At [app.netlify.com](https://app.netlify.com), "Add new site" → "Import an existing project" → pick the `devlog` repo. Netlify reads `netlify.toml` automatically (build command `npm run build`, publish directory `_site`).
3. **Register a GitHub OAuth App.** Go to [github.com/settings/developers](https://github.com/settings/developers) → OAuth Apps → "New OAuth App." Homepage URL can be your Netlify site URL; **Authorization callback URL** must be exactly:
   ```
   https://api.netlify.com/auth/done
   ```
   Register it, then generate a **Client Secret** and copy both the Client ID and Client Secret (the secret is only shown once).
4. **Add the OAuth provider in Netlify.** In your site's dashboard: **Project configuration → Access & security → OAuth** → under Authentication Providers, click **Install provider** → GitHub → paste in the Client ID and Client Secret → save.
5. Visit `yoursite.com/admin`, click **Login with GitHub**, authorize the app, and you're in.

From this point, `/admin` only ever accepts a login from a GitHub account that has write access to this repo — which by default is just you. Add a GitHub collaborator later if you ever want someone else to be able to publish; remove them from GitHub and their `/admin` access is gone too.

## AdSense
1. Once the site is live with a good number of posts, go to google.com/adsense and sign up with the site's URL.
2. Google will ask you to paste a snippet into `<head>` — add it to `src/_layouts/base.njk` (right after the `<link rel="stylesheet" href="/style.css">` line) so it applies to every page in one place.
3. Once approved, replace the `<div class="ad-slot">` placeholders inside each post's Markdown body with your actual AdSense ad unit code.
4. Google generally wants to see 15–20+ substantive, original posts and real traffic before approving — 3 starter posts is a skeleton, not enough on its own.

Before publishing: replace `hello@example.com` in `contact.njk` and `privacy.njk` with your real email, and update the "last updated" date in `privacy.njk`.
