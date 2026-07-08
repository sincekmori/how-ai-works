# AGENTS.md

Guidance for AI agents working on **How AI Works and How to Use It** (its Japanese site name is set in `siteName(lang)`).
It is a static, bilingual site that explains how LLMs work, from zero background to the frontier.
Read this before making changes.
The full rationale lives in [`README.md`](README.md); this file is the operating manual.

Everything in the repo — code, comments, config, meta docs (README, AGENTS, CONTRIBUTING, issue templates), and commit messages — is written in English.
The only Japanese lives in the `ja` locale content: the `src/content/chapters/ja/` MDX, the `ja` strings inside figures/islands/dictionaries (`src/i18n/ui.ts`, `src/lib/parts.ts`, `FIGURE_DESC`/attribution in `src/lib/chapters.ts`), and the Japanese OG card (`scripts/og/og-ja.svg`).
Rule-defining Japanese punctuation (below) and localized string values documented in these meta files are the only exceptions.

## The one thing that matters most: read it as a middle-schooler

The hardest and most important part of this project is not technical.
It is keeping every page understandable to a curious reader with a completed middle-school education and zero AI/programming background.
Math through grade 9 (the Pythagorean theorem, √, basic probability) may be assumed without re-teaching; anything beyond it may not.
After any change to content (prose, a figure's words, an island's labels), re-read it as if you were that reader.
If you stumble even once, fix the writing — not the reader.
This check matters more than passing the build.

Ask yourself, line by line:

- Would a fresh middle-school graduate with no AI/programming background understand this sentence?
- Is every term defined the moment it first appears, right where it appears?
- Did I explain WHY this exists before explaining WHAT it is?
- Did any symbol (Σ, √, a formula) show up before a concrete example made the reader want it?
- Could an everyday example replace this abstract sentence?
- Is there a figure wherever words alone would be hard to picture?
- Did I avoid "obviously", "simply", "just", and summarizing connectors ("要するに" / "in short") for an idea not yet built up?
- Does the chapter's interactive demo let the reader _do_ the idea, not just read about it?
- Are button labels and UI text written for the reader, not for me (no insider phrasing like "open the .md")?
- (English) Does it read like natural English written for a beginner, not a literal translation?

When in doubt, choose the more concrete, gentler explanation.

## Editorial policy

Every chapter is one flat, top-to-bottom explanation; there is no depth toggle or audience switch.
Lead with the problem the reader can feel, then introduce the idea that solves it.
Define terms at first use; never lean on a word you have not yet explained.
Use symbols only after a worked example, and only when they genuinely help.
Use many figures, and give each chapter one interactive island.
Stay model-neutral: cite GPT / Llama / Claude / Gemini / Mistral / Qwen evenly, and explain concepts in general terms.
Give every chapter a distinct role; do not re-explain what another chapter already covers.
Treat UI labels, button text, and figure captions as content, and write them for the reader, not for yourself.
Reach for animation or interaction only when motion makes the idea click, never for decoration.
Make figures show concrete instances (real words, real numbers), label what needs labeling, and stand on their own.
Write prose one sentence per line in the MDX source (and in the Markdown meta docs — README, AGENTS, CONTRIBUTING): break the line after every 。！？/./?/!, and use a blank line for a paragraph break (Markdown joins adjacent lines into one paragraph).
Do not use the long dash（——）in Japanese prose; it is not normal Japanese punctuation, so rephrase with 。、（）or a new sentence (English may use the em-dash sparingly).

## Reading experience and UX

Keep a comfortable reading width on desktop, not just a narrow mobile-first column.
Prefer elegant, consolidated UI: one entry point that opens a tidy menu beats a row of buttons (see Share and Ask AI).
Keep the share targets broad (X, Facebook, Reddit, Hacker News, LINE, Hatena, native share, copy link) — reach is the goal, so do not trim them.

## Credibility

The author is not a domain expert, so the site must let readers check it themselves.
Keep each chapter's references canonical and accurate (peer-reviewed papers or well-known books) in `src/lib/references.ts`.
The per-chapter Ask AI buttons (`AskAI.astro`) hand the page's `.md` to ChatGPT / Gemini / Claude to fact-check it and cite sources.
A site-wide disclaimer (`t(lang).disclaimer`, shown on the landing page and under every chapter) states that the content is not expert-reviewed and links to GitHub Issues.
Community corrections are welcomed via the issue forms in `.github/ISSUE_TEMPLATE/` and the guidelines in `CONTRIBUTING.md`.

## Working agreement

Always commit completed, gate-passing work automatically.
Never `git push` (and never push via `gh`) — the maintainer reviews and pushes.
Run `bun run check` and `bun run build` before every commit; both must pass.
End commit messages with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
Credit the work to its author, **Shinsuke Mori**, under the **CC BY 4.0** license.
Keep every dependency on its latest version: Dependabot (`.github/dependabot.yml`) opens weekly PRs for npm/Bun packages and GitHub Actions, and a build breakage from a bump is fixed forward, not reverted. Pin an older version only when a newer one is genuinely incompatible, and always with a written reason.

## What it is

Astro 7 static site with 26 chapters, each a beginner-first primer with SVG figures and one Svelte island.
The site name is localized — "How AI Works and How to Use It" (en) / 「AI のしくみと使い方」 (ja), via `siteName(lang)` in `src/lib/urls.ts`.
Part II ("how LLMs are put to work") is planned to grow implementation-level chapters (calling the model from real code) — the "how to use it" in the name anticipates this.
The repo is `how-ai-works`, and the base path is `/how-ai-works/`.
It is fully bilingual: English is the default at the root, Japanese lives under `/ja/`, with browser-language auto-detect.
It deploys to GitHub Pages at `https://sincekmori.github.io/how-ai-works/` via `.github/workflows/deploy.yml`.

## Commands

`bun run dev` starts the dev server.
`bun run build` runs `astro build && pagefind --site dist` into `./dist`.
`bun run preview` serves `./dist` — this is what the preview tooling runs, not a dev server.
`bun run check` (oxfmt --check + oxlint `--deny-warnings`) is the CI gate; `bun run format` writes formatting.
The gate fails on any lint warning, not just errors, so resolve every finding (fix it, or disable the rule with a written rationale in `.oxlintrc.json`) before committing — a clean `bun run check` is the bar, and it now matches the warnings the oxc editor extension surfaces.

## i18n model

Content lives per locale at `src/content/chapters/{en,ja}/<slug>.mdx`, sharing the same `<slug>` and `order`.
Frontmatter is `title`, `order` (drives sort and nav), `description`, and `draft`.
`src/lib/chapters.ts` holds `getSortedChapters(lang)`, `chapterSlug(entry)`, `neighbours`, and `toCleanMarkdown(entry, lang)` (the export builder, figure descriptions, island regex, and attribution footer).
`src/lib/urls.ts` provides `localeHref(lang, path)` and `absoluteLocale(lang, path)` — always use these for links.
`src/i18n/ui.ts` holds the chrome strings via `t(lang)`.
English routes are at `src/pages/`, the Japanese mirror is at `src/pages/ja/`, and both reuse `Landing.astro` and `ChapterView.astro`.
A pre-paint script in `BaseLayout.astro` auto-detects language, and `LangSwitcher.astro` stores the user's choice so it overrides the auto-detect.

Figures (`.astro`) and islands (`.svelte`) are lang-aware, not duplicated.
Each takes a `lang` prop that defaults to `'ja'` and holds both languages inside.
When editing one, keep the `ja` strings byte-for-byte unchanged and only add or adjust `en`.
Figures use `const S = { ja, en }[lang]`, with SVG text as `{S.x}` and the caption via `<figcaption set:html={S.cap} />`.
Islands use `const { lang = 'ja' } = $props()` then `const T = { ja, en }[lang]`, with markup via `{@html ...}`.
Adapt language-specific examples rather than translating them literally — the JA particle word-order figure becomes the English "dog bites man".

## Recipes

To add or edit a figure, use the `lang`-prop + `S` pattern, then add its name to both the `en` and `ja` maps in `FIGURE_DESC` in `chapters.ts` so the export can describe it.
To add or edit an island, use the `lang`-prop + `T` pattern, add its name to the `islands` regex in `chapters.ts`, hydrate with `client:visible` (3D uses `client:only="svelte"`), and keep all demo state in memory.
To add a chapter, create matching `en/` and `ja/` MDX with the same `order`, and optionally add canonical sources to `src/lib/references.ts` (keyed by bare slug, language-neutral, rendered into both locales and the exports).
In MDX, never put a literal `<` or `{` in prose, and never write a double-underscore around a word (it parses as bold) — use ○○ or rephrase.
Keep each figure label well under its box (about 0.7 fill); English is wider than Japanese and wider than the headless preview measures, so shorten the wording or widen the box.
To verify an island's interaction, temporarily switch it to `client:load` and rebuild (a `client:visible` island will not hydrate in the headless preview), then revert to `client:visible` before committing.

## Stack gotchas

Math uses a unified processor: `astro.config.mjs` sets `markdown.processor` to `unified(...)` with `remark-math` + `rehype-katex`, because Astro 7's default engine cannot run remark/rehype.
The one-sentence-per-line source works because our own `src/lib/rehype-cjk-line-join.mjs` (in the same pipeline) strips soft line breaks between CJK characters; without it each break renders as a stray half-width space in the Japanese text.
Vite is pinned via `package.json` `overrides.vite`; keep a single `vite` in `bun.lock`.
Use `@threlte/core` only; `@threlte/extras` fails to build under Vite 8 / Rolldown.
oxfmt does not format `.astro` files, so those are kept consistent by hand.
OGP cards (`public/og-{ja,en}.png`, one per locale, shared by all pages) are rasterized from `scripts/og/*.svg` with `sh scripts/og/make-og.sh` (qlmanage + sips, macOS-only, no npm dependency) — rerun it after editing the SVGs.
Sequential `await` in animation loops is intentional — keep the `// eslint-disable-next-line no-await-in-loop` comments.

## Tooling and dependency principles

Apply all lint rules; when two genuinely conflict, keep the more elegant/idiomatic option and disable the other with a written rationale in `.oxlintrc.json`.
Lean self-contained: official `@astrojs/*` only, Pagefind as a CLI, and self-generated llms.txt — no community integrations, to stay insulated from churn.
When a need arises, weigh using a library against implementing it yourself, and choose the more elegant; for small, self-contained needs, prefer your own implementation.

## Don'ts

Do not reproduce the OpenAI/ChatGPT logo (removed from simple-icons at OpenAI's request); the ChatGPT entry uses a neutral chat-bubble glyph on purpose.
Do not add a hand-maintained third-party notices file, because it drifts out of sync with `package.json`.
Do not reintroduce the old reader-level / depth-toggle system; it was deliberately removed.
Do not break the Japanese rendering when touching a shared component.
