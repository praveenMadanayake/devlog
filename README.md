# devlog — a blog with a secure admin

A small blog built with [Eleventy](https://www.11ty.dev/) (a static site generator) and [Decap CMS](https://decapcms.org/) for a real, secure "create post" admin at `/admin` — no custom login code, no database. Netlify Identity handles accounts and login; every post you publish through the admin becomes a real git commit.

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

1. **Push to GitHub.** Create a new repo and push this project to it.
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. **Connect Netlify.** At [app.netlify.com](https://app.netlify.com), "Add new site" → "Import an existing project" → pick your GitHub repo. Netlify will read `netlify.toml` automatically (build command `npm run build`, publish directory `_site`).
3. **Enable Identity.** In your new Netlify site's dashboard: Site configuration → Identity → Enable Identity.
4. **Lock down registration.** Identity → Registration → set to **Invite only**, so no one else can ever create an account on your site.
5. **Enable Git Gateway.** Identity → Services → Git Gateway → Enable. This is what lets a logged-in Identity user (you) commit through the CMS without needing their own GitHub access or personal token.
6. **Invite yourself.** Identity → Invite users → enter your own email. You'll get an email to set a password.
7. Visit `yoursite.com/admin`, log in with that account, and you're in.

From this point, only people you've explicitly invited in Netlify Identity can ever log in to `/admin` — there's no separate password to leak, no custom auth code to have bugs, and Netlify's own security/session handling applies.

## AdSense
1. Once the site is live with a good number of posts, go to google.com/adsense and sign up with the site's URL.
2. Google will ask you to paste a snippet into `<head>` — add it to `src/_layouts/base.njk` (right after the `<link rel="stylesheet" href="/style.css">` line) so it applies to every page in one place.
3. Once approved, replace the `<div class="ad-slot">` placeholders inside each post's Markdown body with your actual AdSense ad unit code.
4. Google generally wants to see 15–20+ substantive, original posts and real traffic before approving — 3 starter posts is a skeleton, not enough on its own.

Before publishing: replace `hello@example.com` in `contact.njk` and `privacy.njk` with your real email, and update the "last updated" date in `privacy.njk`.
