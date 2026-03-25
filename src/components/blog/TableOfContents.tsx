import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // extract h2 and h3
    const regex = /^(## |### )(.*)$/gm;
    const items: TocItem[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].trim() === "##" ? 2 : 3;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      items.push({ id, text, level });
    }
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const obverse = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) obverse.observe(el);
    });

    return () => obverse.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-2 relative">
      <h4 className="font-semibold text-foreground tracking-tight mb-4">On this page</h4>
      <div className="absolute left-0 top-10 bottom-0 w-[1px] bg-border/50"></div>
      <ul className="space-y-3 text-sm relative z-10">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              "transition-colors hover:text-foreground",
              heading.level === 3 ? "ml-4" : "",
              activeId === heading.id
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-1 pl-4 border-l-2 transition-all",
                activeId === heading.id ? "border-primary" : "border-transparent"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                // Update URL without jump
                history.pushState(null, "", `#${heading.id}`);
                setActiveId(heading.id);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
