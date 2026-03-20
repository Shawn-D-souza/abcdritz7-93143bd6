import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Clock, Users, Star, ArrowRight, Sparkles,
  BookOpen, Brain, Code, Rocket, Zap, GraduationCap,
  ChevronDown, Play, Award, TrendingUp, X, Menu,
  User, Mail, Phone, ChevronRight
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

// ── Types ──
type CourseCategory = "all" | "ai" | "no-code" | "automation" | "bootcamp";
type CourseLevel = "beginner" | "intermediate" | "advanced";

interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: string;
  students: number;
  rating: number;
  image: string;
  tags: string[];
  icon: React.ReactNode;
  gradient: string;
  isFeatured?: boolean;
  price: string;
  originalPrice?: string;
}

// ── Data ──
const categories: { value: CourseCategory; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All Programs", icon: <Sparkles className="w-4 h-4" /> },
  { value: "ai", label: "AI & ML", icon: <Brain className="w-4 h-4" /> },
  { value: "no-code", label: "No-Code", icon: <Code className="w-4 h-4" /> },
  { value: "automation", label: "Automation", icon: <Zap className="w-4 h-4" /> },
  { value: "bootcamp", label: "Bootcamps", icon: <Rocket className="w-4 h-4" /> },
];

const courses: Course[] = [
  {
    id: "1",
    title: "AI Mastery Bootcamp",
    description: "A comprehensive 12-week program covering ChatGPT, Midjourney, and enterprise AI workflows. Build real projects and deploy AI solutions.",
    category: "bootcamp",
    level: "beginner",
    duration: "12 Weeks",
    students: 2400,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    tags: ["ChatGPT", "Midjourney", "AI Workflows"],
    icon: <Brain className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-600",
    isFeatured: true,
    price: "₹14,999",
    originalPrice: "₹24,999",
  },
  {
    id: "2",
    title: "No-Code App Development",
    description: "Learn to build full-stack applications without writing code. Master Bubble, Glide, and other leading platforms.",
    category: "no-code",
    level: "beginner",
    duration: "8 Weeks",
    students: 1850,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    tags: ["Bubble", "Glide", "Webflow"],
    icon: <Code className="w-5 h-5" />,
    gradient: "from-blue-500 to-cyan-500",
    price: "₹9,999",
    originalPrice: "₹16,999",
  },
  {
    id: "3",
    title: "n8n Automation Masterclass",
    description: "Automate everything with n8n. From simple workflows to complex enterprise integrations — become an automation expert.",
    category: "automation",
    level: "intermediate",
    duration: "6 Weeks",
    students: 1200,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&q=80",
    tags: ["n8n", "Zapier", "Make"],
    icon: <Zap className="w-5 h-5" />,
    gradient: "from-orange-500 to-red-500",
    price: "₹7,999",
  },
  {
    id: "4",
    title: "Prompt Engineering Pro",
    description: "Master the art of communicating with AI. Learn advanced prompting for GPT-4, Claude, and Gemini models.",
    category: "ai",
    level: "beginner",
    duration: "4 Weeks",
    students: 3100,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
    tags: ["GPT-4", "Claude", "Gemini"],
    icon: <Sparkles className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-500",
    isFeatured: true,
    price: "₹4,999",
    originalPrice: "₹8,999",
  },
  {
    id: "5",
    title: "AI for Entrepreneurs",
    description: "Leverage AI to scale your business. From content to customer service to product — implement AI across your organization.",
    category: "ai",
    level: "intermediate",
    duration: "10 Weeks",
    students: 980,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
    tags: ["Business AI", "Strategy", "Scaling"],
    icon: <TrendingUp className="w-5 h-5" />,
    gradient: "from-amber-500 to-orange-500",
    price: "₹19,999",
    originalPrice: "₹29,999",
  },
  {
    id: "6",
    title: "Full-Stack AI Developer",
    description: "The ultimate career transformation. Combine no-code, AI, and automation to become a full-stack AI developer in 16 weeks.",
    category: "bootcamp",
    level: "advanced",
    duration: "16 Weeks",
    students: 650,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    tags: ["Full-Stack", "AI", "Career Switch"],
    icon: <Rocket className="w-5 h-5" />,
    gradient: "from-pink-500 to-rose-500",
    isFeatured: true,
    price: "₹29,999",
    originalPrice: "₹49,999",
  },
];

const levelColors: Record<CourseLevel, string> = {
  beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

// ── Page Component ──
const Programs = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredCourse = courses.find((c) => c.isFeatured && c.category === "bootcamp");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl md:px-12">
        <a href="/" className="flex items-center gap-2 group">
          <img
            src={isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png"}
            alt="Ritz7 Logo"
            className="h-9 object-contain transition-all duration-300 group-hover:scale-105"
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {categories.slice(1).map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-sm font-medium transition-colors ${
                activeCategory === cat.value ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setShowRegistration(true)}
            className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-primary/30 md:block"
          >
            Get Started
          </button>
          <button className="p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-border/50 bg-background/95 p-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => { setActiveCategory(cat.value); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    activeCategory === cat.value
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
              <button
                onClick={() => { setShowRegistration(true); setMobileMenuOpen(false); }}
                className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {courses.length}+ Programs • {courses.reduce((a, c) => a + c.students, 0).toLocaleString()}+ Learners
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Master the Future with{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
                AI & No-Code
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Industry-ready programs designed by practitioners. From crash courses to career-transforming bootcamps — find the perfect program for your journey.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 max-w-xl mx-auto"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="Search programs, topics, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-border/60 bg-background/80 py-4 pl-12 pr-4 text-sm backdrop-blur-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Category Filters (Desktop) ── */}
      <section className="sticky top-16 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              {filteredCourses.length} program{filteredCourses.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Course Banner ── */}
      {featuredCourse && activeCategory === "all" && !searchQuery && (
        <section className="container mx-auto px-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${featuredCourse.gradient} p-8 md:p-12`}
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white mb-4">
                  <Award className="w-3.5 h-3.5" />
                  Featured Program
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{featuredCourse.title}</h2>
                <p className="text-white/80 mb-6 leading-relaxed">{featuredCourse.description}</p>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-white/90 text-sm">
                    <Clock className="w-4 h-4" /> {featuredCourse.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/90 text-sm">
                    <Users className="w-4 h-4" /> {featuredCourse.students.toLocaleString()}+ enrolled
                  </span>
                  <span className="flex items-center gap-1.5 text-yellow-300 text-sm">
                    <Star className="w-4 h-4 fill-yellow-300" /> {featuredCourse.rating}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-gray-900 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    Enroll Now — {featuredCourse.price}
                  </button>
                  {featuredCourse.originalPrice && (
                    <span className="text-white/50 line-through text-sm">{featuredCourse.originalPrice}</span>
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img src={featuredCourse.image} alt={featuredCourse.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-110">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── Course Grid ── */}
      <section className="container mx-auto px-4 py-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Level badge */}
                  <div className={`absolute top-3 left-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${levelColors[course.level]}`}>
                    {course.level}
                  </div>

                  {course.isFeatured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-yellow-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-950 backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </div>
                  )}

                  {/* Icon overlay */}
                  <div className={`absolute bottom-3 right-3 rounded-xl bg-gradient-to-br ${course.gradient} p-2.5 text-white shadow-lg`}>
                    {course.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students.toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3.5 h-3.5 fill-yellow-500" /> {course.rating}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border/40 pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-card-foreground">{course.price}</span>
                      {course.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">{course.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowRegistration(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      Enroll <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No programs found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-10 md:p-14 text-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-[80px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Not sure which program is right for you?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Book a free 15-minute consultation with our learning advisors. We'll help you pick the perfect path.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowRegistration(true)}
                className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-xl transition-all hover:scale-105"
              >
                Get Started Free
              </button>
              <a
                href="https://wa.me/message/RVQXUI35RJO4J1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-white/10"
              >
                Talk to an Advisor <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img
              src={isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png"}
              alt="Ritz7"
              className="h-6 object-contain"
            />
            <span>© {new Date().getFullYear()} Ritz7 AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/community-guidelines" className="hover:text-foreground transition-colors">Guidelines</a>
          </div>
        </div>
      </footer>

      {/* ── Registration Modal ── */}
      <AnimatePresence>
        {showRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowRegistration(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md rounded-3xl border border-border/50 bg-background p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowRegistration(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Get Started</h3>
                <p className="text-sm text-muted-foreground mt-1">Create your account to enroll in programs</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">I am a...</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Student", "Entrepreneur", "Working Professional", "Educator"].map((role) => (
                      <label
                        key={role}
                        className="group flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm transition-all hover:border-primary/40 hover:bg-primary/5 has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                      >
                        <input type="radio" name="role" value={role} className="sr-only" />
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/40 transition-all group-has-[:checked]:border-primary group-has-[:checked]:bg-primary group-has-[:checked]:shadow-[inset_0_0_0_2px_white]" />
                        <span className="text-muted-foreground group-has-[:checked]:text-foreground">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Account
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
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
