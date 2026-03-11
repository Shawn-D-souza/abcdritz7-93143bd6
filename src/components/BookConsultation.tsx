import { motion } from "framer-motion";
import { Calendar, Clock, Video, ArrowRight, Star } from "lucide-react";

export const BookConsultation = () => {
  return (
    <section id="book-consultation" className="py-24 relative w-full overflow-hidden">
      <div className="container px-4 mx-auto relative z-10 w-full max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative w-full rounded-[2rem] bg-card/40 backdrop-blur-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Profile & Info */}
            <div className="md:w-2/5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-border/50 flex flex-col relative overflow-hidden bg-background/30">
              {/* Subtle background pattern/gradient for left side */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
              
              <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left h-full">
                <div className="relative w-32 h-32 md:w-36 md:h-36 mb-6 shrink-0 flex items-center justify-center transform-style-3d">
                  {/* Outer Ambient Glow */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-blue-500/30 rounded-full blur-[30px]"
                  />

                  {/* 3D Rotating Rings */}
                  <motion.div
                    animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20%] rounded-full border-t border-l border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] pointer-events-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                  <motion.div
                    animate={{ rotateX: [360, 0], rotateZ: [0, 360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-10%] rounded-full border-b border-r border-purple-400/40 border-dashed shadow-[0_0_15px_rgba(168,85,247,0.3)] pointer-events-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                  <motion.div
                    animate={{ rotateY: [360, 0], rotateZ: [360, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-30%] rounded-full border border-teal-400/30 shadow-[0_0_20px_rgba(45,212,191,0.2)] pointer-events-none"
                    style={{ transformStyle: 'preserve-3d' }}
                  />

                  <motion.div 
                     whileHover={{ scale: 1.05 }}
                     className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl z-10 bg-background/50"
                  >
                    <img 
                      src="/rithesh_hegde.avif" 
                      alt="Rithesh Hegde, CEO of Ritz7" 
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent mix-blend-overlay" />
                  </motion.div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-foreground">
                  Rithesh Hegde
                </h3>
                <p className="text-primary font-medium tracking-wide text-sm md:text-base mb-8 flex items-center justify-center md:justify-start gap-2">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  CEO & AI Expert, Ritz7
                </p>
                
                <div className="w-full grid grid-cols-2 gap-2 text-left mt-auto">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center gap-2 text-muted-foreground p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 bg-background/50">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-xs">Duration</h4>
                      <p className="text-[10px] leading-tight">30 to 60 Mins</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col xl:flex-row items-start xl:items-center gap-2 text-muted-foreground p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 bg-background/50">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-xs">Meeting</h4>
                      <p className="text-[10px] leading-tight">G Meet / Zoom</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Details */}
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center relative">
               <div className="mb-8">
                 <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                   Accelerate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Learning</span>
                 </h2>
                 <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
                   Schedule a 1-on-1 mentorship call to discuss your learning path, mastering AI tools, and career growth. Get personalized guidance tailored to your goals.
                 </p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    "AI & Automation Mastery",
                    "Personalized Learning Path",
                    "Doubt Clearing & Guidance",
                    "Portfolio Review & Feedback"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                         <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                         </svg>
                       </div>
                       <span className="text-sm font-medium text-foreground/80">{item}</span>
                    </div>
                  ))}
               </div>

               <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                 <motion.a 
                   href="https://wa.me/message/RVQXUI35RJO4J1" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="relative overflow-hidden flex-1 flex items-center justify-center gap-2 bg-[#0756B1] hover:bg-[#064a97] text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(7,86,177,0.4)] group animate-pulse-glow hover:animate-none shine-effect"
                 >
                   <Calendar className="relative z-10 w-5 h-5 transition-transform group-hover:-rotate-12" />
                   <span className="relative z-10">Book a 1-on-1 Call</span>
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] opacity-0 transition-opacity duration-300 group-hover:animate-sweep group-hover:opacity-100" />
                 </motion.a>
                 
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
