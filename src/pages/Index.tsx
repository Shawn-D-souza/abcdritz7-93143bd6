import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LearnerAchievements } from "@/components/LearnerAchievements";
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

const Index = () => {
  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground overflow-hidden">
      <CustomCursor />
      <Background3D />
      <Navbar />
      <main>
        <Hero />
        <WallOfLove />
        <LearnerAchievements />
        <Programs />
        <AboutUs />
        <Journey1000Days />
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
