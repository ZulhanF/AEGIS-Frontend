/**
 * Performance utilities for React components
 * Use these helpers to optimize component rendering and reduce unnecessary re-renders
 */

/**
 * Debounce function for search inputs and expensive operations
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll events and frequent updates
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images with Intersection Observer
 * @param {HTMLImageElement} img - Image element to lazy load
 */
export const lazyLoadImage = (img) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.add('loaded');
          imageObserver.unobserve(image);
        }
      });
    });
    imageObserver.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = img.dataset.src;
  }
};

/**
 * Dynamic import wrapper with error handling
 * @param {Function} importFn - Dynamic import function
 * @returns {Promise} - Import promise with error handling
 */
export const dynamicImport = async (importFn) => {
  try {
    return await importFn();
  } catch (error) {
    console.error('Failed to load component:', error);
    throw error;
  }
};

/**
 * Check if code is running on client side
 * @returns {boolean}
 */
export const isClient = () => typeof window !== 'undefined';

/**
 * Measure component render time (development only)
 * @param {string} componentName - Name of the component
 * @param {Function} fn - Function to measure
 */
export const measureRender = (componentName, fn) => {
  if (import.meta.env.DEV && isClient()) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
};

/**
 * Preload route component
 * @param {Function} importFn - Dynamic import function for the route
 */
export const preloadRoute = (importFn) => {
  if (isClient()) {
    // Start loading the component
    importFn();
  }
};

/**
 * Deep comparison for useMemo/useCallback dependencies
 * Only use when necessary as it's slower than shallow comparison
 * @param {any} obj1
 * @param {any} obj2
 * @returns {boolean}
 */
export const deepEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Shallow comparison for props (for React.memo)
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @returns {boolean} - true if equal (skip re-render)
 */
export const shallowEqual = (prevProps, nextProps) => {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  return prevKeys.every(
    (key) => prevProps[key] === nextProps[key]
  );
};

/**
 * Request Idle Callback wrapper with fallback
 * Use for non-critical work that can be deferred
 * @param {Function} callback
 */
export const requestIdleCallbackPolyfill = (callback) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback);
  }
  // Fallback
  return setTimeout(callback, 1);
};

/**
 * Cancel Idle Callback wrapper with fallback
 * @param {number} id
 */
export const cancelIdleCallbackPolyfill = (id) => {
  if ('cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id);
  }
  return clearTimeout(id);
};
