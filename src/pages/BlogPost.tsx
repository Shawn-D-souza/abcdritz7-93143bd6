import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { BlogHeader } from "@/components/BlogHeader";
import { Footer } from "@/components/Footer";
import { getBlogBySlug } from "@/lib/blog";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { MarkdownComponents } from "@/components/blog/MarkdownComponents";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { format } from "date-fns";
import { CalendarIcon, User, ArrowLeft, Clock, Share2, Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const post = id ? getBlogBySlug(id) : undefined;
  const [isCopied, setIsCopied] = useState(false);

  const handleBackToArticles = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.state?.from === '/blogs') {
      navigate(-1);
    } else {
      navigate("/blogs");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!post) return;

    const metaTags: HTMLMetaElement[] = [];

    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement;
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        element.setAttribute('content', content);
        document.head.appendChild(element);
        metaTags.push(element);
      }
    };

    const originalTitle = document.title;
    document.title = `${post.title} | Ritz7`;
    
    setMetaTag('name', 'description', post.description || "");
    setMetaTag('name', 'author', post.author);
    setMetaTag('property', 'og:title', post.title);
    setMetaTag('property', 'og:description', post.description || "");
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('property', 'og:url', window.location.href);
    
    if (post.thumbnail) {
      const imageUrl = post.thumbnail.startsWith('http') 
        ? post.thumbnail 
        : `${window.location.origin}${post.thumbnail}`;
      setMetaTag('property', 'og:image', imageUrl);
      setMetaTag('name', 'twitter:image', imageUrl);
    }
    
    setMetaTag('property', 'article:published_time', post.date);
    if (post.updated_date) {
      setMetaTag('property', 'article:modified_time', post.updated_date);
    }
    
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', post.title);
    setMetaTag('name', 'twitter:description', post.description || "");

    return () => {
      metaTags.forEach(tag => {
        if (tag.parentNode) {
          tag.parentNode.removeChild(tag);
        }
      });
      document.title = originalTitle;
    };
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
          <a href="/blogs" onClick={handleBackToArticles} className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to articles
          </a>
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
                <div className="flex flex-col">
                  <time className="text-base leading-none mt-1" dateTime={post.date}>
                    {format(new Date(post.date), "MMMM d, yyyy")}
                  </time>
                  {post.updated_date && format(new Date(post.date), "yyyy-MM-dd") !== format(new Date(post.updated_date), "yyyy-MM-dd") && (
                    <time className="text-xs text-muted-foreground/80 mt-1 mb-1" dateTime={post.updated_date}>
                      Updated: {format(new Date(post.updated_date), "MMM d, yyyy")}
                    </time>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-base">{post.readingTime}</span>
              </div>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-primary-foreground hover:bg-primary/90 transition-all bg-primary px-5 py-2 rounded-full lg:ml-auto shadow-sm hover:shadow-md"
                aria-label="Share article"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span className="text-sm font-semibold">{isCopied ? "Copied Link" : "Share Article"}</span>
              </button>
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
