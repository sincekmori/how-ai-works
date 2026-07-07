import type { APIRoute, GetStaticPaths } from "astro";
import { getSortedChapters, chapterSlug, toCleanMarkdown, type Chapter } from "../../lib/chapters";

// Per-chapter clean Markdown for Japanese, served at `/ja/<slug>.md`.
export const getStaticPaths: GetStaticPaths = async () => {
  const chapters = await getSortedChapters("ja");
  return chapters.map((entry) => ({
    params: { slug: chapterSlug(entry) },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const entry = props.entry as Chapter;
  return new Response(toCleanMarkdown(entry, "ja"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
