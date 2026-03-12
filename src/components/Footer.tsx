import { Youtube, Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const socials = [
  { icon: Youtube, href: "https://www.youtube.com/@ritz7ai", label: "YouTube" },
  { icon: Instagram, href: "https://www.instagram.com/abcdbyritz7/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/showcase/abcd-by-ritz7/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/abcdbyritz7", label: "Twitter" },
];

export const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <img
              src={isDark ? "/assets/Ritz7_logo_dark.png" : "/assets/Ritz7_logo_light.png"}
              alt="Ritz7 Logo"
              className="h-10 w-fit object-contain"
            />
            <p className="text-sm text-muted-foreground">
              Empowering the next generation of no-code & AI builders.
            </p>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-foreground">Socials</h4>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] dark:border-white/10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-foreground">Contact Us</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:abcd@ritz7.com" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4" />
                abcd@ritz7.com
              </a>
              <a href="tel:+917019986530" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Phone className="h-4 w-4" />
                +91-701-998-6530
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <div className="flex flex-col gap-2">
              <a href="/privacy-policy" className="text-sm text-muted-foreground transition-colors hover:text-primary">Privacy Policy</a>
              <a href="/community-guidelines" className="text-sm text-muted-foreground transition-colors hover:text-primary">Community Guidelines</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border/40 pt-6 text-center dark:border-white/10">
          <p className="text-xs text-muted-foreground">
            © 2026. Ritz7 Automations Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
