import { useEffect, lazy, Suspense, useRef, useState, ComponentType } from "react";
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

// Intersection Observer-based lazy section that only renders when near viewport
const LazySection = ({ children, fallback, rootMargin = "200px" }: { children: React.ReactNode; fallback?: React.ReactNode; rootMargin?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: isVisible ? undefined : '100px' }}>
      {isVisible ? (
        <Suspense fallback={fallback || <div className="py-10" />}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};

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
        <LazySection>
          <Programs />
        </LazySection>
        <LazySection>
          <AboutUs />
        </LazySection>
        <LazySection>
          <Journey1000Days />
        </LazySection>
        <LazySection>
          <WallOfLove />
        </LazySection>
        <LazySection>
          <BookConsultation />
        </LazySection>
        <LazySection>
          <TeamMembers />
        </LazySection>
        <LazySection>
          <Blogs />
        </LazySection>
        <LazySection>
          <FAQ />
        </LazySection>
        <LazySection>
          <ContactAndNewsletter />
        </LazySection>
      </main>
      <LazySection rootMargin="400px">
        <Footer />
      </LazySection>
    </div>
  );
};

export default Index;

