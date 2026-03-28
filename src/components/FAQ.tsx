import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is this community all about?",
    answer: "Ritz7 is a launchpad for Modern Builders. We’re a collective of learners and creators driven by No-Code, Generative AI, and AI Agents. We focus on using smart tools to build software and automate tasks—without the headache of traditional coding. Whether you're here to learn the basics or launch your first AI assistant, we’re all about building fast and growing together.",
  },
  {
    question: "Why combine No-Code with AI?",
    answer: "No-Code gives you the layout, and AI gives it a brain. Together, they let you build apps that can actually \"think\"—summarizing notes, creating images, or answering customer questions automatically.",
  },
  {
    question: "What exactly are \"AI Agents\"?",
    answer: "Think of them as digital teammates. Unlike a basic app that waits for a click, an Agent can reason, follow a goal, and execute multi-step tasks autonomously—like managing your lead research or drafting a week’s worth of content.",
  },
  {
    question: "Do I need to be a developer to join?",
    answer: "Not at all. Whether you’re a founder, a creative, or a curious professional, if you want to build things faster, you belong here. We value logic over syntax.",
  },
  {
    question: "How do I get started?",
    answer: "Start with our Resource Hub. We have \"Zero-to-One\" guides that walk you through building your first AI-powered app or automated workflow in hours, not weeks.",
  },
  {
    question: "What Kind of Content Can I Expect?",
    answer: "We keep it practical. You’ll find everything from \"how-to\" guides and project showcases to deep dives into new AI agents. We also host live webinars and community-led builds so you can see exactly how these tools work in the real world.",
  },
  {
    question: "Is There a Cost to Join?",
    answer: "Our community is free to join! As we grow, we may introduce premium features or events, but the core community will always remain accessible.",
  },
  {
    question: "How can I contribute?",
    answer: "Show up and share. Post your wins, ask questions, or drop a tutorial on a tool you love. The best way to learn is to teach others what you’ve just figured out.",
  }
];

export const FAQ = () => {
  return (
    <section id="faqs" className="relative py-6 md:py-10 overflow-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-8 md:mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our community, tools, and how to get started on your building journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <div className="rounded-2xl border border-border/50 bg-background/50 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/20 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/50 dark:border-white/10 last:border-b-0">
                  <AccordionTrigger 
                    className={`text-left text-lg font-medium hover:text-primary transition-colors ${
                      index === 0 ? "pt-0 pb-5" : 
                      index === faqs.length - 1 ? "pt-5 pb-0 data-[state=open]:pb-5" : 
                      "py-5"
                    }`}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className={`text-base text-muted-foreground leading-relaxed ${index === faqs.length - 1 ? "pb-0" : "pb-6"}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
