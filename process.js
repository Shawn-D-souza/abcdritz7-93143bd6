import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '*',
  codeBlockStyle: 'fenced'
});

const imagesToDownload = [];

// Rule for YouTube
turndownService.addRule('youtube', {
  filter: 'iframe',
  replacement: function (content, node) {
    let src = node.getAttribute('src');
    if (src && src.includes('youtube.com/embed/')) {
      let videoId = src.split('youtube.com/embed/')[1].split('?')[0];
      return `\n\n<youtube>https://www.youtube.com/watch?v=${videoId}</youtube>\n\n`;
    }
    return '';
  }
});

// Rule for Tables -> <customtable>
turndownService.addRule('customtable', {
  filter: 'table',
  replacement: function (content, node) {
    let output = '\n\n<customtable>\n';
    const rows = Array.from(node.querySelectorAll('tr'));
    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      const cellTexts = [];
      cells.forEach(cell => {
        let cellMd = turndownService.turndown(cell.innerHTML).trim();
        cellMd = cellMd.replace(/\n/g, ' '); 
        cellTexts.push(cellMd);
      });
      output += cellTexts.join(' | ') + '\n';
    });
    output += '</customtable>\n\n';
    return output;
  }
});

// Rule for FAQ placeholder
turndownService.addRule('faq-placeholder', {
  filter: 'faq-placeholder',
  replacement: function (content, node) {
    return '\n\n' + node.textContent + '\n\n';
  }
});

// Rule for Images
turndownService.addRule('images', {
  filter: 'img',
  replacement: function (content, node) {
    const alt = node.getAttribute('alt') || '';
    let src = node.getAttribute('src');
    const title = node.getAttribute('title') || '';
    if (!src) return '';
    
    if (src.startsWith('//')) {
      src = 'https:' + src;
    } else if (src.startsWith('/')) {
      // relative url, can't download easily if we don't know the domain
      return `![${alt}](${src})`;
    }

    try {
      const parsedUrl = new URL(src);
      // Remove query params to get clean extension, but framerusercontent often has none
      let filename = path.basename(parsedUrl.pathname);
      if (!filename.includes('.')) {
         filename += '.png'; // default
      }
      const localSrc = `/assets/uploads/${filename}`;
      imagesToDownload.push({ url: src, filename: filename });
      let titlePart = title ? ` "${title}"` : '';
      return `\n\n![${alt}](${localSrc}${titlePart})\n\n`;
    } catch (e) {
      return `![${alt}](${src})`;
    }
  }
});

// Overwrite blockquote to ensure it's simple
turndownService.addRule('blockquote', {
  filter: 'blockquote',
  replacement: function (content) {
    return '\n\n' + content.trim().split('\n').map(line => '> ' + line).join('\n') + '\n\n';
  }
});

function parseFAQs(document, faqMap) {
  const headings = Array.from(document.querySelectorAll('h2, h3, h4, strong')).filter(h => {
    const t = h.textContent.toLowerCase().trim();
    return t.includes('faq') || t.includes('frequently asked questions');
  });
  
  headings.forEach(heading => {
    // If it's a strong inside a p, use the p as heading
    let actualHeading = heading;
    if (heading.tagName === 'STRONG' && heading.parentElement.tagName === 'P') {
      actualHeading = heading.parentElement;
    }

    let currentNode = actualHeading.nextElementSibling;
    let faqContent = '';
    
    while (currentNode) {
      if (currentNode.tagName.match(/^H[1-6]$/) && !currentNode.textContent.toLowerCase().includes('faq')) {
        break; 
      }
      
      if (currentNode.tagName === 'OL' || currentNode.tagName === 'UL') {
        const lis = currentNode.querySelectorAll('li');
        lis.forEach(li => {
          let q = li.textContent.trim().replace(/^(Q:|Q\.)\s*/i, '');
          if (q) faqContent += `Q: ${q}\n`;
        });
      } else if (currentNode.tagName === 'P') {
        let text = currentNode.textContent.trim();
        if (!text) {
          let next = currentNode.nextElementSibling;
          currentNode.remove();
          currentNode = next;
          continue;
        }
        
        let isQuestion = false;
        let strong = currentNode.querySelector('strong');
        if (strong && text === strong.textContent.trim()) {
           isQuestion = true;
        }
        
        if (text.match(/^[0-9]+\.\s/)) {
            isQuestion = true;
            text = text.replace(/^[0-9]+\.\s/, '');
        }

        if (text.toLowerCase().startsWith('q:')) {
            isQuestion = true;
        }

        if (isQuestion) {
          faqContent += `Q: ${text.replace(/^(Q:|Q\.)\s*/i, '')}\n`;
        } else {
          faqContent += `A: ${text.replace(/^(A:|A\.)\s*/i, '')}\n`;
        }
      }
      
      let next = currentNode.nextElementSibling;
      currentNode.remove();
      currentNode = next;
    }
    
    if (faqContent) {
      const token = 'FAQTOKEN' + Math.random().toString(36).substr(2, 9) + 'ENDTOKEN';
      const p = document.createElement('p');
      p.textContent = token;
      actualHeading.replaceWith(p);
      faqMap[token] = `\n\n<faq>\n${faqContent.trim()}\n</faq>\n\n`;
    } else {
      actualHeading.remove();
    }
  });
}

function processHTML(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const faqMap = {};

  // Remove Table of Contents
  const tocHeadings = Array.from(document.querySelectorAll('h2, h3, h4, strong')).filter(h => h.textContent.toLowerCase().includes('table of contents'));
  tocHeadings.forEach(tocHeading => {
    let actualHeading = tocHeading;
    if (tocHeading.tagName === 'STRONG' && tocHeading.parentElement.tagName === 'P') {
      actualHeading = tocHeading.parentElement;
    }
    let next = actualHeading.nextElementSibling;
    if (next && (next.tagName === 'OL' || next.tagName === 'UL')) {
      next.remove();
    }
    actualHeading.remove();
  });

  parseFAQs(document, faqMap);

  let markdown = turndownService.turndown(document.body.innerHTML);
  for (const [token, block] of Object.entries(faqMap)) {
    markdown = markdown.replace(token, block);
  }
  return markdown;
}

async function downloadImage(url, filename) {
  const filepath = path.join(process.cwd(), 'public', 'assets', 'uploads', filename);
  if (fs.existsSync(filepath)) return; // Skip if already downloaded
  
  console.log(`Downloading ${url} -> ${filename}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    const buffer = await res.arrayBuffer();
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, Buffer.from(buffer));
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
  }
}

async function main() {
  const csvData = fs.readFileSync('Blog.csv', 'utf-8');
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  for (const record of records) {
    const slug = record['Slug'];
    if (!slug) continue;

    console.log(`Processing: ${slug}`);

    let dateStr = record['Date'] || new Date().toISOString();
    let updatedDateStr = record['Updated on'] || dateStr;

    // Handle thumbnail
    let thumbnailUrl = record['Blog/ Project Image'];
    let thumbnailLocal = '';
    if (thumbnailUrl) {
      try {
        let filename = path.basename(new URL(thumbnailUrl).pathname);
        if (!filename.includes('.')) {
          filename += '.png';
        }
        thumbnailLocal = `/assets/uploads/${filename}`;
        imagesToDownload.push({ url: thumbnailUrl, filename: filename });
      } catch (e) {
        // Invalid URL
      }
    }

    const htmlContent = record['Project/ Blog Content'] || '';
    const markdownContent = processHTML(htmlContent);

    // Frontmatter
    const frontmatter = `---
summary: ${JSON.stringify(record['Summary'] || '')}
title: ${JSON.stringify(record['Blog/ Project Title/ Meta title'] || '')}
slug: ${slug}
category: ${record['Type'] === 'Blog' ? 'Technology' : (record['Type'] || 'Blog')}
author: ${record['Author Name'] || 'Ritz7'}
date: ${dateStr}
updated_date: ${updatedDateStr}
thumbnail: ${thumbnailLocal}
thumbnail_alt: ${JSON.stringify(record['Blog/ Project Image:alt'] || '')}
description: ${JSON.stringify(record['Summary'] || '')}
---
`;

    const fullContent = frontmatter + '\n' + markdownContent + '\n';

    // File name: date-slug.md
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const filename = `${yyyy}-${mm}-${dd}-${slug}.md`;

    const outPath = path.join(process.cwd(), 'src', 'content', 'blog', filename);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, fullContent, 'utf-8');
  }

  // Download all images
  console.log(`Found ${imagesToDownload.length} images to download...`);
  // Deduplicate
  const uniqueImages = [];
  const seenUrls = new Set();
  for (const img of imagesToDownload) {
    if (!seenUrls.has(img.url)) {
      seenUrls.add(img.url);
      uniqueImages.push(img);
    }
  }

  for (const img of uniqueImages) {
    await downloadImage(img.url, img.filename);
  }

  console.log('Done!');
}

main().catch(console.error);
