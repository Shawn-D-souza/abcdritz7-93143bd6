import { motion } from "framer-motion";

const caseStudies = [
  { title: "Live Workshop at IIT Delhi", description: "200+ students learned to build AI chatbots in 2 hours", image: "/placeholder.svg" },
  { title: "n8n Automation Bootcamp", description: "Hands-on session automating workflows with 500+ registrations", image: "/placeholder.svg" },
  { title: "No-Code Hackathon 2024", description: "50 teams built full-stack apps in 48 hours using Bubble", image: "/placeholder.svg" },
  { title: "AI Agents Masterclass", description: "Deep dive into building autonomous agents with OpenAI + n8n", image: "/placeholder.svg" },
  { title: "Startup MVP Sprint", description: "Helped 20 founders build and ship their MVPs in one weekend", image: "/placeholder.svg" },
  { title: "Campus Ambassador Program", description: "Training student leaders across 30+ colleges to spread no-code", image: "/placeholder.svg" },
];

const CaseStudies = () => {
  return (
    <section id="case-studies" className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Case Studies</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 text-foreground">
            From Workshops to Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A snapshot of our live sessions, workshops, and events that have transformed how students approach tech.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img src={study.image} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold mb-1 text-card-foreground">{study.title}</h3>
                <p className="text-sm text-muted-foreground">{study.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
