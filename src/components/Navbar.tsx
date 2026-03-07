import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import brandLogoBlue from "@/assets/brand_logo_blue.png";
import brandLogoBlack from "@/assets/brand_logo_black.png";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Why Us", href: "#why-us" },
  { label: "Tools", href: "#tools" },
  { label: "Milestones", href: "#milestones" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Resources", href: "#resources" },
  { label: "Blog", href: "#blog" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("abcd-theme");
      if (stored) return stored === "dark";
      return true; // default dark
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("abcd-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => !prev);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <img
            src={dark ? brandLogoBlue : brandLogoBlack}
            alt="ABCD Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display font-bold text-xl text-foreground">ABCD</span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button className="hidden sm:inline-flex" size="sm">
            Join Community
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-card border-t border-border"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button className="w-full mt-3" size="sm">
                Join Community
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
