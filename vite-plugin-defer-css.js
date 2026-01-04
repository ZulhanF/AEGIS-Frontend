/**
 * Vite Plugin: Defer Non-Critical CSS
 * This plugin helps reduce render-blocking CSS by deferring non-critical stylesheets
 */

export default function deferNonCriticalCSS() {
  return {
    name: 'defer-non-critical-css',
    enforce: 'post',
    
    transformIndexHtml(html) {
      // Add preload for CSS files to prevent render blocking
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
        (match, href) => {
          // Preload CSS for faster loading without blocking render
          return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${href}"></noscript>`;
        }
      );
    },
  };
}
