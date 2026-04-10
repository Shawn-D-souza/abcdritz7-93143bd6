import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { ProgramsOrbit } from "./ProgramsOrbit";

export const Programs = () => {
  const [rippleStyle, setRippleStyle] = useState({});

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    <section className="relative py-6 md:py-10 w-full overflow-hidden" id="programs">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-primary/90 to-[#0a2540] dark:from-primary/80 dark:to-background border border-primary/20 shadow-2xl overflow-hidden"
        >
          {/* Glowing background textures */}
          <div className="absolute -top-1/2 -right-1/4 w-[80%] h-[150%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[60%] h-[150%] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 md:p-8 lg:p-10">
            
            {/* Left Column: Content */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium backdrop-blur-md shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Accelerate Your Career
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-[1.25]"
              >
                From <span className="text-white/90 font-serif italic text-3xl sm:text-4xl lg:text-[2.75rem]">Short</span> Crash Courses, to <br className="hidden lg:block" />
                <span className="text-white/90 font-serif italic text-3xl sm:text-4xl lg:text-[2.75rem]">Comprehensive</span> Bootcamps.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base text-white/80 leading-relaxed max-w-[28rem]"
              >
                Whether you need to master a specific AI tool or undergo a career transformation, our programs are meticulously crafted for your success.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-1"
              >
                <a 
                  href="https://ritz7.edrona.ai/programs" 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleRipple}
                  className="group relative inline-flex overflow-hidden rounded-xl bg-white px-10 py-3 text-center font-bold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-white/20 sm:text-base items-center justify-center min-w-[200px]"
                >
                  <span className="relative z-10">Explore the Programs</span>
                  <ArrowRight className="absolute right-4 w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                  
                  {Object.keys(rippleStyle).length > 0 && (
                    <span
                      className="absolute scale-0 animate-[ripple_0.6s_linear] rounded-full bg-primary/10"
                      style={rippleStyle}
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.04)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] opacity-0 transition-opacity duration-300 group-hover:animate-sweep group-hover:opacity-100" />
                </a>
              </motion.div>
            </div>

            {/* Right Column: Orbit Animation */}
            <ProgramsOrbit />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
