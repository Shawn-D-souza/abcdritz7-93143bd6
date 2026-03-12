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
          {/* Subtle noise and glowing background textures */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute -top-1/2 -right-1/4 w-[80%] h-[150%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[60%] h-[150%] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 md:p-8 lg:p-10">
            
            {/* Left Column: Content */}
            <div className="flex flex-col items-start text-left space-y-5">
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
                  href="https://abcd-master.vercel.app/courses" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleRipple}
                  className="group relative inline-flex overflow-hidden rounded-xl bg-white px-6 py-3 text-center font-bold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-white/20 sm:text-base items-center gap-2"
                >
                  <span className="relative z-10">Explore the Programs</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transform transition-transform group-hover:translate-x-1" />
                  
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

            {/* Right Column: Visually Stunning Interactive Animation */}
            <div className="relative hidden lg:flex flex-col items-center justify-center min-h-[400px] w-full perspective-1000">
              
              {/* Core Glowing Orb System */}
              <div className="relative w-64 h-64 flex items-center justify-center transform-style-3d">
                
                {/* Outer Ambient Glow */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-blue-500/30 rounded-full blur-[60px]"
                />

                {/* 3D Rotating Rings */}
                <motion.div
                  animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t border-l border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  style={{ transformStyle: 'preserve-3d' }}
                />
                <motion.div
                  animate={{ rotateX: [360, 0], rotateZ: [0, 360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-b border-r border-purple-400/40 border-dashed shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  style={{ transformStyle: 'preserve-3d' }}
                />
                <motion.div
                  animate={{ rotateY: [360, 0], rotateZ: [360, 0] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 rounded-full border border-teal-400/30 shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                  style={{ transformStyle: 'preserve-3d' }}
                />

                {/* Central Premium Emblem */}
                <motion.div
                  animate={{ y: [-10, 10, -10], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-[3px] shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-sm mix-blend-overlay" />
                  <div className="w-full h-full bg-[#0a192f] rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-2xl">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.8)_360deg)]" 
                    />
                    <div className="absolute inset-[2px] bg-[#0f2347] rounded-full flex items-center justify-center">
                      <Brain className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </div>
                  </div>
                </motion.div>

                {/* Interactive Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, x: 40, y: -40 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                  whileHover={{ scale: 1.1, y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
                  className="absolute top-[-10%] -right-[25%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex items-center gap-3 cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl shadow-inner group-hover:rotate-12 transition-transform">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-white font-bold text-sm tracking-wide">Flexible Pacing</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-emerald-100/70 text-xs text-left">Learn at your speed</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50, y: 40 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                  whileHover={{ scale: 1.1, y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
                  className="absolute bottom-[-10%] -left-[35%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex items-center gap-3 cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-2 rounded-xl shadow-inner group-hover:-rotate-12 transition-transform">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm tracking-wide">Real-world Projs</p>
                     <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      <p className="text-purple-100/70 text-xs text-left">Deploy immediately</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
                  whileHover={{ scale: 1.1, y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
                  className="absolute -bottom-[25%] right-[0%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex items-center gap-3 cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-xl shadow-inner group-hover:rotate-180 transition-transform duration-500">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-white font-bold text-sm tracking-wide">Modern Stack</p>
                     <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <p className="text-blue-100/70 text-xs text-left">No-code & AI</p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
