import { useState, useMemo, useRef } from "react";
import { BlogHeader } from "@/components/BlogHeader";
import { Footer } from "@/components/Footer";
import { getAllBlogs } from "@/lib/blog";
import { Link, useLocation } from "react-router-dom";
import { CalendarIcon, User, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { useSEO } from "@/hooks/useSEO"; // Import the hook
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogList() {
  const blogs = getAllBlogs();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollByAmount = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const categories = useMemo(() => {
    const allCategories = blogs.map((blog) => blog.category).filter(Boolean);
    return ["All", ...new Set(allCategories)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        blog.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  useSEO({
    title: "Our Blogs | Ritz7",
    description: "Discover the latest thoughts, news, and perspectives from our team on technology, design, and the future.",
    type: "website",
  });

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
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Discover the latest thoughts, news, and perspectives from our team on technology, design, and the future.
          </p>

          <div className="flex flex-col gap-8 items-center w-full max-w-3xl mx-auto mb-16">
            <div className="relative w-full group">
              <Input
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-6 py-7 w-full rounded-full border-border/60 bg-card/50 shadow-sm transition-all duration-300 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-base md:text-lg"
              />
            </div>
            
            <div className="relative w-full group/scroll flex items-center">
              <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none flex items-center justify-start pl-2 opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 hidden md:flex z-10">
                <button 
                  onClick={() => scrollByAmount(-200)}
                  className="bg-background/90 hover:bg-background backdrop-blur-sm rounded-full p-2 shadow-md border border-border/50 text-foreground pointer-events-auto transition-transform hover:scale-110"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div 
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`flex overflow-x-auto pb-4 pt-2 px-4 md:px-10 gap-3 w-full snap-x snap-mandatory category-scrollbar ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap shrink-0 snap-center rounded-full px-6 py-2.5 text-sm md:text-base font-medium transition-all duration-300 border backdrop-blur-sm ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                        : "bg-card/40 text-muted-foreground border-border/60 hover:bg-card/80 hover:text-foreground hover:border-primary/40 hover:-translate-y-0.5 shadow-sm"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none flex items-center justify-end pr-2 opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 hidden md:flex z-10">
                <button 
                  onClick={() => scrollByAmount(200)}
                  className="bg-background/90 hover:bg-background backdrop-blur-sm rounded-full p-2 shadow-md border border-border/50 text-foreground pointer-events-auto transition-transform hover:scale-110"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Link 
              to={`/blog/${blog.id}`} 
              state={{ from: location.pathname }}
              key={blog.id}
              className="group flex flex-col h-full rounded-2xl overflow-hidden border bg-card/40 backdrop-blur shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="relative aspect-video overflow-hidden bg-muted/30 shrink-0 flex items-center justify-center">
                {blog.thumbnail ? (
                  <img 
                    src={blog.thumbnail} 
                    alt={blog.thumbnail_alt} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm font-medium">No Image</span>
                )}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground mb-3">
                  {/* Replaced the two dates with this single block */}
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <time dateTime={blog.updated_date || blog.date}>
                      {format(new Date(blog.updated_date || blog.date), "MMM d, yyyy")}
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

                <h2 className="text-xl font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {blog.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {blog.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-lg">
            No articles found matching your criteria. Check back later!
          </div>
        )}
      </div>
      
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
