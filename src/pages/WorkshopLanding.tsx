import { useEffect, useState, useRef, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { 
  ArrowRight, 
  Bot, 
  Zap, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
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
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/lib/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Custom hook for number animation
const AnimatedCounter = ({ value, duration = 2, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        // Easing out function
        const easeOutQuad = (t: number) => t * (2 - t);
        setCount(Math.floor(easeOutQuad(progress) * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, value, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}{suffix}</span>;
};

const WorkshopLanding = () => {
  const [showRest, setShowRest] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "", countryCode: "+91" });
  const [isProcessing, setIsProcessing] = useState(false);

  useSEO({
    title: "Start Your Automation Journey | n8n Beginner Workshop",
    description: "Join our beginner-friendly n8n workshop. Build your first automation without any coding experience. May 30th.",
    type: "website",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load below-the-fold content after initial paint
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(() => setShowRest(true), { timeout: 1500 });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setShowRest(true), 500);
      return () => clearTimeout(id);
    }
  }, []);

  const handleRegister = () => {
    setIsPaymentModalOpen(true);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend Validation
    if (!formData.countryCode.startsWith('+') || formData.countryCode.length < 2) {
      toast.error("Country code must start with '+' and contain numbers (e.g., +91)");
      return;
    }
    if (formData.whatsapp.length < 7 || formData.whatsapp.length > 15) {
      toast.error("Please enter a valid WhatsApp number (between 7 and 15 digits).");
      return;
    }

    setIsProcessing(true);
    
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Payment gateway failed to load. Please check your connection.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // Uses the key from .env
      amount: "9900", // ₹99 in paise
      currency: "INR",
      name: "n8n Workshop",
      description: "Beginner Friendly Automation Workshop",
      handler: function (response: any) {
        // 1. Immediately show success so the user doesn't wait!
        setIsProcessing(false);
        toast.success("Payment successful! Our team will reach out to you via WhatsApp and email.");

        // 2. Process the webhook securely in the background (fire-and-forget)
        supabase.functions.invoke('payment-webhook', {
          body: {
            payment_id: response.razorpay_payment_id,
            name: formData.name,
            email: formData.email,
            whatsapp: formData.countryCode + formData.whatsapp,
            amount: 99,
            workshop_name: "Basics of Automation using n8n",
            date: format(new Date(), "dd MMM, yyyy")
          }
        }).catch((error) => {
          console.error("Webhook trigger error in background:", error);
        });
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.countryCode + formData.whatsapp,
      },
      theme: {
        color: "#6d28d9", // Purple matching the theme
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on("payment.failed", function (response: any) {
      toast.error("Payment failed: " + response.error.description);
      setIsProcessing(false);
    });
    
    // Close the custom Radix UI Dialog so it releases the focus trap and body pointer-events
    setIsPaymentModalOpen(false);
    
    // Slight delay ensures Radix clears its overlay styles before Razorpay injects its iframe
    setTimeout(() => {
      paymentObject.open();
    }, 150);
  };

  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <CustomCursor />
      <Navbar />

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Secure Your Spot</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-1">
              Enter your details below to register for the workshop.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
              <Input 
                id="name" 
                required 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-background/50 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-background/50 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm font-semibold">WhatsApp Number</Label>
              <div className="flex gap-2">
                <Input 
                  value={formData.countryCode} 
                  onChange={(e) => setFormData({...formData, countryCode: e.target.value.replace(/[^\+0-9]/g, '')})}
                  className="w-[80px] bg-background/50 h-11 shrink-0 font-medium text-center px-1"
                  placeholder="+91"
                  minLength={2}
                  maxLength={5}
                  required
                />
                <Input 
                  id="whatsapp" 
                  type="tel" 
                  required 
                  placeholder="9876543210" 
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value.replace(/[^0-9]/g, '')})}
                  className="bg-background/50 h-11 flex-1"
                  minLength={7}
                  maxLength={15}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold shine-effect transition-transform hover:scale-[1.02]" 
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay ₹99 & Register"}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Secure Checkout by Razorpay
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Subtle Background Elements instead of heavy 3D Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <main className="relative z-10 pt-24 pb-0 lg:pt-32">
        {/* Hero Section */}
        <section className="container px-4 mx-auto text-center max-w-5xl">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">Beginner Friendly Workshop</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Build Your First <span className="text-primary">Automation</span><br/> Without Writing Code
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Step into the world of AI & n8n. Let computers do the boring repetitive work so you can focus on what truly matters.
            </motion.p>

            <motion.div variants={fadeIn} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={handleRegister}
                size="lg" 
                className="h-16 px-10 text-lg w-full sm:w-auto rounded-full shine-effect bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] transition-transform hover:scale-105"
              >
                Secure Your Spot for ₹99
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <div className="flex flex-col items-start gap-1 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  May 30th • 3 Hours
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  Perfect for Beginners
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {showRest && (
          <div className="animate-in fade-in duration-1000">
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
                      What if you could just click a button and let the internet do it for you?
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      You <strong className="text-foreground">don't</strong> need a computer science degree to make this magic happen. You just need <strong className="text-primary font-extrabold text-xl whitespace-nowrap">3 hours</strong> and the willingness to learn how to build your first automation.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 md:p-10 rounded-3xl bg-card border border-border/50 shadow-xl hover:shadow-primary/5 transition-all group flex items-start gap-6 justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Gain Confidence</h3>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      Overcome the fear of "tech". We break down complex concepts into simple, bite-sized pieces that anyone can understand. By the end, you'll feel empowered to automate your daily tasks.
                    </p>
                  </div>
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <HeartHandshake className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="p-6 md:p-10 rounded-3xl bg-card border border-border/50 shadow-xl hover:shadow-primary/5 transition-all group flex items-start gap-6 justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Unlock Your Potential</h3>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      Automation isn't about replacing humans; it's about freeing up your brain for creative, high-value work. Take your first step into a more productive, fulfilling future.
                    </p>
                  </div>
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BrainCircuit className="w-7 h-7 md:w-8 md:h-8 text-purple-500" />
                  </div>
                </motion.div>
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
                      <img src="/ritesh_hegde.avif" alt="Ritesh Hegde" className="w-full h-full object-cover object-[center_15%]" />
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
                      <div className="text-6xl md:text-7xl font-black text-foreground tracking-tight">₹99</div>
                      <p className="text-muted-foreground text-lg font-medium">A small investment for a big leap.</p>
                      <Button onClick={handleRegister} className="w-full h-16 text-xl mt-4 shine-effect rounded-xl font-bold" size="lg">
                        Join The Workshop
                      </Button>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4 font-medium">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        Secure Checkout via Razorpay
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="container px-4 mx-auto pt-8 pb-12 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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
                <AccordionItem value="item-4" className="border-none">
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">What happens after I register?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-4">
                    Once you complete your payment of ₹99, our team will reach out to you via WhatsApp and Email with all the details, links, and preparations you need for May 30th.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        )}
      </main>

      {showRest && <Footer />}
    </div>
  );
};

export default WorkshopLanding;
