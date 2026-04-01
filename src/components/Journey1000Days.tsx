import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

// import required modules
import { EffectCoverflow, Keyboard, Navigation } from "swiper/modules";

/** One row in the `phases` table */
type PhaseRow = {
  id: string;
  phase: string;
  icon: string;
  topic: string;
  description: string;
  tag: string | null;
  sort_order: number;
  playlist_link?: string | null;
};

// Start date corresponding to Day 1
const START_DATE = new Date("2024-11-30T00:00:00Z");

/* ── Skeleton shimmer card shown while loading ── */
function SkeletonPhaseCard() {
  return (
    <div className="h-full w-full p-[1px] rounded-2xl bg-gradient-to-b from-border/80 to-transparent">
      <div className="h-full w-full bg-card/90 backdrop-blur-3xl p-6 md:p-8 rounded-[15px] border border-border flex flex-col gap-4 shadow-lg animate-pulse">
        <div className="flex items-center justify-between mt-2 mb-2">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-muted/50" />
          <div className="flex flex-col items-end gap-2">
            <div className="h-5 w-16 rounded-full bg-muted/40" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-6 w-3/4 rounded-md bg-muted/50" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-muted/30" />
            <div className="h-3 w-5/6 rounded bg-muted/30" />
            <div className="h-3 w-2/3 rounded bg-muted/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Journey1000Days = () => {
  const [phases, setPhases] = useState<PhaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentDay, setCurrentDay] = useState(484);

  useEffect(() => {
    const today = new Date();
    // Offset by 18 hours so the day increments at 6:00 PM local time instead of 12:00 AM
    const shiftedTime = today.getTime() - 18 * 60 * 60 * 1000;
    const diffTime = shiftedTime - START_DATE.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setCurrentDay(Math.max(0, diffDays));
  }, []);

  useEffect(() => {
    async function fetchPhases() {
      try {
        const { data, error: fetchError } = await supabase
          .from("phases")
          .select("*")
          .order("sort_order", { ascending: true });

        if (fetchError) {
          console.error("Error fetching phases:", fetchError);
          setError(true);
        } else if (data) {
          setPhases(data as PhaseRow[]);
        }
      } catch (err) {
        console.error("Error fetching phases:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPhases();
  }, []);

  const progressPercentage = Math.min((currentDay / 1000) * 100, 100);

  /* ── Section heading ── */
  const sectionHeading = (
    <div className="text-center mb-8 md:mb-10">
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
  );

  /* ── Progress dashboard (shared between loading & loaded states) ── */
  const progressDashboard = (
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
  );

  /* ── Loading — skeleton cards in Swiper ── */
  if (loading) {
    return (
      <section id="journey" className="py-6 md:py-10 relative w-full overflow-hidden">
        <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
          {sectionHeading}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full max-w-6xl mx-auto rounded-[2rem] bg-card/40 backdrop-blur-2xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 md:p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2rem] pointer-events-none" />
            <div className="relative w-full mx-auto mb-2 md:mb-6">
              <div className="flex gap-4 justify-center py-4 px-4 md:px-0 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-[280px] sm:w-[340px] md:w-[420px] shrink-0">
                    <SkeletonPhaseCard />
                  </div>
                ))}
              </div>
            </div>
            {progressDashboard}
          </motion.div>
        </div>
      </section>
    );
  }

  if (error || phases.length === 0) {
    return null;
  }

  return (
    <section id="journey" className="py-6 md:py-10 relative w-full overflow-hidden">
      
      <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
        {sectionHeading}

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
            <button className="custom-prev absolute left-0 sm:left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-border bg-card/90 backdrop-blur-md hover:bg-secondary transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg group">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-foreground group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button className="custom-next absolute right-0 sm:right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-border bg-card/90 backdrop-blur-md hover:bg-secondary transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg group">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-foreground group-hover:translate-x-0.5 transition-transform" />
            </button>

            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              initialSlide={phases.length - 1}
              keyboard={{ enabled: true }}
              navigation={{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
              }}
              coverflowEffect={{
                rotate: 40,
                stretch: 0,
                depth: 300,
                modifier: 1.2,
                slideShadows: false,
              }}
              breakpoints={{
                768: {
                  slidesOffsetBefore: 200,
                  slidesOffsetAfter: 200,
                },
                1280: {
                  slidesOffsetBefore: 300,
                  slidesOffsetAfter: 300,
                },
              }}
              modules={[EffectCoverflow, Keyboard, Navigation]}
              className="phase-swiper w-full py-4 px-4 md:px-0"
            >
              {phases.map((phase, idx) => (
                <SwiperSlide key={phase.id ?? idx} className="!w-[280px] sm:!w-[340px] md:!w-[420px]">
                  <PhaseCard phase={phase} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {progressDashboard}
        </motion.div>

      </div>
    </section>
  );
};

const PhaseCard = ({ phase }: { phase: PhaseRow }) => {
  return (
    <div className="h-full w-full group relative p-[1px] rounded-2xl bg-gradient-to-b from-border/80 to-transparent flex flex-col">
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
        
        <div className="mt-4 flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
              {phase.topic}
            </h3>
            {phase.playlist_link && (
              <a 
                href={phase.playlist_link} 
                target="_blank" 
                rel="noreferrer"
                className="shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_15px_rgba(79,70,229,0.4)] hover:scale-110 hover:shadow-[0_6px_20px_rgba(79,70,229,0.6)] transition-all duration-300 group/play"
                title="Watch Playlist"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 ml-1 fill-white" />
              </a>
            )}
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {phase.description}
          </p>
        </div>

      </div>
    </div>
  );
};
