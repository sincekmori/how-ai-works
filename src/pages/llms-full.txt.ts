import type { APIRoute } from "astro";
import { getSortedChapters, toCleanMarkdown, type Locale } from "../lib/chapters";
import { siteName } from "../lib/urls";
import { t } from "../i18n/ui";

// The complete English site material as one Markdown file: every chapter's full
// text concatenated. Interactive demos become a short note; figures are described.
const LANG: Locale = "en";

export const GET: APIRoute = async () => {
  const s = t(LANG);
  const chapters = await getSortedChapters(LANG);
  const out: string[] = [];

  out.push(`# ${siteName("en")}${s.llmsFullHeading}`);
  out.push("");
  out.push(`> ${s.llmsFullBlurb}`);
  out.push("");

  for (const c of chapters) {
    out.push(toCleanMarkdown(c, LANG));
    out.push("");
    out.push("---");
    out.push("");
  }

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
