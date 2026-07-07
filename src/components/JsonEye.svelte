<script lang="ts">
  // Reading JSON by key: click a key and see the program pull that value out
  // by name (obj["key"]). Teaches "keys are fixed, values vary; a program reads
  // by key, reliably." Illustrative, in-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Row {
    key: string;
    val: string;
    kind: "string" | "number" | "array";
  }

  const T = {
    ja: {
      title: "鍵をクリックして、値を取り出してみる",
      rows: [
        { key: "city", val: '"Tokyo"', kind: "string" },
        { key: "condition", val: '"sunny"', kind: "string" },
        { key: "temperature", val: "28", kind: "number" },
        { key: "humidity", val: "45", kind: "number" },
      ] as Row[],
      idle: "この JSON は weather という名前の入れもの（変数）にしまってあります。上の鍵（キー）をクリックすると、プログラムがその鍵で値を取り出します。",
      got: (k: string, v: string) =>
        `プログラムが weather["${k}"] と書くと、いつでも ${v} を取り出せます。`,
      note: "鍵の名前は固定、値だけが変わります。だからプログラムは「この鍵の値がほしい」と、毎回おなじ書き方でねらえます。",
      kindLabel: { string: "文字列", number: "数値", array: "配列" },
    },
    en: {
      title: "Click a key to pull out its value",
      rows: [
        { key: "city", val: '"Tokyo"', kind: "string" },
        { key: "condition", val: '"sunny"', kind: "string" },
        { key: "temperature", val: "28", kind: "number" },
        { key: "humidity", val: "45", kind: "number" },
      ] as Row[],
      idle: "This JSON is kept in a container (variable) named weather. Click a key above, and the program pulls out its value by that key.",
      got: (k: string, v: string) =>
        `When the program writes weather["${k}"], it always gets ${v} back.`,
      note: "The key names are fixed; only the values change. So a program can aim for exactly the value it wants, with the same code every time.",
      kindLabel: { string: "string", number: "number", array: "array" },
    },
  }[lang];

  let sel = $state(-1);

  const status = $derived(sel === -1 ? T.idle : T.got(T.rows[sel].key, T.rows[sel].val));
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="je-code">
    <span class="je-brace">&#123;</span>
    {#each T.rows as row, i (row.key)}
      <div class="je-line">
        <button class="je-key {i === sel ? 'on' : ''}" onclick={() => (sel = i)} type="button"
          >"{row.key}"</button
        ><span class="je-colon">:</span>
        <span class="je-val {row.kind} {i === sel ? 'on' : ''}">{row.val}</span
        >{#if i < T.rows.length - 1}<span class="je-comma">,</span>{/if}
        <span class="je-kind">{T.kindLabel[row.kind]}</span>
      </div>
    {/each}
    <span class="je-brace">&#125;</span>
  </div>

  <p class="ll-status">{status}</p>
  <p class="ll-status">{T.note}</p>
</div>
