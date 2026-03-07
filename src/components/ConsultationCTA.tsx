import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ConsultationCTA = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">1-on-1 Consultation</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 mb-5 text-foreground">
                Need Personalized Guidance?
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Book a paid 1-on-1 call with our experts. Get tailored advice on your project, 
                choose the right tools, or get help building your automation stack.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: Clock, text: "30 or 60 minute sessions available" },
                  { icon: Video, text: "Video call via Google Meet or Zoom" },
                  { icon: Calendar, text: "Book at your convenience, 7 days a week" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <item.icon className="h-5 w-5 text-primary shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="gap-2" onClick={() => setOpen(true)}>
                Book a Call <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-square max-w-md mx-auto lg:mx-0 lg:ml-auto"
            >
              <img src="/placeholder.svg" alt="Consultation call" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-card-foreground">Book Your Call</h3>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Consultation form submitted");
                setOpen(false);
              }}
              className="space-y-4"
            >
              <Input placeholder="Your Name" required />
              <Input type="email" placeholder="Email Address" required />
              <Input placeholder="Phone Number (optional)" />
              <Textarea placeholder="What do you need help with?" rows={3} />
              <Button type="submit" className="w-full gap-2">
                Submit Request <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ConsultationCTA;
