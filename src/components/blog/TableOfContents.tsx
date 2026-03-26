import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  
  // Keep track of ALL headings currently in the viewport
  const visibleHeadings = useRef(new Set<string>());

  useEffect(() => {
    // extract ONLY h2 (starts with exactly "## ")
    const regex = /^##\s+(.*)$/gm;
    const items: TocItem[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const text = match[1].trim();
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      items.push({ id, text });
    }
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let hasChanges = false;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadings.current.add(entry.target.id);
            hasChanges = true;
          } else {
            visibleHeadings.current.delete(entry.target.id);
            hasChanges = true;
          }
        });

        // If the visible headings changed, find the top-most one to highlight
        if (hasChanges && visibleHeadings.current.size > 0) {
          // Find the first heading in our ordered list that is currently in the Set
          const topVisibleHeading = headings.find(h => visibleHeadings.current.has(h.id));
          if (topVisibleHeading) {
            setActiveId(topVisibleHeading.id);
          }
        }
      },
      // Much wider detection window: starts 100px from top, stretches down 60% of the screen
      { rootMargin: "-100px 0px -40% 0px" } 
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-2 relative">
      <h4 className="font-semibold text-foreground tracking-tight mb-4">On this page</h4>
      <div className="absolute left-0 top-10 bottom-0 w-[1px] bg-border/50"></div>
      
      <ul className="space-y-3 text-sm relative z-10">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "flex py-1 pl-4 border-l-2 transition-all group",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(heading.id);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                  history.pushState(null, "", `#${heading.id}`);
                  setActiveId(heading.id);
                }}
              >
                <span className="mr-2 flex-shrink-0">
                  {index + 1}.
                </span>
                <span className="leading-snug">
                  {heading.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
