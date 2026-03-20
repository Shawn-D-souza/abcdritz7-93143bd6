
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Clock, Users, Star, ArrowRight, Sparkles,
  BookOpen, Brain, Code, Rocket, Zap, GraduationCap,
  TrendingUp, X, Menu, User, Mail, Phone,
  SlidersHorizontal, ArrowUpDown, Check, ChevronDown, Briefcase, Laptop
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

// ── Types ──
type CourseCategory = "all" | "ai" | "no-code" | "automation" | "bootcamp";
type SortOption = "popular" | "rating" | "price-low" | "price-high" | "newest";

interface Course {
  id: string;
  title: string;
  description: string;
  categories: CourseCategory[];
  duration: string;
  students: number;
  rating: number;
  image: string;
  tags: string[];
  price: string;
  priceNum: number;
}

// ── Icon map (shared between tabs & cards) ──
const categoryIcons: Record<string, React.ReactNode> = {
  all: <GraduationCap className="w-4 h-4" />,
  ai: <Brain className="w-4 h-4" />,
  "no-code": <Code className="w-4 h-4" />,
  automation: <Zap className="w-4 h-4" />,
  bootcamp: <Rocket className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  trending: <TrendingUp className="w-4 h-4" />,
};

// ── Data ──
const categoryList: { value: CourseCategory; label: string }[] = [
  { value: "all", label: "All Programs" },
  { value: "ai", label: "AI & ML" },
  { value: "no-code", label: "No-Code" },
  { value: "automation", label: "Automation" },
  { value: "bootcamp", label: "Bootcamps" },
];

const courses: Course[] = [
  {
    id: "1",
    title: "AI Mastery Bootcamp",
    description: "Master ChatGPT, Midjourney, and enterprise AI workflows. Build real projects and deploy AI solutions.",
    categories: ["bootcamp", "ai"],
    duration: "12 Weeks",
    students: 2400,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    tags: ["ChatGPT", "Midjourney", "AI Workflows"],
    price: "₹3,999",
    priceNum: 3999,
  },
  {
    id: "2",
    title: "No-Code App Development",
    description: "Build full-stack applications without code. Master Bubble, Glide, and other leading platforms.",
    categories: ["no-code"],
    duration: "8 Weeks",
    students: 1850,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    tags: ["Bubble", "Glide", "Webflow"],
    price: "₹2,499",
    priceNum: 2499,
  },
  {
    id: "3",
    title: "n8n Automation Masterclass",
    description: "From simple workflows to complex integrations — become an automation expert with n8n.",
    categories: ["automation"],
    duration: "6 Weeks",
    students: 1200,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&q=80",
    tags: ["n8n", "Zapier", "Make"],
    price: "₹1,999",
    priceNum: 1999,
  },
  {
    id: "4",
    title: "Prompt Engineering Pro",
    description: "Master advanced prompting techniques for GPT-4, Claude, and Gemini models.",
    categories: ["ai"],
    duration: "4 Weeks",
    students: 3100,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
    tags: ["GPT-4", "Claude", "Gemini"],
    price: "₹999",
    priceNum: 999,
  },
  {
    id: "5",
    title: "AI for Entrepreneurs",
    description: "Leverage AI to scale your business — from content and customer service to product strategy.",
    categories: ["ai", "automation"],
    duration: "10 Weeks",
    students: 980,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
    tags: ["Business AI", "Strategy", "Scaling"],
    price: "₹4,499",
    priceNum: 4499,
  },
  {
    id: "6",
    title: "Full-Stack AI Developer",
    description: "The ultimate career switch — combine no-code, AI, and automation into one powerhouse skill set.",
    categories: ["bootcamp", "ai", "no-code", "automation"],
    duration: "16 Weeks",
    students: 650,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    tags: ["Full-Stack", "AI", "Career Switch"],
    price: "₹4,999",
    priceNum: 4999,
  },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
];

// Dynamic search suggestions from all course tags
const allTags = Array.from(new Set(courses.flatMap((c) => c.tags)));

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

  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

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
      case "newest": result.sort((a, b) => +b.id - +a.id); break;
    }
    return result;
  }, [activeCategory, searchQuery, sortBy]);

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
              {searchFocused && !searchQuery && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border/60 bg-background shadow-xl p-3 z-50">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2 px-1">Popular</p>
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
          <button onClick={() => setShowRegistration(true)} className="hidden md:block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-primary/30">
            Get Started
          </button>
          <button className="p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ───── Mobile menu ───── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed inset-x-0 top-16 z-40 border-b border-border/50 bg-background/95 p-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-2">
              <div className="relative mb-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search programs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-border/60 bg-muted/40 py-3 pl-10 pr-10 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground" />
                {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground"><X className="w-3.5 h-3.5" /></button>}
              </div>
              {categoryList.map((cat) => (
                <button key={cat.value} onClick={() => { setActiveCategory(cat.value); setMobileMenuOpen(false); }} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeCategory === cat.value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                  {categoryIcons[cat.value]}
                  {cat.label}
                </button>
              ))}
              <button onClick={() => { setShowRegistration(true); setMobileMenuOpen(false); }} className="mt-3 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── Main ───── */}
      <main className="pt-16">
        {/* Sticky filter bar */}
        <section className="sticky top-16 z-30 border-b border-border/30 bg-background/90 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 py-3">
              {/* Scrollable category pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                {categoryList.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeCategory === cat.value
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {categoryIcons[cat.value]}
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort + count — outside overflow */}
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
                        className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/15 dark:shadow-black/40 p-1.5 z-50"
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
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
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
                    {categoryIcons[activeCategory]}
                    {categoryList.find(c => c.value === activeCategory)?.label}
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
                      {/* Image */}
                      <div className="relative aspect-[2.2/1] overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Category pills with icon + label */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                          {course.categories.map((cat) => {
                            const catData = categoryList.find(c => c.value === cat);
                            return catData ? (
                              <button
                                key={cat}
                                onClick={(e) => { e.stopPropagation(); setActiveCategory(cat); }}
                                className="flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/60 transition-all shadow-md"
                              >
                                {categoryIcons[cat]}
                                {catData.label}
                              </button>
                            ) : null;
                          })}
                        </div>


                      </div>

                      {/* Content — compact */}
                      <div className="p-4 pb-3">
                        <h3 className="text-[15px] font-bold text-card-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 mb-2">
                          {course.description}
                        </p>

                        {/* Tags + meta — single compact row */}
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

                        {/* Footer — price + enroll */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                          <span className="text-base font-bold text-card-foreground">{course.price}</span>
                          <button
                            onClick={() => setShowRegistration(true)}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/85 px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] group/btn"
                          >
                            <span className="relative z-10 flex items-center gap-1.5">
                              Enroll Now <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
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
        </section>
      </main>

      {/* ───── Footer ───── */}
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

      {/* ───── Registration Modal (responsive + scrollable) ───── */}
      <AnimatePresence>
        {showRegistration && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowRegistration(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-border/50 bg-background p-5 sm:p-7 shadow-2xl my-4 mx-4 sm:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowRegistration(false)} className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10">
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 sm:mb-5 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Get Started</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Create your account to enroll</p>
              </div>

              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="John Doe" className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" placeholder="john@example.com" className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="tel" placeholder="+91 98765 43210" className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div className="relative" ref={roleDropdownRef}>
                  <label className="mb-1 block text-xs font-medium text-foreground text-left">I am a...</label>
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className={`flex items-center justify-between w-full h-11 rounded-xl border bg-background px-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      isRoleDropdownOpen ? "border-primary/40 ring-2 ring-primary/20 shadow-sm" : "border-border hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {selectedRole ? (
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                            {roles.find((r) => r.value === selectedRole)?.icon}
                          </div>
                          <span className="text-foreground truncate font-medium">
                            {roles.find((r) => r.value === selectedRole)?.label}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <User className="w-4 h-4 shrink-0" />
                          <span>Select your role</span>
                        </div>
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
                            className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm transition-all ${
                              selectedRole === role.value
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                              selectedRole === role.value ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                              {role.icon}
                            </div>
                            <span className="flex-1 text-left">{role.label}</span>
                            {selectedRole === role.value && (
                              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/20">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/85 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]">Create Account</button>
                <p className="text-center text-[11px] text-muted-foreground">
                  By signing up, you agree to our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Programs;
