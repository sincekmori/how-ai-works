<script lang="ts">
  // Fetches the generated /llms-full.txt (the complete site material) and copies
  // it to the clipboard so a reader can paste the whole site into their own LLM.
  // `href` is passed base-path-aware from the layout (withBase('llms-full.txt')).
  const {
    href,
    compact = false,
    idleLabel,
    lang = "en",
  }: { href: string; compact?: boolean; idleLabel?: string; lang?: "en" | "ja" } = $props();

  const L = {
    en: {
      done: "Copied ✓",
      working: "Copying…",
      error: "Failed (open the link instead)",
      full: "Copy the whole site for an LLM",
      compact: "Copy all text for an LLM",
    },
    ja: {
      done: "コピーしました ✓",
      working: "コピー中…",
      error: "失敗（リンクから開いてください）",
      full: "サイト全文を LLM 用にコピー",
      compact: "全文を LLM 用にコピー",
    },
  }[lang];

  let status = $state<"idle" | "working" | "done" | "error">("idle");

  async function copy() {
    status = "working";
    try {
      const res = await fetch(href);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      status = "done";
      setTimeout(() => (status = "idle"), 2200);
    } catch {
      status = "error";
      setTimeout(() => (status = "idle"), 3500);
    }
  }

  const label = $derived(
    status === "done"
      ? L.done
      : status === "working"
        ? L.working
        : status === "error"
          ? L.error
          : (idleLabel ?? (compact ? L.compact : L.full)),
  );
</script>

<button type="button" class="btn btn--accent" onclick={copy} disabled={status === "working"}>
  📋 {label}
</button>
