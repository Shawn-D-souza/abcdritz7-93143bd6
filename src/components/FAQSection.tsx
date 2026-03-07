import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What is ABCD?", a: "ABCD stands for 'Anybody Can Design, Develop, Deploy.' We're a tech community that empowers students, founders, and creators to build intelligent systems using No-Code tools, AI agents, and automation — without writing traditional code." },
  { q: "Is the community free to join?", a: "Yes! Our community is completely free. You get access to 500+ video tutorials, downloadable resources, live sessions, and a network of thousands of builders." },
  { q: "Do I need any coding experience?", a: "Absolutely not. Our entire curriculum is designed for non-developers. If you can use a web browser, you can start building with the tools we teach." },
  { q: "What tools do you teach?", a: "We cover 30+ tools including Bubble, n8n, OpenAI, Google Gemini, Zapier, Make, ElevenLabs, Microsoft Copilot, FlutterFlow, and many more." },
  { q: "How do consultation calls work?", a: "You can book a paid 1-on-1 video call with our experts. We'll help you choose the right tools, plan your project architecture, or troubleshoot specific issues." },
  { q: "What is the 1000 Days Challenge?", a: "It's our ambitious public journey to master every major no-code and AI tool, one day at a time. We document everything so you can learn alongside us." },
  { q: "Can I contribute or collaborate?", a: "We love collaborations! Whether you want to guest on our YouTube channel, co-host a workshop, or become a campus ambassador, reach out to us." },
  { q: "Where can I find your content?", a: "Our primary content is on YouTube. We also share tips and updates on Instagram. Join our community for exclusive resources and live sessions." },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding bg-muted/30">
      <div className="container-narrow max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 text-foreground">
            Got Questions?
          </h2>
          <p className="text-lg text-muted-foreground">
            Here are answers to the most common questions about ABCD.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-6 bg-card data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-card-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
