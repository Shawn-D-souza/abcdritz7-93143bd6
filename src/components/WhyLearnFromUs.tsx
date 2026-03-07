import { motion } from "framer-motion";
import { Rocket, Brain, Users, TrendingUp, Code2, Lightbulb } from "lucide-react";

const benefits = [
  {
    icon: Rocket,
    title: "Ship 10x Faster",
    description: "Build and launch full-stack apps in days, not months. No-code tools let you move at the speed of thought.",
  },
  {
    icon: Brain,
    title: "AI-First Approach",
    description: "Learn to leverage AI agents, GPT models, and automation to create intelligent systems that scale.",
  },
  {
    icon: Code2,
    title: "No Coding Required",
    description: "Our curriculum is designed for non-developers. If you can use a browser, you can build production apps.",
  },
  {
    icon: TrendingUp,
    title: "Career-Ready Skills",
    description: "The no-code & AI market is exploding. Position yourself at the forefront of the next tech revolution.",
  },
  {
    icon: Users,
    title: "Learn in Community",
    description: "Join live sessions, get peer feedback, and collaborate with thousands of like-minded builders.",
  },
  {
    icon: Lightbulb,
    title: "Real-World Projects",
    description: "Every lesson is project-based. Walk away with a portfolio of apps, agents, and automations.",
  },
];

const WhyLearnFromUs = () => {
  return (
    <section id="why-us" className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why ABCD?</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 text-foreground">
            The Unfair Advantage You've Been Looking For
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We don't just teach tools — we transform how you think about technology. 
            Here's why thousands choose ABCD over traditional learning.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 text-card-foreground">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyLearnFromUs;
