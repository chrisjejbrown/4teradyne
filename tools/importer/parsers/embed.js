/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed block.
 * Base: embed. Source: https://www.teradyne.com/defense-and-aerospace-product-explorer/
 * Generated: 2026-04-15
 *
 * UE Model fields:
 *   - embed_placeholder (reference/image) - collapsed with embed_placeholderAlt
 *   - embed_uri (text/string) - URL to embed
 *
 * Source DOM: #product-finder-root (empty div, React app)
 * Block library: 1 column, 1 content row with URL (optional image poster above)
 */
export default function parse(element, { document }) {
  // The product-finder-root is a React app container - create embed with source page URL
  const sourceUrl = document.location ? document.location.href : 'https://www.teradyne.com/defense-and-aerospace-product-explorer/';

  const cells = [];

  // Row 1: URL content with field hint
  const urlFrag = document.createDocumentFragment();
  urlFrag.appendChild(document.createComment(' field:embed_uri '));
  const link = document.createElement('a');
  link.href = sourceUrl;
  link.textContent = sourceUrl;
  urlFrag.appendChild(link);
  cells.push([urlFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}
