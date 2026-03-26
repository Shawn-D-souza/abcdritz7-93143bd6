import { useEffect } from 'react';

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
}

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
}: SEOProps) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    const modifiedTags: { element: Element; originalContent: string | null; attr: string }[] = [];
    const addedTags: Element[] = [];

    const setTag = (tagName: string, attrName: string, attrValue: string, contentAttr: string, content: string) => {
      let element = document.querySelector(`${tagName}[${attrName}="${attrValue}"]`);
      if (element) {
        modifiedTags.push({ 
          element, 
          originalContent: element.getAttribute(contentAttr), 
          attr: contentAttr 
        });
        element.setAttribute(contentAttr, content);
      } else {
        element = document.createElement(tagName);
        element.setAttribute(attrName, attrValue);
        element.setAttribute(contentAttr, content);
        document.head.appendChild(element);
        addedTags.push(element);
      }
    };

    const setMeta = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
      if (!content) return;
      setTag('meta', attributeName, attributeValue, 'content', content);
    };

    const setLink = (rel: string, href: string) => {
      if (!href) return;
      setTag('link', 'rel', rel, 'href', href);
    };

    setMeta('name', 'description', description);
    if (author) setMeta('name', 'author', author);
    
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    
    const currentUrl = url || window.location.href;
    setMeta('property', 'og:url', currentUrl);
    setLink('canonical', currentUrl); 

    if (image) {
      const absoluteImageUrl = image.startsWith('http') 
        ? image 
        : `${window.location.origin}${image}`;
      setMeta('property', 'og:image', absoluteImageUrl);
      setMeta('name', 'twitter:image', absoluteImageUrl);
    }

    if (category) setMeta('property', 'article:section', category);
    if (publishedTime) setMeta('property', 'article:published_time', publishedTime);
    if (modifiedTime) setMeta('property', 'article:modified_time', modifiedTime);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

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
  }, [title, description, image, url, type, author, publishedTime, modifiedTime, category]);
}
