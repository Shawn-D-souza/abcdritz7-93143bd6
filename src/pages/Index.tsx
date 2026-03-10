import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LearnerAchievements } from "@/components/LearnerAchievements";
import { Background3D } from "@/components/Background3D";
import { CustomCursor } from "@/components/CustomCursor";
import { WallOfLove } from "@/components/WallOfLove";
import { Programs } from "@/components/Programs";

const Index = () => {
  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground overflow-hidden">
      <CustomCursor />
      <Background3D />
      <Navbar />
      <main>
        <Hero />
        <LearnerAchievements />
        <WallOfLove />
        <Programs />
      </main>
    </div>
  );
};

export default Index;
