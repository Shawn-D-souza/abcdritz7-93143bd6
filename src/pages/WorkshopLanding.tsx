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
  Star,
  MonitorSmartphone,
  TrendingUp,
  CheckCircle2,
  Check,
  XCircle,
  Gift,
  Target,
  Trophy,
  Quote,
  Frown,
  HelpCircle,
  Laptop,
  User,
  ShieldAlert,
  BarChart,
  CircleDollarSign,
  Lightbulb,
  Atom,
  AlarmClock
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
          The workshop is a single 3-hour power session! The next batch is scheduled for <strong>27/06/2026</strong> from <strong>6 PM to 9 PM (IST)</strong>.<br /><br />
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

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Workshop date: June 27, 2026, 6:00 PM IST
    const targetDate = new Date("2026-06-27T18:00:00+05:30").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer(); // initial call
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-primary/5 border border-primary/20 rounded-2xl p-2 pl-4 pr-3 shadow-sm">
      <div className="inline-flex items-center gap-2 text-primary font-bold">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
        </span>
        Limited Seats Available!
      </div>
      
      <div className="hidden sm:block w-px h-8 bg-primary/20"></div>

      <div className="flex items-center gap-2 text-center">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col bg-background rounded-lg px-3 py-1 min-w-[50px] sm:min-w-[60px] shadow-sm">
              <span className="text-lg font-bold font-mono text-foreground">{timeLeft.days.toString().padStart(2, '0')}</span>
              <span className="text-[9px] tracking-wider text-muted-foreground uppercase">Days</span>
            </div>
            <span className="text-lg font-bold text-muted-foreground/50">:</span>
          </>
        )}
        <div className="flex flex-col bg-background rounded-lg px-3 py-1 min-w-[50px] sm:min-w-[60px] shadow-sm">
          <span className="text-lg font-bold font-mono text-foreground">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="text-[9px] tracking-wider text-muted-foreground uppercase">Hrs</span>
        </div>
        <span className="text-lg font-bold text-muted-foreground/50">:</span>
        <div className="flex flex-col bg-background rounded-lg px-3 py-1 min-w-[50px] sm:min-w-[60px] shadow-sm">
          <span className="text-lg font-bold font-mono text-foreground">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="text-[9px] tracking-wider text-muted-foreground uppercase">Min</span>
        </div>
        <span className="text-lg font-bold text-muted-foreground/50">:</span>
        <div className="flex flex-col bg-background rounded-lg px-3 py-1 min-w-[50px] sm:min-w-[60px] shadow-sm">
          <span className="text-lg font-bold font-mono text-primary animate-pulse">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="text-[9px] tracking-wider text-muted-foreground uppercase">Sec</span>
        </div>
      </div>
    </div>
  );
};

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

      <main className="relative z-10 pt-12 pb-0 lg:pt-16">
        {/* Hero Section */}
        <section className="container px-4 mx-auto text-center max-w-5xl">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">Beginner Friendly Workshop</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 backdrop-blur-md dark:text-orange-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide">27/06/2026 • 6 PM - 9 PM (IST)</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              Automate Your Future, <span className="text-primary">One Skill at a Time</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Setting you on the path to partially automate your daily work—and fix <strong className="text-foreground">90% of your boring tasks</strong>.
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto hidden sm:block">
              A beginner-friendly workshop that breaks down the core concepts behind modern automation systems using simple explanations and practical examples.
            </p>

            <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-5 md:gap-6">
              <Button 
                onClick={handleRegister}
                size="lg" 
                className="h-14 md:h-16 px-8 md:px-10 text-lg w-full sm:w-auto rounded-full shine-effect bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] transition-transform hover:scale-105 shrink-0"
              >
                Reserve My Spot Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              
              <div className="scale-95 sm:scale-100 origin-left">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </section>

        <div>
          {/* Avoid the Pain of Repetitive Tasks */}
          <section className="container px-4 mx-auto py-16 md:py-24 mt-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-6">
                <span className="text-sm font-medium">⚠️ If this feels familiar, you're not alone.</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4"><span className="text-primary">Avoid the Pain of</span> Repetitive Tasks</h2>
              <div className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto space-y-3">
                <p>These daily challenges drain your time, energy, and potential.</p>
                <p className="font-bold text-foreground text-2xl">Which ones are <span className="text-primary">holding you back?</span></p>
              </div>
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              {/* Time & Stress */}
              <div className="bg-card border border-border shadow-lg rounded-3xl overflow-hidden flex flex-col hover:border-red-500/30 transition-colors">
                <div className="bg-red-500/5 p-6 border-b border-border/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Time & Stress</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold">Too busy. Too tired.</p>
                  </div>
                </div>
                <div className="p-6 space-y-6 flex-1">
                  <div className="flex gap-4">
                    <AlarmClock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Wasting hours on boring, manual work every single day.</p>
                  </div>
                  <div className="flex gap-4">
                    <Frown className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Feeling completely overwhelmed by a never-ending to-do list.</p>
                  </div>
                  <div className="flex gap-4">
                    <HelpCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Not knowing where to start or how to begin with automation.</p>
                  </div>
                </div>
              </div>

              {/* Skills & Tech */}
              <div className="bg-card border border-border shadow-lg rounded-3xl overflow-hidden flex flex-col hover:border-blue-500/30 transition-colors">
                <div className="bg-blue-500/5 p-6 border-b border-border/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Laptop className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Skills & Tech</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Hard to keep up.</p>
                  </div>
                </div>
                <div className="p-6 space-y-6 flex-1">
                  <div className="flex gap-4">
                    <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Struggling to keep pace with fast-moving technology.</p>
                  </div>
                  <div className="flex gap-4">
                    <User className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Feeling stuck with outdated skills in a changing job market.</p>
                  </div>
                  <div className="flex gap-4">
                    <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Fearing the future of work and being left behind.</p>
                  </div>
                </div>
              </div>

              {/* Business Growth */}
              <div className="bg-card border border-border shadow-lg rounded-3xl overflow-hidden flex flex-col hover:border-emerald-500/30 transition-colors">
                <div className="bg-emerald-500/5 p-6 border-b border-border/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <BarChart className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Business Growth</h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">Growth feels out of reach.</p>
                  </div>
                </div>
                <div className="p-6 space-y-6 flex-1">
                  <div className="flex gap-4">
                    <Target className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Missing opportunities to grow and scale your business.</p>
                  </div>
                  <div className="flex gap-4">
                    <Atom className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Feeling frustrated by slow, messy, and inefficient processes.</p>
                  </div>
                  <div className="flex gap-4">
                    <CircleDollarSign className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/90 font-medium">Losing time (and money) to repetitive tasks that could be automated.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto mt-10">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center sm:text-left mt-1 sm:mt-0">
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    <strong className="text-foreground">The good news?</strong> You can automate the repetitive, focus on what matters, and create <strong className="text-primary">more time</strong> for what truly <strong className="text-primary">moves you forward.</strong>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Master the Basics */}
          <section className="bg-muted/30 py-16 md:py-24 border-y border-border/50">
            <div className="container px-4 mx-auto max-w-5xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4"><span className="text-primary">Master the Basics.</span> Build the Foundation.</h2>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto flex items-center justify-center gap-2">
                  <span className="text-2xl">✨</span> Practical automation skills that save time, reduce effort, and open new possibilities.
                </p>
              </div>

              <div className="bg-card border border-border rounded-[2rem] shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 bg-muted/50 p-6 border-b border-border">
                  <div className="flex items-center gap-3 justify-center md:justify-start md:pl-8 font-bold text-lg text-foreground mb-4 md:mb-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    What You'll Learn
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start md:pl-8 font-bold text-lg text-foreground">
                    <Target className="w-6 h-6 text-primary" />
                    What You'll Walk Away With
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  {[
                    { 
                      teach: "What automation really is (in simple terms)", 
                      do: "A clear understanding of how automation can help in everyday work and life.",
                      icon: Lightbulb
                    },
                    { 
                      teach: "Why businesses and professionals use automation to save time", 
                      do: "The ability to identify tasks that can be automated.",
                      icon: Clock
                    },
                    { 
                      teach: "The building blocks behind simple automations", 
                      do: "Confidence to understand how automation workflows work.",
                      icon: BrainCircuit
                    },
                    { 
                      teach: "How different apps and tools connect with each other", 
                      do: "Knowledge of how information moves automatically between systems.",
                      icon: Zap
                    },
                    { 
                      teach: "Real-world automation examples you can use", 
                      do: "Ideas and examples you can immediately apply.",
                      icon: Star
                    },
                    { 
                      teach: "How to get started without coding", 
                      do: "A practical roadmap to start your automation journey.",
                      icon: Rocket
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center md:items-stretch gap-4 md:gap-0 p-4 rounded-2xl hover:bg-muted/50 transition-colors">
                      <div className="flex-1 flex items-center gap-4 text-center md:text-left">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hidden md:flex">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-foreground font-medium">{item.teach}</p>
                      </div>
                      <div className="hidden md:flex shrink-0 w-16 items-center justify-center text-primary">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                      <div className="flex-1 flex items-center gap-4 text-center md:text-left">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 hidden md:flex">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-muted-foreground">{item.do}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3 Simple Steps */}
          <section className="container px-4 mx-auto py-16 md:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Your <span className="text-primary">Automation Journey</span> Starts Here</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From learning the basics to applying them in real life.
              </p>
            </div>

            <div className="max-w-5xl mx-auto relative">
              <div className="absolute top-12 left-[10%] right-[10%] h-[2px] bg-border border-dashed border-t-2 hidden md:block" />

              <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative z-10">
                {/* Step 1 */}
                <div className="bg-card border border-border shadow-lg rounded-[2rem] p-8 text-center relative group hover:shadow-primary/5 transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center absolute -top-4 -left-4 md:left-auto md:right-auto md:mx-auto shadow-lg z-20">1</div>
                  <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <MonitorSmartphone className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Join the Workshop</h3>
                  <p className="text-muted-foreground leading-relaxed text-left">
                    Learn automation through simple explanations, real examples, and live demonstrations.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-card border-2 border-primary shadow-xl rounded-[2rem] p-8 text-center relative group transform md:-translate-y-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center absolute -top-4 -left-4 md:left-auto md:right-auto md:mx-auto shadow-lg z-20">2</div>
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Gift className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Unlock Your Bonus Resources</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-4 text-left">
                    Share your feedback after the workshop and receive:
                  </p>
                  <div className="flex flex-col gap-3 mb-4 text-sm text-foreground items-start text-left font-medium">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                      Workshop recording
                    </div>
                    <div className="flex gap-2.5 items-center">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                      Bonus template
                    </div>
                  </div>
                  <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-2 rounded-lg inline-block">
                    Feedback helps us improve future sessions.
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-card border border-border shadow-lg rounded-[2rem] p-8 text-center relative group hover:shadow-primary/5 transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center absolute -top-4 -left-4 md:left-auto md:right-auto md:mx-auto shadow-lg z-20">3</div>
                  <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Rocket className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Put It Into Action</h3>
                  <p className="text-muted-foreground leading-relaxed text-left">
                    Start spotting repetitive tasks, exploring automation opportunities, and applying what you've learned.
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Button onClick={handleRegister} size="lg" className="h-14 px-10 text-lg rounded-full shine-effect shadow-xl transition-transform hover:scale-105">
                  Register Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* Target Audience */}
          <section className="bg-muted/40 py-16 md:py-24 border-y border-border/50">
            <div className="container px-4 mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Perfect For */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Who Is <span className="text-primary">This For?</span></h2>
                    <p className="text-foreground/80 font-medium text-lg">Designed to build a strong foundation.</p>
                  </div>
                  
                  <div className="bg-card border border-border shadow-lg rounded-[2rem] p-8 space-y-6 hover:border-emerald-500/50 transition-colors">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                      Perfect For
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Students",
                        "Working Professionals",
                        "Freelancers",
                        "Business Owners",
                        "Non-Technical Beginners",
                        "Anyone Curious About AI & Automation"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-foreground/90 font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Not Intended For */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Is This Right <span className="text-primary">For You?</span></h2>
                    <p className="text-foreground/80 font-medium text-lg">Let's be clear about what this is not.</p>
                  </div>
                  
                  <div className="bg-card border border-border shadow-lg rounded-[2rem] p-8 space-y-6 hover:border-red-500/50 transition-colors">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="w-6 h-6" />
                      Not Intended For
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "Experienced automation professionals",
                        "Advanced workflow builders",
                        "Those looking for deep technical implementation"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                          <span className="text-foreground/90 font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <p className="text-sm text-foreground/80 font-medium">
                        <strong className="text-foreground">Note:</strong> This workshop is Beginner-friendly, Concept-focused, Practical and easy to understand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Our Workshop */}
          <section className="container px-4 mx-auto py-16 md:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose <span className="text-primary">Our Workshop?</span></h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Learn from a true master who worked in automation long before AI became a trend.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 text-center mb-16 max-w-5xl mx-auto">
              <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-4xl font-black text-foreground mb-2 font-mono">
                  <AnimatedCounter value={20000} suffix="+" />
                </h3>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Learners Taught</p>
              </div>
              <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-4xl font-black text-foreground mb-2 font-mono">
                  <AnimatedCounter value={450} suffix="+" />
                </h3>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Projects Built</p>
              </div>
              <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-4xl font-black text-foreground mb-2 font-mono flex items-center justify-center">
                  Award
                </h3>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Winning Leaders</p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto flex flex-col gap-12">
              {/* Trust Table */}
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl flex flex-col w-full">
                {/* Headers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-border bg-muted/30">
                  <div className="p-6 md:p-8 border-b sm:border-b-0 sm:border-r border-border flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <h3 className="font-bold text-foreground text-lg md:text-xl">Why You Can Trust Us</h3>
                  </div>
                  <div className="p-6 md:p-8 flex items-center gap-3">
                    <span className="text-2xl">🤝</span>
                    <h3 className="font-bold text-foreground text-lg md:text-xl">How We Support You</h3>
                  </div>
                </div>
                
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-border">
                  <div className="p-6 md:p-8 border-b sm:border-b-0 sm:border-r border-border hover:bg-muted/50 transition-colors">
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 md:text-lg">
                      <Clock className="text-primary w-6 h-6 shrink-0" />
                      17+ Years of Experience
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Learn from a true master who worked in automation long before AI became a trend.
                    </p>
                  </div>
                  <div className="p-6 md:p-8 hover:bg-muted/50 transition-colors">
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 md:text-lg">
                      <HeartHandshake className="text-primary w-6 h-6 shrink-0" />
                      No More Tech Anxiety
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      We break down scary tech into simple steps so you can build confidence fast.
                    </p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="p-6 md:p-8 border-b sm:border-b-0 sm:border-r border-border hover:bg-muted/50 transition-colors">
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 md:text-lg">
                      <TrendingUp className="text-primary w-6 h-6 shrink-0" />
                      247% Business Growth
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      We don't just teach growth—we achieved it. Get the exact blueprint we used.
                    </p>
                  </div>
                  <div className="p-6 md:p-8 hover:bg-muted/50 transition-colors">
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 md:text-lg">
                      <Target className="text-primary w-6 h-6 shrink-0" />
                      Skip the Guesswork
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stop wasting hours on YouTube. Get a clear, guided path from a veteran mentor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted overflow-hidden border-4 border-background shadow-lg mb-6 relative">
                    <img src="/ritesh_black_suit.webp" alt="Ritesh Hegde" loading="lazy" className="w-full h-full object-cover object-top" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground text-center">
                    Ritesh Hegde
                  </h3>
                  <p className="text-primary font-medium tracking-wide text-sm flex items-center justify-center gap-1.5">
                    <Star className="w-4 h-4 fill-primary text-primary shrink-0" />
                    CEO & AI Expert, Ritz7ai
                  </p>
                </div>
                
                <div className="flex-1 flex flex-col justify-center w-full">
                  <div className="relative pt-2">
                    <p className="text-foreground text-lg md:text-xl italic leading-relaxed relative z-10 text-center md:text-left">
                      "I didn't start as a coder. In fact, I was an Electrical Engineer with <strong className="text-primary">zero coding background</strong>. But I realized the power of automation and visual building. Fast forward to today, my team and I have delivered over 450 automation projects. If I can learn this and build a business around it, <strong className="text-primary">so can you</strong>."
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-2 text-center md:text-left text-lg">A Partner in Your Success</h4>
                    <p className="text-muted-foreground text-center md:text-left text-base">You are not doing this alone. We care about your personal growth as much as the tech.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="bg-muted/40 py-16 md:py-24 border-y border-border/50">
            <div className="container px-4 mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">What <span className="text-primary">People Are Saying</span></h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6">
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="font-semibold">100% agreed teaching pace was "Just Right"</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <span className="font-semibold">4.8 / 5 Average Score</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Manoj Kumar",
                    text: "Mr. Ritesh is one of the few AI enthusiasts with deep knowledge who believes in delivering content with the sole purpose of empowering the masses selflessly. I appreciate and admire his passion."
                  },
                  {
                    name: "Sankeeth",
                    text: "Highly informative and insightful, well aligned with current AI trends. I found the subject matter very engaging and am interested in exploring it further to support my professional growth and upskilling.",
                    stars: 4
                  },
                  {
                    name: "Vijay N M",
                    text: "I loved the session as a whole—especially the live agent building and step-by-step teaching. It's a valuable session. I am interested in enrolling [in future classes]."
                  },
                  {
                    name: "Mangala",
                    text: "Easy to understand step-by-step instructions made us understand better."
                  },
                  {
                    name: "Savitha B. & Goutham R.",
                    text: "The workshop was useful, highly informative, and easy to follow."
                  }
                ].map((t, i) => (
                  <div key={i} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-lg">{t.name}</div>
                      <div className="flex">
                        {[...Array(t.stars || 5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        {[...Array(5 - (t.stars || 5))].map((_, j) => <Star key={j} className="w-4 h-4 text-muted-foreground/30" />)}
                      </div>
                    </div>
                    <p className="text-muted-foreground italic flex-1">"{t.text}"</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button onClick={handleRegister} size="lg" className="h-14 px-10 text-lg rounded-full shine-effect shadow-xl transition-transform hover:scale-105">
                  Secure My Seat <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing / What You Get */}
          <section className="container px-4 mx-auto py-16 md:py-24">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Your Investment</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe in practical learning. You won't just watch theory; you'll get your hands dirty.
                </p>
                <ul className="space-y-6 pt-4">
                  <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg mt-1">
                      <FileJson className="w-6 h-6 text-primary shrink-0" />
                    </div>
                    <div>
                      <strong className="text-foreground text-xl block mb-1">Plug & Play JSON Files</strong>
                      <span className="text-muted-foreground text-base">We will give you the exact n8n JSON files used in the workshop to import directly into your workspace.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg mt-1">
                      <Zap className="w-6 h-6 text-primary shrink-0" />
                    </div>
                    <div>
                      <strong className="text-foreground text-xl block mb-1">Your First Automation</strong>
                      <span className="text-muted-foreground text-base">Walk away with a functioning automation that you can immediately use or tweak.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-[400px]">
                <div className="relative p-8 md:p-10 rounded-[2rem] bg-card border border-border shadow-2xl text-center hover:shadow-primary/10 transition-shadow">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-[2rem] pointer-events-none" />
                  <div className="text-6xl font-black text-foreground tracking-tight mb-4 relative z-10">
                    {variant === 'free' ? 'Free' : variant === '9' ? '₹9' : '₹99'}
                  </div>
                  <p className="text-muted-foreground font-medium mb-8 relative z-10">A small investment for a big leap.</p>
                  <Button onClick={handleRegister} className="w-full h-16 text-xl rounded-xl font-bold shine-effect relative z-10 transition-transform hover:scale-105" size="lg">
                    Join The Workshop
                  </Button>
                  {variant !== 'free' && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6 font-medium relative z-10">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" /> Secure Checkout via Razorpay
                    </div>
                  )}
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
