import { useEffect, lazy, Suspense, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Background3D } from "@/components/Background3D";
import { CustomCursor } from "@/components/CustomCursor";
import { useSEO } from "@/hooks/useSEO";

// Lazy-load below-the-fold sections to reduce initial bundle
const WallOfLove = lazy(() => import("@/components/WallOfLove").then(m => ({ default: m.WallOfLove })));
const Programs = lazy(() => import("@/components/Programs").then(m => ({ default: m.Programs })));
const AboutUs = lazy(() => import("@/components/AboutUs").then(m => ({ default: m.AboutUs })));
const Journey1000Days = lazy(() => import("@/components/Journey1000Days").then(m => ({ default: m.Journey1000Days })));
const BookConsultation = lazy(() => import("@/components/BookConsultation").then(m => ({ default: m.BookConsultation })));
const TeamMembers = lazy(() => import("@/components/TeamMembers").then(m => ({ default: m.TeamMembers })));
const Blogs = lazy(() => import("@/components/Blogs").then(m => ({ default: m.Blogs })));
const FAQ = lazy(() => import("@/components/FAQ").then(m => ({ default: m.FAQ })));
const ContactAndNewsletter = lazy(() => import("@/components/ContactAndNewsletter").then(m => ({ default: m.ContactAndNewsletter })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRest, setShowRest] = useState(false);
  
  useSEO({
    title: "Ritz7 | Learn AI & No-Code Automation: n8n, Bubble, Emergent & More",
    description: "Ritz7 is a student community that makes AI and no-code accessible — learn to build real projects without writing complex code.",
    type: "website",
  });

  // Load the rest of the page after initial paint
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(() => setShowRest(true), { timeout: 1500 });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setShowRest(true), 100);
      return () => clearTimeout(id);
    }
  }, []);

  useEffect(() => {
    const scrollToId = location.state?.scrollTo || (location.hash ? location.hash.substring(1) : null);

    if (scrollToId) {
      // Poll for the element to appear (lazy chunks need time to load & render)
      const scrollToElement = (attempts = 0) => {
        const element = document.getElementById(scrollToId);
        if (element) {
          const navbarHeight = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          // Clean up hash or state from URL so it doesn't get stuck
          if (location.hash || location.state?.scrollTo) {
            navigate(location.pathname + location.search, { replace: true, state: {} });
          }
        } else if (attempts < 20) {
          setTimeout(() => scrollToElement(attempts + 1), 100);
        }
      };

      scrollToElement();
    }
  }, [location, navigate]);

  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground overflow-hidden">
      <CustomCursor />
      <Background3D />
      <Navbar />
      <main>
        <Hero />
        {showRest && (
          <Suspense fallback={<div className="py-10" />}>
            <Programs />
            <AboutUs />
            <Journey1000Days />
            <WallOfLove />
            <BookConsultation />
            <TeamMembers />
            <Blogs />
            <FAQ />
            <ContactAndNewsletter />
          </Suspense>
        )}
      </main>
      {showRest && (
        <Suspense fallback={<div className="py-10" />}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
