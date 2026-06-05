import { motion } from "framer-motion";
import { Check, Info, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Background3D } from "@/components/Background3D";
import { CustomCursor } from "@/components/CustomCursor";
import RazorpayButton from "@/components/RazorpayButton";

const SubscriptionLanding = () => {
  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground overflow-hidden">
      <CustomCursor />
      <Background3D />
      <Navbar />

      <main className="pt-24 pb-20 lg:pt-32">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Join the Exclusive Community
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl"
          >
            Elevate Your AI Journey with{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-[#0756B1] bg-clip-text text-transparent">
              Premium Memberships
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Get access to our top-tier Learning Management System, participate in weekly insightful calls, and collaborate in monthly workshops. Choose the plan that fits your ambition.
          </motion.p>
        </section>

        {/* Pricing Section */}
        <section className="relative z-10 mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
            {/* Silver Membership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex flex-col justify-between rounded-3xl border-2 border-primary bg-white/60 p-8 shadow-lg backdrop-blur-xl dark:bg-black/60"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-sm">
                Most Popular
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Silver Membership</h3>
                <p className="mt-2 text-muted-foreground">Perfect for learners who want consistent growth.</p>
                <div className="mt-6 flex items-baseline gap-x-2">
                  <span className="text-4xl font-bold tracking-tight">₹999</span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-sm leading-6">
                  {["LMS access", "Weekly calls", "Monthly workshops"].map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Gold Membership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative flex flex-col justify-between rounded-3xl border border-border bg-white/40 p-8 shadow-sm backdrop-blur-xl dark:bg-black/40"
            >
              <div>
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  Gold Membership <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </h3>
                <p className="mt-2 text-muted-foreground">For those who want personalized attention and maximum impact.</p>
                <div className="mt-6 flex items-baseline gap-x-2">
                  <span className="text-4xl font-bold tracking-tight">₹4,999</span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-sm leading-6">
                  {["LMS access", "Weekly calls", "Monthly workshops", "2 x 1-on-1 call per month"].map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Payment Button Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-col items-center rounded-3xl border border-primary/20 bg-primary/5 px-4 py-8 sm:p-8 text-center backdrop-blur-md max-w-3xl mx-auto dark:bg-primary/10"
          >
            <h3 className="text-xl font-semibold mb-2">Ready to take the next step?</h3>
            <p className="text-muted-foreground mb-6">Select your preferred membership securely via Razorpay.</p>
            <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-none sm:shadow-lg border-0 sm:border border-black/10 dark:border-white/10 bg-transparent sm:bg-white/50 dark:sm:bg-black/50 p-0 sm:p-2">
               <RazorpayButton buttonId="pl_SxdobEf86E6Ky9" />
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Cancel anytime. No hidden fees.</span>
            </div>
          </motion.div>
        </section>

        {/* FAQ / Info Section */}
        <section className="relative z-10 mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Info className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-4">Flexible Subscription</h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe in delivering continuous value. Your subscription helps us maintain high-quality resources, bring in expert speakers for weekly calls, and host hands-on monthly workshops. You can easily manage or cancel your subscription at any time directly through your payment provider. If you ever encounter any issues or need assistance, our support team is always here for you at <a href="mailto:support@ritz7.ai" className="text-primary hover:underline font-medium">support@ritz7.ai</a>.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionLanding;
