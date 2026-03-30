import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const md = `<faq>
Q: Who is behind Sienna Rose?
A: Sienna Rose is a digital artist.
Q: How did Sienna Rose become famous?
A: She became famous by uploading many songs.
</faq>`;

const MarkdownComponents = {
  faq: (props) => {
    console.log("FAQ children:", JSON.stringify(props.children));
    console.log("FAQ node children type:", props.node.children.map(c => c.type));
    console.log("FAQ String(children):", String(props.children));
    return createElement('div', {}, 'FAQ');
  }
};

const el = createElement(ReactMarkdown, {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeRaw],
  components: MarkdownComponents
}, md);

renderToStaticMarkup(el);
