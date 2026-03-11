import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type NavItem = {
  name: string;
  href?: string;
  isExternal?: boolean;
  dropdown?: { label: string; href: string; isExternal?: boolean }[];
};

const navItems: NavItem[] = [
  {
    name: "Student Success",
    href: "#learner-achievements",
  },
  {
    name: "Programs",
    href: "#programs",
  },
  {
    name: "About Us",
    dropdown: [
      { label: "Why We Started", href: "#why-we-started" },
      { label: "1000 Days Journey & Milestones", href: "#journey-milestones" },
      { label: "The Team", href: "#the-team" },
    ],
  },
  {
    name: "Resources",
    dropdown: [
      { label: "Blogs", href: "#blogs" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
];

export const Navbar = () => {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = (name: string) => setOpenDropdown(openDropdown === name ? null : name);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isExternal?: boolean) => {
    if (isExternal || !href.startsWith("#")) return;
    
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      const navbarHeight = 64; // h-16 = 4rem = 64px
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-black/20 md:px-12">
      {/* Left: Logo */}
      <div className="flex h-full items-center">
        <a href="/" className="flex items-center">
          <img
            src={isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png"}
            alt="Ritz7 Logo"
            className="h-10 object-contain transition-all duration-300 hover:scale-105"
          />
        </a>
      </div>

      {/* Middle: Nav Items */}
      <div className="hidden h-full items-center lg:flex lg:gap-4 xl:gap-8">
        {navItems.map((item) => (
          <div key={item.name} className="group relative flex h-full cursor-pointer items-center">
            {item.href ? (
              <a
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href!, item.isExternal)}
                {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.name}
              </a>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors group-hover:text-primary">
                  {item.name}
                  <ChevronDown className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:rotate-180 group-hover:opacity-100" />
                </div>
                
                {/* Dropdown Menu Container */}
                <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 translate-y-3 pt-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  {/* Invisible bridge to keep hover state active */}
                  <div className="absolute -top-4 left-0 h-4 w-full bg-transparent" />
                  
                  <div className="flex w-52 flex-col gap-1 rounded-2xl border border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
                    {item.dropdown?.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        onClick={(e) => handleScrollTo(e, subItem.href, subItem.isExternal)}
                        {...(subItem.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/70 transition-all hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                      >
                        {subItem.label}
                        {subItem.isExternal && (
                          <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 lg:gap-4 xl:gap-6">
        <ThemeToggle />
        <a href="#" className="hidden whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary lg:block">
          Book Consultation
        </a>
        <a href="https://wa.me/message/RVQXUI35RJO4J1" target="_blank" rel="noopener noreferrer" className="hidden whitespace-nowrap rounded-full bg-[#0756B1] px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#064a97] hover:shadow-[0_0_20px_rgba(7,86,177,0.4)] lg:block xl:px-6 xl:py-2.5">
          Join the Community
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="ml-1 block p-2 text-foreground/80 transition-colors hover:text-primary lg:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full max-h-[calc(100vh-4rem)] w-full overflow-y-auto border-b border-border/40 bg-background/95 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-black/95 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.name} className="flex flex-col border-b border-border/20 pb-4 dark:border-white/10 last:border-0 hover:border-transparent">
                {item.href ? (
                  <a
                    href={item.href}
                    {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center justify-between text-base font-medium text-foreground/80 transition-colors hover:text-primary"
                    onClick={(e) => {
                      handleScrollTo(e, item.href!, item.isExternal);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </a>
                ) : (
                  <>
                    <button
                      className="flex items-center justify-between text-base font-medium text-foreground/80 transition-colors hover:text-primary"
                      onClick={() => toggleDropdown(item.name)}
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${openDropdown === item.name ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.name && item.dropdown && (
                      <div className="mt-4 flex flex-col gap-1 pl-2">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            {...(subItem.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition-all hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                            onClick={(e) => {
                              handleScrollTo(e, subItem.href, subItem.isExternal);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {subItem.label}
                            {subItem.isExternal && <ExternalLink className="h-3.5 w-3.5 opacity-60" />}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            
            <a href="#" className="mt-2 text-base font-medium text-foreground/80 transition-colors hover:text-primary">
              Book Consultation
            </a>
            <a href="https://wa.me/message/RVQXUI35RJO4J1" target="_blank" rel="noopener noreferrer" className="mt-4 w-full rounded-full bg-[#0756B1] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#064a97] hover:shadow-[0_0_20px_rgba(7,86,177,0.4)]">
              Join the Community
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};


