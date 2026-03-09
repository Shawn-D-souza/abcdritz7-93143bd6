import { HeroCodeCard } from "./HeroCodeCard";
import { motion } from "framer-motion";
import { useState } from "react";

export const Hero = () => {
  const [rippleStyle, setRippleStyle] = useState({});

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRippleStyle({
      width: size,
      height: size,
      top: y,
      left: x,
    });

    setTimeout(() => {
      setRippleStyle({});
    }, 600);
  };

  return (
    <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-start px-6 pt-32 md:justify-center md:pt-28 lg:flex-row lg:justify-between lg:px-12 lg:pt-20">
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-start gap-6 lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
        >
          New & Growing Community for students & founders
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          Anybody Can{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-[#0756B1] bg-clip-text text-transparent">
            Design Develop Deploy
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-foreground/80 md:text-foreground/90 md:text-xl md:leading-relaxed md:rounded-xl md:bg-white/40 md:p-4 md:-mx-4 md:shadow-md md:backdrop-blur-md md:border md:border-black/10 md:dark:bg-black/40 md:dark:border-white/10 md:dark:shadow-none"
        >
          Whether you're a creator, entrepreneur, or problem-solver, our community helps you transform raw ideas into intelligent systems—powered by no-code tools and AI automation.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 flex w-full flex-row gap-3 sm:w-auto sm:gap-4"
        >
          <a href="https://wa.me/message/RVQXUI35RJO4J1" target="_blank" rel="noopener noreferrer" className="group relative w-full flex-1 overflow-hidden rounded-full bg-primary px-4 py-3.5 text-center text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 sm:w-auto sm:flex-none sm:px-8 sm:py-4 sm:text-base animate-pulse-glow hover:animate-none shine-effect">
            <span className="relative z-10 w-full whitespace-nowrap">Join the community</span>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] opacity-0 transition-opacity duration-300 group-hover:animate-sweep group-hover:opacity-100" />
          </a>

          <button 
            onClick={handleRipple}
            className="relative w-full flex-1 overflow-hidden rounded-full border border-primary/20 bg-primary/5 px-4 py-3.5 text-center text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:bg-primary/10 dark:border-primary/30 dark:bg-white/5 dark:hover:bg-white/10 sm:w-auto sm:flex-none sm:px-8 sm:py-4 sm:text-base"
          >
            <span className="relative z-10 whitespace-nowrap">Explore Programs</span>
            {Object.keys(rippleStyle).length > 0 && (
              <span
                className="absolute scale-0 animate-[ripple_0.6s_linear] rounded-full bg-primary/30"
                style={rippleStyle}
              />
            )}
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-20 hidden w-full justify-center md:flex lg:mt-0 lg:w-1/2 lg:justify-end"
      >
        <HeroCodeCard />
      </motion.div>
    </section>
  );
};
