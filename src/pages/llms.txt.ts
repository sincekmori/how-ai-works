import type { APIRoute } from "astro";
import { getSortedChapters, chapterSlug, type Locale } from "../lib/chapters";
import { absoluteLocale, siteName } from "../lib/urls";
import { t } from "../i18n/ui";

// Spec-compliant index per https://llmstxt.org/ : H1 (site name) → blockquote
// summary → prose → H2 sections with a Markdown link list to the clean per-chapter
// `.md` files, as absolute URLs valid under the base path.
const LANG: Locale = "en";

export const GET: APIRoute = async () => {
  const s = t(LANG);
  const chapters = await getSortedChapters(LANG);
  const out: string[] = [];

  out.push(`# ${siteName("en")}`);
  out.push("");
  out.push(`> ${s.llmsSummary}`);
  out.push("");
  out.push(s.llmsIntro);
  out.push("");
  out.push("## Chapters");
  for (const c of chapters) {
    out.push(
      `- [${c.data.title}](${absoluteLocale(LANG, `${chapterSlug(c)}.md`)}): ${c.data.description}`,
    );
  }
  out.push("");
  out.push("## Optional");
  out.push(`- [${s.llmsFullTitle}](${absoluteLocale(LANG, "llms-full.txt")}): ${s.llmsFullDesc}`);
  out.push("");

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
