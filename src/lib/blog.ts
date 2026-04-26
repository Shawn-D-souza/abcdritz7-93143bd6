import { parse } from 'yaml';

export interface BlogPost {
  id: string; // The slug
  title: string;
  category: string;
  author: string;
  date: string;
  updated_date?: string;
  thumbnail?: string;
  thumbnail_alt?: string;
  description: string;
  content: string; // the markdown body
  readingTime: string;
  custom_head?: string;
  authorUrl?: string;
}

// Vite feature: import all markdown files as raw strings
const markdownFiles = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true });

function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function parseFrontmatter(fileContent: string) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: fileContent };

  const frontmatterString = match[1];
  const content = match[2];
  let data: Record<string, any> = {};

  try {
    data = parse(frontmatterString) || {};
  } catch (e) {
    console.error("YAML parse error", e);
  }

  return { data, content };
}

export function getAllBlogs(): BlogPost[] {
  const blogs: BlogPost[] = Object.entries(markdownFiles).map(([path, fileContent]) => {
    const { data, content } = parseFrontmatter(fileContent as string);

    let authorName = data.author || "Sangya Keswani";
    let authorLink = undefined;

    const authorMatch = typeof data.author === 'string' ? data.author.match(/^\[(.*?)\]\((.*?)\)$/) : null;
    if (authorMatch) {
      authorName = authorMatch[1];
      authorLink = authorMatch[2];
    } else if (data.author === "Sangya Keswani" || data.author === "Admin" || !data.author) {
      authorName = "Sangya Keswani";
      authorLink = "http://linkedin.com/in/sangya-seo/";
    } else if (data.author_link) {
      authorLink = data.author_link;
    }

    return {
      id: data.slug || path.split('/').pop()?.replace('.md', '') || "",
      title: data.title || "Untitled",
      category: data.category || "General", // Fallback if category is missing
      author: authorName,
      date: data.date || new Date().toISOString(),
      updated_date: data.updated_date,
      thumbnail: data.thumbnail,
      thumbnail_alt: data.thumbnail_alt || data.title,
      description: data.description || "",
      content,
      readingTime: calculateReadingTime(content),
      custom_head: data.custom_head,
      authorUrl: authorLink,
    };
  });

  // Sort by updated_date (if it exists) or date descending
  return blogs.sort((a, b) => {
    const dateA = new Date(a.updated_date || a.date).getTime();
    const dateB = new Date(b.updated_date || b.date).getTime();
    return dateB - dateA;
  });
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const blogs = getAllBlogs();
  return blogs.find((b) => b.id === slug);
}


