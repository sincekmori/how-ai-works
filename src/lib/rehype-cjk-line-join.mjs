// The MDX source is written one sentence per line (see AGENTS.md). Markdown keeps
// those soft line breaks as "\n" inside paragraph text, and browsers render each
// as a visible half-width space, which is wrong between Japanese characters.
// This rehype plugin removes a soft line break when the characters on BOTH sides
// are CJK (kana, kanji, CJK punctuation, or fullwidth forms), including across
// sibling inline nodes such as <strong>. English text keeps its spaces.
// Hand-rolled (no unist-util-visit) to stay dependency-free.

const CJK = /[　-ヿ㐀-䶿一-鿿豈-﫿＀-｠￠-￦]/;
const SKIP = new Set(["pre", "code", "script", "style"]);

/** First printable character of a node's rendered text, or undefined. */
function firstChar(node) {
  if (node.type === "text") {
    return node.value.replace(/^\n+/, "")[0];
  }
  if (node.children) {
    for (const child of node.children) {
      const ch = firstChar(child);
      if (ch !== undefined) {
        return ch;
      }
    }
  }
}

/** Last printable character of a node's rendered text, or undefined. */
function lastChar(node) {
  if (node.type === "text") {
    const v = node.value.replace(/\n+$/, "");
    return v.at(-1);
  }
  if (node.children) {
    for (let i = node.children.length - 1; i >= 0; i -= 1) {
      const ch = lastChar(node.children[i]);
      if (ch !== undefined) {
        return ch;
      }
    }
  }
}

function processChildren(children) {
  children.forEach((node, i) => {
    if (node.type !== "text") {
      if (node.children && !SKIP.has(node.tagName)) {
        processChildren(node.children);
      }
      return;
    }

    // Break inside one text node. One CJK side is enough: a line may start with
    // ASCII while continuing Japanese, and no space belongs after a CJK stop
    // either way. A break between two ASCII characters (English) is left intact.
    node.value = node.value.replaceAll(
      /(?<=[　-ヿ㐀-䶿一-鿿豈-﫿＀-｠￠-￦])\n|\n(?=[　-ヿ㐀-䶿一-鿿豈-﫿＀-｠￠-￦])/g,
      "",
    );

    // Break at the end of this node, before an inline sibling (e.g. <strong>).
    if (node.value.endsWith("\n")) {
      const before = lastChar(node);
      const next = children[i + 1];
      const after = next === undefined ? undefined : firstChar(next);
      if (before !== undefined && after !== undefined && (CJK.test(before) || CJK.test(after))) {
        node.value = node.value.replace(/\n+$/, "");
      }
    }

    // Break at the start of this node, after an inline sibling.
    if (node.value.startsWith("\n")) {
      const after = firstChar(node);
      const prev = children[i - 1];
      const before = prev === undefined ? undefined : lastChar(prev);
      if (before !== undefined && after !== undefined && (CJK.test(before) || CJK.test(after))) {
        node.value = node.value.replace(/^\n+/, "");
      }
    }
  });
}

export default function rehypeCjkLineJoin() {
  return (tree) => {
    if (tree.children) {
      processChildren(tree.children);
    }
  };
}
