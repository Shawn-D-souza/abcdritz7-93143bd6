import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Youtube } from "lucide-react";

const achievements = [
  {
    monthYear: "March 2024",
    title: "Global AI Hackathon",
    youtubeUrl: "https://www.youtube.com/@ritz7hq",
    winners: [
      { name: "Alice Smith", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", linkedin: "https://www.linkedin.com/in/" },
      { name: "Bob Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", linkedin: "https://www.linkedin.com/in/" },
    ],
  },
  {
    monthYear: "February 2024",
    title: "Web3 Innovation Challenge",
    youtubeUrl: "https://www.youtube.com/@ritz7hq",
    winners: [
      { name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d", linkedin: "https://www.linkedin.com/in/" },
    ],
  },
  {
    monthYear: "January 2024",
    title: "Open Source Code Sprint",
    youtubeUrl: "https://www.youtube.com/@ritz7hq",
    winners: [
      { name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d", linkedin: "https://www.linkedin.com/in/" },
      { name: "Evan Wright", avatar: "https://i.pravatar.cc/150?u=2042581f4e29026704d", linkedin: "https://www.linkedin.com/in/" },
      { name: "Fiona Gallagher", avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d", linkedin: "https://www.linkedin.com/in/" },
    ],
  },
  {
    monthYear: "December 2023",
    title: "Cyber Security CTF",
    youtubeUrl: "https://www.youtube.com/@ritz7hq",
    winners: [
      { name: "George King", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026700d", linkedin: "https://www.linkedin.com/in/" },
      { name: "Hannah Lee", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026025d", linkedin: "https://www.linkedin.com/in/" },
    ],
  },
  {
    monthYear: "November 2023",
    title: "FinTech App Showdown",
    youtubeUrl: "https://www.youtube.com/@ritz7hq",
    winners: [
      { name: "Ivan Drago", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026709d", linkedin: "https://www.linkedin.com/in/" },
    ],
  },
];

export function LearnerAchievements() {
  return (
    <section
      id="learner-achievements"
      className="py-6 md:py-10 px-6 md:px-12 bg-background/50 relative overflow-hidden"
    >
      {/* Ambient bg glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="mb-8 md:mb-10 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
            Learner{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-[#0756B1] bg-clip-text text-transparent">
              Achievements
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Celebrating the outstanding milestones and competitive successes of our community members around the globe.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{ align: "start", loop: false, dragFree: true }}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {achievements.map((achievement, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:pl-6 basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3 select-none"
              >
                {/*
                  ┌──────────────────────────────┐
                  │  Gradient header              │
                  │  🏆  Competition Name         │
                  │  Month Year                   │
                  ├─────── Avatars overlap ───────│
                  │   [pic]  [pic]  [pic]         │
                  │   Name   Name   Name          │
                  │                               │
                  │  [ ▶ Watch on YouTube ]       │
                  └──────────────────────────────┘
                */}
                <div className="group relative rounded-2xl overflow-hidden border border-white/10 dark:border-white/5 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-primary/15 hover:shadow-2xl bg-card/40 backdrop-blur-lg">

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
                          {achievement.monthYear}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Winners — avatars break out of the header ── */}
                  <div className="relative z-10 flex flex-col items-center px-5 pb-5 -mt-9 gap-3">

                    {/* Avatar row — centered, all equal */}
                    <div className={`flex items-end justify-center flex-wrap ${achievement.winners.length === 2 ? 'gap-6' : 'gap-3'}`}>
                      {achievement.winners.map((winner, idx) => (
                        <a
                          key={idx}
                          href={winner.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 cursor-pointer group/avatar"
                        >
                          {/* Big avatar with glowing ring */}
                          <div className="relative">
                            <img
                              src={winner.avatar}
                              alt={winner.name}
                              className="w-[72px] h-[72px] lg:w-[80px] lg:h-[80px] rounded-full object-cover ring-[3px] ring-white/90 dark:ring-white/70 shadow-xl group-hover/avatar:ring-[#0A66C2] group-hover/avatar:shadow-[#0A66C2]/30 transition-all duration-400"
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
                      href={achievement.youtubeUrl}
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
