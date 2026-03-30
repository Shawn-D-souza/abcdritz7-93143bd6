import { Navbar } from "@/components/Navbar";
import { LearnerAchievements } from "@/components/LearnerAchievements";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Background3D } from "@/components/Background3D";

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const HallOfFame = () => {
  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground overflow-hidden">
      <CustomCursor />
      <Background3D />
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-2 relative z-10 w-full flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all text-sm font-medium backdrop-blur-md shadow-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        <LearnerAchievements />
      </main>
      <Footer />
    </div>
  );
};

export default HallOfFame;
