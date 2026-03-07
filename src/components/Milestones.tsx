import { motion } from "framer-motion";

const phases = [
  { phase: 1, title: "100 Days of Bubble Development", days: "100 Days", color: "from-blue-500 to-blue-700" },
  { phase: 2, title: "21 Days of Automation Tools", days: "21 Days", color: "from-emerald-500 to-emerald-700" },
  { phase: 3, title: "125 Days of Exploring AI Tools", days: "125 Days", color: "from-violet-500 to-violet-700" },
  { phase: 4, title: "75 Days of AI Agents (N8N)", days: "75 Days", color: "from-orange-500 to-orange-700" },
  { phase: 5, title: "10 Days of OpenAI Builder", days: "10 Days", color: "from-teal-500 to-teal-700" },
  { phase: 6, title: "30 Days of Emergent AI", days: "30 Days", color: "from-pink-500 to-pink-700" },
  { phase: 7, title: "10 Days of Microsoft Copilot Series", days: "10 Days", color: "from-cyan-500 to-cyan-700" },
  { phase: 8, title: "20 Days of Google Gemini Series", days: "20 Days", color: "from-amber-500 to-amber-700" },
  { phase: 9, title: "ElevenLabs Mastery Series", days: "Series", color: "from-rose-500 to-rose-700" },
];

const Milestones = () => {
  return (
    <section id="milestones" className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">The Journey</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 text-foreground">
            The 1000 Days Challenge
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our ambitious roadmap of mastering every major no-code and AI tool — publicly, one day at a time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((p, i) => (
            <motion.div
              key={p.phase}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img src="/placeholder.svg" alt={p.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-40 group-hover:opacity-60 transition-opacity`} />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    Phase {p.phase}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm text-card-foreground text-xs font-semibold">
                    {p.days}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-card-foreground">{p.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Milestones;
