import { motion } from "framer-motion";
import { ArrowRight, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const JoinCommunity = () => {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-primary-foreground">
            Ready to Start Building?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join our free community of 10,000+ builders. Get instant access to tutorials, templates, live sessions, 
            and a network of creators who are transforming ideas into reality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 gap-2 font-semibold shadow-lg"
            >
              Join Free Community <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="#"
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Youtube className="h-6 w-6" />
              <span className="text-sm font-medium">YouTube</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="text-sm font-medium">Instagram</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinCommunity;
