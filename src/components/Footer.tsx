import { Youtube, Instagram, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-narrow px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">AB</span>
              </div>
              <span className="font-display font-bold text-xl text-card-foreground">ABCD</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Anybody Can Design, Develop, Deploy. Empowering the next generation of no-code builders.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-card-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#why-us" className="hover:text-primary transition-colors">Why Us</a></li>
              <li><a href="#milestones" className="hover:text-primary transition-colors">Milestones</a></li>
              <li><a href="#resources" className="hover:text-primary transition-colors">Resources</a></li>
              <li><a href="#blog" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-card-foreground">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#case-studies" className="hover:text-primary transition-colors">Case Studies</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Join Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Book a Call</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-card-foreground">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ABCD Community. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-primary" /> by the ABCD Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
