import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = sessionStorage.getItem("favorites");
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error(
        "Context Init Error: Failed to parse favorites from sessionStorage:",
        error
      );
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (identifier) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.includes(identifier)) {
        return [...prevFavorites, identifier];
      }
      return prevFavorites;
    });
  };

  const removeFavorite = (identifier) => {
    setFavorites((prevFavorites) => {
      return prevFavorites.filter((id) => id !== identifier);
    });
  };

  const isFavorited = (identifier) => {
    return favorites.includes(identifier);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorited }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
