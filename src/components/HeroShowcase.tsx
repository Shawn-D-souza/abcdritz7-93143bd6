import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import {
  Zap,
  Bot,
  Globe,
  TrendingUp,
  BookOpen,
  Wrench,
  Workflow,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import React, { useRef, useCallback, useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";



/* ── Floating Tool Badges ── */
const floatingTools = [
  { emoji: "🫧", label: "Bubble", align: "left", y: 25 },
  { emoji: "⚡", label: "n8n", align: "right", y: 25 },
  { emoji: "✨", label: "Copilot", align: "left", y: 75 },
  { emoji: "🤖", label: "AI Agents", align: "right", y: 75 },
];

/* ── Neural Pathway Particle ── */
const particlePaths = [
  { cx: [20, 80, 180, 280, 340, 420], cy: [180, 80, 120, 160, 80, 100] },
  { cx: [30, 100, 200, 280, 350, 430], cy: [50, 140, 100, 70, 150, 130] },
  { cx: [10, 90, 160, 250, 340, 440], cy: [120, 30, 90, 180, 120, 160] },
  { cx: [40, 120, 220, 300, 360, 440], cy: [160, 60, 140, 190, 60, 80] },
  { cx: [20, 100, 190, 260, 330, 440], cy: [90, 170, 80, 20, 100, 110] },
];

const NeuralParticle = ({ delay, path }: { delay: number; path: number }) => {
  const p = particlePaths[path % particlePaths.length];
  return (
    <motion.circle
      r="2.5"
      fill="url(#particleGrad)"
      filter="url(#glow)"
      animate={{
        cx: p.cx,
        cy: p.cy,
        opacity: [0, 1, 1, 1, 1, 0],
      }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

/* ── Stat Counter Animation ── */
const AnimatedNumber = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

/* ── Learner Journey Pipeline ── */
const pipelineSteps = [
  { icon: BookOpen, label: "Learn", color: "from-amber-400 to-orange-500" },
  { icon: Wrench, label: "Build", color: "from-violet-400 to-purple-600" },
  { icon: Workflow, label: "Automate", color: "from-blue-400 to-cyan-500" },
  { icon: Rocket, label: "Launch", color: "from-emerald-400 to-green-600" },
];

const PipelineProgress = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-2">
      {pipelineSteps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i === activeStep;
        const isPast = i < activeStep;
        return (
          <React.Fragment key={step.label}>
            <motion.div
              className="flex flex-col items-center gap-1.5 relative"
              animate={{ scale: isActive ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                  isActive
                    ? `bg-gradient-to-br ${step.color} border-white/30 shadow-lg`
                    : isPast
                    ? "bg-primary/10 border-primary/20 dark:bg-white/15 dark:border-white/20"
                    : "bg-black/[0.03] border-black/5 dark:bg-white/5 dark:border-white/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ boxShadow: "0 0 20px 4px rgba(255,255,255,0.2)" }}
                  />
                )}
                <Icon
                  className={`w-[18px] h-[18px] relative z-10 transition-colors duration-300 ${
                    isActive ? "text-white" : isPast ? "text-primary/70 dark:text-white/70" : "text-muted-foreground/40 dark:text-white/40"
                  }`}
                />
                {isPast && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
              <span
                className={`text-[10px] font-medium transition-colors duration-300 w-14 text-center ${
                  isActive ? "text-primary dark:text-white" : isPast ? "text-foreground/60 dark:text-white/60" : "text-muted-foreground/40 dark:text-white/30"
                }`}
              >
                {step.label}
              </span>
            </motion.div>

            {i < pipelineSteps.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 relative self-start mt-5">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary/60 to-primary/20 dark:from-white/60 dark:to-white/20 rounded-full"
                  animate={{
                    width: isPast ? "100%" : isActive ? "60%" : "0%",
                  }}
                  transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                />
                {isActive && (
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary dark:bg-white shadow-[0_0_8px_2px_rgba(59,130,246,0.4)] dark:shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]"
                    animate={{ left: ["0%", "50%"] }}
                    transition={{ duration: 2.5, ease: "linear" }}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};


export const HeroShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse position for tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse position for spotlight
  const spotlightX = useMotionValue(-200);
  const spotlightY = useMotionValue(-200);

  const springConfig = { stiffness: 200, damping: 25, mass: 0.5 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, hsl(212 92% 50% / 0.12), transparent 80%)`;
  const borderGlow = useMotionTemplate`radial-gradient(500px circle at ${spotlightX}px ${spotlightY}px, hsl(212 92% 50% / 0.45), hsl(270 70% 50% / 0.15) 40%, transparent 70%)`;

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
    },
    [mouseX, mouseY, spotlightX, spotlightY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    spotlightX.set(-200);
    spotlightY.set(-200);
  }, [mouseX, mouseY, spotlightX, spotlightY]);

  /* ── Live status text rotation ── */
  const statusTexts = [
    "Ideas → Reality",
    "No-code builders",
    "500+ learners strong",
    "Community powered",
  ];
  const [statusIdx, setStatusIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % statusTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <div
      className="relative w-full max-w-[480px]"
      style={{ perspective: isTouchDevice ? "none" : "1200px" }}
    >
      {/* Ambient glow */}
      <div className="absolute -inset-16 rounded-3xl bg-gradient-to-br from-primary/20 via-violet-500/10 to-cyan-500/10 blur-[80px] dark:from-primary/15 dark:via-violet-500/8 dark:to-cyan-500/8" />

      {/* Outer card wrapper — tilt only on non-touch devices */}
      <motion.div
        ref={ref}
        onMouseMove={isTouchDevice ? undefined : handleMouseMove}
        onMouseLeave={isTouchDevice ? undefined : handleMouseLeave}
        style={{
          rotateX: isTouchDevice ? 0 : rotateX,
          rotateY: isTouchDevice ? 0 : rotateY,
          transformStyle: isTouchDevice ? "flat" : "preserve-3d",
        }}
        className="relative z-10 rounded-2xl p-[1px]"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: borderGlow }}
        />
        <div className="absolute inset-0 rounded-2xl border border-black/10 dark:border-white/[0.08]" />

        {/* Card body */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0a0f1a] dark:shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
          {/* Spotlight overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{ background: spotlightBackground }}
          />

          {/* Background neural SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25 dark:opacity-15"
            viewBox="0 0 460 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="particleGrad">
                <stop offset="0%" stopColor="hsl(212, 92%, 60%)" />
                <stop offset="100%" stopColor="hsl(270, 70%, 50%)" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Neural pathway lines */}
            {[
              "M 20 180 Q 80 80 180 120 Q 280 160 340 80 Q 380 40 420 100",
              "M 30 50 Q 100 140 200 100 Q 280 70 350 150 Q 400 190 430 130",
              "M 10 120 Q 90 30 160 90 Q 250 180 340 120 Q 390 90 440 160",
              "M 40 160 Q 120 60 220 140 Q 300 190 360 60 Q 400 10 440 80",
              "M 20 90 Q 100 170 190 80 Q 260 20 330 100 Q 380 150 440 110",
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={`url(#pathGrad${i})`}
                strokeWidth="1"
                opacity="0.3"
              />
            ))}

            {/* Path gradients */}
            {[0, 1, 2, 3, 4].map((i) => (
              <defs key={`grad-${i}`}>
                <linearGradient id={`pathGrad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(212, 92%, 50%)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="hsl(270, 70%, 50%)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(180, 70%, 50%)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            ))}

            {/* Animated particles flowing along paths */}
            {Array.from({ length: 12 }).map((_, i) => (
              <NeuralParticle key={i} delay={i * 0.4} path={i} />
            ))}
          </svg>

          {/* ── Header Bar ── */}
          <div className="relative z-10 flex items-center justify-between border-b border-black/5 bg-gradient-to-r from-muted/40 to-muted/20 px-4 py-3 dark:border-white/5 dark:from-white/[0.03] dark:to-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-125" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e] transition-transform hover:scale-125" />
              <div className="h-3 w-3 rounded-full bg-[#28c840] transition-transform hover:scale-125" />
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 text-primary/60" />
              <span className="text-xs font-medium text-muted-foreground/80">
                ritz7 — AI Engine
              </span>
            </div>
            <div className="w-[52px]" />
          </div>

          {/* ── Main Content Area ── */}
          <div className="relative z-10 p-5 space-y-5">

            {/* Top stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Learners", value: 500, suffix: "+", icon: Globe, gradient: "from-blue-500 to-cyan-400" },
                { label: "Automations", value: 1200, suffix: "+", icon: Zap, gradient: "from-violet-500 to-purple-400" },
                { label: "Hours Saved", value: 10000, suffix: "+", icon: TrendingUp, gradient: "from-emerald-500 to-green-400" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="relative group rounded-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-white/[0.06] dark:to-white/[0.02] border border-black/5 dark:border-white/[0.08] p-3 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <stat.icon className="w-4 h-4 mx-auto mb-1.5 text-primary" />
                  <p className="text-lg font-bold text-foreground leading-none">
                    <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* ── Central Orb with floating tools ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.7, type: "spring" }}
              className="relative flex items-center justify-center py-3"
            >
              {/* Pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-24 h-24 rounded-full border-2 border-primary/30"
              />
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute w-24 h-24 rounded-full border border-violet-400/20"
              />

              {/* Central Ritz7 "R" Icon */}
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-primary via-blue-400 to-violet-500 p-[2px] shadow-[0_0_30px_6px_rgba(59,130,246,0.2)]"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-[#0a0f1a] flex items-center justify-center">
                  <img
                    src="/favicon.png"
                    alt="Ritz7"
                    className="w-11 h-11 object-contain"
                  />
                </div>
              </motion.div>

              {/* Floating tool badges */}
              {floatingTools.map((tool, i) => (
                <motion.div
                  key={tool.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.15, type: "spring" }}
                  className="absolute"
                  style={{
                    [tool.align]: isMobile ? '12px' : '40px',
                    top: `${tool.y}%`,
                    transform: "translateY(-50%)",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-white/10 border border-black/5 dark:border-white/15 shadow-lg cursor-default"
                  >
                    <span className="text-xs">{tool.emoji}</span>
                    <span className="text-[9px] font-semibold text-foreground/80 whitespace-nowrap">{tool.label}</span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Learner Journey Pipeline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="rounded-xl bg-gradient-to-br from-primary/8 to-violet-500/5 dark:from-primary/15 dark:to-violet-500/10 border border-primary/10 dark:border-primary/20 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Workflow className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider">Your Journey</span>
              </div>
              <PipelineProgress />
            </motion.div>
          </div>

          {/* ── Status bar ── */}
          <div className="relative z-10 flex items-center justify-between border-t border-black/5 bg-muted/30 px-4 py-2 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                <motion.span
                  className="h-2 w-2 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={statusIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    {statusTexts[statusIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground/40 font-mono">
                No-Code
              </span>
              <span className="text-[10px] text-muted-foreground/20">•</span>
              <span className="text-[10px] text-muted-foreground/40 font-mono">
                AI-Powered
              </span>
            </div>
          </div>
        </div>
      </motion.div>


    </div>
  );
};
