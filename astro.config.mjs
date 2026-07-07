// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import svelte, { vitePreprocess } from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import tailwindcss from "@tailwindcss/vite";
import rehypeCjkLineJoin from "./src/lib/rehype-cjk-line-join.mjs";

// Astro 7's default Markdown processor is Sätteri (Rust), which does NOT run
// remark/rehype plugins by design. We switch to the unified pipeline via
// `@astrojs/markdown-remark` so we can render math with remark-math + rehype-katex
// at build time (no client-side KaTeX runtime). The MDX integration extends this
// Markdown configuration by default, so `.mdx` chapters render math too.
// rehype-cjk-line-join is ours (src/lib): the MDX source is one sentence per
// line, and it removes the soft line breaks between CJK characters that would
// otherwise render as stray half-width spaces in the Japanese text.
const processor = unified({
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex, rehypeCjkLineJoin],
});

// https://astro.build/config
export default defineConfig({
  site: "https://sincekmori.github.io",
  base: "/how-ai-works/",
  output: "static",
  trailingSlash: "ignore",
  // `vitePreprocess()` is required so TypeScript in `.svelte` files is stripped.
  // @astrojs/svelte@9 applies no preprocessor by default, and dependencies such as
  // @threlte/extras ship raw `.svelte` source with `<script lang="ts">`.
  integrations: [mdx(), svelte({ preprocess: vitePreprocess() }), sitemap()],
  markdown: {
    processor,
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
