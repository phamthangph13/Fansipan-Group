import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function renderBlock(block: string, index: number) {
  if (block.startsWith("### ")) {
    return <h3 key={index}>{inline(block.slice(4))}</h3>;
  }

  if (block.startsWith("## ")) {
    return <h2 key={index}>{inline(block.slice(3))}</h2>;
  }

  if (block.startsWith("> ")) {
    return <blockquote key={index}>{inline(block.slice(2))}</blockquote>;
  }

  const lines = block.split("\n").map((line) => line.trim());
  if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
    return (
      <ul key={index}>
        {lines.map((line, itemIndex) => (
          <li key={itemIndex}>{inline(line.slice(2))}</li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 ? <br /> : null}
          {inline(line)}
        </span>
      ))}
    </p>
  );
}

export function RichText({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return <div className={cn("prose-fsg", className)}>{blocks.map(renderBlock)}</div>;
}
