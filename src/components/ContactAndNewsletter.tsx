import { useState } from "react";
import { Mail, Send, Sparkles, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export const ContactAndNewsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email.trim())) {
      toast({ title: "Invalid email", description: "Please enter a valid email address (e.g. you@example.com).", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already subscribed!", description: "This email is already on our list." });
        } else {
          throw error;
        }
      } else {
        setSubscribed(true);
        toast({ title: "Welcome aboard! 🎉", description: "You're now part of the ABCD community." });
        setEmail("");
      }
    } catch {
      toast({ title: "Oops!", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-10 px-6 md:px-12">
      <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-2">
        {/* Contact Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 md:p-8 flex flex-col justify-between dark:border-white/10"
        >
          {/* Decorative gradient blob */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

          <div className="absolute top-5 right-5 md:top-6 md:right-6 z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>

          <div className="relative z-10 pr-16">
            <h3 className="text-xl font-bold text-foreground md:text-2xl">
              Let's <span className="text-primary">Collab</span>
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Have an idea, a project, or just want to explore what we could create together? Let's talk — great things are built through collaboration.
            </p>
          </div>

          <div className="relative z-10 mt-5">
            <a href="mailto:abcd@ritz7.ai">
              <Button size="lg" className="group/btn gap-2 rounded-xl px-6 text-base">
                <Mail className="h-5 w-5" />
                Let's Collab
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Newsletter Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 md:p-8 flex flex-col justify-between dark:border-white/10"
        >
          {/* Decorative gradient blob */}
          <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-primary/8 blur-3xl transition-all duration-500 group-hover:bg-primary/15" />

          <div className="absolute top-5 right-5 md:top-6 md:right-6 z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <div className="relative z-10 pr-16">
            <h3 className="text-xl font-bold text-foreground md:text-2xl">
              Get Insights That <span className="text-primary">Actually Matter</span>
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Join 5,000+ no-code builders and get curated insights, tool picks, and exclusive workshop access — delivered when it's worth your time.
            </p>
          </div>

          <div className="relative z-10 mt-5">
            {subscribed ? (
              <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="font-medium text-foreground">You're on the list! Welcome to the community 🚀</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-xl border-border/50 bg-background/50 dark:border-white/10"
                />
                <Button type="submit" size="lg" disabled={loading} className="gap-2 rounded-xl px-6">
                  <Send className="h-4 w-4" />
                  {loading ? "..." : "Join"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
