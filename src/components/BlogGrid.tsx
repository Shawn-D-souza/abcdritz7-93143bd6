import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  { title: "How to Build an AI Chatbot in 30 Minutes with n8n", category: "AI Agents", readTime: "5 min", image: "/placeholder.svg" },
  { title: "Bubble vs FlutterFlow: Which No-Code Tool Is Right for You?", category: "No-Code", readTime: "8 min", image: "/placeholder.svg" },
  { title: "Automate Your Entire Lead Gen Pipeline with Zapier + Make", category: "Automation", readTime: "6 min", image: "/placeholder.svg" },
  { title: "The Complete Guide to Google Gemini API for Beginners", category: "AI Tools", readTime: "10 min", image: "/placeholder.svg" },
  { title: "From Idea to MVP in 48 Hours: A No-Code Founder's Guide", category: "Startup", readTime: "7 min", image: "/placeholder.svg" },
  { title: "5 n8n Workflows Every Freelancer Needs in 2025", category: "Automation", readTime: "4 min", image: "/placeholder.svg" },
];

const BlogGrid = () => {
  return (
    <section id="blog" className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Blog</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5 text-foreground">
            Latest From the Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tutorials, insights, and deep dives into the tools shaping the future of building.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-primary bg-accent px-2 py-0.5 rounded">{post.category}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" className="gap-2">
            View All Posts <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;
