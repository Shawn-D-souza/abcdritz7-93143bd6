import { getAllBlogs } from "@/lib/blog";
import { Link } from "react-router-dom";
import { CalendarIcon, User, ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export const Blogs = () => {
  const recentBlogs = getAllBlogs().slice(0, 3);

  return (
    <section id="blogs" className="py-10 relative w-full overflow-hidden">
      <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
        <div className="mx-auto max-w-4xl text-center mb-10 md:mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
            Latest <span className="text-primary">Blogs</span>
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Discover our most recent thoughts, news, and perspectives on technology and design.
          </p>
          <Link to="/blogs">
            <Button variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all group">
              View All Blogs <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBlogs.map((blog) => (
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
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <time dateTime={blog.date}>
                      {format(new Date(blog.date), "MMM d, yyyy")}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{blog.readingTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{blog.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {blog.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {recentBlogs.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No articles found. Check back later!
          </div>
        )}
      </div>
    </section>
  );
};
