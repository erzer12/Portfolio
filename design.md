# Portfolio Design System — harshilp.codes

---

## 1. Home Page — Detailed Section Spec

> Full home page, scroll-based, all sections below.

---

### § 1 — Header (sticky, full-width)

```
[ harshilp.codes ]    About   Projects   Achievements   Contact    [ Resume ↓ ]
```

- Logo/name left-aligned, links center or right, Resume button rightmost.
- **Resume** is a direct `.pdf` download (no new page).
- Sticky on scroll; subtle border/shadow appears on scroll to separate from content.
- Mobile: hamburger collapses all nav links.
- CMS field: `resumeUrl` (Supabase or a simple static file URL on Vercel).

---

### § 2 — Hero Section

Two sub-blocks stacked vertically inside the hero:

#### 2a. Bio + Links

```
Hi, I'm Harshil! 👋
[Short paragraph — 2–3 lines]
CS student at [college], frontend intern at GTech MuLearn,
building at the intersection of AI/ML and full-stack web.
NASA Space Apps 2025 Global Nominee.

[ GitHub icon ]  [ LinkedIn icon ]  [ More about me → ]
```

- **No photo.**
- Name greeting is large (2.5–3rem), paragraph is ~1rem body text.
- Inline links within the bio text (MuLearn, NASA Space Apps, etc.) open external profiles.
- Icon row uses Lucide or Simple Icons; "More about me →" routes to `/about`.
- CMS fields: `bio` (rich text or markdown), `socialLinks[]` (platform + url).

#### 2b. Experience — Hover-Reveal Strip

Sits below the bio, still inside the hero container.

```
[ MuLearn ]   [ GeeksforGeeks ]   [ NASA Space Apps ]   ...
```

- Horizontal row of small pill/chip items (company/role name, optionally with a small logo or icon).
- **On hover** over each chip: a small **popover/tooltip card** appears with:
  - Role title, company, dates
  - 2–3 bullet highlights (pulled from CMS)
- Clicking a chip navigates to `/experience` (full detail page).
- CMS fields per entry: `company`, `role`, `dateRange`, `highlights[]`, `logo` (optional).

---

### § 3 — Featured Projects

```
Featured Projects                                    [ All Projects → ]
┌───────────────────────────────┐  ┌───────────────────────────────┐
│  📁 SignStream                │  │  📁 Historical Risk Explorer  │
│  Real-time sign language...   │  │  Geospatial risk viz...       │
│                               │  │                               │
│  [Next.js] [TensorFlow] [CV]  │  │  [React] [D3] [Supabase]     │
│  ⭐ 12  •  Last commit: 2d    │  │  ⭐ 8   •  Last commit: 5d   │
└───────────────────────────────┘  └───────────────────────────────┘
```

- Section label top-left, "All Projects →" button top-right linking to `/projects`.
- **2 cards only** on the home page (pinned/featured projects).
- Each card is large — GitHub repo card style:
  - Repo icon + project title (linked, external icon)
  - 1–2 line description (line-clamp-2)
  - Tech tag chip row (monospace or small-caps, low-opacity background)
  - Footer row: GitHub star count + last commit age (via GitHub API) OR just date
- Hover: border lifts to accent color, subtle shadow increase.
- CMS fields: `featured: true` flag on projects; `title`, `description`, `tags[]`, `githubUrl`, `liveUrl`.

---

### § 4 — Widget Row (4 equal-width tiles)

```
┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ ┌──────────────┐
│  🎨 Theme   │ │  🔗 Connect  │ │  📍 Trivandrum   │ │  🎮 Fun Item │
│  Switcher   │ │  with me     │ │  IST · 10:42 PM  │ │  [clicker /  │
│  [toggles]  │ │  [→ /contact]│ │  (live clock)    │ │   mini game] │
└──────────────┘ └──────────────┘ └──────────────────┘ └──────────────┘
```

#### Tile 1 — Theme Switcher
- Toggles between light / dark, optionally 2–3 accent color choices.
- State persisted in `localStorage`, syncs with system preference on first visit.

#### Tile 2 — Connect with Me
- CTA button → routes to `/contact`.
- Optionally lists 1–2 quicklinks (LinkedIn DM, email).

#### Tile 3 — Location + Live Clock
- Static: "Thiruvananthapuram, Kerala 🇮🇳"
- Dynamic: live IST clock (updates every second via `setInterval`).
- `Intl.DateTimeFormat` with `Asia/Kolkata` timezone — no external API.

#### Tile 4 — Fun Item
- Options: cookie-clicker counter (Supabase global count), mini terminal, or spin-the-wheel fun fact.

---

### § 5 — GitHub Activity Section

Two-column layout:

```
┌───────────────────────────────────┐  ┌───────────────────────────┐
│  Recent Commits                   │  │                           │
│  ─────────────────────────────    │  │   GitHub Contribution     │
│  · feat: add dark mode   [2h]     │  │       Stats Card          │
│  · fix: nav mobile bug   [5h]     │  │   (contrib graph / API)   │
│  · chore: update deps    [1d]     │  │                           │
│  · feat: SignStream v2   [3d]     │  └───────────────────────────┘
│  [ View all on GitHub → ]         │
│                                   │
│  Languages Used                   │
│  ─────────────────────────────    │
│  JavaScript  ████████████░░  62%  │
│  Python      ██████░░░░░░░░  31%  │
│  CSS         ██░░░░░░░░░░░░   7%  │
└───────────────────────────────────┘
```

#### Left — Commit Feed
- Latest 4–5 commits across all public repos, filtered from GitHub Events API (`PushEvent`).
- Each row: commit message (truncated) + repo name + relative time ago.
- "View all on GitHub →" links to `github.com/{username}`.

#### Left (below commits) — Language Bar
- **Single segmented bar** spanning the full column width, divided into color-coded segments proportional to byte count across all public repos.
- Source: GitHub REST API `/users/{username}/repos` → sum `languages_url` for each repo.
- **On hover** over a segment: tooltip shows language name + percentage.
- No labels visible at rest — the bar is clean and minimal, interaction reveals the detail.
- 4–6 top languages shown; remaining bytes collapsed into an "Other" segment (gray).
- Rendered as a flex row of `<div>` elements with `width: X%` — no chart library needed. Use Radix `Tooltip` or a plain CSS `:hover` + `::after` tooltip.
- Color-coded per language (match GitHub dot colors: JS = #f1e05a, Python = #3572A5, TypeScript = #3178c6, CSS = #563d7c, etc.).

```
Languages:  [████ JS ][██ PY][█ TS][░ other]
                ↑ hover reveals "JavaScript  62%"
```

#### Right — Contribution Stats Card
- Easiest: embed `github-readme-stats` as `<img>` (Vercel-hosted, auto-updates). Zero API work.
- Medium: custom card with Recharts using `github-readme-stats` API response.
- Full custom: GitHub GraphQL API contribution calendar heatmap grid.
- Recommend starting with the embed; swap for custom later.

---

### § 6 — Footer

```
© @Harshil · 2025        👁 1,204 views        ⎇ a3f9c12  [source]        GitHub · LinkedIn · Email
```

| Slot | Content | Implementation |
|---|---|---|
| Name/copyright | `© @Harshil · {year}` | Static, auto-year via JS |
| View counter | 👁 `N views` | Supabase `page_views` table, increment on each visit |
| Portfolio commit | ⎇ `{shortSHA}` with source-control icon | `VERCEL_GIT_COMMIT_SHA` env var at build time |
| Links | GitHub · LinkedIn · Email icons | Static config |

---

## 2. Shared Layout Rules (All Pages)

- **Header:** same sticky nav as home, always visible. Active page link gets a subtle accent underline or dot to show current location.
- **Max content width:** 760px centered on desktop. Full-width on mobile with `px-4` padding.
- **Footer:** home page only. Sub-pages end after their last section with `pb-16` breathing room.
- **Page transitions:** fade-in on mount (`opacity-0 → opacity-100`, 150ms). No slide or bounce — keep it calm.
- **Responsive breakpoints:** mobile `<640px`, tablet `640–1024px`, desktop `>1024px`.

---

## 3. `/about` — Detailed Spec

```
[ Header ]

  Hi, I'm Harshil.                            ← 2rem semibold, left-aligned
  ───────────────────────────────────────────

  [Bio paragraph 1 — who I am, where I study,
   what drives me to build things.]

  [Bio paragraph 2 — what I build specifically,
   which technologies I reach for, current focus.]

  [Bio paragraph 3 — interests outside code,
   what makes me interesting to work with.]

  ───────────────────────────────────────────
  Education

  B.Tech Computer Science  ·  [College Name]
  2022 – 2026  ·  CGPA: X.X
  Relevant: DSA, ML, OS, DBMS, Networks

  ───────────────────────────────────────────
  Skills

  Languages      [JS] [Python] [TypeScript] [Go]
  Web / App      [Next.js] [React] [Tailwind] [Flutter]
  AI / ML        [TensorFlow] [PyTorch] [LangChain]
  Gen AI         [OpenAI API] [RAG] [Embeddings]
  Databases      [Supabase] [PostgreSQL] [MongoDB]
  Tools          [Git] [Docker] [Vercel] [Figma]
```

### Section rules

**Bio block**
- Plain prose, no card boxes or borders. `line-height: 1.75`, `font-size: 1rem`.
- Page heading "Hi, I'm Harshil." is `2rem` semibold — a warm opener, not a full hero repeat.
- Inline links within the bio (college name, MuLearn, NASA etc.) open external profiles in a new tab, styled in the accent color.
- 3 paragraphs is the target. Keep each under 4 sentences — dense but readable.
- Thin `<hr>` (`opacity-20`) separates bio, education, and skills blocks.

**Education block**
- "Education" label in muted small-caps (`text-xs tracking-wider`) above the entry.
- One block per institution: degree + college (`font-semibold`) on line 1, dates + CGPA (`text-sm`, muted) on line 2, coursework (`text-xs`, muted) on line 3.
- If more institutions exist, stack with `gap-6` between them.
- Text only — no logos, no icons.

**Skills block**
- "Skills" label in muted small-caps.
- Each row: category name in a fixed `~110px` left column (muted), then a flex-wrap row of `<Chip>` components to the right.
- Chips: `rounded-full`, `text-xs`, `px-2 py-0.5`, low-opacity accent background, accent text.
- Same `<Chip>` component reused across About, Experience, and Projects.
- Skills data from `site_config` in Supabase — updatable without a deploy.
- Mobile: category label stacks above its chips.

**CMS fields:** `bio` (markdown, 3 paragraphs), `education[]` (`institution`, `degree`, `startYear`, `endYear`, `cgpa`, `courses[]`), `skills` (object: category label → string array, ordered).

---

## 4. `/projects` — Detailed Spec

```
[ Header ]

All Projects
                    [ All ] [ Next.js ] [ Python ] [ ML ] [ React ] [ Flutter ]

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 📁 SignStream       │  │ 📁 Historical Risk   │  │ 📁 Zen              │
│                     │  │                      │  │                     │
│ Real-time sign      │  │ Geospatial risk       │  │ Mental health       │
│ language recog.     │  │ visualisation         │  │ RAG assistant       │
│                     │  │                      │  │                     │
│ [Next.js][TF][CV]   │  │ [React][D3][SB]      │  │ [Python][LC][RAG]   │
│                     │  │                      │  │                     │
│ [GH ↗]  [Live ↗]   │  │ [GH ↗]  [Live ↗]    │  │ [GH ↗]             │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│ 📁 HomePulse        │  │ 📁 ...              │
│ ...                 │  │                     │
└─────────────────────┘  └─────────────────────┘
```

### Section rules

**Heading + filter row**
- "All Projects" `1.75rem` semibold, left-aligned.
- Filter pills on the same row (right-aligned) on desktop; wrap below the heading on mobile.
- Active filter: filled accent background + white text. Inactive: ghost/outline style.
- Filtering is client-side — tag list is derived dynamically from all `tags[]` values in the `projects` table (deduplicated, sorted alphabetically). "All" resets to show every card.

**Project cards**
- Same `<ProjectCard>` component as home featured cards — repo icon, title, description, chips, action buttons.
- On this page cards are slightly compact: `text-sm` description, less padding than the home featured version.
- Description: `line-clamp-2`.
- Footer: `[GH ↗]` links to GitHub repo. `[Live ↗]` links to deployed URL. If `liveUrl` is null, Live button is hidden entirely — not greyed out.
- Hover: border shifts to accent color, `shadow-lg`, `translate-y-[-2px]`, `transition-all duration-150`.

**Grid**
- Desktop: `grid-cols-3`, `gap-4`.
- Tablet: `grid-cols-2`.
- Mobile: `grid-cols-1`.
- Order by Supabase `order` field (ascending). Featured projects sit first if their `order` is lowest.

**CMS fields:** `title`, `description`, `tags[]`, `githubUrl`, `liveUrl` (nullable), `featured` (bool), `order` (int).

---

## 5. `/experience` — Detailed Spec

```
[ Header ]

Experience
───────────────────────────────────────────────────────────

  Frontend Intern  ·  GTech MuLearn                  Part-time
  Oct 2024 – Present

  • Led UI redesign serving 60,000+ users
  • Built reusable React component library
  • Reduced page load times by 30% via lazy loading

  [Next.js]  [Tailwind]  [Supabase]  [React]          [ LOR ↗ ]

───────────────────────────────────────────────────────────

  Campus Manthri  ·  GeeksforGeeks                   Volunteer
  Jan 2024 – Dec 2024

  • Organised 8 workshops and 3 hackathons
  • Grew chapter to 200+ active members

  [Community]  [Events]  [Leadership]

───────────────────────────────────────────────────────────
```

### Section rules

**Page heading**
- "Experience" `1.75rem` semibold. Optional one-line muted subtext: "What I've worked on." Keep it brief or omit.

**Each entry**
- **Row 1 (role line):** Role title (`font-semibold`, `~1.1rem`) + ` · ` + Company name (accent-colored, links to company site if `companyUrl` is set) + employment type pill right-aligned (`text-xs`, muted, `rounded-sm bg-muted`).
- **Row 2 (dates):** `startDate – endDate` (or "Present" if `endDate` is null), `text-sm`, muted.
- **Bullet list:** plain `<ul list-disc ml-4 text-sm space-y-1>`. No boxes. 2–4 bullets per role, quantified where possible.
- **Tag row:** `<Chip>` components below bullets, same component as About/Projects.
- **LOR button:** only rendered if `lorUrl` is set — ghost button top-right of the entry, `[ LOR ↗ ]`, opens in a new tab.
- **Divider:** `<hr className="opacity-20">` between entries. No dots, no vertical timeline lines — flat and minimal.

**Ordering:** reverse-chronological by `order` field in Supabase. Adding a new role = one Supabase insert, no code change.

**Mobile:** employment type pill wraps below the role+company on narrow screens. LOR button moves below the tag row.

**CMS fields:** `company`, `companyUrl` (nullable), `role`, `type` (enum: `Full-time | Part-time | Intern | Volunteer | Contract`), `startDate`, `endDate` (nullable), `highlights[]`, `tags[]`, `lorUrl` (nullable), `order`.

---

## 6. `/achievements` — Detailed Spec

```
[ Header ]

Achievements
───────────────────────────────────────────────────────────

  NASA Space Apps Challenge 2025                      2025  [ ↗ ]
  Global Nominee

  Built SignStream — a real-time sign language recognition
  system. Selected as Global Nominee from 57,000+
  participants across 160+ countries.

───────────────────────────────────────────────────────────

  [More achievement entries...]

───────────────────────────────────────────────────────────


Certifications

  ┌──────────────────────────────────────────────────────┐
  │  [logo]  Cert Name  ·  Issuer              2024  ↗  │
  │  [logo]  Cert Name  ·  Issuer              2023  ↗  │
  │  [logo]  Cert Name  ·  Issuer              2023  ↗  │
  └──────────────────────────────────────────────────────┘
```

### Section rules

**Achievements block**
- "Achievements" `1.75rem` semibold.
- Each entry:
  - **Row 1:** Title (`font-semibold`, `~1rem`) + year right-aligned (muted) + `↗` link icon (only if `link` is set).
  - **Row 2:** Issuer / event name, muted, `text-sm`.
  - **Row 3+:** 2–3 lines of description prose, `text-sm`, muted color.
- `<hr className="opacity-20">` between entries — same divider pattern as `/experience`.
- No card boxes, no badge walls, no progress bars. Text-first.
- Order by `year` descending, or manual `order` field.

**Certifications block**
- "Certifications" `1.25rem` semibold, separated from achievements with `mt-12`.
- Rendered as a bordered list block (`border rounded-lg divide-y`) — visually distinct from the flat achievement entries above.
- Each row: `[logo 24×24px]` + cert name (`text-sm font-medium`) + ` · ` + issuer (muted) + year right-aligned + `↗` icon.
- If `badgeUrl` is null, render a generic Lucide `Award` icon in the logo slot.
- Compact and dense — this is a list, not prose.
- Link opens the credential URL in a new tab.

**Mobile:** year and link icon stay on the same row (right-aligned) — no changes needed at this density.

**CMS fields (achievements):** `title`, `issuer`, `description`, `year` (int), `link` (nullable), `order`.
**CMS fields (certifications):** `name`, `issuer`, `badgeUrl` (nullable), `link`, `year` (int).

---

## 7. `/contact` — Detailed Spec

```
[ Header ]

Get in touch
───────────────────────────────────────────────────────────

┌──────────────────────────────┐    Professional
│                              │    ├ LinkedIn  ↗
│  Name                        │    └ Resume PDF  ↗
│  ──────────────────────      │
│  Email                       │    Coding
│  ──────────────────────      │    ├ GitHub  ↗
│                              │    └ LeetCode  ↗
│  Message                     │
│                              │    AI & ML
│                              │    ├ Kaggle  ↗
│                              │    └ HuggingFace  ↗
│  [ Send  → ]                 │
└──────────────────────────────┘

  ✓  Message sent! I'll get back to you soon.   ← replaces form on success
```

### Section rules

**Page heading**
- "Get in touch" `1.75rem` semibold, left-aligned. One muted subline: "I read everything. Usually reply within a day." — or omit entirely.

**Two-column layout**
- Left: contact form, `max-w-[420px]`.
- Right: categorised links, `~240px`, vertically top-aligned with the form.
- Mobile/tablet: links column stacks below the form with `mt-8`.

**Contact form**
- Fields: Name (text), Email (email), Message (textarea, `rows=5`).
- Placeholder text inside fields (fades on focus). No floating labels — keep it simple.
- Send button: accent fill, white text, right-aligned on desktop, full-width on mobile.
- **Submission flow:**
  1. User clicks Send → button shows spinner, fields go `disabled`.
  2. Next.js server action fires → Supabase `contact_messages` insert (`name`, `email`, `message`, `created_at`).
  3. Success: form fades out, replaced by `✓ Message sent!` in accent color. No page reload.
  4. Error: inline error text below Send button. Form stays filled so the user can retry.
- No CAPTCHA initially. Add `hcaptcha` or Supabase rate-limit policy if spam appears.

**Links column**
- Three groups: `Professional`, `Coding`, `AI & ML`.
- Group heading: muted small-caps (`text-xs tracking-widest uppercase`).
- Plain `<ul>` of linked items, each with a Lucide `ExternalLink` icon after the text.
- All open in new tab (`target="_blank" rel="noopener"`).
- Data from `site_config` — key `socialLinks`, value `[{ platform, url, category }]`. Same data as the home icon row; `/contact` groups and labels it differently.

**CMS fields:** `socialLinks[]` in `site_config` (`platform`, `url`, `category` enum: `Professional | Coding | AI & ML`). `contact_messages` table: `id`, `name`, `email`, `message`, `created_at`.

---

## 8. CMS Strategy (Supabase)

| Table | Fields | Used by |
|---|---|---|
| `projects` | id, title, description, tags[], githubUrl, liveUrl, featured, order | Home cards, /projects |
| `experience` | id, company, companyUrl, role, type, startDate, endDate, highlights[], tags[], lorUrl, order | Home hover strip, /experience |
| `achievements` | id, title, issuer, description, year, link, order | /achievements |
| `certifications` | id, name, issuer, link, badgeUrl, year | /achievements |
| `page_views` | id, count | Footer view counter |
| `contact_messages` | id, name, email, message, created_at | /contact form |
| `site_config` | key, value | bio, resumeUrl, socialLinks[], skills{} |

---

## 9. Migration Notes (from current single-page harshilp.codes)

| Current section | New location |
|---|---|
| Hero / Profile blurb | Home § 2a (rewritten, no photo) |
| Experience entries | Home § 2b hover strip + full `/experience` |
| Skills | `/about` — Skills block |
| Projects | Home § 3 (2 featured) + full `/projects` |
| Education | `/about` — Education block |
| Achievements | `/achievements` — Achievements block |
| Certifications | `/achievements` — Certifications block |
| Contact form | `/contact` |
| Footer | Home page only (redesigned per § 6) |
