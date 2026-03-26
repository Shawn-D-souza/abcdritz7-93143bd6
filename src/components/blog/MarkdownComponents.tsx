import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Copy, Check, Quote, Link as LinkIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const MarkdownComponents: import("react-markdown").Components | any = {
  h1: ({ node, ...props }) => (
    <h1
      className="mt-12 mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => {
    // Generate an ID for Table of Contents
    const id = props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return (
      <h2
        id={id}
        className="mt-10 mb-5 scroll-m-24 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-foreground"
        {...props}
      />
    );
  },
  h3: ({ node, ...props }) => {
    const id = props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return (
      <h3
        id={id}
        className="mt-8 mb-4 scroll-m-24 text-2xl font-semibold tracking-tight text-foreground"
        {...props}
      />
    );
  },
  p: ({ node, children, ...props }: any) => {
    const hasBlockElement = node?.children?.some((child: any) => 
      child.type === 'element' && 
      ['img', 'youtube', 'figure', 'div', 'video', 'customtable', 'faq'].includes(child.tagName)
    );

    if (hasBlockElement) {
      return (
        <div className="leading-8 text-lg text-muted-foreground [&:not(:first-child)]:mt-6 mb-6 w-full" {...props}>
          {children}
        </div>
      );
    }

    return (
      <p className="leading-8 text-lg text-muted-foreground [&:not(:first-child)]:mt-6 mb-6" {...props}>
        {children}
      </p>
    );
  },
  blockquote: ({ node, ...props }) => (
    <div className="relative my-8 overflow-hidden rounded-xl border-l-[6px] border-primary bg-muted/40 px-6 py-5 shadow-sm transition-all hover:shadow-md hover:bg-muted/60">
      <Quote className="absolute right-4 top-4 h-12 w-12 text-primary/10 -z-10" />
      <blockquote className="text-xl font-medium italic leading-relaxed text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" {...props} />
    </div>
  ),
  a: ({ node, ...props }) => (
    <a
      className="font-medium text-primary underline underline-offset-4 decoration-primary/30 transition-all hover:decoration-primary hover:text-primary/80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {props.children}
    </a>
  ),
  ul: ({ node, ...props }) => (
    <ul className="my-6 ml-6 list-disc space-y-2 text-muted-foreground text-lg leading-7" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="my-6 ml-6 list-decimal space-y-2 text-muted-foreground text-lg leading-7" {...props} />
  ),
  li: ({ node, ...props }) => <li className="pl-2" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const [copied, setCopied] = React.useState(false);

    const onCopy = () => {
      navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (inline) {
      return (
        <code className="relative rounded bg-muted/60 px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium text-primary" {...props}>
          {children}
        </code>
      );
    }

    return (
      <div className="group relative my-8 overflow-hidden rounded-xl border bg-zinc-950 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
          <span className="text-xs font-medium text-zinc-400">
            {match ? match[1] : "plaintext"}
          </span>
          <button
            onClick={onCopy}
            className="rounded p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 relative">
          <code className={cn("text-sm text-zinc-50 font-mono", className)} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },
  img: ({ node, alt, src, title, ...props }) => (
    <figure className="my-10 flex flex-col items-center">
      <div className="relative overflow-hidden rounded-2xl shadow-xl border bg-muted/20">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover max-h-[600px] transition-transform duration-500 hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
          {...props}
        />
      </div>
      {(title || alt) && (
        <figcaption className="mt-3 text-sm text-muted-foreground italic text-center px-4">
          {title || alt}
        </figcaption>
      )}
    </figure>
  ),
  table: ({ node, ...props }) => (
    <div className="my-8 w-full overflow-y-auto rounded-xl border bg-card shadow-sm">
      <Table className="border-collapse" {...props} />
    </div>
  ),
  tr: ({ node, ...props }) => <TableRow className="hover:bg-muted/50 transition-colors" {...props} />,
  th: ({ node, ...props }) => (
    <TableCell className="py-4 px-4 leading-relaxed border border-border font-normal text-muted-foreground align-middle" {...props} />
  ),
  td: ({ node, ...props }) => (
    <TableCell className="py-4 px-4 leading-relaxed border border-border text-muted-foreground align-middle" {...props} />
  ),

  // Custom Components
  youtube: ({ node, children, ...props }) => {
    // extract youtube ID from children which might be a string, array, or React node
    const extractText = (child: any): string => {
      if (typeof child === 'string') return child;
      if (Array.isArray(child)) return child.map(extractText).join('');
      if (child && typeof child === 'object') {
        if (child.props) {
          return child.props.href || extractText(child.props.children);
        }
      }
      return '';
    };
    
    const text = extractText(children).trim();
    let videoId = "";
    const match = text.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (match && match[1]) {
      videoId = match[1];
    } else { // Maybe they just put the id
      videoId = text;
    }

    if (!videoId) return null;

    return (
      <div className="my-10 overflow-hidden rounded-2xl shadow-xl border bg-black aspect-video relative group">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </div>
    );
  },

  faq: ({ node, children, ...props }) => {
    const text = String(children).trim();
    const splitLines = text.split('\n').filter(l => l.trim() !== '');
    const faqs: { q: string, a: string }[] = [];
    
    let currentQ = '';
    let currentA = '';

    for (const line of splitLines) {
      if (line.startsWith('Q:')) {
        if (currentQ) {
          faqs.push({ q: currentQ, a: currentA });
        }
        currentQ = line.replace('Q:', '').trim();
        currentA = '';
      } else if (line.startsWith('A:')) {
        currentA = line.replace('A:', '').trim();
      } else {
        if (currentQ && currentA) {
          currentA += ' ' + line.trim();
        }
      }
    }
    if (currentQ) {
      faqs.push({ q: currentQ, a: currentA });
    }

    if (faqs.length === 0) return null;

    return (
      <div className="my-12 rounded-2xl border border-border/60 bg-card/20 shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="px-5 py-6 md:px-8 md:py-8 border-b border-border/60 bg-muted/20">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Frequently Asked Questions
          </h3>
          <p className="text-muted-foreground text-base">
            Everything you need to know about this topic.
          </p>
        </div>
        <div className="divide-y divide-border/60">
          {faqs.map((faq, i) => (
            <div key={i} className="px-5 py-6 md:px-8 md:py-6 hover:bg-card/40 transition-colors duration-300">
              <h4 className="text-lg md:text-xl font-semibold text-foreground mb-3 leading-tight">
                {faq.q}
              </h4>
              <div className="text-muted-foreground text-base leading-relaxed">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },

  customtable: ({ node, children, ...props }) => {
    const text = String(children).trim();
    const lines = text.split('\n').filter(l => l.trim() !== '');
    if (lines.length === 0) return null;

    const allRows = lines.map(line => line.split('|').map(c => c.trim()));

    // user requested: if table cell has **bold**, make it bold. 
    // we'll parse the cell string as markdown!
    const renderCellContent = (content: string) => {
      return (
        <ReactMarkdown 
          components={{ 
            p: React.Fragment,
            strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} /> 
          }}
        >
          {content}
        </ReactMarkdown>
      );
    };

    return (
      <div className="my-8 w-full overflow-hidden rounded-xl border bg-card/60 backdrop-blur shadow-sm">
        <Table className="border-collapse">
          <TableBody>
            {allRows.map((row, i) => (
              <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                {row.map((cell, j) => (
                  <TableCell key={j} className="py-4 px-5 leading-relaxed text-muted-foreground border border-border align-middle">
                    {renderCellContent(cell)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};
