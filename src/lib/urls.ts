// Base-path aware URL helpers.
//
// The site is deployed to GitHub Pages under a project base path (`/how-ai-works/`),
// so every internal link and every absolute URL emitted into llms.txt / llms-full.txt
// must include that base. `import.meta.env.BASE_URL` is "/how-ai-works/" in this project.

const SITE = "https://sincekmori.github.io";

/** Prefix a site-relative path with the configured base path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/how-ai-works/"
  const b = base.endsWith("/") ? base : `${base}/`;
  return b + path.replace(/^\/+/, "");
}

/** Build a fully-qualified absolute URL (site + base + path). */
export function absoluteUrl(path: string): string {
  return new URL(withBase(path), SITE).href;
}

/**
 * Base- and locale-aware site-relative path. English (the default locale) lives at
 * the root; Japanese lives under `/ja/`. `localeHref('en','attention/')` →
 * `/how-ai-works/attention/`, `localeHref('ja','attention/')` → `/how-ai-works/ja/attention/`.
 */
export function localeHref(lang: "en" | "ja", path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return withBase(lang === "en" ? clean : `ja/${clean}`);
}

/** Fully-qualified locale-aware absolute URL. */
export function absoluteLocale(lang: "en" | "ja", path = ""): string {
  return new URL(localeHref(lang, path), SITE).href;
}

export const repoUrl = "https://github.com/sincekmori/how-ai-works";
export const issuesUrl = `${repoUrl}/issues`;

// Localized site name. A keyed map (not a ternary) so TypeScript flags a missing
// entry if the locale union ever grows. (The `Locale` type lives in chapters.ts,
// which imports this file, so it's spelled inline here to avoid an import cycle.)
const SITE_NAMES: Record<"en" | "ja", string> = {
  en: "How AI Works and How to Use It",
  ja: "AI のしくみと使い方",
};
export function siteName(lang: "en" | "ja"): string {
  return SITE_NAMES[lang];
}
export const siteOrigin = SITE;
