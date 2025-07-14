import { ImageCard } from "./ImageCard";
import { useFavorites } from "../contexts/FavoritesContext";

export const GalleryImageCard = ({ image }) => {
  const {
    addFavorite,
    removeFavorite,
    isFavorited: checkFavoritedStatus,
  } = useFavorites();

  const identifier = image.filename;
  const isFavorited = checkFavoritedStatus(identifier);

  const paddingTopPercentage = (image.height / image.width) * 100;

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      removeFavorite(identifier);
    } else {
      addFavorite(identifier);
    }
  };

  const getImageSource = (filename) => {
    return new URL(`../assets/photos/medium/${filename}`, import.meta.url).href;
  };

  const getOrigSource = (filename) => {
    return new URL(`../assets/photos/full/${filename}`, import.meta.url).href;
  };

  return (
    <div className="p-[2px]">
      <div className="relative group overflow-hidden">
        <div
          className="relative w-full bg-gray-100 flex items-center justify-center"
          style={{ paddingBottom: `${paddingTopPercentage}%` }}
        >
          <ImageCard imgSrc={getImageSource(identifier)} alt={identifier} />
        </div>
        <div className="absolute inset-0 h-full w-full transition-opacity flex flex-col justify-between opacity-0 group-hover:opacity-100 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex w-full items-center justify-between p-3">
            <div
              className="cursor-pointer select-none"
              onClick={handleFavoriteToggle}
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isFavorited ? "#FFFFFF" : "none"}
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <a
              href={getOrigSource(identifier.split(".")[0] + ".jpg")}
              className="cursor-pointer select-none"
              download={identifier.split(".")[0] + ".jpg"}
              aria-label={`Download ${identifier.split(".")[0]}`}
            >
              <span className="pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1"
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
    </div>
  );
};
