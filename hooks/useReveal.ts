
import { useEffect } from 'react';

export const useReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Once revealed, we don't need to observe it anymore
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05, // Lower threshold for mobile
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before it enters viewport
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(
        '[class*="reveal"]:not(.active)'
      );
      elements.forEach((el) => observer.observe(el));
    };

    // Initial scan
    observeElements();

    // Use MutationObserver for dynamically loaded images (like in Gallery)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Return a dummy function to avoid breaking existing imports while refactoring
  return { addToReveal: () => { } };
};
