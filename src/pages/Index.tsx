import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Background3D } from "@/components/Background3D";
import { CustomCursor } from "@/components/CustomCursor";

const Index = () => {
  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground overflow-hidden">
      <CustomCursor />
      <Background3D />
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
};

export default Index;
