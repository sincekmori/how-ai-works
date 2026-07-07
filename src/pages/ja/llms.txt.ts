import type { APIRoute } from "astro";
import { getSortedChapters, chapterSlug, type Locale } from "../../lib/chapters";
import { absoluteLocale, siteName } from "../../lib/urls";
import { t } from "../../i18n/ui";

// Japanese llms.txt index, served at `/ja/llms.txt`.
const LANG: Locale = "ja";

export const GET: APIRoute = async () => {
  const s = t(LANG);
  const chapters = await getSortedChapters(LANG);
  const out: string[] = [];

  out.push(`# ${siteName("ja")}`);
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
