import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const md = `<faq>
Q: Who is behind Sienna Rose?
A: Sienna Rose is a digital artist created by an anonymous group of developers. They use artificial intelligence to make her music and look. There is no real person named Sienna Rose.
Q: How did Sienna Rose become famous?
A: She became famous by uploading many songs to Spotify playlists and getting a huge boost when Selena Gomez shared her music. This pushed her onto the Viral 50 – USA chart.
</faq>`;

const extractText = (node) => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props && node.props.children) return extractText(node.props.children);
  return '';
};

const MarkdownComponents = {
  faq: (props) => {
    let str1 = String(props.children);
    let str2 = extractText(props.children);
    console.log("String(children):", JSON.stringify(str1));
    console.log("extractText:", JSON.stringify(str2));
    
    // Simulating their logic:
    const splitLines = str1.split('\n').filter(l => l.trim() !== '');
    console.log("splitLines with String:", splitLines);

    return createElement('div', {}, 'FAQ');
  }
};

const el = createElement(ReactMarkdown, {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeRaw],
  components: MarkdownComponents
}, md);

renderToStaticMarkup(el);
