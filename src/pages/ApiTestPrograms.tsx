import { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, ChevronLeft, ChevronRight, AlertCircle, RefreshCcw } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface ApiCourse {
  batch_id: number;
  name: string;
  thumbnail_url: string | null;
  course_fee: string | null;
  offer_price: string | null;
}

interface ApiResponse {
  courses: ApiCourse[];
  total_items: number;
  current_page: number;
  total_pages: number;
}

const CourseSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card flex flex-col animate-pulse">
    <div className="relative aspect-[2.2/1] bg-muted/60 w-full"></div>
    <div className="p-4 pb-4 flex flex-col flex-1 gap-3">
      <div className="h-5 bg-muted/60 rounded-md w-3/4 mb-1"></div>
      <div className="h-4 bg-muted/60 rounded-md w-1/2 mb-4"></div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
        <div className="h-6 bg-muted/60 rounded-md w-1/3"></div>
        <div className="h-8 bg-muted/60 rounded-xl w-24"></div>
      </div>
    </div>
  </div>
);

const ApiTestPrograms = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const paginationVal = 9;

  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCourses = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Call our Supabase Edge Function which proxies to the upstream API
      const url = new URL(`${supabaseUrl}/functions/v1/courses`);
      
      if (debouncedSearchQuery) url.searchParams.append("q", debouncedSearchQuery);
      url.searchParams.append("page_num", currentPage.toString());
      url.searchParams.append("pagination_val", paginationVal.toString());

      const res = await fetch(url.toString(), {
        headers: {
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      
      const data: ApiResponse = await res.json();
      setCourses(data.courses || []);
      setTotalItems(data.total_items || 0);
      setCurrentPage(data.current_page || 1);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("API error:", err);
      setHasError(true);
      toast.error("Failed to load programs.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, [debouncedSearchQuery, currentPage]);

  // Helper for rendering price
  const renderPrice = (fee: string | null, offer: string | null) => {
    const feeNum = fee ? Number(fee) : 0;
    const offerNum = offer ? Number(offer) : 0;

    if (!feeNum && !offerNum) {
      return <span className="text-emerald-500 font-bold">Free</span>;
    }
    if (feeNum && !offerNum) {
      return <span className="text-card-foreground font-bold">₹{fee}</span>;
    }
    // Provide strict check for both existing and offer being essentially considered valid
    if (feeNum && offerNum) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground line-through text-sm">₹{fee}</span>
          <span className="text-card-foreground font-bold">₹{offer}</span>
        </div>
      );
    }
    return null;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 md:px-8 lg:px-12">
        <a href="/" className="shrink-0 group flex items-center gap-2">
          <img
            src={isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png"}
            alt="Ritz7"
            className="h-9 object-contain transition-transform group-hover:scale-105"
          />
          <span className="hidden sm:inline-block font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-md text-xs uppercase tracking-wider">
            API Test
          </span>
        </a>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8" ref={searchRef}>
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-muted/40 py-2.5 pl-10 pr-10 text-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
        </div>
      </nav>

      {/* ───── Main ───── */}
      <main className="pt-16 flex-1 flex flex-col pb-6">
        {/* Sticky filter bar */}
        <section className="sticky top-16 z-30 border-b border-border/30 bg-background/90 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            {/* Mobile search bar */}
            <div className="flex md:hidden pt-3 pb-1">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-muted/40 py-2.5 pl-10 pr-10 text-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <h2 className="text-base font-bold text-foreground">
                {debouncedSearchQuery ? `Search results for "${debouncedSearchQuery}"` : "All Programs"}
              </h2>
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap block tabular-nums bg-muted/40 px-3 py-1.5 rounded-full">
                {totalItems} result{totalItems !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </section>

        {/* ───── Course Grid ───── */}
        <section className="container mx-auto px-4 py-8 flex-1 flex flex-col">
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 w-full">
               {Array.from({ length: paginationVal }).map((_, i) => (
                 <CourseSkeleton key={`skel-${i}`} />
               ))}
             </div>
          ) : hasError ? (
             <div className="py-20 flex-1 flex flex-col items-center justify-center text-center border border-destructive/20 rounded-3xl border-dashed bg-destructive/5 my-auto">
               <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                 <AlertCircle className="w-8 h-8 text-destructive" />
               </div>
               <p className="text-lg font-bold text-foreground">Failed to load programs</p>
               <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto mb-6">There was a problem communicating with the server. Please try again later.</p>
               <button onClick={fetchCourses} className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-xl text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                 <RefreshCcw className="w-4 h-4" /> Try Again
               </button>
             </div>
          ) : (
             <AnimatePresence mode="wait">
             <motion.div key={`${debouncedSearchQuery}-${currentPage}`} className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
               {courses && courses.length > 0 ? (
                 <>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-auto">
                     {courses.map((course, i) => (
                       <motion.div
                         key={course.batch_id}
                         initial={{ opacity: 0, y: 12 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.25, delay: i * 0.05 }}
                         className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 flex flex-col"
                       >
                         <div className="relative aspect-[2.2/1] overflow-hidden bg-muted flex items-center justify-center shrink-0">
                           {course.thumbnail_url ? (
                             <img src={course.thumbnail_url} alt={course.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                           ) : (
                             <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60" />
                           <div className="absolute top-2.5 left-2.5">
                             <div className="flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-md">
                               BATCH {course.batch_id}
                             </div>
                           </div>
                         </div>
   
                         <div className="p-4 pb-4 flex flex-col flex-1">
                           <h3 className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors leading-snug mb-4 flex-1">
                             {course.name}
                           </h3>
   
                           <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                             <div className="text-lg">
                               {renderPrice(course.course_fee, course.offer_price)}
                             </div>
                             <button
                               className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/85 px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98]"
                             >
                               <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                                 View Details
                               </span>
                             </button>
                           </div>
                         </div>
                       </motion.div>
                     ))}
                   </div>

                   {/* Pagination UI */}
                   {totalPages > 1 && (
                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-border/40">
                       <p className="text-sm text-muted-foreground">
                         Showing page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
                       </p>
                       <div className="flex items-center gap-2">
                         <button
                           onClick={() => handlePageChange(currentPage - 1)}
                           disabled={currentPage === 1 || isLoading}
                           className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border/60 bg-card hover:bg-muted text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                         >
                           <ChevronLeft className="w-4 h-4" /> Previous
                         </button>
                         
                         <div className="hidden sm:flex items-center gap-1">
                           {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .map((p, i, arr) => {
                              // add ellipsis if gap
                              const addEllipsis = i > 0 && p - arr[i - 1] > 1;
                              return (
                                <div key={p} className="flex gap-1">
                                  {addEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                                  <button
                                    onClick={() => handlePageChange(p)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                      currentPage === p 
                                        ? "bg-primary text-primary-foreground shadow-sm" 
                                        : "hover:bg-muted border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    {p}
                                  </button>
                                </div>
                              );
                           })}
                         </div>

                         <button
                           onClick={() => handlePageChange(currentPage + 1)}
                           disabled={currentPage === totalPages || isLoading}
                           className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border/60 bg-card hover:bg-muted text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                         >
                           Next <ChevronRight className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   )}
                 </>
               ) : (
                 <div className="py-12 flex-1 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                     <Search className="w-8 h-8 text-muted-foreground/50" />
                   </div>
                   <p className="text-xl font-bold text-foreground">No programs found</p>
                   <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">We couldn't find any courses matching your search criteria. Try using different keywords.</p>
                   <button onClick={() => { setSearchQuery(""); setDebouncedSearchQuery(""); setCurrentPage(1); }} className="mt-8 px-5 py-2.5 bg-primary/10 rounded-xl text-sm font-bold text-primary hover:bg-primary/20 transition-colors">
                     Clear search bar
                   </button>
                 </div>
               )}
             </motion.div>
           </AnimatePresence>
          )}
        </section>
      </main>

      {/* ───── Footer ───── */}
      <footer className="border-t border-border/40 bg-muted/30 py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png"} alt="Ritz7" className="h-5 object-contain" />
            <span className="text-xs">© {new Date().getFullYear()} Ritz7 AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/community-guidelines" className="hover:text-foreground transition-colors">Guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ApiTestPrograms;
