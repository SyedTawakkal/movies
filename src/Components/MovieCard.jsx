import React from "react";
import { useNavigate } from "react-router-dom";
import { useMovie } from "../context/movieContext.jsx"; // Import context hook

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { setSelectedMovieId } = useMovie(); // Get setter from context

  const handleClick = () => {
    setSelectedMovieId(movie.id); // Store movie ID in context
    navigate(`/movie/${movie.id}`); // Navigate to MovieDetail page
  };

  return (
    <div className="movie-card cursor-pointer" onClick={handleClick}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : "/No-Poster.svg"
        }
        alt={movie.title || "Unknown"}
      />

      <div className="mt-4">
        <h3>{movie.title || "Unknown"}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star Icon" />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>•</span>
          <p className="lang">{movie.original_language || "N/A"}</p>

          <span>•</span>
          <p className="year">
            {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
