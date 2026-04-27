import { useEffect } from 'react';

const SITE_URL = 'https://ritz7.ai';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  customHead?: string;
  // Optional: pass blog post content to auto-generate schemas
  content?: string;
}

// ---------------------------------------------------------------------------
// Schema generators
// ---------------------------------------------------------------------------

/**
 * Generates a BlogPosting JSON-LD schema from blog post metadata.
 */
function buildArticleSchema(props: SEOProps): object {
  const pageUrl = props.url || `${SITE_URL}/blog/`;
  const absoluteImage = props.image
    ? props.image.startsWith('http')
      ? props.image
      : `${SITE_URL}${props.image.startsWith('/') ? '' : '/'}${props.image}`
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    description: props.description,
    author: {
      '@type': 'Person',
      name: props.author || 'Ritz7',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ritz7',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.png`,
      },
    },
    url: pageUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    ...(props.publishedTime && { datePublished: props.publishedTime }),
    ...(props.modifiedTime && { dateModified: props.modifiedTime }),
    ...(absoluteImage && {
      image: { '@type': 'ImageObject', url: absoluteImage },
    }),
    ...(props.category && { articleSection: props.category }),
  };
}

/**
 * Parses <faq> blocks from markdown content and returns a FAQPage schema,
 * or null if no FAQs are found.
 *
 * Expected format inside <faq>...</faq>:
 *   Q: Question text
 *   A: Answer text
 */
function buildFAQSchema(content: string): object | null {
  const faqBlockRegex = /<faq>([\s\S]*?)<\/faq>/gi;
  const qaRegex = /^Q:\s*(.+)$/m;
  const answerRegex = /^A:\s*([\s\S]+?)(?=^Q:|$)/m;

  const mainEntities: { '@type': string; name: string; acceptedAnswer: object }[] = [];

  let blockMatch: RegExpExecArray | null;
  while ((blockMatch = faqBlockRegex.exec(content)) !== null) {
    const block = blockMatch[1].trim();
    // Split on lines starting with "Q:" to get individual Q/A pairs
    const pairs = block.split(/(?=^Q:)/m);

    for (const pair of pairs) {
      const qMatch = qaRegex.exec(pair);
      const aMatch = answerRegex.exec(pair);
      if (qMatch && aMatch) {
        mainEntities.push({
          '@type': 'Question',
          name: qMatch[1].trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: aMatch[1].trim(),
          },
        });
      }
    }
  }

  if (mainEntities.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mainEntities,
  };
}

/**
 * Finds the first <youtube> URL in content and returns a VideoObject schema,
 * or null if no video is found.
 *
 * Expected format: <youtube>https://www.youtube.com/watch?v=VIDEO_ID</youtube>
 */
function buildVideoSchema(content: string, props: SEOProps): object | null {
  const youtubeTagMatch = content.match(/<youtube>(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+))<\/youtube>/i);
  if (!youtubeTagMatch) return null;

  const videoUrl = youtubeTagMatch[1];
  const videoId = youtubeTagMatch[2];
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: props.title,
    description: props.description,
    thumbnailUrl,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    url: videoUrl,
    ...(props.publishedTime && { uploadDate: props.publishedTime }),
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  category,
  customHead,
  content,
}: SEOProps) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    const modifiedTags: { element: Element; originalContent: string | null; attr: string }[] = [];
    const addedTags: Element[] = [];

    const setTag = (tagName: string, attrName: string, attrValue: string, contentAttr: string, tagContent: string) => {
      let element = document.querySelector(`${tagName}[${attrName}="${attrValue}"]`);
      if (element) {
        modifiedTags.push({
          element,
          originalContent: element.getAttribute(contentAttr),
          attr: contentAttr,
        });
        element.setAttribute(contentAttr, tagContent);
      } else {
        element = document.createElement(tagName);
        element.setAttribute(attrName, attrValue);
        element.setAttribute(contentAttr, tagContent);
        document.head.appendChild(element);
        addedTags.push(element);
      }
    };

    const setMeta = (attributeName: 'name' | 'property', attributeValue: string, metaContent: string) => {
      if (!metaContent) return;
      setTag('meta', attributeName, attributeValue, 'content', metaContent);
    };

    const setLink = (rel: string, href: string) => {
      if (!href) return;
      setTag('link', 'rel', rel, 'href', href);
    };

    const injectJsonLd = (schema: object, id: string) => {
      // Remove any stale script with the same id first
      document.getElementById(id)?.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.text = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
      addedTags.push(script);
    };

    // --- Standard meta tags ---
    setMeta('name', 'description', description);
    if (author) setMeta('name', 'author', author);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);

    const currentUrl = url || window.location.href;
    setMeta('property', 'og:url', currentUrl);
    setLink('canonical', currentUrl);

    if (image) {
      const siteUrl = SITE_URL;
      const absoluteImageUrl = image.startsWith('http')
        ? image
        : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`;

      setMeta('property', 'og:image', absoluteImageUrl);
      setMeta('name', 'twitter:image', absoluteImageUrl);
    }

    if (category) setMeta('property', 'article:section', category);
    if (publishedTime) setMeta('property', 'article:published_time', publishedTime);
    if (modifiedTime) setMeta('property', 'article:modified_time', modifiedTime);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    // --- Auto JSON-LD schema injection ---
    if (type === 'article') {
      // 1. Always inject BlogPosting schema for articles
      injectJsonLd(
        buildArticleSchema({ title, description, image, url: currentUrl, author, publishedTime, modifiedTime, category }),
        'schema-article'
      );

      // 2. Auto-inject FAQPage schema if <faq> blocks exist in content
      if (content) {
        const faqSchema = buildFAQSchema(content);
        if (faqSchema) {
          injectJsonLd(faqSchema, 'schema-faq');
        }

        // 3. Auto-inject VideoObject schema if a <youtube> embed exists
        const videoSchema = buildVideoSchema(content, { title, description, publishedTime });
        if (videoSchema) {
          injectJsonLd(videoSchema, 'schema-video');
        }
      }
    }

    // --- Custom head content from Decap CMS field (still supported) ---
    if (customHead) {
      const container = document.createElement('div');
      container.innerHTML = customHead;
      Array.from(container.childNodes).forEach(node => {
        if (node.nodeName.toLowerCase() === 'script') {
          const script = document.createElement('script');
          Array.from((node as HTMLScriptElement).attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
          script.text = node.textContent || '';
          document.head.appendChild(script);
          addedTags.push(script);
        } else {
          document.head.appendChild(node);
          addedTags.push(node as Element);
        }
      });
    }

    return () => {
      document.title = originalTitle;
      addedTags.forEach(tag => tag.remove());
      modifiedTags.forEach(({ element, originalContent, attr }) => {
        if (originalContent === null) {
          element.removeAttribute(attr);
        } else {
          element.setAttribute(attr, originalContent);
        }
      });
    };
  }, [title, description, image, url, type, author, publishedTime, modifiedTime, category, customHead, content]);
}

