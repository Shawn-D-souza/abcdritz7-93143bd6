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

export default function BlogPost() {
  const { id } = useParams();
  const post = id ? getBlogBySlug(id) : undefined;

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
      
      {/* Hero Section */}
      <div className="bg-muted/30 border-b border-border/40 py-16 md:py-24 mb-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <Link to="/blogs" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to articles
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {post.description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur border rounded-full px-4 py-1.5 shadow-sm">
              <User className="w-4 h-4 text-primary" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur border rounded-full px-4 py-1.5 shadow-sm">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <time dateTime={post.date}>
                {format(new Date(post.date), "MMMM d, yyyy")}
              </time>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Content */}
          <article className="lg:col-span-8 lg:col-start-1">
            {post.thumbnail && (
              <div className="mb-12 rounded-3xl overflow-hidden border shadow-2xl bg-muted/20">
                <img 
                  src={post.thumbnail} 
                  alt={post.thumbnail_alt} 
                  className="w-full h-auto max-h-[500px] object-cover hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
            )}
            
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
          <aside className="lg:col-span-4 hidden lg:block sticky top-28 pt-8 px-2 max-h-[85vh] overflow-y-auto">
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
