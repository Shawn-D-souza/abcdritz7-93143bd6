import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Star, Zap } from "lucide-react";
import React, { useRef } from "react";

export const HeroCodeCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative w-full max-w-[500px]" style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-full rounded-2xl border border-black/5 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-black/60 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
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
      </motion.div>

      {/* Floating mini cards */}
      <motion.div 
        className="absolute -right-6 -top-6 z-20 flex animate-bob items-center gap-2 rounded-xl border border-black/5 bg-white/90 p-3 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-black/40 md:-right-8 md:-top-8 md:p-4"
      >
        <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
        <span className="text-sm font-medium text-foreground">Top Network</span>
      </motion.div>

      <motion.div 
        className="absolute -bottom-6 -left-6 z-20 flex animate-bob items-center gap-2 rounded-xl border border-black/5 bg-white/90 p-3 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-black/40 md:-bottom-8 md:-left-8 md:p-4"
        style={{ animationDelay: "1s" }}
      >
        <Zap className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        <span className="text-sm font-medium text-foreground">N8N Series</span>
      </motion.div>
    </div>
  );
};
