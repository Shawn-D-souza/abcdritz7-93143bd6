import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Loader2 } from "lucide-react";

interface BlogPost {
  title: string;
  link: string;
  date: string;
  image: string;
}

export const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const url = encodeURIComponent("https://ritz7.com/blog");
        const response = await fetch(`https://api.allorigins.win/get?url=${url}`);
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const html = data.contents;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        
        const links = Array.from(doc.querySelectorAll("a"));
        // Filter links that point to a specific blog post
        const blogLinks = links.filter(a => {
          const href = a.getAttribute("href") || "";
          return href.includes("/blog/") && href !== "/blog" && href !== "https://ritz7.com/blog";
        });

        const uniqueBlogs: BlogPost[] = [];
        const seenUrls = new Set<string>();

        for (const link of blogLinks) {
          const href = link.getAttribute("href") || "";
          // Resolve absolute URL
          const absoluteUrl = href.startsWith("http") 
            ? href 
            : `https://ritz7.com${href.startsWith("/") ? "" : "/"}${href}`;

          if (seenUrls.has(absoluteUrl)) continue;
          
          let title = "";
          const h3 = link.querySelector("h3");
          const h2 = link.querySelector("h2");
          const h1 = link.querySelector("h1");
          
          if (h3) title = h3.textContent || "";
          else if (h2) title = h2.textContent || "";
          else if (h1) title = h1.textContent || "";
          else {
            // Try to find the first significant text node or paragraph
            const paragraphs = Array.from(link.querySelectorAll("p"));
            if (paragraphs.length > 0) {
                title = paragraphs[0].textContent || "";
            } else {
                title = link.textContent?.trim() || "";
            }
          }
          
          // Extract image
          let image = "";
          const img = link.querySelector("img");
          if (img) {
            image = img.getAttribute("src") || "";
            // Handle relative image URLs if any
            if (image && !image.startsWith("http")) {
              if (image.startsWith("//")) image = "https:" + image;
              else if (image.startsWith("/")) image = "https://ritz7.com" + image;
            }
          }
          
          // Clean title
          title = title.replace(/\s+/g, " ").trim();
          if (title.length > 80) title = title.substring(0, 80) + "...";

          // Extract date with regex (e.g., Mar 3, 2026 or March 3, 2026)
          const textContent = link.textContent || "";
          const dateMatch = textContent.match(/[A-Z][a-z]+\s\d{1,2},\s\d{4}/);
          const date = dateMatch ? dateMatch[0] : "";

          // Only keep valid-looking blog links
          if (title && title.length > 5) {
            uniqueBlogs.push({
              title,
              link: absoluteUrl,
              date,
              image
            });
            seenUrls.add(absoluteUrl);
          }

          if (uniqueBlogs.length >= 3) break;
        }

        setBlogs(uniqueBlogs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blogs" className="py-24 relative w-full overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
      
      <div className="container px-4 mx-auto relative z-10 w-full max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Latest from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Blog</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Insights, tutorials, and updates on AI, automation, and no-code tools.
            </p>
          </motion.div>
          
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="https://ritz7.com/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-medium text-foreground bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-6 py-3 transition-all cursor-pointer whitespace-nowrap"
          >
            Explore All Blogs
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-blue-400" />
          </motion.a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500/50 animate-spin" />
              </div>
            ))}
          </div>
        ) : error || blogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
            <p className="text-red-400">Failed to load recent blogs. Please visit the blog directly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog, idx) => (
              <motion.a
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col h-full rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-blue-500/50 transition-all overflow-hidden"
              >
                {/* Card hover effect glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
                
                <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 border border-white/10">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>

                {blog.image && (
                  <div className="relative w-full h-40 overflow-hidden shrink-0">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 mix-blend-overlay" />
                  </div>
                )}
                
                <div className="relative z-10 flex-grow flex flex-col p-6">
                  {blog.date && (
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3 bg-white/5 w-fit px-3 py-1.5 rounded-full border border-white/5 relative z-20 backdrop-blur-md">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      {blog.date}
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-300">
                    {blog.title}
                  </h3>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
