// src/components/Lightbox.jsx
import { useState, useEffect, useCallback } from "react";
import { useFavorites } from "../contexts/FavoritesContext";

export const Lightbox = ({ images, initialImageIndex, onClose, isOpen }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  const currentImage = images[currentIndex];
  const isFavorite = favorites.includes(currentImage.filename);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setCurrentIndex(initialImageIndex);
    if (isOpen) {
      setIsImageLoading(true);
    }
  }, [initialImageIndex, isOpen]);

  useEffect(() => {
    if (!isOpen || !images || images.length === 0) return;

    // Preload next image
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImageFilename = images[nextIndex].filename;
    const nextImageUrl = getOrigSource(nextImageFilename);
    const imgNext = new Image();
    imgNext.src = nextImageUrl;

    // Preload previous image
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const prevImageFilename = images[prevIndex].filename;
    const prevImageUrl = getOrigSource(prevImageFilename);
    const imgPrev = new Image();
    imgPrev.src = prevImageUrl;
  }, [currentIndex, images, isOpen]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const getOrigSource = (filename) => {
    const identifier = filename.split(".")[0];
    return new URL(`/src/assets/photos/full/${identifier}.jpg`, import.meta.url)
      .href;
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(currentImage.filename);
    } else {
      addFavorite(currentImage.filename);
    }
  };

  const handleDownload = () => {
    const filename = currentImage.filename;
    const originalImageUrl = getOrigSource(filename);
    const link = document.createElement("a");
    link.href = originalImageUrl;
    link.download = filename.split(".")[0] + ".jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrev = () => {
    setIsImageLoading(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsImageLoading(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/92 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative p-4 sm:p-6 lg:p-8 w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <button
            onClick={handleToggleFavorite}
            className="p-2 rounded-full cursor-pointer"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isFavorite ? "#FFFFFF" : "none"}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-full cursor-pointer"
            aria-label="Download image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
            </svg>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full cursor-pointer"
            aria-label="Close lightbox"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="absolute flex top-4 left-4 text-white text-lg font-semibold z-10 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full pt-12 pb-5">
          <div className="flex-grow flex-shrink flex items-center justify-center w-full overflow-hidden">
            {isImageLoading && (
              <div className="text-white text-lg">Loading image...</div>
            )}
            <img
              src={getOrigSource(currentImage.filename)}
              alt={currentImage.filename}
              className={`max-h-full max-w-full object-contain ${
                isImageLoading ? "hidden" : ""
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </div>
          <p className="text-gray-500 text-center text-sm sm:text-base mt-2 flex-shrink-0">
            {currentImage.filename.split(".")[0] + ".jpg"}
          </p>
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-4 bg-black/40 top-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer hover:scale-130 duration-150 transition-scale"
          aria-label="Previous image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 bg-black/40 top-1/2 -translate-y-1/2 p-2 rounded-full hover:scale-130 duration-150 transition-scale cursor-pointer"
          aria-label="Next image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};
