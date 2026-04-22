import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Background3D } from "@/components/Background3D";
import { CustomCursor } from "@/components/CustomCursor";
import { WallOfLove } from "@/components/WallOfLove";
import { Programs } from "@/components/Programs";
import { AboutUs } from "@/components/AboutUs";
import { Journey1000Days } from "@/components/Journey1000Days";
import { BookConsultation } from "@/components/BookConsultation";
import { TeamMembers } from "@/components/TeamMembers";
import { Blogs } from "@/components/Blogs";
import { FAQ } from "@/components/FAQ";
import { ContactAndNewsletter } from "@/components/ContactAndNewsletter";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useSEO({
    title: "Ritz7 | Learn AI & No-Code Automation: n8n, Bubble, Emergent & More",
    description: "Ritz7 is a student community that makes AI and no-code accessible — learn to build real projects without writing complex code.",
    type: "website",
  });

  useEffect(() => {
    const scrollToId = location.state?.scrollTo || (location.hash ? location.hash.substring(1) : null);

    if (scrollToId) {
      setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          const navbarHeight = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
        // Clean up hash or state from URL so it doesn't get stuck
        if (location.hash || location.state?.scrollTo) {
          navigate(location.pathname + location.search, { replace: true, state: {} });
        }
      }, 100);
    }
  }, [location, navigate]);

  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground overflow-hidden">
      <CustomCursor />
      <Background3D />
      <Navbar />
      <main>
        <Hero />
        <Programs />
        <AboutUs />
        <Journey1000Days />
        <WallOfLove />
        <BookConsultation />
        <TeamMembers />
        <Blogs />
        <FAQ />
        <ContactAndNewsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
