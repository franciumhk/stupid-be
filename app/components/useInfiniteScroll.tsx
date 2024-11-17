// in @/app/components/useInfiniteScroll.ts

import { useEffect, RefObject } from 'react';

export const useInfiniteScroll = (
  loadMoreRef: RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          callback();
        }
      },
      { threshold: 1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreRef, callback]);
};
