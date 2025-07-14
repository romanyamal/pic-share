// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { Modal } from "./Modal";

import allImageData from "../assets/photos/medium/image_data.json";
// import allPhotosZip from "../assets/photos/alex+sara.zip?url";

export const Navbar = () => {
  const { removeFavorite, favorites } = useFavorites();

  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [favoritedImagesDetails, setFavoritedImagesDetails] = useState([]);

  useEffect(() => {
    // Determine if a scrollbar is present AND consuming layout space
    // This is typically true on desktop, false on mobile (overlay scrollbars)
    const isScrollbarPresentAndConsumingSpace =
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const isTouchDevice = "ontouchstart" in window;

    if (showFavoritesModal) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      if (!isTouchDevice && isScrollbarPresentAndConsumingSpace) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.touchAction = "";
    };
  }, [showFavoritesModal]);

  useEffect(() => {
    console.log(
      "Navbar Effect: 'favorites' from context updated to:",
      favorites
    );
    if (Array.isArray(favorites) && favorites.length > 0) {
      const resolvedFavorited = allImageData
        .filter((image) => favorites.includes(image.filename))
        .map((image) => ({
          ...image,
          resolvedSrc: getImageSource(image.filename),
        }));
      setFavoritedImagesDetails(resolvedFavorited);
      console.log(
        "Navbar Effect: Resolved favorited images for modal:",
        resolvedFavorited
      );
    } else {
      setFavoritedImagesDetails([]);
      console.log(
        "Navbar Effect: 'favorites' from context is empty or not an array. Clearing modal images."
      );
    }
  }, [favorites]);

  const handleOpenModal = () => {
    setShowFavoritesModal(true);
  };

  const getImageSource = (filename) => {
    return new URL(`../assets/photos/medium/${filename}`, import.meta.url).href;
  };

  const getOrigSource = (filename) => {
    return new URL(`../assets/photos/full/${filename}`, import.meta.url).href;
  };

  return (
    <nav
      className="sticky top-0 z-10 flex h-16 items-center bg-white px-4 shadow-sm lg:px-12"
      id="gallery-nav"
    >
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">a6400_pixels</h1>
        <div className="flex items-center gap-8">
          <button
            onClick={handleOpenModal}
            className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Show favorited images"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={favorites.length > 0 ? "#000000" : "#FFFFFF"}
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {favorites && favorites.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {favorites.length}
              </span>
            )}
          </button>
          <div className="relative flex items-center group">
            <a
              // href={allPhotosZip}
              download="alex+sara.zip"
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
              </svg>
            </a>
            <span className="absolute -bottom-8 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              currently not working
            </span>
          </div>
        </div>
      </div>

      <Modal
        isVisible={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        bgColor="bg-white"
      >
        <div className="flex flex-col justify-center text-center items-center text-primaryft m-8">
          <h2 className="text-md sm:text-lg md:text-2xl font-bold mb-4 text-center text-gray-800">
            Your Favorited Images ❤️
          </h2>
          <div className="overflow-y-auto max-h-[calc(85vh-150px)]">
            {favoritedImagesDetails && favoritedImagesDetails.length === 0 ? (
              <p className="text-center text-gray-500 text-sm sm:text-md">
                You haven't favorited any images yet. Click the heart on an
                image to add it here!
              </p>
            ) : (
              <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 xlg:columns-5 gap-4">
                {favoritedImagesDetails.map((image) => (
                  <div
                    key={image.filename}
                    className="mb-4 break-inside-avoid relative group rounded-sm overflow-hidden shadow-md"
                  >
                    <img
                      src={image.resolvedSrc}
                      alt={image.filename}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 h-full w-full transition-opacity flex flex-col justify-between opacity-0 group-hover:opacity-100 bg-gradient-to-b from-black/50 to-transparent">
                      <div className="flex w-full flex-col items-center justify-center m-auto gap-4 md:gap-8">
                        <div
                          className="cursor-pointer select-none"
                          onClick={() => removeFavorite(image.filename)}
                          aria-label="Remove from favorites"
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
                            <circle cx="12" cy="12" r="10"></circle>
                            <line
                              x1="4.93"
                              y1="4.93"
                              x2="19.07"
                              y2="19.07"
                            ></line>
                          </svg>
                        </div>
                        <a
                          href={getOrigSource(
                            image.filename.split(".")[0] + ".jpg"
                          )}
                          className="cursor-pointer select-none"
                          download={image.filename.split(".")[0] + ".jpg"}
                          aria-label={`Download ${
                            image.filename.split(".")[0] + ".jpg"
                          }`}
                        >
                          <span className="pointer-events-none">
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
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </nav>
  );
};
