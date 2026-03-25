import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

export const BlogHeader = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md transition-all duration-300 md:px-12">
      <div className="flex items-center gap-6">
        <a href="/" className="flex items-center transition-transform hover:scale-105">
          <img
            src={isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png"}
            alt="Ritz7 Logo"
            className="h-8 object-contain"
          />
        </a>
        <div className="hidden h-6 w-px bg-border/50 md:block" />
        <a 
          href="/" 
          className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:flex group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Website
        </a>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <a href="/" className="md:hidden flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </a>
      </div>
    </nav>
  );
};
