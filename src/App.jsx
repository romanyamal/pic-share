import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Gallery } from "./components/Gallery.jsx";
import { FavoritesProvider } from "./contexts/FavoritesContext.jsx";
import "./App.css";
import "./index.css";

function App() {
  return (
    <>
      <Hero></Hero>
      <FavoritesProvider>
        <Navbar></Navbar>
        <Gallery></Gallery>
      </FavoritesProvider>
    </>
  );
}

export default App;
