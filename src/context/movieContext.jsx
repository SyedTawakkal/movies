import { createContext, useContext, useState } from "react";

// Create Context
const MovieContext = createContext();

// Context Provider Component
export const MovieProvider = ({ children }) => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  return (
    <MovieContext.Provider value={{ selectedMovieId, setSelectedMovieId }}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom Hook for using MovieContext
export const useMovie = () => {
  return useContext(MovieContext);
};

export default MovieContext;
