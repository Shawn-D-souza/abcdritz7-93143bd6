import { BlogHeader } from "@/components/BlogHeader";
import { Footer } from "@/components/Footer";

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-0 relative">
      <BlogHeader />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Ready for your new blog post design */}
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
