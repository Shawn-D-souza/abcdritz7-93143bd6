import { BlogHeader } from "@/components/BlogHeader";
import { Footer } from "@/components/Footer";
import { getAllBlogs } from "@/lib/blog";
import { Link } from "react-router-dom";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";

export default function BlogList() {
  const blogs = getAllBlogs();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 overflow-hidden relative font-sans">
      <BlogHeader />
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <header className="mb-12 text-center max-w-4xl mx-auto mt-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            Our <span className="text-primary">Blogs</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover the latest thoughts, news, and perspectives from our team on technology, design, and the future.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link 
              to={`/blog/${blog.id}`} 
              key={blog.id}
              className="group flex flex-col h-full rounded-2xl overflow-hidden border bg-card/40 backdrop-blur shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="relative aspect-video overflow-hidden bg-muted/30 shrink-0 flex items-center justify-center">
                {blog.thumbnail ? (
                  <img 
                    src={blog.thumbnail} 
                    alt={blog.thumbnail_alt} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm font-medium">No Image</span>
                )}
                {/* Permanent gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Meta Information directly on Thumbnail */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-medium text-white/90 drop-shadow-sm z-10">
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <CalendarIcon className="w-3 h-3" />
                    <time dateTime={blog.date}>
                      {format(new Date(blog.date), "MMM d, yyyy")}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <User className="w-3 h-3" />
                    <span>{blog.author}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 pt-3 flex flex-col flex-grow">
                <h2 className="text-lg font-bold tracking-tight text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug">
                  {blog.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {blog.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-lg">
            No articles found. Check back later!
          </div>
        )}
      </div>
      
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
