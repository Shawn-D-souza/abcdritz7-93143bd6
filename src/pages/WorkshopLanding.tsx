import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { 
  ArrowRight, 
  Bot, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Rocket, 
  BrainCircuit, 
  HeartHandshake, 
  FileJson, 
  Users, 
  Briefcase,
  GraduationCap,
  Star
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { capture } from "@/lib/analytics";

// ── Lazy-loaded components (not needed for first paint) ──────────────────
// Payment modal: pulls in Supabase (177 KB), date-fns (20 KB), Dialog, Input, Label, sonner
const WorkshopPaymentModal = lazy(() => import("@/components/WorkshopPaymentModal"));
// Footer: below fold, deferred via showRest
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
// CustomCursor: desktop-only decorative element, skip entirely on touch devices
const CustomCursor = lazy(() => import("@/components/CustomCursor").then(m => ({ default: m.CustomCursor })));

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// ── CSS-based hero animations (replaces 128 KB framer-motion) ────────────
// (Hero animations removed for max LCP speed)

// Custom hook for number animation (no framer-motion dependency)
const AnimatedCounter = ({ value, duration = 2, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            const easeOutQuad = (t: number) => t * (2 - t);
            setCount(Math.floor(easeOutQuad(progress) * value));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { rootMargin: "-100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
};

type Variant = 'free' | '9' | '99' | '99_lead';

// ── Lazy Accordion wrapper ───────────────────────────────────────────────
const LazyFAQSection = ({ variant }: { variant: Variant }) => {
  const [AccordionComponents, setAccordionComponents] = useState<any>(null);

  useEffect(() => {
    import("@/components/ui/accordion").then((mod) => {
      setAccordionComponents(mod);
    });
  }, []);

  if (!AccordionComponents) {
    return <div className="w-full bg-card rounded-2xl border border-border p-4 shadow-sm h-64 animate-pulse" />;
  }

  const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } = AccordionComponents;

  return (
    <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border border-border p-4 shadow-sm">
      <AccordionItem value="item-1" className="border-b border-border/50">
        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">I have absolutely zero coding background. Can I really do this?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-4">
          <strong>Of course you can!</strong> Ritesh, who will be guiding you, started with no coding background whatsoever. Today, he has built over 450 automation projects. n8n is a visual tool designed to be accessible. This workshop is crafted specifically for complete beginners to give you that "Aha!" moment.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-b border-border/50">
        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">What exactly is n8n?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-4">
          n8n is a visual automation tool. Instead of writing code, you build workflows by connecting blocks — "When a new email arrives → save the attachment to Google Drive → notify me on WhatsApp." It works 24/7 in the background so you don't have to lift a finger.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border-b border-border/50">
        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">Do I need to buy any software for this?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-4">
          No! We will show you how to get started using free tools. You just need a computer, an internet connection, and 3 hours of focus.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4" className="border-b border-border/50">
        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">When is the next workshop?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-4">
          The workshop is a single 3-hour power session! The next batch is scheduled for <strong>27/06/2026</strong> from <strong>6 PM to 9 PM</strong>.<br /><br />
          Once you secure your spot, you will receive an instant confirmation via email and WhatsApp. The meeting link and specific instructions will be sent to you about a week before the workshop.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5" className="border-none">
        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">What happens after I register?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-4">
          Once you complete your {variant === 'free' ? 'registration' : `payment of ₹${variant === '9' ? '9' : '99'}`}, you will instantly receive a confirmation via Email and WhatsApp. The meeting link and all necessary preparations will be shared about a week before the session.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// ── Detect touch device once ─────────────────────────────────────────────
const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const WorkshopLanding = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hasOpenedModal, setHasOpenedModal] = useState(false);
  const [variant, setVariant] = useState<Variant>('99');
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useSEO({
    title: "Start Your Automation Journey | n8n Beginner Workshop",
    description: "Join our beginner-friendly n8n workshop. Build your first automation without any coding experience.",
    type: "website",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Assign A/B test variant
    const savedVariant = localStorage.getItem('ab_test_variant') as Variant | null;
    if (savedVariant && ['free', '9', '99'].includes(savedVariant)) {
      setVariant(savedVariant);
    } else {
      const variants: Variant[] = ['free', '9', '99'];
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem('ab_test_variant', randomVariant);
      setVariant(randomVariant);
    }
  }, []);

  const handleRegister = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'workshop_button_click', { variant });
    }
    // Direct push to GTM dataLayer to bypass any auto-tracking scripts
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'workshop_button_click',
        variant: variant,
        gtag_override: true // signals to GTM to bypass auto-macros
      });
    }
    // Track click — safe capture handles queueing if PostHog isn't ready yet
    capture('workshop_button_click', { variant });
    setHasOpenedModal(true);
    setIsPaymentModalOpen(true);
  };

  const handleLeadMagnetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    
    setIsSubmittingLead(true);
    try {
      const { error } = await supabase.from('lead_magnet_signups').insert([{ email: leadEmail }]);
      if (error) throw error;
      toast.success("Templates sent! Check your email shortly.");
      setLeadEmail("");
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      {/* Custom cursor: only on desktop, lazy-loaded */}
      {!isTouchDevice && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}
      <Navbar />

      {/* Payment modal: lazy-loaded, stays mounted after first open to preserve success modal state */}
      {hasOpenedModal && (
        <Suspense fallback={null}>
          <WorkshopPaymentModal
            isOpen={isPaymentModalOpen}
            onOpenChange={setIsPaymentModalOpen}
            variant={variant}
          />
        </Suspense>
      )}

      {/* Subtle Background Elements instead of heavy 3D Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] max-w-[800px] aspect-square rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] w-[60vw] max-w-[600px] aspect-square rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      <main className="relative z-10 pt-24 pb-0 lg:pt-32">
        {/* Hero Section — CSS animations instead of framer-motion */}
        <section className="container px-4 mx-auto text-center max-w-5xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">Beginner Friendly Workshop</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Build Your First <span className="text-primary">Automation</span><br/>Without Writing Code
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Step into the world of AI & n8n. Let computers do the boring repetitive work so you can focus on what truly matters.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* CTA Button */}
              <Button 
                onClick={handleRegister}
                size="lg" 
                className="h-16 px-10 text-lg w-full sm:w-auto rounded-full shine-effect bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] transition-transform hover:scale-105"
              >
                Secure Your Spot
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>

              {/* Minimal Text Info (Side-by-side on PC) */}
              <div className="flex flex-col items-start gap-2 text-muted-foreground text-sm md:text-base font-medium text-left">
                <div className="flex items-start sm:items-center gap-2">
                  <Clock className="w-4 h-4 text-primary mt-1 sm:mt-0 shrink-0" />
                  <span><strong>Next Workshop: 27/06/2026, 6 PM - 9 PM</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary shrink-0" />
                  3-Hour Session • Perfect for Beginners
                </div>
              </div>
            </div>
          </div>
        </section>

        <div>
          {/* The "Hope" / Emotional Section */}
            <section className="container px-4 mx-auto py-12 mt-6 md:py-20 md:mt-10">
              <div className="max-w-5xl mx-auto bg-card border border-border shadow-2xl rounded-[2rem] p-6 md:p-16 relative overflow-hidden mb-16">
                <div className="relative z-10 grid md:grid-cols-2 gap-0 md:gap-12 items-center">
                  <div className="space-y-6 relative">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                      Stop working like a <span className="text-destructive/80 dark:text-red-400/80">robot.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Staring at spreadsheets. Copy-pasting data from one app to another. We've all been there, wasting hours on repetitive tasks that drain our creative energy.
                    </p>
                  </div>
                  <div className="space-y-6 pt-6 mt-6 border-t border-border md:pt-0 md:mt-0 md:border-t-0 md:border-l md:pl-12">
                    <h2 className="text-2xl font-bold text-foreground">
                      What if you could just click a button and let the automation handle the rest?
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      You <strong className="text-foreground">don't</strong> need a computer science degree to make this magic happen. You just need <strong className="text-primary font-extrabold text-xl whitespace-nowrap">3 hours</strong> and the willingness to learn how to build your first automation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16">
                <div className="workshop-scroll-reveal p-6 md:p-10 rounded-3xl bg-card border border-border/50 shadow-xl hover:shadow-primary/5 transition-all group flex items-start gap-6 justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Gain Confidence</h3>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      Overcome the fear of "tech". We break down complex concepts into simple, bite-sized pieces that anyone can understand. By the end, you'll feel empowered to automate your daily tasks.
                    </p>
                  </div>
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <HeartHandshake className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                </div>
                
                <div className="workshop-scroll-reveal p-6 md:p-10 rounded-3xl bg-card border border-border/50 shadow-xl hover:shadow-primary/5 transition-all group flex items-start gap-6 justify-between" style={{ animationDelay: '200ms' }}>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Unlock Your Potential</h3>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      Automation isn't about replacing humans; it's about freeing up your brain for creative, high-value work. Take your first step into a more productive, fulfilling future.
                    </p>
                  </div>
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BrainCircuit className="w-7 h-7 md:w-8 md:h-8 text-purple-500" />
                  </div>
                </div>
              </div>
            </section>

            {/* The "Trust" / Logical Section */}
            <section className="bg-muted/40 pt-12 pb-16 md:pt-16 md:pb-24 border-y border-border/50">
              <div className="container px-4 mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Learn From <span className="text-primary">Experience</span></h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    You are in safe hands. Here is why you should take this leap with us.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-center mb-20">
                  <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-5xl font-black text-foreground mb-3 font-mono">
                      <AnimatedCounter value={20000} suffix="+" />
                    </h3>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Learners Taught</p>
                  </div>
                  <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Rocket className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-5xl font-black text-foreground mb-3 font-mono">
                      <AnimatedCounter value={450} suffix="+" />
                    </h3>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Projects Built</p>
                  </div>
                  <div className="bg-card p-8 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-5xl font-black text-foreground mb-3 font-mono">
                      <AnimatedCounter value={100} suffix="+" />
                    </h3>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Global Clients</p>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto bg-card border border-border p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-start text-center md:text-left">
                  {/* Avatar & Info */}
                  <div className="flex flex-col items-center shrink-0 md:w-56 mt-2">
                    <div className="w-32 h-32 md:w-56 md:h-56 rounded-full bg-muted overflow-hidden border-4 border-background shadow-lg relative mb-4">
                      <img src="/ritesh_black_suit.webp" alt="Ritesh Hegde" loading="lazy" className="w-full h-full object-cover object-top" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1.5 text-foreground text-center">
                      Ritesh Hegde
                    </h3>
                    <p className="text-primary font-medium tracking-wide text-xs md:text-sm flex items-center justify-center gap-1.5 text-center">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary shrink-0" />
                      CEO & AI Expert, Ritz7ai
                    </p>
                  </div>
                  
                  {/* Quote Section */}
                  <div className="space-y-6 flex-1 md:mt-2">
                    <p className="text-muted-foreground text-sm md:text-base font-bold uppercase tracking-wider">
                      Listen to what our educator has to say:
                    </p>
                    <div className="relative pl-5 md:pl-6 border-l-[4px] border-primary/60">
                      <p className="text-foreground text-xl md:text-2xl italic leading-relaxed">
                        "I didn't start as a coder. In fact, I was an Electrical Engineer with <strong className="text-primary">zero coding background</strong>. But I realized the power of automation and visual building. Fast forward to today, my team and I have delivered over 450 automation projects for clients globally. If I can learn this and build a business around it, <strong className="text-primary">so can you</strong>."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* What You Get */}
            <section className="container px-4 mx-auto pt-16 pb-12 md:pt-24">
              <div className="max-w-5xl mx-auto px-2 md:px-8 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">Ready-to-Use <span className="text-primary">Workflows</span></h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We believe in practical learning. You won't just watch theory; you'll get your hands dirty. 
                  </p>
                  <ul className="space-y-6 pt-6">
                    <li className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg mt-1">
                        <FileJson className="w-6 h-6 text-primary shrink-0" />
                      </div>
                      <div>
                        <strong className="text-foreground text-xl block mb-1">Plug & Play JSON Files</strong>
                        <span className="text-muted-foreground text-lg">We will give you the exact n8n JSON files used in the workshop. We'll show you step-by-step how to import them directly into your own workspace!</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg mt-1">
                        <Zap className="w-6 h-6 text-primary shrink-0" />
                      </div>
                      <div>
                        <strong className="text-foreground text-xl block mb-1">Your First Automation</strong>
                        <span className="text-muted-foreground text-lg">Walk away with a functioning automation that you can immediately use or tweak.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <div className="relative p-8 md:p-10 rounded-[2rem] bg-card border border-border shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-[2rem] pointer-events-none" />
                    <div className="text-center space-y-6 relative z-10">
                      <div className="text-6xl md:text-7xl font-black text-foreground tracking-tight">
                        {variant === 'free' ? 'Free' : variant === '9' ? '₹9' : '₹99'}
                      </div>
                      <p className="text-muted-foreground text-lg font-medium">A small investment for a big leap.</p>
                      <Button onClick={handleRegister} className="w-full h-16 text-xl mt-4 shine-effect rounded-xl font-bold" size="lg">
                        Join The Workshop
                      </Button>
                      
                      {variant !== 'free' && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4 font-medium">
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          Secure Checkout via Razorpay
                        </div>
                      )}
                      
                      {/* variant === '99_lead' && (
                        <div className="mt-8 pt-8 border-t border-border/50 text-left">
                          <h4 className="text-xl font-bold text-foreground mb-2">Not ready for the workshop?</h4>
                          <p className="text-muted-foreground text-sm mb-4">Enter your email and we'll send you some Free Automation Templates directly to your inbox!</p>
                          <form onSubmit={handleLeadMagnetSubmit} className="flex gap-2">
                            <Input 
                              type="email" 
                              placeholder="Your email address" 
                              required 
                              className="bg-background h-12"
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                            />
                            <Button type="submit" className="h-12 px-6" disabled={isSubmittingLead}>
                              {isSubmittingLead ? "Sending..." : "Get Templates"}
                            </Button>
                          </form>
                        </div>
                      ) */}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="container px-4 mx-auto pt-8 pb-12 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <LazyFAQSection variant={variant} />
            </section>
        </div>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default WorkshopLanding;
