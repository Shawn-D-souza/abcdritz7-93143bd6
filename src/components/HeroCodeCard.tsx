import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Star, Zap } from "lucide-react";
import React, { useRef } from "react";

export const HeroCodeCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative w-full max-w-[560px]" style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-full rounded-3xl border border-primary/20 bg-white/50 p-4 shadow-[0_0_60px_-12px_hsl(var(--primary)/0.15)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_0_60px_-12px_hsl(var(--primary)/0.25)]"
      >
        {/* Inner code block */}
        <div className="rounded-2xl border border-black/5 bg-white/90 p-6 shadow-lg dark:border-white/15 dark:bg-black/60 dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <pre className="text-left text-sm font-mono text-slate-800 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
            <code className="block">
              <span className="text-purple-600 dark:text-purple-400">import</span> {"{ "}
              <span className="text-blue-600 dark:text-blue-400">Community</span>
              {" }"} <span className="text-purple-600 dark:text-purple-400">from</span> <span className="text-emerald-600 dark:text-green-400">'@ritz7/core'</span>;<br/>
              <span className="text-purple-600 dark:text-purple-400">import</span> {"{ "}
              <span className="text-blue-600 dark:text-blue-400">AIAgents</span>, <span className="text-blue-600 dark:text-blue-400">NoCode</span>
              {" }"} <span className="text-purple-600 dark:text-purple-400">from</span> <span className="text-emerald-600 dark:text-green-400">'@ritz7/tools'</span>;
              <br/><br/>
              <span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-amber-600 dark:text-yellow-200">builder</span> = <span className="text-purple-600 dark:text-purple-400">new</span> <span className="text-blue-600 dark:text-blue-400">Community</span>({"{ "}<br/>
              {"  "}name: <span className="text-emerald-600 dark:text-green-400">"Ritz7"</span>,<br/>
              {"  "}stack: [<span className="text-blue-600 dark:text-blue-400">NoCode</span>, <span className="text-blue-600 dark:text-blue-400">AIAgents</span>],<br/>
              {"  "}status: <span className="text-emerald-600 dark:text-green-400">"Live & Growing"</span><br/>
              {"});"}
              <br/><br/>
              <span className="text-slate-500 dark:text-gray-500">// Transform raw ideas into intelligent systems</span><br/>
              <span className="text-amber-600 dark:text-yellow-200">builder</span>.<span className="text-sky-600 dark:text-blue-300">deployAutomations</span>();
            </code>
          </pre>
        </div>
      </motion.div>

      {/* Floating mini cards */}
      <motion.div 
        className="absolute -right-6 -top-6 z-20 flex animate-bob flex-col rounded-xl border border-black/5 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-black/40 md:-right-10 md:-top-10"
      >
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          <span className="text-sm font-semibold text-foreground">Top Network</span>
        </div>
        <span className="mt-0.5 text-xs text-muted-foreground">Connect with experts</span>
      </motion.div>

      <motion.div 
        className="absolute -bottom-6 -left-6 z-20 flex animate-bob flex-col rounded-xl border border-black/5 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-black/40 md:-bottom-10 md:-left-10"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <span className="text-sm font-semibold text-foreground">N8N Series</span>
        </div>
        <span className="mt-0.5 text-xs text-muted-foreground">Build automations</span>
      </motion.div>
    </div>
  );
};
