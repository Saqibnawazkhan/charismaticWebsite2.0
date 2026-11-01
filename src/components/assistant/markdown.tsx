import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders the small Markdown subset the assistant is told to use (paragraphs, bullet and
 * numbered lists, **bold**, [links](...)) as React elements - no raw HTML is ever injected.
 * Only site-relative, https, mailto and tel links become clickable.
 */
export function ChatMarkdown({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  const blocks: ReactNode[] = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const bullet = /^\s*[-*•]\s+/;
    const numbered = /^\s*\d+[.)]\s+/;
    if (bullet.test(line) || numbered.test(line)) {
      const ordered = numbered.test(line);
      const re = ordered ? numbered : bullet;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ""));
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag key={blocks.length} className={ordered ? "list-decimal space-y-1 pl-5 marker:font-semibold marker:text-brand-500" : "space-y-1.5"}>
          {items.map((item, k) => (
            <li key={k} className={ordered ? "pl-1" : "relative pl-4"}>
              {!ordered && <span className="absolute top-[0.6em] left-0 size-1.5 rounded-full bg-linear-to-br from-brand-500 to-iris" />}
              {inline(item, onNavigate)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !bullet.test(lines[i]) && !numbered.test(lines[i])) para.push(lines[i++].replace(/^#+\s*/, ""));
    blocks.push(
      <p key={blocks.length}>
        {para.map((p, k) => (
          <span key={k}>
            {k > 0 && <br />}
            {inline(p, onNavigate)}
          </span>
        ))}
      </p>,
    );
  }

  return <div className="space-y-2.5">{blocks}</div>;
}

function inline(text: string, onNavigate?: () => void): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, k) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={k} className="font-semibold text-ink">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const cls = "font-semibold text-brand-600 underline decoration-brand-300 decoration-2 underline-offset-2 transition-colors hover:text-navy-500";
      if (href.startsWith("/") && !href.startsWith("//")) {
        return (
          <Link key={k} href={href} onClick={onNavigate} className={cls}>
            {label}
          </Link>
        );
      }
      if (/^(https:|mailto:|tel:)/.test(href)) {
        return (
          <a key={k} href={href} className={cls} {...(href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>
        );
      }
      return label;
    }
    return part;
  });
}

/** Plain text version for read-aloud and copy. */
export function toPlainText(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*•]\s+/gm, "")
    .trim();
}
