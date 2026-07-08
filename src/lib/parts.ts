import { chapterSlug, type Chapter, type Locale } from "./chapters";

// The curriculum has two big divisions — how an LLM works inside, and how LLMs
// are put to work — each holding several thematic groups of chapters. This file
// owns only that display grouping (which slug sits in which group/division);
// chapter order and numbering come from the `order` frontmatter.
export interface Group {
  title: Record<Locale, string>;
  slugs: string[];
}
export interface Division {
  title: Record<Locale, string>;
  groups: Group[];
}

export const divisions: Division[] = [
  {
    title: {
      ja: "第 I 部　LLM の内部のしくみ",
      en: "Part I · How an LLM works inside",
    },
    groups: [
      {
        title: { ja: "まずはここから", en: "Start here" },
        slugs: ["the-one-job"],
      },
      {
        title: { ja: "ぜんぶ「数」にする", en: "Turning everything into numbers" },
        slugs: ["tokenization", "vectors", "similarity", "probability"],
      },
      {
        title: { ja: "機械はどう学ぶ？", en: "How the machine learns" },
        slugs: ["neural-networks", "embeddings"],
      },
      {
        title: { ja: "文章をどう読む？", en: "How it reads a sentence" },
        slugs: ["the-sequence-problem", "attention", "transformer"],
      },
      {
        title: { ja: "育てて、動かす", en: "Raising and running it" },
        slugs: ["pretraining", "fine-tuning", "inference-sampling"],
      },
      {
        title: { ja: "大きく、速く、その先へ", en: "Bigger, faster, and beyond" },
        slugs: ["scaling-laws", "efficiency", "frontier"],
      },
    ],
  },
  {
    title: {
      ja: "第 II 部　LLM を活用するしくみ",
      en: "Part II · How LLMs are put to work",
    },
    groups: [
      {
        title: { ja: "モデルを呼ぶ", en: "Calling the model" },
        slugs: ["calling-the-model", "parameters", "extracting-data"],
      },
      {
        title: { ja: "決まった形で受け取る", en: "Getting a fixed shape back" },
        slugs: ["json", "json-schema"],
      },
      {
        title: { ja: "道具を使う", en: "Using tools" },
        slugs: ["tool-use", "mcp"],
      },
      {
        title: { ja: "自分で動く", en: "Acting on its own" },
        slugs: ["agents", "agent-skills"],
      },
    ],
  },
  // The closing chapter sits outside both parts, like an afterword in a book's
  // table of contents, so its division and group carry no title.
  {
    title: { ja: "", en: "" },
    groups: [{ title: { ja: "", en: "" }, slugs: ["epilogue"] }],
  },
];

export interface NumberedChapter {
  chapter: Chapter;
  number: number;
}
export interface RenderedGroup {
  title: Record<Locale, string>;
  items: NumberedChapter[];
}
export interface RenderedDivision {
  title: Record<Locale, string>;
  groups: RenderedGroup[];
}

/**
 * The sorted chapter list regrouped into divisions and groups, keeping each
 * chapter's global number (1-based position in the sorted list). Any chapter not
 * listed above is appended to a final untitled division so nothing disappears.
 */
export function groupChapters(chapters: Chapter[]): RenderedDivision[] {
  const bySlug = new Map(chapters.map((c, i) => [chapterSlug(c), { chapter: c, number: i + 1 }]));
  const seen = new Set<string>();
  const out: RenderedDivision[] = divisions.map((division) => ({
    title: division.title,
    groups: division.groups
      .map((group) => ({
        title: group.title,
        items: group.slugs
          .filter((slug) => {
            seen.add(slug);
            return bySlug.has(slug);
          })
          .map((slug) => {
            const hit = bySlug.get(slug);
            if (!hit) {
              throw new Error(`unreachable: ${slug}`);
            }
            return hit;
          }),
      }))
      .filter((g) => g.items.length > 0),
  }));
  const rest = chapters
    .map((c, i) => ({ chapter: c, number: i + 1 }))
    .filter(({ chapter }) => !seen.has(chapterSlug(chapter)));
  if (rest.length > 0) {
    out.push({ title: { ja: "", en: "" }, groups: [{ title: { ja: "", en: "" }, items: rest }] });
  }
  return out.filter((d) => d.groups.length > 0);
}
