import { motion } from "framer-motion";
import { BookOpen, Headphones, MessageCircle, Download, Video, Award } from "lucide-react";

const perks = [
  { icon: Video, title: "500+ Video Tutorials", description: "Comprehensive library covering 30+ tools from basics to advanced" },
  { icon: MessageCircle, title: "Private Community", description: "Direct access to mentors and fellow builders in our exclusive community" },
  { icon: Download, title: "Downloadable Templates", description: "Ready-to-use n8n workflows, Bubble templates, and automation blueprints" },
  { icon: Headphones, title: "Live Weekly Sessions", description: "Join live workshops, AMAs, and build-alongs every week" },
  { icon: BookOpen, title: "Step-by-Step Guides", description: "Written guides and cheat sheets for every tool we cover" },
  { icon: Award, title: "Certificates & Badges", description: "Earn proof of your skills with completion certificates" },
];

const CommunityPerks = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Membership Perks</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 text-foreground">
            Everything You Need to Build
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free community membership includes access to an incredible suite of resources, mentorship, and tools.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <perk.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold mb-1 text-card-foreground">{perk.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{perk.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityPerks;
