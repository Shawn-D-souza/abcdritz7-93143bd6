import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Youtube } from "lucide-react";
import { supabase } from "@/lib/supabase";

/** One row in the single `hall_of_fame` table */
type HallOfFameRow = {
  id: string;
  title: string;
  month_year: string;
  youtube_url: string;
  winner_name: string;
  avatar_url: string;
  linkedin_url: string;
};

/** Grouped view used by the UI — one per achievement card */
type AchievementCard = {
  key: string;
  title: string;
  month_year: string;
  youtube_url: string;
  winners: { name: string; avatar_url: string; linkedin_url: string }[];
};

/**
 * Given just a filename like "alice.jpg", returns the full Supabase Storage
 * public URL from the "avatars" bucket. If the value is already a full URL
 * (starts with http), it is returned as-is.
 */
function getAvatarUrl(avatarValue: string): string {
  if (avatarValue.startsWith("http")) {
    return avatarValue;
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarValue);
  return data.publicUrl;
}

/** Group flat rows into one card per unique achievement */
function groupRows(rows: HallOfFameRow[]): AchievementCard[] {
  const map = new Map<string, AchievementCard>();

  for (const row of rows) {
    const key = `${row.title}__${row.month_year}__${row.youtube_url}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        title: row.title,
        month_year: row.month_year,
        youtube_url: row.youtube_url,
        winners: [],
      });
    }
    map.get(key)!.winners.push({
      name: row.winner_name,
      avatar_url: row.avatar_url,
      linkedin_url: row.linkedin_url,
    });
  }

  // Insertion order from the DB query (created_at desc) is preserved by Map
  return Array.from(map.values());
}

/* ── Skeleton shimmer card shown while loading ── */
function SkeletonCard({ avatarCount = 3 }: { avatarCount?: number }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-lg shadow-xl animate-pulse">
      {/* Gradient header skeleton */}
      <div className="relative bg-gradient-to-br from-primary/30 via-blue-500/20 to-[#0756B1]/30 px-5 pt-5 pb-10 overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-white/20" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 rounded-md bg-white/20" />
            <div className="h-3 w-1/3 rounded-md bg-white/15" />
          </div>
        </div>
      </div>

      {/* Avatar row skeleton */}
      <div className="relative z-10 flex flex-col items-center px-5 pb-5 -mt-9 gap-3">
        <div className="flex items-end justify-center gap-4">
          {Array.from({ length: avatarCount }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-[72px] h-[72px] lg:w-[80px] lg:h-[80px] rounded-full bg-muted/60 ring-[3px] ring-white/30" />
              <div className="h-3 w-14 rounded bg-muted/40" />
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="mt-1 w-full h-10 rounded-xl bg-muted/30" />
      </div>
    </div>
  );
}

/* ── Reusable achievement card content ── */
function AchievementCardContent({ achievement }: { achievement: AchievementCard }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 dark:border-white/5 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-primary/15 hover:shadow-2xl bg-card/40 backdrop-blur-lg h-full">
      {/* ── Gradient Header ── */}
      <div className="relative bg-gradient-to-br from-primary/80 via-blue-500/70 to-[#0756B1]/80 px-5 pt-5 pb-10 overflow-hidden">
        {/* subtle noise/shimmer overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/40 to-transparent" />

        {/* Trophy + Title */}
        <div className="relative z-10 flex items-start gap-3">
          <span className="text-2xl mt-0.5 drop-shadow">🏆</span>
          <div>
            <h3 className="text-white font-extrabold text-lg md:text-xl leading-tight drop-shadow-sm">
              {achievement.title}
            </h3>
            <span className="text-white/70 text-xs font-semibold tracking-wider uppercase">
              {achievement.month_year}
            </span>
          </div>
        </div>
      </div>

      {/* ── Winners — avatars break out of the header ── */}
      <div className="relative z-10 flex flex-col items-center px-5 pb-5 -mt-9 gap-3">
        {/* Avatar row — centered, all equal */}
        <div
          className={`flex items-end justify-center flex-wrap ${
            achievement.winners.length === 2 ? "gap-6" : "gap-3"
          }`}
        >
          {achievement.winners.map((winner, idx) => (
            <a
              key={idx}
              href={winner.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 cursor-pointer group/avatar"
            >
              {/* Big avatar with glowing ring */}
              <div className="relative">
                <img
                  src={getAvatarUrl(winner.avatar_url)}
                  alt={winner.name}
                  className="w-[72px] h-[72px] lg:w-[80px] lg:h-[80px] rounded-full object-cover object-[center_20%] ring-[3px] ring-white/90 dark:ring-white/70 shadow-xl group-hover/avatar:ring-[#0A66C2] group-hover/avatar:shadow-[#0A66C2]/30 transition-all duration-400"
                />
                {/* glow blob behind avatar */}
                <div className="absolute inset-0 rounded-full blur-md bg-primary/40 -z-10 opacity-0 group-hover:opacity-70 transition-opacity duration-500 scale-110" />
              </div>
              {/* Name — single line */}
              <span className="text-xs font-bold text-foreground/90 text-center whitespace-nowrap group-hover/avatar:text-[#0A66C2] transition-colors duration-300">
                {winner.name}
              </span>
            </a>
          ))}
        </div>

        {/* YouTube Button */}
        <a
          href={achievement.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/yt mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4
            font-bold text-sm tracking-wide
            bg-[#E53935] hover:bg-[#C62828]
            text-white
            shadow-md hover:shadow-lg hover:shadow-red-500/30
            transition-all duration-300"
        >
          <Youtube className="w-4 h-4 group-hover/yt:scale-110 transition-transform duration-300" />
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}

export function LearnerAchievements() {
  const [achievements, setAchievements] = useState<AchievementCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const { data, error: fetchError } = await supabase
          .from("hall_of_fame")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching hall of fame:", fetchError);
          setError(true);
        } else if (data) {
          setAchievements(groupRows(data as HallOfFameRow[]));
        }
      } catch (err) {
        console.error("Error fetching hall of fame:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  /* ── Section wrapper & heading (shared by loading / loaded states) ── */
  const sectionHeader = (
    <>
      <div className="mb-8 md:mb-10 flex flex-col items-center text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
          Hall of{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-[#0756B1] bg-clip-text text-transparent">
            Fame
          </span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Celebrating the outstanding milestones and competitive successes of
          our community members around the globe.
        </p>
      </div>
    </>
  );

  /* ── Loading — skeleton cards ── */
  if (loading) {
    return (
      <section
        id="learner-achievements"
        className="py-6 md:py-10 px-6 md:px-12 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {sectionHeader}
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {[3, 1, 2].map((count, i) => (
                <CarouselItem
                  key={i}
                  className="pl-4 md:pl-6 basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3 select-none"
                >
                  <SkeletonCard avatarCount={count} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    );
  }

  if (error || achievements.length === 0) {
    return null;
  }

  /* ── Few cards (1–2): centered grid, no carousel ── */
  if (achievements.length <= 2) {
    return (
      <section
        id="learner-achievements"
        className="py-6 md:py-10 px-6 md:px-12 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {sectionHeader}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 md:gap-6 max-w-3xl mx-auto">
            {achievements.map((achievement) => (
              <div
                key={achievement.key}
                className="w-full sm:w-[340px] md:w-[380px]"
              >
                <AchievementCardContent achievement={achievement} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── 3+ cards: full carousel ── */
  return (
    <section
      id="learner-achievements"
      className="py-6 md:py-10 px-6 md:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {sectionHeader}

        <Carousel
          opts={{ align: "start", loop: false, dragFree: true }}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {achievements.map((achievement) => (
              <CarouselItem
                key={achievement.key}
                className="pl-4 md:pl-6 basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3 select-none"
              >
                <AchievementCardContent achievement={achievement} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious className="-left-6 lg:-left-8 w-10 h-10 rounded-full bg-card/80 backdrop-blur-xl border border-white/15 hover:bg-primary hover:text-white hover:border-primary shadow-lg hover:shadow-primary/30 transition-all duration-300" />
            <CarouselNext className="-right-6 lg:-right-8 w-10 h-10 rounded-full bg-card/80 backdrop-blur-xl border border-white/15 hover:bg-primary hover:text-white hover:border-primary shadow-lg hover:shadow-primary/30 transition-all duration-300" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
