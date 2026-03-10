import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const achievements = [
  {
    monthYear: "March 2024",
    title: "Global AI Hackathon",
    description: "Built an autonomous agent that streamlines customer service workflows. The project was highly praised for its seamless integration and innovative use of local LLMs. Won first place among 500+ competing teams worldwide.",
    winners: [
      { name: "Alice Smith", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
      { name: "Bob Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    ],
  },
  {
    monthYear: "February 2024",
    title: "Web3 Innovation Challenge",
    description: "Developed a decentralized voting application using smart contracts. The platform guarantees transparency and immutability for local community elections.",
    winners: [
      { name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
    ],
  },
  {
    monthYear: "January 2024",
    title: "Open Source Code Sprint",
    description: "Contributed over 50 crucial pull requests to major React ecosystems. Our team optimized rendering performance by 40% across several UI libraries. It was an incredible learning experience filled with late-night coding sessions.",
    winners: [
      { name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d" },
      { name: "Evan Wright", avatar: "https://i.pravatar.cc/150?u=2042581f4e29026704d" },
      { name: "Fiona Gallagher", avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d" },
    ],
  },
  {
    monthYear: "December 2023",
    title: "Cyber Security CTF",
    description: "Successfully identified and patched zero-day vulnerabilities in a simulated corporate network environment. Secured the top spot by maintaining the longest uptime during the attack phase.",
    winners: [
      { name: "George King", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026700d" },
      { name: "Hannah Lee", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026025d" },
    ],
  },
  {
    monthYear: "November 2023",
    title: "FinTech App Showdown",
    description: "Designed a micro-investing platform tailored for college students. The app analyzes spending habits to automatically invest spare change.",
    winners: [
      { name: "Ivan Drago", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026709d" },
    ],
  },
];

export function LearnerAchievements() {
  return (
    <section id="learner-achievements" className="pt-8 md:pt-12 pb-8 md:pb-12 px-6 md:px-12 bg-background/50 relative overflow-hidden">
      {/* Optional background glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-foreground">
            Learner <span className="bg-gradient-to-r from-primary via-blue-400 to-[#0756B1] bg-clip-text text-transparent">Achievements</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Celebrating the outstanding milestones and competitive successes of our community members around the globe.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
          }}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {achievements.map((achievement, index) => (
              <CarouselItem key={index} className="pl-4 md:pl-6 basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3 select-none">
                <Card className="group h-full flex flex-col bg-card/40 backdrop-blur-md border border-white/10 dark:border-white/5 hover:border-primary/30 hover:bg-card/60 transition-all duration-500 overflow-hidden relative">
                  {/* Subtle elegant corner glow on hover */}
                  <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500 px-3 py-1 rounded-full border border-primary/20 h-fit">
                        {achievement.monthYear}
                      </span>
                      {/* Avatars elegantly spread apart on hover */}
                      <div className="flex -space-x-3 group-hover:-space-x-1 transition-all duration-500 p-1">
                        {achievement.winners.map((winner, idx) => (
                          <Avatar key={idx} className="inline-block border-2 border-background h-10 w-10 sm:h-12 sm:w-12 ring-1 ring-black/5 group-hover:shadow-lg transition-transform duration-500 group-hover:scale-105">
                            <AvatarImage src={winner.avatar} alt={winner.name} />
                            <AvatarFallback>{winner.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl md:text-2xl leading-tight font-bold">
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow relative z-10">
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base group-hover:text-foreground/90 transition-colors duration-500">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12 bg-background/50 backdrop-blur-md border-white/10 hover:bg-background hover:text-primary transition-colors" />
            <CarouselNext className="-right-12 bg-background/50 backdrop-blur-md border-white/10 hover:bg-background hover:text-primary transition-colors" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
