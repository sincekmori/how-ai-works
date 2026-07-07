# How AI Works and How to Use It

**A free, bilingual site that explains large language models from zero background to the frontier — and then how to actually build with them.**

### 🔗 Read it → **https://sincekmori.github.io/how-ai-works/** &nbsp;·&nbsp; 日本語 → **https://sincekmori.github.io/how-ai-works/ja/**

No math, no coding, no AI background required.
Just read top to bottom.

---

## The idea

Most explanations of AI either wave their hands (“it predicts the next word — magic!”) or bury you in equations.
This site takes a third path: **start from a problem you can feel, then build the idea that solves it** — one concept at a time, each earning the next.

Every chapter:

- **Leads with _why_, not _what_.** A term or a symbol only appears once you already want it.
- **Defines every word where it first shows up.** No undefined jargon, no “as you know”.
- **Comes with a figure and a hands-on demo.**
  You don’t just read that attention masks the future — you click a word and watch it happen.
- **Stays vendor-neutral.** GPT, Llama, Claude, Gemini, Mistral and Qwen are cited evenly; the concepts are general.

The reader we write for is a curious middle-school graduate.
If a sentence would lose them, the sentence is wrong — not the reader.

## What you’ll learn

The 24 chapters are one continuous arc, in two parts.

**Part I — How an LLM works inside.**
Words become numbers → tokens → embeddings → neural nets → why a plain network hits a wall → attention → the Transformer → pretraining → fine-tuning → how it writes one word at a time → scaling laws → efficiency → the frontier.

**Part II — How LLMs are put to work.**
Calling a model over the web → the knobs on a request (temperature and friends) → pulling data out of replies → JSON → guaranteeing the shape → giving the model tools → connecting tools with MCP → agents that think, act, and repeat.

## Built to be checked

The author isn’t claiming to be a domain expert — so the site is built so you can verify it yourself:

- **Canonical references** end every chapter (the original papers and books — _Attention Is All You Need_, Chinchilla, word2vec, …).
- **An “Ask AI” button** on every page hands the chapter to ChatGPT / Gemini / Claude and asks them to fact-check it and cite sources.
  The whole site is also downloadable as one Markdown file to feed to a model.
- **A plain disclaimer** says the content hasn’t been expert-reviewed, with a link to report anything wrong.

Found a mistake, or a passage that confused you?
That’s the most valuable thing you can send — see **[CONTRIBUTING.md](CONTRIBUTING.md)** and the issue templates.

## Bilingual

English lives at the root, 日本語 under `/ja/`.
First-time visitors are sent to their browser’s language automatically; a switcher lets you override it, and your choice sticks.

## License

Everything here — the code and the writing — is **[CC BY 4.0](LICENSE)**.
Reuse it freely, including commercially, with attribution.

> “How AI Works and How to Use It” by Shinsuke Mori, CC BY 4.0 — https://sincekmori.github.io/how-ai-works/

© 2026 Shinsuke Mori.

---

_Developing?_ It’s a static [Astro](https://astro.build) + [Svelte](https://svelte.dev) site — `bun install`, then `bun run dev`.
The full guide to the architecture, the bilingual model, and the conventions lives in **[AGENTS.md](AGENTS.md)**.
