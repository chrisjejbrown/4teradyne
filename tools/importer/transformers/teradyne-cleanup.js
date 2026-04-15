/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: teradyne cleanup.
 * Selectors from captured DOM of https://www.teradyne.com/defense-and-aerospace-product-explorer/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent dialog (found: #CybotCookiebotDialog)
    WebImporter.DOMUtils.remove(element, [
      '#CybotCookiebotDialog',
      '.CybotCookiebotDialogActive',
    ]);
  }
  if (hookName === H.after) {
    // Remove non-authorable content: header, footer, breadcrumbs, search, modals, iframes
    WebImporter.DOMUtils.remove(element, [
      'header#masthead',
      '.header-search-form',
      '.header-search-form-overlay',
      '#breadcrumbs_container',
      'footer',
      '#eknowledge-modal-container',
      '#disRedirect',
      '#menu-background-blur-disabled',
      '.related-post-container',
      'iframe',
      'link',
      'noscript',
      'template',
    ]);
    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
    });
  }
}
