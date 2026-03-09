import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Star, Zap, Terminal } from "lucide-react";
import React, { useRef, useState } from "react";

const codeLines = [
  { line: 1, tokens: [{ text: "import", type: "keyword" }, { text: " { ", type: "plain" }, { text: "Community", type: "type" }, { text: " } ", type: "plain" }, { text: "from", type: "keyword" }, { text: " '@ritz7/core'", type: "string" }, { text: ";", type: "plain" }] },
  { line: 2, tokens: [{ text: "import", type: "keyword" }, { text: " { ", type: "plain" }, { text: "AIAgents", type: "type" }, { text: ", ", type: "plain" }, { text: "NoCode", type: "type" }, { text: " } ", type: "plain" }, { text: "from", type: "keyword" }, { text: " '@ritz7/tools'", type: "string" }, { text: ";", type: "plain" }] },
  { line: 3, tokens: [] },
  { line: 4, tokens: [{ text: "const", type: "keyword" }, { text: " builder", type: "variable" }, { text: " = ", type: "plain" }, { text: "new", type: "keyword" }, { text: " Community", type: "type" }, { text: "({", type: "plain" }] },
  { line: 5, tokens: [{ text: "  name", type: "plain" }, { text: ": ", type: "plain" }, { text: '"Ritz7"', type: "string" }, { text: ",", type: "plain" }] },
  { line: 6, tokens: [{ text: "  stack", type: "plain" }, { text: ": [", type: "plain" }, { text: "NoCode", type: "type" }, { text: ", ", type: "plain" }, { text: "AIAgents", type: "type" }, { text: "],", type: "plain" }] },
  { line: 7, tokens: [{ text: "  status", type: "plain" }, { text: ": ", type: "plain" }, { text: '"Live & Growing"', type: "string" }] },
  { line: 8, tokens: [{ text: "});", type: "plain" }] },
  { line: 9, tokens: [] },
  { line: 10, tokens: [{ text: "// Transform ideas into systems", type: "comment" }] },
  { line: 11, tokens: [{ text: "builder", type: "variable" }, { text: ".", type: "plain" }, { text: "deployAutomations", type: "method" }, { text: "();", type: "plain" }] },
];

const tokenColors: Record<string, string> = {
  keyword: "text-purple-400",
  type: "text-blue-400",
  string: "text-green-400",
  variable: "text-yellow-200",
  method: "text-blue-300",
  comment: "text-gray-500 italic",
  plain: "text-gray-300",
};

const tokenColorsDark: Record<string, string> = {
  keyword: "dark:text-purple-400",
  type: "dark:text-blue-400",
  string: "dark:text-green-400",
  variable: "dark:text-yellow-200",
  method: "dark:text-blue-300",
  comment: "dark:text-gray-500",
  plain: "dark:text-gray-300",
};

const tokenColorsLight: Record<string, string> = {
  keyword: "text-purple-600",
  type: "text-blue-600",
  string: "text-emerald-600",
  variable: "text-amber-700",
  method: "text-sky-600",
  comment: "text-slate-400 italic",
  plain: "text-slate-700",
};

export const HeroCodeCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHoveredLine(null);
  };

  return (
    <div className="relative w-full max-w-[600px]" style={{ perspective: "1200px" }}>
      {/* Ambient glow behind card */}
      <div className="absolute -inset-8 rounded-3xl bg-primary/20 blur-3xl dark:bg-primary/10" />
      
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0d1117] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-black/5 bg-muted/50 px-4 py-3 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-xs font-medium text-muted-foreground/80">ritz7-community.ts</span>
          </div>
          <div className="w-[52px]" /> {/* spacer for centering */}
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-black/5 dark:border-white/5">
          <div className="border-b-2 border-primary bg-muted/30 px-4 py-2 text-xs font-medium text-foreground dark:bg-white/[0.03]">
            community.ts
          </div>
          <div className="px-4 py-2 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground">
            agents.ts
          </div>
          <div className="px-4 py-2 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground">
            deploy.ts
          </div>
        </div>

        {/* Code area with line numbers */}
        <div className="relative p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {codeLines.map(({ line, tokens }) => (
                  <tr
                    key={line}
                    className={`group transition-colors duration-150 ${
                      hoveredLine === line
                        ? "bg-primary/5 dark:bg-primary/10"
                        : "hover:bg-muted/30 dark:hover:bg-white/[0.02]"
                    }`}
                    onMouseEnter={() => setHoveredLine(line)}
                  >
                    <td className="w-12 select-none border-r border-black/5 px-3 py-0.5 text-right align-top font-mono text-xs text-muted-foreground/40 dark:border-white/5">
                      {line}
                    </td>
                    <td className="px-4 py-0.5 font-mono text-sm">
                      {tokens.length === 0 ? (
                        <span>&nbsp;</span>
                      ) : (
                        tokens.map((token, i) => (
                          <span
                            key={i}
                            className={`${tokenColorsLight[token.type]} ${tokenColorsDark[token.type]}`}
                          >
                            {token.text}
                          </span>
                        ))
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between border-t border-black/5 bg-muted/30 px-4 py-1.5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Ready
              </span>
              <span className="text-[10px] text-muted-foreground/40">TypeScript</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground/40">Ln {hoveredLine ?? 1}, Col 1</span>
              <span className="text-[10px] text-muted-foreground/40">UTF-8</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -right-4 -top-5 z-20 flex animate-bob flex-col rounded-xl border border-black/5 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-[#161b22]/90 md:-right-12 md:-top-8"
      >
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold text-foreground">Top Network</span>
        </div>
        <span className="mt-0.5 text-[11px] text-muted-foreground">Connect with experts</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -bottom-5 -left-4 z-20 flex animate-bob flex-col rounded-xl border border-black/5 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-[#161b22]/90 md:-bottom-8 md:-left-12"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">N8N Series</span>
        </div>
        <span className="mt-0.5 text-[11px] text-muted-foreground">Build automations</span>
      </motion.div>
    </div>
  );
};
