import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import NotFound from "./pages/NotFound";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
