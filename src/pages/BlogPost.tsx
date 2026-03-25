import { useParams } from "react-router-dom";
import { BlogHeader } from "@/components/BlogHeader";
import { Footer } from "@/components/Footer";
import { getBlogBySlug } from "@/lib/blog";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { MarkdownComponents } from "@/components/blog/MarkdownComponents";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { format } from "date-fns";
import { CalendarIcon, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function BlogPost() {
  const { id } = useParams();
  const post = id ? getBlogBySlug(id) : undefined;

  useEffect(() => {
    if (post) {
      // Update SEO tags dynamically
      document.title = `${post.title} | Ritz7`;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.description || "");
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = post.description || "";
        document.head.appendChild(meta);
      }
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-0 relative">
        <BlogHeader />
        <div className="container mx-auto px-4 max-w-4xl text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/blogs" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-0 relative font-sans">
      <BlogHeader />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6 lg:pl-0 pl-1">
          <Link to="/blogs" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to articles
          </Link>
        </div>

        {/* Top Split Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-16">
          
          {post.thumbnail && (
            <div className="lg:col-span-7 lg:order-1 order-1 flex justify-center lg:justify-start">
              <img 
                src={post.thumbnail} 
                alt={post.thumbnail_alt} 
                className="w-full h-auto object-contain rounded-3xl shadow-xl shadow-primary/5 border border-border/50"
              />
            </div>
          )}

          <header className={post.thumbnail ? "lg:col-span-5 lg:order-2 order-2" : "lg:col-span-12 order-2"}>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.12]">
              {post.title}
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-medium">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span className="text-base">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <time className="text-base" dateTime={post.date}>
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </time>
              </div>
            </div>
          </header>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Content */}
          <article className="lg:col-span-8 lg:col-start-1">
            
            {/* Mobile TOC */}
            <div className="block lg:hidden mb-10 bg-muted/20 p-6 rounded-2xl border">
              <TableOfContents content={post.content} />
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={MarkdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-28 pt-2 px-2 max-h-[85vh] overflow-y-auto w-full">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
