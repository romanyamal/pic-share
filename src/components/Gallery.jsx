import { useState, useEffect, useRef, useCallback } from "react";
import { XMasonry, XBlock } from "react-xmasonry";
import allImageData from "../assets/photos/medium/image_data.json";
import { GalleryImageCard } from "./GalleryImageCard";
import { useMasonryTargetBlockWidth } from "../utils/masonryCalculations";
import { Lightbox } from "./Lightbox";

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

  const [isBodyScrollLocked, setIsBodyScrollLocked] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsBodyScrollLocked(document.body.style.overflow === "hidden");
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  const scrollToHero = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
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

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentLightboxImageIndex, setCurrentLightboxImageIndex] = useState(0);

  const handleImageClick = useCallback((index, event) => {
    const isButtonClicked = event.target.closest("button, a, svg");

    if (!isButtonClicked) {
      setCurrentLightboxImageIndex(index);
      setIsLightboxOpen(true);
    }
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const calculatedMasonryWidth = useMasonryTargetBlockWidth(64, 16, 4, [
    { width: 0, columns: 2 },
    { width: 640, columns: 2 },
    { width: 768, columns: 3 },
    { width: 1024, columns: 4 },
    { width: 1440, columns: 4 },
  ]);
  return (
    <section id="gallery-nav" className="scroll-smooth">
      <div className="px-2 sm:px-8 py-2">
        <XMasonry
          maxColumns={4}
          updateOnImagesLoad={true}
          targetBlockWidth={calculatedMasonryWidth}
        >
          {displayedImages.map((image, index) => (
            <XBlock key={image.filename} className="flex-1 min-w-0">
              <GalleryImageCard
                image={image}
                index={index}
                onImageClick={handleImageClick}
              />
            </XBlock>
          ))}
        </XMasonry>

        <Lightbox
          images={allImages}
          initialImageIndex={currentLightboxImageIndex}
          isOpen={isLightboxOpen}
          onClose={handleCloseLightbox}
        />

        <div
          ref={observerTargetRef}
          className="flex items-center justify-center py-4"
        >
          {loadingRef.current ? (
            <p className="text-purple-800">Loading more images...</p>
          ) : (
            <button
              onClick={hasMore ? loadMore : scrollToHero}
              className="py-2 px-4 bg-purple-200 text-purple-800 rounded hover:bg-purple-300 transition-colors cursor-pointer"
            >
              {hasMore ? "Load More" : "Back to top"}
            </button>
          )}
        </div>
      </div>

      {showFloatingBackToTop && (
        <button
          onClick={scrollToHero}
          className={`fixed bottom-4 right-4 z-50
                      bg-[#363636] bg-opacity-30 rounded-full w-12 h-12 flex items-center justify-center
                      shadow-lg transition-opacity duration-300 ease-in-out cursor-pointer ${
                        isBodyScrollLocked ? "hidden" : ""
                      }`}
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
