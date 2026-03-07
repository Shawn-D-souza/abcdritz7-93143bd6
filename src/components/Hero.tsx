import { motion } from "framer-motion";
import { ArrowRight, Play, Users, Video, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10 px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>Anybody Can Design · Develop · Deploy</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              Turn Ideas Into{" "}
              <span className="gradient-text">Intelligent Systems</span>{" "}
              Without Writing Code
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Join 10,000+ students, founders & creators who are building AI-powered apps, 
              automating workflows, and launching products — all with no-code tools and AI agents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="text-base px-8 gap-2 shadow-lg hover:shadow-xl transition-shadow">
                Join Free Community <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 gap-2">
                <Play className="h-5 w-5" /> Watch Our Story
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span><strong className="text-foreground">10K+</strong> Community Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <span><strong className="text-foreground">500+</strong> Video Tutorials</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl aspect-[4/3] bg-card">
              <img
                src="/placeholder.svg"
                alt="ABCD Community workshop session"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-4">
                <p className="text-sm font-medium text-foreground">🔴 Live Workshop</p>
                <p className="text-xs text-muted-foreground">Building an AI Agent with n8n — 1.2K watching</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
