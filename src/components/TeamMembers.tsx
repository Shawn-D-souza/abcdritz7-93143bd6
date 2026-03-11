import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { useState, useCallback } from "react";

const teamMembers = [
  {
    name: "Ritesh Hegde",
    role: "CEO & Founder",
    description: "Spearheading innovation in NoCode and AI solutions. The creative force behind Ritz7.",
    image: "/team/rithesh_hegde.avif",
    linkedin: "https://www.linkedin.com/in/ritztalks/",
    accent: "from-blue-500 to-cyan-400"
  },
  {
    name: "Meghana",
    role: "Operations Lead",
    description: "Orchestrates daily operations ensuring smooth workflows and organized excellence.",
    image: "/team/meghana.avif",
    linkedin: "https://www.linkedin.com/in/meghana-laxmidhar-63970948/",
    accent: "from-purple-500 to-pink-400"
  },
  {
    name: "Samskruth",
    role: "No-Code Alchemist",
    description: "Transforms ideas into powerful web apps and smart software automations.",
    image: "/team/Samskruth.avif",
    linkedin: "https://www.linkedin.com/in/samskruth0415/",
    accent: "from-emerald-500 to-teal-400"
  },
  {
    name: "Tushar",
    role: "Video Storyteller",
    description: "Brings stories to life through dynamic video editing, blending creativity and precision.",
    image: "/team/Tushar.avif",
    linkedin: "https://www.linkedin.com/in/tushar-singh-2b15b8278/",
    accent: "from-orange-500 to-amber-400"
  },
  {
    name: "Akhil",
    role: "Content Strategist",
    description: "Transforms ideas into impactful stories, driving brand voice across platforms.",
    image: "/team/Akhil.avif",
    linkedin: "https://www.linkedin.com/in/akhil-ashokan-495706256/",
    accent: "from-rose-500 to-red-400"
  },
  {
    name: "Sangya",
    role: "SEO & Content Strategist",
    description: "Blends data-driven SEO with sharp storytelling for maximum digital reach.",
    image: "/team/Sangya.avif",
    linkedin: "https://www.linkedin.com/in/sangya-seo/",
    accent: "from-indigo-500 to-violet-400"
  }
];

// Pointy-top hexagon clip path
const hexClip = "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)";

const HexCard = ({ member, index, activeIndex, onActivate }: {
  member: typeof teamMembers[0];
  index: number;
  activeIndex: number | null;
  onActivate: (index: number | null) => void;
}) => {
  const isActive = activeIndex === index;

  const handleClick = useCallback(() => {
    onActivate(isActive ? null : index);
  }, [isActive, index, onActivate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 80, damping: 14 }}
      className="flex flex-col items-center"
      onMouseEnter={() => onActivate(index)}
      onMouseLeave={() => onActivate(null)}
      onTouchStart={() => onActivate(isActive ? null : index)}
      onClick={(e) => e.preventDefault()}
    >
      {/* Hexagon container — bigger on desktop to fill width */}
      <div className="relative w-[150px] h-[173px] sm:w-[170px] sm:h-[196px] md:w-[240px] md:h-[276px] lg:w-[280px] lg:h-[322px] cursor-pointer">
        {/* Glowing border hex */}
        <motion.div
          animate={isActive ? { scale: 1.04 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`absolute inset-0 bg-gradient-to-br ${member.accent} opacity-60 transition-opacity duration-500 ${isActive ? 'opacity-100' : ''}`}
          style={{ clipPath: hexClip }}
        />

        {/* Inner background hex */}
        <div
          className="absolute inset-[3px] bg-background transition-colors duration-300"
          style={{ clipPath: hexClip }}
        />

        {/* Photo hex */}
        <div
          className="absolute inset-[4px] overflow-hidden"
          style={{ clipPath: hexClip }}
        >
          <motion.img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top"
            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Hover/tap overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 0.6 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 bg-gradient-to-t ${member.accent}`}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40"
          />

          {/* Overlay content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-6 text-center"
          >
            <p className="text-white text-[10px] sm:text-[11px] md:text-sm leading-snug md:leading-relaxed font-medium">
              {member.description}
            </p>
            <motion.a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 md:mt-3 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-full transition-colors border border-white/30"
            >
              <Linkedin className="w-3 h-3" />
              Connect
            </motion.a>
          </motion.div>
        </div>

        {/* Particle dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isActive ? {
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 50],
              y: [0, (Math.random() - 0.5) * 50],
            } : { opacity: 0, scale: 0 }}
            transition={{ duration: 1.2, delay: i * 0.1, repeat: isActive ? Infinity : 0, repeatDelay: 0.6 }}
            className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${member.accent} pointer-events-none`}
            style={{
              top: `${30 + Math.random() * 40}%`,
              left: `${30 + Math.random() * 40}%`,
            }}
          />
        ))}
      </div>

      {/* Name + Role below hexagon */}
      <motion.div
        className="text-center mt-2 md:mt-3"
        animate={isActive ? { y: -3 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <h3 className="text-base md:text-lg font-bold tracking-tight text-foreground">
          {member.name}
        </h3>
        <p className={`text-[10px] md:text-xs font-semibold tracking-wider uppercase bg-gradient-to-r ${member.accent} bg-clip-text text-transparent`}>
          {member.role}
        </p>
      </motion.div>
    </motion.div>
  );
};

export const TeamMembers = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const topRow = teamMembers.slice(0, 3);
  const bottomRow = teamMembers.slice(3, 6);

  return (
    <section id="team" className="py-6 md:py-10 relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-background/50 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
        <div className="text-center mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
              Meet the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Creative Force
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              The passionate builders and innovators driving Ritz7 forward.
            </p>
          </motion.div>
        </div>

        {/* Honeycomb Grid - Desktop */}
        <div className="hidden md:block">
          {/* Top row */}
          <div className="flex justify-center gap-4 lg:gap-6">
            {topRow.map((member, idx) => (
              <HexCard key={idx} member={member} index={idx} activeIndex={activeIndex} onActivate={setActiveIndex} />
            ))}
          </div>
          {/* Bottom row - proper gap so it doesn't overlap */}
          <div className="flex justify-center gap-4 lg:gap-6 mt-4">
            {bottomRow.map((member, idx) => (
              <HexCard key={idx + 3} member={member} index={idx + 3} activeIndex={activeIndex} onActivate={setActiveIndex} />
            ))}
          </div>
        </div>

        {/* Mobile Grid - 2 columns, tap to reveal */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-x-1 gap-y-3 place-items-center">
            {teamMembers.map((member, idx) => (
              <HexCard key={idx} member={member} index={idx} activeIndex={activeIndex} onActivate={setActiveIndex} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
