import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyLearnFromUs from "@/components/WhyLearnFromUs";
import ToolsCarousel from "@/components/ToolsCarousel";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import Milestones from "@/components/Milestones";
import CommunityPerks from "@/components/CommunityPerks";
import JoinCommunity from "@/components/JoinCommunity";
import LeadMagnets from "@/components/LeadMagnets";
import ConsultationCTA from "@/components/ConsultationCTA";
import ChatWidget from "@/components/ChatWidget";
import BlogGrid from "@/components/BlogGrid";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <WhyLearnFromUs />
      <ToolsCarousel />
      <CaseStudies />
      <Milestones />
      <Testimonials />
      <CommunityPerks />
      <JoinCommunity />
      <LeadMagnets />
      <ConsultationCTA />
      <BlogGrid />
      <FAQSection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
