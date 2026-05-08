import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Background3D } from "@/components/Background3D";
import { CustomCursor } from "@/components/CustomCursor";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen selection:bg-primary/30 text-foreground overflow-hidden flex flex-col">
      <CustomCursor />
      <Background3D />
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-20">
        <div className="max-w-3xl w-full text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="relative inline-block">
              <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-primary/20 blur-[2px] opacity-30 absolute -inset-4">
                404
              </h1>
              <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 relative z-10">
                404
              </h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Page Not Found</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Button asChild size="lg" className="rounded-full gap-2 w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/20">
              <Link to="/">
                <Home className="w-5 h-5" />
                Return Home
              </Link>
            </Button>
            <Button onClick={() => navigate(-1)} variant="outline" size="lg" className="rounded-full gap-2 w-full sm:w-auto h-14 px-8 text-base bg-background/50 backdrop-blur-sm border-foreground/10 hover:bg-foreground/5">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default NotFound;
