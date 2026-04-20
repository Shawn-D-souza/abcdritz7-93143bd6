import { useState, useEffect, useRef } from "react";
import { 
  Search, X, BookOpen, ChevronLeft, ChevronRight, AlertCircle, RefreshCcw, 
  User, Mail, Phone, Lock, LogOut, Check, ChevronDown, Briefcase, Laptop, 
  Loader2, Rocket, Sparkles, GraduationCap 
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { loadRazorpay } from "@/lib/razorpay";
import { Session } from "@supabase/supabase-js";

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

// ── Role Options ──
const roles = [
  { value: "student", label: "Student", icon: <GraduationCap className="w-4 h-4" /> },
  { value: "working-professional", label: "Working Professional", icon: <Briefcase className="w-4 h-4" /> },
  { value: "entrepreneur", label: "Entrepreneur / Business Owner", icon: <Rocket className="w-4 h-4" /> },
  { value: "freelancer", label: "Freelancer / Consultant", icon: <Laptop className="w-4 h-4" /> },
  { value: "educator", label: "Teacher / Educator", icon: <BookOpen className="w-4 h-4" /> },
  { value: "other", label: "Other", icon: <User className="w-4 h-4" /> },
];

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

  const [session, setSession] = useState<Session | null>(null);

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
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Auth State
  const [showRegistration, setShowRegistration] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot-password">("register");
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Initialize Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "SIGNED_IN") {
        setShowRegistration(false);
        toast.success(`Welcome${session?.user?.user_metadata?.full_name ? ` back, ${session.user.user_metadata.full_name}` : ''}! You are successfully logged in.`, {
          icon: <Sparkles className="w-4 h-4 text-primary" />
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthLoading) return;
    setIsAuthLoading(true);
    
    try {
      if (authMode === "register") {
        const cleanNumber = phoneNumber.replace(/\s+/g, '');
        if (!/^\d{7,15}$/.test(cleanNumber)) {
          throw new Error("Please enter a valid phone number (7-15 digits)");
        }
        
        const fullPhoneNumber = `${countryCode} ${cleanNumber}`;
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { 
            data: { 
              full_name: fullName, 
              phone_number: fullPhoneNumber, 
              role: selectedRole,
              country_code: countryCode
            },
          }
        });

        if (error) throw error;
        
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (!loginError) {
          toast.success("Account created and logged in successfully!");
          setShowRegistration(false);
        } else {
          toast.success("Account created successfully!");
          setAuthMode("login");
        }
      } else if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Logged in successfully!");
        setShowRegistration(false);
      } /* else if (authMode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setAuthSuccess(true);
        toast.success("Password reset email sent!");
      } */
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setTimeout(() => setIsAuthLoading(false), 1000);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const handleBuyCourse = async (course: ApiCourse) => {
    if (!session) {
      toast.info("Please login to purchase this course.");
      setAuthMode("register");
      setShowRegistration(true);
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const feeNum = course.offer_price ? Number(course.offer_price) : Number(course.course_fee);
    if (!feeNum) {
      toast.info("This course is free! No payment needed.");
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
    if (!razorpayKey) {
      toast.error("VITE_RAZORPAY_KEY is missing.");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: feeNum * 100, // in paise
      currency: "INR",
      name: "Ritz7 Programs",
      description: course.name,
      image: isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png",
      handler: async function (response: any) {
        toast.loading("Verifying your payment...", { id: "payment-verify" });
        try {
          const verifyRes = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              batch_id: course.batch_id,
            }),
          });

          const result = await verifyRes.json();

          if (!verifyRes.ok || !result.success) {
            throw new Error(result.error || "Payment verification failed");
          }

          toast.success("Payment verified! You're enrolled.", { id: "payment-verify" });
        } catch (err: any) {
          toast.error(err.message || "Could not verify payment.", { id: "payment-verify" });
        }
      },
      prefill: {
        name: session.user.user_metadata?.full_name || "",
        email: session.user.email || "",
      },
      theme: { color: isDark ? "#6d28d9" : "#8b5cf6" },
      modal: {
        ondismiss: () => toast.info("Payment cancelled."),
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  const renderPrice = (fee: string | null, offer: string | null) => {
    const feeNum = fee ? Number(fee) : 0;
    const offerNum = offer ? Number(offer) : 0;

    if (!feeNum && !offerNum) {
      return <span className="text-emerald-500 font-bold">Free</span>;
    }
    if (feeNum && !offerNum) {
      return <span className="text-card-foreground font-bold">₹{fee}</span>;
    }
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
          {session ? (
            <div className="flex items-center gap-3 sm:gap-4 pl-3 sm:pl-5 sm:border-l border-border/50">
              <div className="hidden sm:flex flex-col items-start min-w-[80px]">
                <span className="text-[13px] font-semibold text-foreground leading-none mb-1">
                  {session.user.user_metadata?.full_name || "Student"}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none truncate max-w-[140px]">
                  {session.user.email}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="group flex items-center gap-2 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive hover:shadow-sm"
                title="Log out"
              >
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden md:inline text-[11px] font-bold uppercase tracking-wider">Log out</span>
              </button>
            </div>
          ) : (
            <button onClick={() => { setAuthMode("register"); setShowRegistration(true); }} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-primary/30 md:px-5 flex items-center gap-1.5">
              <User className="w-4 h-4 md:hidden" />
              <span className="hidden md:inline">Login / Register</span>
              <span className="md:hidden">Login</span>
            </button>
          )}
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
                               onClick={() => handleBuyCourse(course)}
                               className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/85 px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98]"
                             >
                               <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                                 Buy Course
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

      {/* ───── Auth Modal ───── */}
      <AnimatePresence>
        {showRegistration && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center sm:items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowRegistration(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md rounded-2xl border border-border/50 bg-background p-3.5 sm:p-5 shadow-2xl my-6 sm:my-8 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowRegistration(false)} 
                className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {!authSuccess && (
                <div className="mb-2 text-center pt-1">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {authMode === "register" ? "Create an Account" : 
                     authMode === "forgot-password" ? "Reset Password" :
                     "Welcome Back"}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0 px-2 line-clamp-1">
                    {authMode === "register" ? "Join us to access exclusive programs" : 
                     authMode === "forgot-password" ? "Enter your email for a reset link" :
                     "Sign in to access your programs"}
                  </p>
                </div>
              )}

              {authSuccess ? (
                <div className="space-y-6 pt-2 pb-1 animate-in fade-in zoom-in duration-500">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center shadow-inner">
                      <Mail className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">Check your inbox</h3>
                      <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                        We've sent a verification link to
                        <span className="block font-medium text-foreground mt-1.5 px-3 py-1.5 bg-muted/50 rounded-lg">{email}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex flex-col gap-3">
                    <button 
                      onClick={() => { setShowRegistration(false); setAuthSuccess(false); }}
                      className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-primary/30 active:translate-y-0"
                    >
                      Got it, Thanks!
                    </button>
                    <button 
                      onClick={() => setAuthSuccess(false)}
                      className="w-full rounded-xl bg-transparent border border-muted-foreground/20 py-3 text-sm font-medium text-foreground/80 transition-all hover:bg-muted hover:text-foreground hover:border-transparent"
                    >
                      Back to sign in
                    </button>
                  </div>
                  <p className="text-center text-xs text-muted-foreground/60">
                    Didn't receive the email? Check your spam folder.
                  </p>
                </div>
              ) : (
                <>
                  {/* Tab Switcher */}
                  {authMode !== "forgot-password" && (
                    <div className="flex bg-muted p-1.5 rounded-xl mb-4">
                      <button
                        onClick={() => setAuthMode("register")}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === "register" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Register
                      </button>
                      <button
                        onClick={() => setAuthMode("login")}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === "login" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Login
                      </button>
                    </div>
                  )}

                  <form className="space-y-3.5" onSubmit={handleAuth}>
                    {authMode === "register" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-foreground">Full Name</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required 
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Full Name" 
                              className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-foreground">Phone Number</label>
                          <div className="flex gap-2">
                            <div className="relative w-[52px] shrink-0">
                              <input 
                                type="text" 
                                required 
                                value={countryCode}
                                onChange={(e) => {
                                  let val = e.target.value;
                                  if (!val.startsWith('+')) val = '+' + val.replace(/\D/g, '');
                                  setCountryCode(val.slice(0, 5));
                                }}
                                placeholder="+91" 
                                className="w-full text-center rounded-xl border border-border bg-background py-2.5 px-0 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground font-medium" 
                              />
                            </div>
                            <div className="relative flex-1">
                              <input 
                                type="tel" 
                                required 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="Phone Number" 
                                className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}


                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">Email</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address" 
                          className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground" 
                        />
                      </div>
                    </div>
                    
                    {authMode !== "forgot-password" && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-foreground">Password</label>
                          {/* authMode === "login" && (
                            <button 
                              type="button"
                              onClick={() => setAuthMode("forgot-password")}
                              className="text-[10px] font-semibold text-primary hover:underline transition-all"
                            >
                              Forgot Password?
                            </button>
                          ) */}
                        </div>
                        <div className="relative">
                          <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password" 
                            className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground" 
                          />
                        </div>
                      </div>
                    )}

                    {authMode === "register" && (
                      <div className="relative" ref={roleDropdownRef}>
                        <label className="mb-1 block text-xs font-medium text-foreground text-left">I am a...</label>
                        <button
                          type="button"
                          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                          className={`flex items-center justify-between w-full py-2.5 rounded-xl border bg-background px-3.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            isRoleDropdownOpen ? "border-primary/40 ring-2 ring-primary/20 shadow-sm" : "border-border hover:border-primary/20"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {selectedRole ? (
                              <span className="text-foreground truncate font-medium">
                                {roles.find((r) => r.value === selectedRole)?.label}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Select your role</span>
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {isRoleDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.98 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute bottom-full mb-2 left-0 right-0 rounded-2xl border border-border/50 bg-background shadow-2xl p-1.5 z-[100]"
                            >
                              {roles.map((role) => (
                                <button
                                  key={role.value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedRole(role.value);
                                    setIsRoleDropdownOpen(false);
                                  }}
                                  className={`flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm transition-all ${
                                    selectedRole === role.value
                                      ? "bg-primary/10 text-primary font-semibold"
                                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                  }`}
                                >
                                  <span className="flex-1 text-left">{role.label}</span>
                                  {selectedRole === role.value && (
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    <button 
                      disabled={isAuthLoading} 
                      type="submit" 
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {isAuthLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                       authMode === "register" ? "Create Account" : 
                       authMode === "forgot-password" ? "Send Recovery Link" :
                       "Sign In"
                      )}
                    </button>

                    {authMode === "forgot-password" && (
                      <button 
                        type="button" 
                        onClick={() => { setAuthMode("login"); }}
                        className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-primary transition-all pb-2"
                      >
                        Back to Login
                      </button>
                    )}

                    {authMode === "register" && (
                      <p className="text-center text-[11px] text-muted-foreground">
                        By signing up, you agree to our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
                      </p>
                    )}
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiTestPrograms;
