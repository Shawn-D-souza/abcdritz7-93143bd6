import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

// import required modules
import { EffectCoverflow, Keyboard, Navigation } from "swiper/modules";

const phases = [
  {
    phase: "Phase 1",
    icon: "🌐",
    topic: "Bubble Development",
    description:
      "Immersed in the world of no-code, building real products using Bubble. Learned what's possible when creativity meets visual development.",
  },
  {
    phase: "Phase 2",
    icon: "⚡",
    topic: "Automation Tools",
    description:
      "Explored automating everyday workflows with tools like Zapier, Make, and n8n to multiply productivity instantly.",
  },
  {
    phase: "Phase 3",
    icon: "🤖",
    topic: "Exploring AI Tools",
    description:
      "Dove into the evolving AI ecosystem. Tested and shared over 100 tools for prompt engineering and agent workflows.",
  },
  {
    phase: "Phase 4",
    icon: "🧠",
    topic: "AI Agents (N8N)",
    description:
      "Focused on building autonomous systems using AI agents, supercharged with n8n for automated lead gen and CRMs.",
  },
  {
    phase: "Phase 5",
    icon: "🛠️",
    topic: "OpenAI Builder",
    description:
      "Mastered creating customized GPTs tailored exactly to unique personal and business requirements.",
  },
  {
    phase: "Phase 6",
    icon: "🌟",
    topic: "Emergent AI",
    description:
      "Explored cutting-edge, emergent AI capabilities and researched the frontier of intelligent systems.",
  },
  {
    phase: "Phase 7",
    icon: "💼",
    topic: "Microsoft Copilot",
    description:
      "Learned how to integrate Microsoft Copilot into enterprise workflows to boost daily productivity.",
  },
  {
    phase: "Phase 8",
    icon: "✨",
    topic: "Google Gemini",
    description:
      "Explored the multimodal capabilities of Google Gemini, building advanced multi-media AI integrations.",
  },
  {
    phase: "Phase 9",
    tag: "Ongoing",
    icon: "🎙️",
    topic: "ElevenLabs Mastery",
    description:
      "Mastered voice generation and cloning using ElevenLabs to bring human-like voices to AI applications.",
  },
];

// Start date corresponding to Day 1
// If today (March 11, 2026) is day 484, Day 1 was 483 days ago = Nov 13, 2024
const START_DATE = new Date("2024-11-13T00:00:00Z");

export const Journey1000Days = () => {
  const [currentDay, setCurrentDay] = useState(484);

  useEffect(() => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - START_DATE.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setCurrentDay(diffDays);
  }, []);

  const progressPercentage = Math.min((currentDay / 1000) * 100, 100);

  return (
    <section id="journey" className="py-24 relative w-full overflow-hidden">
      
      <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">1000 Days</span> Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Documenting the continuous path of exploring, learning, and mastering AI and automation.
          </motion.p>
        </div>

        {/* Unified Design Container connecting Cylinder & Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative w-full max-w-6xl mx-auto rounded-[2rem] bg-card/40 backdrop-blur-2xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 md:p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2rem] pointer-events-none" />
          
          {/* The Scroll Container (Cylindrical Effect via Swiper) */}
          <div className="relative w-full mx-auto mb-2 md:mb-6">
            {/* Fade edges */}
            <div className="absolute top-0 bottom-0 left-0 w-8 md:w-32 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none rounded-l-3xl" />
            <div className="absolute top-0 bottom-0 right-0 w-8 md:w-32 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none rounded-r-3xl" />
            
            {/* Custom Navigation Arrows positioned on the sides of the Swiper */}
            <button className="custom-prev absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full border border-border bg-card/80 backdrop-blur-md hover:bg-secondary transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg group">
              <ChevronLeft className="w-6 h-6 text-foreground group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button className="custom-next absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full border border-border bg-card/80 backdrop-blur-md hover:bg-secondary transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg group">
              <ChevronRight className="w-6 h-6 text-foreground group-hover:translate-x-0.5 transition-transform" />
            </button>

            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              initialSlide={0} // Phase 9 by default
              keyboard={{ enabled: true }}
              navigation={{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
              }}
              coverflowEffect={{
                rotate: 40, // Stronger angle for cylinder look
                stretch: 0,
                depth: 300, // Deeper z-index depth
                modifier: 1.2,
                slideShadows: false, // Disabling shadows because we use custom CSS borders
              }}
              modules={[EffectCoverflow, Keyboard, Navigation]}
              className="w-full py-4 px-4 md:px-0"
            >
              {[...phases].reverse().map((phase, idx) => (
                <SwiperSlide key={idx} className="!w-[280px] sm:!w-[340px] md:!w-[420px]">
                  <PhaseCard phase={phase} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Progress & Navigation Dashboard - Integrated into the same wrapper */}
          <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-center justify-between border-t border-border/50 pt-6 px-4 md:px-8 pb-2">
            
            <div className="flex-1 w-full space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-4">
                  
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base font-bold text-foreground tracking-wider mb-2">Journey Progress</span>
                  </div>

                  <span className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    Day {currentDay} <span className="text-lg font-normal text-muted-foreground">/ 1000</span>
                  </span>

                </div>

                <div className="h-5 md:h-6 w-full bg-secondary/80 rounded-full overflow-hidden backdrop-blur-sm border border-border/50 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-[#0756B1] rounded-full relative shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
                  />
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                Every day is a step towards mastery. Follow along as new tools, techniques, and breakthroughs are documented and shared on the channel.
              </p>
            </div>

            {/* Playlist Thumbnail Preview */}
            <a 
              href="https://youtube.com/playlist?list=PLsuKLwjZkazaRDTHHDDPXG5FOZvFOAect" 
              target="_blank" 
              rel="noreferrer"
              className="group relative block w-full xl:w-[400px] aspect-video rounded-xl overflow-hidden shadow-xl border border-border shrink-0"
            >
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/0 transition-colors duration-500 z-10" />
              <img 
                src="/journey-thumbnail.jpg" 
                alt="Playlist Preview" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/30 group-hover:bg-black/60 group-hover:scale-110 transition-all duration-300">
                  <Play className="w-6 h-6 md:w-7 md:h-7 text-white ml-1 fill-white" />
                </div>
              </div>

              {/* Playlist Label */}
              <div className="absolute bottom-3 left-3 right-3 z-20">
                <div className="bg-black/70 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10">
                  <p className="text-xs font-semibold text-white/90 truncate">
                    Watch the Journey Playlist
                  </p>
                </div>
              </div>
            </a>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

const PhaseCard = ({ phase }: { phase: { phase: string; icon: string; topic: string; description: string; tag?: string } }) => {
  return (
    <div className="h-full w-full group relative p-[1px] rounded-2xl bg-gradient-to-b from-border/80 to-transparent">
      <div className="h-full w-full bg-card/90 backdrop-blur-3xl p-6 md:p-8 rounded-[15px] border border-border flex flex-col gap-4 shadow-lg transition-all duration-500 group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] group-hover:bg-card">
        
        <div className="flex items-center justify-between mt-2 mb-2">
          <span className="text-5xl md:text-6xl filter drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
            {phase.icon}
          </span>
          <div className="flex flex-col items-end gap-2">
            {phase.tag && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                {phase.tag}
              </span>
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/50">
              {phase.phase}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-xl md:text-2xl font-extrabold mb-3 text-foreground tracking-tight">
            {phase.topic}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {phase.description}
          </p>
        </div>

      </div>
    </div>
  );
};
