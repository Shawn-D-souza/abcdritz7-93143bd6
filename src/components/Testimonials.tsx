import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", role: "CS Student, IIT Delhi", text: "ABCD completely changed how I think about building products. I launched my first SaaS in 3 weeks without writing a single line of code.", rating: 5 },
  { name: "Arjun Mehta", role: "Startup Founder", text: "The n8n automation series saved me thousands on developer costs. I now automate everything from lead gen to customer onboarding.", rating: 5 },
  { name: "Sneha Reddy", role: "Product Designer", text: "As a designer, I always depended on developers. ABCD taught me to build and ship my own ideas. Game changer!", rating: 5 },
  { name: "Rahul Gupta", role: "Freelancer", text: "I went from zero to offering AI automation services to clients. The community support is incredible.", rating: 5 },
  { name: "Ananya Iyer", role: "MBA Student", text: "The Bubble course alone was worth 10x any bootcamp I've taken. Practical, clear, and immediately applicable.", rating: 5 },
  { name: "Vikram Singh", role: "Marketing Manager", text: "I automated our entire content pipeline using tools I learned from ABCD. My team thinks I'm a genius now.", rating: 5 },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 text-foreground">
            Don't Take Our Word For It
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from real community members who've transformed their careers with ABCD.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-card-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-foreground">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
