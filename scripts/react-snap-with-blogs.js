#!/usr/bin/env node
/**
 * react-snap-with-blogs.js
 *
 * Dynamically collects all blog post slugs from src/content/blog/*.md,
 * then runs react-snap with the full URL list so every blog post gets
 * a pre-rendered HTML file (and correct OG meta tags for WhatsApp/social previews).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { run } from 'react-snap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.resolve(__dirname, '../src/content/blog');

/**
 * Extracts the `slug` field from a markdown file's YAML frontmatter.
 * Falls back to the filename (without date prefix and .md) if no slug is found.
 */
function extractSlug(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      const frontmatter = match[1];
      const slugLine = frontmatter.split('\n').find((l) => l.startsWith('slug:'));
      if (slugLine) {
        return slugLine.slice('slug:'.length).trim().replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (e) {
    // If reading fails, fall through to filename-based slug
  }

  // Fallback: strip leading date prefix (YYYY-MM-DD-) and .md extension
  const filename = path.basename(filePath, '.md');
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

// Collect all blog slugs
const blogSlugs = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => extractSlug(path.join(blogDir, f)))
  .filter(Boolean);

// Build the full include list: static pages + every blog post URL
const include = [
  '/',
  '/blogs',
  '/workshop',
  ...blogSlugs.map((slug) => `/blog/${slug}`),
];

console.log(`[react-snap] Pre-rendering ${blogSlugs.length} blog post(s) + 3 static pages…`);

// Run react-snap programmatically with the dynamic include list
run({
  source: 'dist',
  concurrency: 2,
  skipThirdPartyRequests: true,
  puppeteerArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
  ],
  include,
}).catch((err) => {
  console.error('[react-snap] Failed:', err);
  process.exit(1);
});
