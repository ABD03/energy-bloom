import Script from "next/script";

interface ScriptItem {
  name?: string;
  position?: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
  content?: string;
}

type Strategy = "beforeInteractive" | "afterInteractive" | "lazyOnload";

function getScriptAttrs(tag: string) {
  const attrs: Record<string, string | boolean> = {};
  const attrRegex = /\s(async|defer|crossorigin|type|nonce)(?:=["']([^"']*)["'])?/gi;
  let m;
  while ((m = attrRegex.exec(tag)) !== null) {
    attrs[m[1].toLowerCase()] = m[2] ?? true;
  }
  return attrs;
}

function parseScript(content: string, id: string, strategy: Strategy) {
  try {
    const elements: React.ReactNode[] = [];
    let remaining = content;
    let idx = 0;

    const srcRegex = /<script([^>]*)\ssrc=["']([^"']+)["']([^>]*)>\s*<\/script>/gi;
    let srcMatch;
    while ((srcMatch = srcRegex.exec(content)) !== null) {
      const attrs = getScriptAttrs(srcMatch[0]);
      const scriptProps: any = { src: srcMatch[2], strategy };
      if (attrs.type) scriptProps.type = attrs.type;
      if (attrs.crossorigin) scriptProps.crossOrigin = attrs.crossorigin === true ? "" : attrs.crossorigin;
      if (attrs.nonce) scriptProps.nonce = attrs.nonce;

      elements.push(
        <Script key={`${id}-src-${idx}`} id={`${id}-${idx}`} {...scriptProps} />,
      );
      remaining = remaining.replace(srcMatch[0], "");
      idx++;
    }

    const inlineRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let inlineMatch;
    const inlineContent = remaining;
    while ((inlineMatch = inlineRegex.exec(inlineContent)) !== null) {
      const code = inlineMatch[1].trim();
      if (code) {
        elements.push(
          <Script key={`${id}-inline-${idx}`} id={`${id}-${idx}`} strategy={strategy} dangerouslySetInnerHTML={{ __html: code }} />,
        );
      }
      remaining = remaining.replace(inlineMatch[0], "");
      idx++;
    }

    const leftover = remaining.trim();
    if (leftover) {
      if (leftover.startsWith("<")) {
        elements.push(
          <div key={`${id}-html-${idx}`} dangerouslySetInnerHTML={{ __html: leftover }} suppressHydrationWarning />,
        );
      } else {
        elements.push(
          <Script key={`${id}-raw-${idx}`} id={`${id}-${idx}`} strategy={strategy} dangerouslySetInnerHTML={{ __html: leftover }} />,
        );
      }
    }

    return elements;
  } catch (err) {
    console.error("Failed to parse script:", err);
    return null;
  }
}

function renderScripts(
  scripts: ScriptItem[] | undefined,
  position: string,
  fallbackStrategy: Strategy,
) {
  const items = scripts?.filter(
    (s) => s.position === position && s.content?.trim(),
  );
  if (!items?.length) return null;
  return (
    <>
      {items.map((s, i) => {
        const strategy = s.strategy || fallbackStrategy;
        const id = `${position}-script-${s.name || i}`;
        return parseScript(s.content!, id, strategy);
      })}
    </>
  );
}

export function HeadScripts({ scripts }: { scripts?: ScriptItem[] }) {
  return renderScripts(scripts, "head", "beforeInteractive");
}

export function BodyScripts({ scripts }: { scripts?: ScriptItem[] }) {
  return renderScripts(scripts, "body", "afterInteractive");
}

export function FooterScripts({ scripts }: { scripts?: ScriptItem[] }) {
  return renderScripts(scripts, "footer", "lazyOnload");
}
