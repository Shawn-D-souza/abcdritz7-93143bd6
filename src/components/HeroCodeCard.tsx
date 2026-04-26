import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { Star, Zap, Terminal } from "lucide-react";
import React, { useRef, useState, useCallback } from "react";

const codeLines = [
  {
    line: 1,
    tokens: [
      { text: "import", type: "keyword" },
      { text: " { ", type: "plain" },
      { text: "Community", type: "type" },
      { text: " } ", type: "plain" },
      { text: "from", type: "keyword" },
      { text: " '@ritz7/core'", type: "string" },
      { text: ";", type: "plain" },
    ],
  },
  {
    line: 2,
    tokens: [
      { text: "import", type: "keyword" },
      { text: " { ", type: "plain" },
      { text: "AIAgents", type: "type" },
      { text: ", ", type: "plain" },
      { text: "NoCode", type: "type" },
      { text: " } ", type: "plain" },
      { text: "from", type: "keyword" },
      { text: " '@ritz7/tools'", type: "string" },
      { text: ";", type: "plain" },
    ],
  },
  { line: 3, tokens: [] },
  {
    line: 4,
    tokens: [
      { text: "const", type: "keyword" },
      { text: " builder", type: "variable" },
      { text: " = ", type: "plain" },
      { text: "new", type: "keyword" },
      { text: " Community", type: "type" },
      { text: "({", type: "plain" },
    ],
  },
  {
    line: 5,
    tokens: [
      { text: "  name", type: "plain" },
      { text: ": ", type: "plain" },
      { text: '"Ritz7"', type: "string" },
      { text: ",", type: "plain" },
    ],
  },
  {
    line: 6,
    tokens: [
      { text: "  stack", type: "plain" },
      { text: ": [", type: "plain" },
      { text: "NoCode", type: "type" },
      { text: ", ", type: "plain" },
      { text: "AIAgents", type: "type" },
      { text: "],", type: "plain" },
    ],
  },
  {
    line: 7,
    tokens: [
      { text: "  status", type: "plain" },
      { text: ": ", type: "plain" },
      { text: '"Live & Growing"', type: "string" },
    ],
  },
  { line: 8, tokens: [{ text: "});", type: "plain" }] },
  { line: 9, tokens: [] },
  {
    line: 10,
    tokens: [{ text: "// Transform ideas into systems", type: "comment" }],
  },
  {
    line: 11,
    tokens: [
      { text: "builder", type: "variable" },
      { text: ".", type: "plain" },
      { text: "deployAutomations", type: "method" },
      { text: "();", type: "plain" },
    ],
  },
];

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
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number>(1);

  // Mouse position for tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse position for spotlight (px from top-left of card)
  const spotlightX = useMotionValue(-200);
  const spotlightY = useMotionValue(-200);

  const springConfig = { stiffness: 200, damping: 25, mass: 0.5 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Spotlight gradient that follows the cursor
  const spotlightBackground = useMotionTemplate`radial-gradient(350px circle at ${spotlightX}px ${spotlightY}px, hsl(212 92% 36% / 0.12), transparent 80%)`;
  // Border glow
  const borderGlow = useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, hsl(212 92% 36% / 0.5), hsl(212 92% 36% / 0.08) 60%, transparent 80%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      mouseX.set(relX / rect.width - 0.5);
      mouseY.set(relY / rect.height - 0.5);
      spotlightX.set(relX);
      spotlightY.set(relY);

      // Calculate column based on horizontal position
      const codeAreaWidth = rect.width - 80; // Approximate code area width
      const col = Math.max(1, Math.floor((relX - 60) / 8) + 1); // ~8px per character
      setHoveredCol(col);
    },
    [mouseX, mouseY, spotlightX, spotlightY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    spotlightX.set(-200);
    spotlightY.set(-200);
    setHoveredLine(null);
    setHoveredCol(1);
  }, [mouseX, mouseY, spotlightX, spotlightY]);

  return (
    <div
      className="relative w-full max-w-[450px]"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient glow */}
      <div className="absolute -inset-12 rounded-3xl bg-primary/15 blur-[60px] dark:bg-primary/10" />

      {/* Outer border wrapper with animated gradient border */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 rounded-2xl p-[1px]"
      >
        {/* Animated border glow layer */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: borderGlow }}
        />
        {/* Fallback static border */}
        <div className="absolute inset-0 rounded-2xl border border-black/10 dark:border-white/10" />

        {/* Card body */}
        <div className="relative overflow-hidden rounded-2xl bg-white/95 shadow-2xl backdrop-blur-xl dark:bg-[#0d1117] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          {/* Spotlight overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{ background: spotlightBackground }}
          />

          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-black/5 bg-muted/50 px-4 py-3 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-125" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e] transition-transform hover:scale-125" />
              <div className="h-3 w-3 rounded-full bg-[#28c840] transition-transform hover:scale-125" />
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-xs font-medium text-muted-foreground/80">
                ritz7-community.ts
              </span>
            </div>
            <div className="w-[52px]" />
          </div>

          {/* Code area */}
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {codeLines.map(({ line, tokens }) => (
                    <tr
                      key={line}
                      className={`group transition-all duration-200 ${
                        hoveredLine === line
                          ? "bg-primary/8 dark:bg-primary/15"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredLine(line)}
                    >
                      <td
                        className={`w-12 select-none border-r border-black/5 px-3 py-[3px] text-right align-top font-mono text-xs transition-colors duration-200 dark:border-white/5 ${
                          hoveredLine === line
                            ? "text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      >
                        {line}
                      </td>
                      <td className="px-4 py-[3px] font-mono text-sm">
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

            {/* Status bar */}
            <div className="flex items-center justify-between border-t border-black/5 bg-muted/30 px-4 py-1.5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  Ready
                </span>
                <span className="text-[10px] text-muted-foreground/40">
                  TypeScript
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground/40">
                  Ln {hoveredLine ?? 1}, Col {hoveredCol}
                </span>
                <span className="text-[10px] text-muted-foreground/40">
                  UTF-8
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -right-2 -top-4 z-50 flex animate-bob flex-col rounded-xl border border-black/5 bg-white/95 px-3 py-2 sm:px-4 sm:py-3 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-[#161b22]/90 sm:-right-6 sm:-top-5 md:-top-8 lg:-right-2 xl:-right-12"
      >
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold text-foreground">
            Top Network
          </span>
        </div>
        <span className="mt-0.5 text-[11px] text-muted-foreground">
          Connect with experts
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -bottom-4 -left-2 z-50 flex animate-bob flex-col rounded-xl border border-black/5 bg-white/95 px-3 py-2 sm:px-4 sm:py-3 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-[#161b22]/90 sm:-bottom-5 sm:-left-6 md:-bottom-8 lg:-left-2 xl:-left-12"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            N8N Series
          </span>
        </div>
        <span className="mt-0.5 text-[11px] text-muted-foreground">
          Build automations
        </span>
      </motion.div>
    </div>
  );
};
