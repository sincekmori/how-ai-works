import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Chapters live as .md / .mdx files in src/content/chapters/.
// The glob loader derives each entry's `id` from its filename (the URL slug),
// so file names are topic slugs (no numeric prefix) and ordering is driven by
// the `order` frontmatter field instead.
const chapters = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/chapters" }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { chapters };
