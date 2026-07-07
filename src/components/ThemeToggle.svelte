<script lang="ts">
  import { onMount } from "svelte";

  // Dark mode is site chrome, not interactive-widget state, so persisting it to
  // localStorage is appropriate and avoids a flash of the wrong theme.
  const { lang = "en" }: { lang?: "en" | "ja" } = $props();
  const L = {
    en: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
    ja: { toLight: "ライトモードに切り替え", toDark: "ダークモードに切り替え" },
  }[lang];
  const STORAGE_KEY = "how-ai-works:theme";
  let dark = $state(false);

  function apply(next: boolean) {
    dark = next;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  onMount(() => {
    dark = document.documentElement.classList.contains("dark");
  });
</script>

<button
  type="button"
  class="btn icon-btn"
  aria-label={dark ? L.toLight : L.toDark}
  aria-pressed={dark}
  onclick={() => apply(!dark)}
>
  {dark ? "☀️" : "🌙"}
</button>
