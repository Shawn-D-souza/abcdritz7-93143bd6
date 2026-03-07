import { motion } from "framer-motion";

const tools = [
  "Bubble", "n8n", "OpenAI", "Gemini", "Zapier", "Make",
  "ElevenLabs", "Microsoft Copilot", "Midjourney", "Claude",
  "Airtable", "FlutterFlow", "Supabase", "Figma",
];

const sessions = [
  "IIT Delhi", "NIT Warangal", "BITS Pilani", "VIT University",
  "SRM University", "IIIT Hyderabad", "DTU", "Amity University",
  "LPU", "Manipal Institute", "KIIT", "Symbiosis",
];

const MarqueeRow = ({ items, reverse = false, label }: { items: string[]; reverse?: boolean; label: string }) => (
  <div className="mb-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-6"
    >
      <span className="text-sm font-semibold text-primary uppercase tracking-wider">{label}</span>
    </motion.div>
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div className={reverse ? "marquee-reverse flex gap-6 w-max" : "marquee flex gap-6 w-max"}>
        {[...items, ...items].map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-3 px-6 py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-xs font-bold text-accent-foreground">{item.charAt(0)}</span>
            </div>
            <span className="text-sm font-medium text-card-foreground whitespace-nowrap">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ToolsCarousel = () => {
  return (
    <section id="tools" className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Trusted by Students. Proven Across Campuses.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            We've covered 30+ tools and conducted sessions at India's top institutions.
          </p>
        </motion.div>
        <MarqueeRow items={tools} label="Tools We Cover" />
        <MarqueeRow items={sessions} reverse label="Sessions Conducted At" />
      </div>
    </section>
  );
};

export default ToolsCarousel;
