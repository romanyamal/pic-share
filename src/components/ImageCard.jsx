import React, { useState } from "react";

export const ImageCard = ({ imgSrc, alt }) => {
  // Now accepts only 'imgSrc'
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true); // Set error state if the image fails to load
  };

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500 p-4 text-center">
        <span className="text-sm">Image failed to load 😞</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc} // Directly use the single image source
      alt={alt}
      className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out opacity-100"
      onError={handleError} // Still handle errors
      loading="lazy" // Keep lazy loading for performance
    />
  );
};
