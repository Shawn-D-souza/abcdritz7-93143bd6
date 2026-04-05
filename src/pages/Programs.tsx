import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Clock, Users, Star, ArrowRight, Sparkles,
  BookOpen, Brain, Code, Rocket, Zap, GraduationCap,
  TrendingUp, X, User, Mail, Phone, Lock, LogOut,
  SlidersHorizontal, ArrowUpDown, Check, ChevronDown, Briefcase, Laptop, LayoutGrid, Loader2
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabase";
import { loadRazorpay } from "@/lib/razorpay";
import { mockFetchProgramsData, LMSCourse, LMSCategory } from "@/services/mockApi";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

// ── Types ──
type SortOption = "popular" | "rating" | "price-low" | "price-high" | "newest";

interface Course {
  id: string;
  title: string;
  description: string;
  categories: string[];
  duration: string;
  students: number;
  rating: number;
  image: string;
  tags: string[];
  price: string;
  priceNum: number;
  lmsData: LMSCourse;
}


const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
];

// ── Role Options ──
const roles = [
  { value: "student", label: "Student", icon: <GraduationCap className="w-4 h-4" /> },
  { value: "working-professional", label: "Working Professional", icon: <Briefcase className="w-4 h-4" /> },
  { value: "entrepreneur", label: "Entrepreneur / Business Owner", icon: <Rocket className="w-4 h-4" /> },
  { value: "freelancer", label: "Freelancer / Consultant", icon: <Laptop className="w-4 h-4" /> },
  { value: "educator", label: "Teacher / Educator", icon: <BookOpen className="w-4 h-4" /> },
  { value: "other", label: "Other", icon: <User className="w-4 h-4" /> },
];

// ── Component ──
const Programs = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [session, setSession] = useState<Session | null>(null);
  
  // Dynamic LMS Data
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<LMSCategory[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const [showRegistration, setShowRegistration] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot-password">("register");
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Initialize Auth & Data
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
    
    // Fetch dynamic programs mapping from LMS API mock
    const loadProgramsData = async () => {
      try {
        const payload = await mockFetchProgramsData();
        setCategories(payload.categories);
        setAllTags(payload.tags);

        const mappedCourses: Course[] = payload.courses.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          categories: c.category_names,
          duration: c.duration,
          students: c.students_count,
          rating: c.average_rating,
          image: c.thumbnail_url,
          tags: c.tags,
          price: "₹" + c.price_inr.toLocaleString("en-IN"),
          priceNum: c.price_inr,
          lmsData: c
        }));
        setCourses(mappedCourses);
      } catch (e) {
        toast.error("Failed to load programs, please check your connection.");
      } finally {
        setIsLoadingCourses(false);
      }
    };
    loadProgramsData();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasActiveFilters = activeCategory !== "all" || searchQuery !== "";

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let result = courses.filter((c) => {
      const matchCat = activeCategory === "all" || c.categories.includes(activeCategory);
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
    switch (sortBy) {
      case "popular": result.sort((a, b) => b.students - a.students); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "price-low": result.sort((a, b) => a.priceNum - b.priceNum); break;
      case "price-high": result.sort((a, b) => b.priceNum - a.priceNum); break;
      case "newest": result.sort((a, b) => b.id.localeCompare(a.id)); break;
    }
    return result;
  }, [activeCategory, searchQuery, sortBy, courses]);

  // Auth Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthLoading) return;
    setIsAuthLoading(true);
    
    try {
      if (authMode === "register") {
        // Validation for phone number
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
        
        // Commenting out email confirmation flow
        // setAuthSuccess(true);
        // toast.success("Verification email sent!");
        
        // Directly log in the user
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (!loginError) {
          toast.success("Account created and logged in successfully!");
          setShowRegistration(false);
        } else {
          // Fallback if login fails or confirmation is somehow still required
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

  // Payment + Webhook Handler
  const handleCheckout = async (course: Course) => {
    if (!session) {
      toast.info("Please login to enroll in this course.");
      setAuthMode("register");
      setShowRegistration(true);
      return;
    }

    const { lmsData } = course;
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Security Notice: The frontend NEVER calls the webhook URL directly for actual processing.
    // Instead the frontend sends the Razorpay payment confirmation to our Supabase Edge function,
    // which in turn verifies the payment and securely acts upon the webhook.
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_YOUR_KEY", 
      amount: lmsData.price_inr * 100, // Amount in paise
      currency: "INR",
      name: "Ritz7 Programs",
      description: `Enroll in ${lmsData.title}`,
      image: isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png",
      handler: async function (response: any) {
        toast.success(`Payment Authorised! Verifying...`);
        
        try {
          // SECURE BACKEND VERIFICATION FLOW:
          // 1. You send 'response.razorpay_payment_id' to your backend.
          // 2. Your backend does: "razorpay.payments.fetch(payment_id)" using the SECRET key
          // 3. The backend then makes the secure request to the LMS API for creating an enrollment
          
          /*
          const res = await fetch('YOUR_SUPABASE_EDGE_FUNCTION/verify-payment', {
            method: 'POST',
            body: JSON.stringify({
              payment_id: response.razorpay_payment_id,
              course_id: lmsData.id,
              user_email: session.user.email,
            })
          });
          const result = await res.json()
          */

          // Since we are mocking right now:
          await new Promise(r => setTimeout(r, 1000));
          toast.success("Payment verified and enrolled successfully!");
          window.location.href = `/dashboard?course_id=${lmsData.id}`;
        } catch (err) {
          toast.error("Could not verify the secure enrollment.");
        }
      },
      prefill: {
        name: session.user.user_metadata?.full_name || "",
        email: session.user.email || "",
      },
      theme: { color: isDark ? "#6d28d9" : "#8b5cf6" },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 md:px-8 lg:px-12">
        <a href="/" className="shrink-0 group">
          <img
            src={isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png"}
            alt="Ritz7"
            className="h-9 object-contain transition-transform group-hover:scale-105"
          />
        </a>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8" ref={searchRef}>
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search programs, topics, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full rounded-xl border border-border/60 bg-muted/40 py-2.5 pl-10 pr-10 text-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <AnimatePresence>
              {searchFocused && !searchQuery && allTags.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border/60 bg-background shadow-xl p-3 z-50">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 px-1">Popular Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((t) => (
                      <button key={t} onClick={() => { setSearchQuery(t); setSearchFocused(false); }} className="rounded-lg bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">{t}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              <span className="hidden md:inline">Enroll / Login</span>
              <span className="md:hidden">Enroll/Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* ───── Main ───── */}
      <main className="pt-16">
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

            <div className="flex items-center gap-3 py-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === "all"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  All Programs
                </button>
                {/* Dynamically render LMS categories */}
                {categories.map((catName) => (
                  <button
                    key={catName}
                    onClick={() => setActiveCategory(catName)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeCategory === catName
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {catName}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="relative" ref={sortRef}>
                  <button
                     onClick={() => setShowSortMenu(!showSortMenu)}
                     className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
                       showSortMenu
                         ? "border-primary/40 bg-primary/5 text-primary shadow-sm"
                         : "border-border/60 bg-card text-foreground hover:border-primary/30 hover:shadow-sm"
                     }`}
                   >
                     <ArrowUpDown className="w-3.5 h-3.5" />
                     <span className="hidden sm:inline">{sortOptions.find(s => s.value === sortBy)?.label}</span>
                     <svg className={`w-3 h-3 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                     </svg>
                   </button>
                   <AnimatePresence>
                     {showSortMenu && (
                       <motion.div
                         initial={{ opacity: 0, y: 6, scale: 0.96 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 6, scale: 0.96 }}
                         transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                         className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/15 p-1.5 z-50"
                       >
                         <p className="px-3 pt-2 pb-1.5 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Sort by</p>
                         {sortOptions.map((opt) => (
                           <button
                             key={opt.value}
                             onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                             className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                               sortBy === opt.value
                                 ? "text-primary bg-primary/8 font-medium"
                                 : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                             }`}
                           >
                             <span>{opt.label}</span>
                             {sortBy === opt.value && (
                               <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15"><Check className="w-3 h-3 text-primary" /></div>
                             )}
                           </button>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
                 <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline tabular-nums">
                   {filteredCourses.length} result{filteredCourses.length !== 1 ? "s" : ""}
                 </span>
              </div>
            </div>
          </div>
        </section>

        {/* Active filter chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="border-b border-border/20 bg-muted/20">
              <div className="container mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                {activeCategory !== "all" && (
                  <button onClick={() => setActiveCategory("all")} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-all">
                    {activeCategory}
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                )}
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 transition-all">
                    "{searchQuery}"
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                )}
                <button onClick={() => { setActiveCategory("all"); setSearchQuery(""); }} className="ml-auto text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0">Clear all</button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ───── Course Grid ───── */}
        <section className="container mx-auto px-4 py-5 pb-12">
          {isLoadingCourses ? (
             <div className="py-20 text-center flex flex-col items-center">
                 <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                 <p className="text-base font-medium text-muted-foreground">Loading LMS Programs...</p>
             </div>
          ) : (
             <AnimatePresence mode="wait">
             <motion.div key={`${activeCategory}-${searchQuery}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
               {filteredCourses.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {filteredCourses.map((course, i) => (
                     <motion.div
                       key={course.id}
                       initial={{ opacity: 0, y: 12 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.25, delay: i * 0.05 }}
                       className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
                     >
                       <div className="relative aspect-[2.2/1] overflow-hidden">
                         <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                         <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                           {course.categories.map((catName) => {
                             return (
                               <button
                                 key={catName}
                                 onClick={(e) => { e.stopPropagation(); setActiveCategory(catName); }}
                                 className="flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/60 transition-all shadow-md"
                               >
                                 {catName}
                               </button>
                             );
                           })}
                         </div>
                       </div>
 
                       <div className="p-4 pb-3">
                         <h3 className="text-[15px] font-bold text-card-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                           {course.title}
                         </h3>
                         <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 mb-2">
                           {course.description}
                         </p>
 
                         <div className="flex items-center justify-between gap-2">
                           <div className="flex flex-wrap gap-1 min-w-0">
                             {course.tags.map((tag) => (
                               <span key={tag} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap" onClick={() => setSearchQuery(tag)}>
                                 {tag}
                               </span>
                             ))}
                           </div>
                           <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground shrink-0">
                             <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{course.duration}</span>
                             <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{course.students.toLocaleString()}</span>
                             <span className="flex items-center gap-0.5 text-yellow-500"><Star className="w-2.5 h-2.5 fill-yellow-500" />{course.rating}</span>
                           </div>
                         </div>
 
                         <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                           <span className="text-base font-bold text-card-foreground">{course.price}</span>
                           <button
                             onClick={() => handleCheckout(course)}
                             className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/85 px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] group/btn"
                           >
                             <span className="relative z-10 flex items-center gap-1.5">
                               {session ? "Pay & Enroll" : "Enroll Now"} <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                             </span>
                             <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                           </button>
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               ) : (
                 <div className="py-20 text-center">
                   <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                   <p className="text-base font-medium text-muted-foreground">No programs found</p>
                   <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
                   <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors">Clear all filters</button>
                 </div>
               )}
             </motion.div>
           </AnimatePresence>
          )}
        </section>
      </main>

      <footer className="border-t border-border/40 bg-muted/30 py-6">
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

export default Programs;
