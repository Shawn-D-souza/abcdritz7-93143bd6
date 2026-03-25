import { BlogHeader } from "@/components/BlogHeader";
import { Footer } from "@/components/Footer";

export default function BlogList() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 overflow-hidden relative">
      <BlogHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Ready for your new blog list design */}
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
