import { motion } from "framer-motion";
import { Youtube, Users, Video, ExternalLink } from "lucide-react";

export const AboutUs = () => {
  return (
    <section id="about-us" className="relative py-6 md:py-10 w-full overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-3"
          >
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
              Ritz7
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto"
          >
            Tearing down software development barriers—one builder at a time
          </motion.p>
        </div>

        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto rounded-[2rem] bg-card/40 backdrop-blur-2xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
        >
          {/* Background accents */}
          <div className="absolute -top-1/3 -right-1/4 w-[60%] h-[120%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[50%] h-[100%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Content with floated YouTube card */}
          <div className="relative z-10 p-6 md:p-8 lg:p-10">
            {/* Pull Quote */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-5"
            >
              <div className="relative pl-4 border-l-[3px] border-blue-500/60">
                <p className="text-base md:text-lg italic text-foreground leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">
                  "You don't need a CS degree to build software."
                </p>
              </div>
            </motion.div>

            {/* YouTube Card - floated left so text wraps around it */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="float-left mr-6 mb-4 w-full sm:w-[280px] md:w-[300px]"
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-xl overflow-hidden">
                {/* Card banner using real image */}
                <div className="h-[72px] relative overflow-hidden">
                  <img
                    src="/ritz7-banner.jpg"
                    alt="Ritz7 Channel Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                  <div className="absolute bottom-2 right-3 flex items-center gap-1.5 text-white/80">
                    <Youtube className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">
                      YouTube
                    </span>
                  </div>
                </div>

                {/* Avatar + Info */}
                <div className="relative px-5 pb-5 pt-0">
                  {/* Avatar overlapping the banner */}
                  <div className="relative -mt-7 mb-3 flex justify-center">
                    <div className="w-14 h-14 rounded-full ring-[3px] ring-card shadow-lg overflow-hidden bg-card">
                      <img
                        src="/ritz7-profile.jpg"
                        alt="Ritz7 Channel Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Channel Name */}
                  <div className="text-center space-y-1 mb-3">
                    <h4 className="text-sm font-bold text-foreground leading-tight">
                      Ritesh Hegde - Your AI Partner
                    </h4>
                    <p className="text-xs text-muted-foreground">@ritz7ai</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">6K+</span>
                      <span className="text-[10px]">subscribers</span>
                    </div>
                    <div className="w-px h-3 bg-border/50" />
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Video className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">1K+</span>
                      <span className="text-[10px]">videos</span>
                    </div>
                  </div>

                  {/* Subscribe Button */}
                  <a
                    href="https://www.youtube.com/@ritz7ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Youtube className="w-4 h-4" />
                    Subscribe
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Story Paragraphs — text wraps around the floated card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="space-y-4 text-base md:text-[1.05rem]"
            >
              <p className="text-muted-foreground leading-relaxed">
                We saw something that bothered us — really smart, creative students were just sitting on the side, 
                using technology but never building it. For years, people were told that coding is only for those 
                with a computer science degree or a technical background. That idea kept lakhs of talented people from 
                even trying.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">
                  We started Ritz7 to change that completely.
                </span>{" "}
                With AI and No-Code tools now available to everyone, you no longer need to learn complex code just to 
                build something. The real skills that matter now are{" "}
                <span className="text-foreground font-medium">
                  thinking clearly, solving problems, and being creative
                </span>{" "}
                — and those are skills anyone can develop.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Ritz7 was built to be a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 font-semibold">
                  launchpad for the world
                </span>
                . It started with the{" "}
                <span className="font-semibold text-foreground">'1000 Days Challenge'</span> — a 
                public commitment to show that anyone, from anywhere, can build real products. 
                What started small quickly grew into a{" "}
                <span className="font-semibold text-foreground">global movement</span>. Today, 
                Ritz7 exists because we truly believe the next great builders will come from 
                wherever there is ambition — not just from elite colleges.
              </p>
            </motion.div>

            {/* Clear float */}
            <div className="clear-both" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
