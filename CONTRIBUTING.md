# Contributing

Error reports, "this confused me" feedback, and edit proposals are all welcome.
You can write issues in English or Japanese.

## The easiest way: open an issue

Just pick an [issue template](https://github.com/sincekmori/how-ai-works/issues/new/choose) and fill it in.
Even "I got stuck here while reading" is a valuable contribution on its own.

## If you want to fix it directly: pull request

1. Run locally: `bun install`, then `bun run dev`.
2. Make your edit.
   The writing rules live in [`AGENTS.md`](AGENTS.md) (one sentence per line, define terms on the spot, readable by a middle-school graduate, and so on).
   The content exists in both Japanese and English under `src/content/chapters/{en,ja}/`.
   Fixing just one language is fine — the other will be synced.
3. Before submitting, make sure `bun run check` and `bun run build` both pass.

## License

By contributing you agree that your contribution is released under the project's [CC BY 4.0](LICENSE) license.
