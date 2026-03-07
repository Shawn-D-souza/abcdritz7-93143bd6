import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, ArrowRight, FileJson, BookOpen, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const resources = [
  { icon: FileJson, title: "n8n Starter Pack", description: "10 ready-to-import workflow JSON files for lead gen, CRM, and content automation", format: "JSON" },
  { icon: Workflow, title: "AI Agent Blueprint", description: "Step-by-step guide to building your first autonomous AI agent with n8n + OpenAI", format: "PDF" },
  { icon: BookOpen, title: "No-Code Launch Checklist", description: "The complete 50-point checklist for launching your no-code MVP", format: "PDF" },
];

const LeadMagnets = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Webhook integration point
    console.log("Lead captured:", email);
    setEmail("");
  };

  return (
    <section id="resources" className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Free Resources</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 text-foreground">
            Download & Start Building Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Grab our most popular templates, workflows, and guides — completely free.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {resources.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <r.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary bg-accent px-2 py-0.5 rounded">{r.format}</span>
              <h3 className="font-display text-lg font-semibold mt-3 mb-2 text-card-foreground">{r.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{r.description}</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Download Free
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto p-8 rounded-2xl border border-primary/20 bg-accent/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-6 w-6 text-primary" />
            <h3 className="font-display text-xl font-semibold text-foreground">Get Weekly No-Code Tips</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Join 5,000+ subscribers. One email per week with tutorials, tools, and insider tips.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" className="gap-2 shrink-0">
              Subscribe <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadMagnets;
