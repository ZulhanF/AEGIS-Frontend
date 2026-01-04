/**
 * Web Vitals Reporter
 * Tracks Core Web Vitals metrics for performance monitoring
 * 
 * Metrics tracked:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */

/**
 * Send metrics to analytics endpoint
 * Replace with your actual analytics service
 */
const sendToAnalytics = (metric) => {
  // Example: Send to Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }

  // Example: Send to custom endpoint
  if (import.meta.env.PROD) {
    // Uncomment and configure your analytics endpoint
    // navigator.sendBeacon('/api/analytics', JSON.stringify(metric));
  }

  // Log in development
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }
};

/**
 * Initialize Web Vitals tracking
 * Call this function in your main app file
 */
export const initWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Dynamically import web-vitals library only when needed
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }).catch((error) => {
    console.error('Failed to load web-vitals:', error);
  });
};

/**
 * Report custom performance metric
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @param {Object} additionalData - Additional data to send
 */
export const reportCustomMetric = (name, value, additionalData = {}) => {
  if (import.meta.env.DEV) {
    console.log('[Custom Metric]', { name, value, ...additionalData });
  }

  // Send to analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', name, {
      value: Math.round(value),
      ...additionalData,
    });
  }
};

/**
 * Get performance navigation timing
 * Useful for debugging performance issues
 */
export const getNavigationTiming = () => {
  if (typeof window === 'undefined' || !window.performance) return null;

  const perfData = window.performance.timing;
  const navigation = {
    dns: perfData.domainLookupEnd - perfData.domainLookupStart,
    tcp: perfData.connectEnd - perfData.connectStart,
    request: perfData.responseStart - perfData.requestStart,
    response: perfData.responseEnd - perfData.responseStart,
    dom: perfData.domComplete - perfData.domLoading,
    load: perfData.loadEventEnd - perfData.loadEventStart,
    total: perfData.loadEventEnd - perfData.navigationStart,
  };

  if (import.meta.env.DEV) {
    console.table(navigation);
  }

  return navigation;
};

/**
 * Monitor long tasks (> 50ms)
 * Helps identify performance bottlenecks
 */
export const monitorLongTasks = () => {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          reportCustomMetric('long_task', entry.duration, {
            entryType: entry.entryType,
            startTime: entry.startTime,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    console.warn('Long task monitoring not supported:', error);
  }
};

export default {
  initWebVitals,
  reportCustomMetric,
  getNavigationTiming,
  monitorLongTasks,
};
