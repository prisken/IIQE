# IIQE Prep Site

Study helper for IIQE Papers 1–5. Content is extracted **only** from the `content source` DOCX files (study manuals, high-density guides, mock question banks).

## Features

1. **研習 / Study** — chapter navigation for full manuals and high-density guides; guide points link back to the matching manual section  
2. **題庫 / Question bank** — segmented by chapter; answers hidden until revealed  
3. **模擬試 / Mock exam** — official chapter weights, random selection each attempt, similarity filter, timer, results review  

## Local development

```bash
npm install
npm run extract    # rebuild public/data from content source DOCX (optional if data already committed)
npm run test:exam  # verify mock allocation / randomisation
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Deploy on Vercel (step by step)

1. Open [https://vercel.com](https://vercel.com) and sign in with the same GitHub account that owns `prisken/IIQE`.
2. Click **Add New… → Project**.
3. Import **`prisken/IIQE`**. If you do not see it, click **Adjust GitHub App Permissions** and grant access to that repo.
4. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** leave as `.` (repo root)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** leave default (Next.js handles this)
   - **Install Command:** `npm install` (default)
5. Click **Deploy**. Wait for the build to finish.
6. Open the generated URL (e.g. `https://iiqe-….vercel.app`).
7. Optional: Project → **Settings → Domains** to add a custom domain.

### After you push updates

Every push to the production branch (`main` / `master`) triggers a new Vercel deployment automatically.

### Notes

- `public/data/` is committed so Vercel can serve study/question content without the original DOCX files.
- Do not commit `.env*` secrets. This app does not require env vars for the basic build.
- If the build fails on memory with large JSON, raise the Node memory or contact Vercel support; the current data set (~5MB) is normally fine.

## Exam settings

| Paper | Questions | Time | Pass |
|------:|----------:|-----:|-----:|
| 1 | 75 | 120 min | 70% |
| 2–3 | 50 | 75 min | 70% |
| 4–5 | 80 | 120 min | 70% |

## Disclaimer

Content is independent study material, not affiliated with IA / PEAK / MPFA / HKSI / SFC. See `/disclaimer` on the site.
