import { useState, useEffect, useRef, useCallback } from "react";
import { XMasonry, XBlock } from "react-xmasonry";
import allImageData from "../assets/photos/medium/image_data.json";
import { GalleryImageCard } from "./GalleryImageCard";
import { useMasonryTargetBlockWidth } from "../utils/masonryCalculations";

export const Gallery = () => {
  const allImages = allImageData;

  const INITIAL_LOAD_COUNT = 20;
  const LOAD_MORE_COUNT = 10;

  const [loadedImageCount, setLoadedImageCount] = useState(INITIAL_LOAD_COUNT);
  const loadingRef = useRef(false);
  const observerTargetRef = useRef(null);

  const displayedImages = allImages.slice(0, loadedImageCount);
  const hasMore = loadedImageCount < allImages.length;

  const [showFloatingBackToTop, setShowFloatingBackToTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = useCallback(() => {
    const scrollThreshold = 800;
    const bottomOffset = 150;

    const currentScrollPos = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    const isScrolledDown = currentScrollPos > scrollThreshold;
    const isNearBottom =
      currentScrollPos + windowHeight + bottomOffset >= documentHeight;

    if (isScrolledDown && !isNearBottom) {
      setShowFloatingBackToTop(true);
    } else {
      setShowFloatingBackToTop(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) {
      return;
    }
    loadingRef.current = true;

    setTimeout(() => {
      setLoadedImageCount((prevCount) =>
        Math.min(prevCount + LOAD_MORE_COUNT, allImages.length)
      );
      loadingRef.current = false;
    }, 200);
  }, [hasMore, allImages.length]);

  useEffect(() => {
    let observer;
    const currentObserverTarget = observerTargetRef.current;

    if (currentObserverTarget && hasMore) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            loadMore();
          }
        },
        {
          root: null,
          rootMargin: "0px 0px 150px 0px",
          threshold: 0.1,
        }
      );
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (observer && currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
        observer.disconnect();
      }
    };
  }, [loadMore, hasMore]);

  // Use the custom hook to get the calculated targetBlockWidth
  const calculatedMasonryWidth = useMasonryTargetBlockWidth(
    64, // totalModalHorizontalPadding (m-8 on each side)
    16, // columnGap (gap-4)
    4, // effectiveMaxColumns (your XMasonry maxColumns prop)
    [
      // Custom breakpoints if you want to override defaults in the hook
      { width: 0, columns: 2 },
      { width: 640, columns: 2 },
      { width: 768, columns: 3 },
      { width: 1024, columns: 4 },
      { width: 1440, columns: 4 },
    ]
  );
  return (
    <section id="gallery-nav" className="scroll-smooth">
      <div className="px-2 sm:px-8 py-2">
        <XMasonry
          maxColumns={4}
          updateOnImagesLoad={true}
          targetBlockWidth={calculatedMasonryWidth}
        >
          {displayedImages.map((image) => (
            <XBlock key={image.filename} className="flex-1 min-w-0">
              <GalleryImageCard image={image} />
            </XBlock>
          ))}
        </XMasonry>

        <div
          ref={observerTargetRef}
          className="flex items-center justify-center py-4"
        >
          {loadingRef.current ? (
            <p className="text-purple-800">Loading more images...</p>
          ) : (
            <button
              onClick={hasMore ? loadMore : scrollToTop}
              className="py-2 px-4 bg-purple-200 text-purple-800 rounded hover:bg-purple-300 transition-colors"
            >
              {hasMore ? "Load More" : "Back to top"}
            </button>
          )}
        </div>
      </div>

      {showFloatingBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50
                      bg-[#363636] bg-opacity-30 rounded-full w-12 h-12 flex items-center justify-center
                      shadow-lg transition-opacity duration-300 ease-in-out cursor-pointer"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            ></path>
          </svg>
        </button>
      )}
    </section>
  );
};
