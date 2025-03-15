import { useEffect, useState } from "react";
import { useMovie } from "../context/movieContext.jsx";
import { FaStar } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { MdIndeterminateCheckBox } from "react-icons/md";

function MovieDetail() {
  const { selectedMovieId } = useMovie(); // Get movie ID from context
  const [currentMovie, setCurrentMovie] = useState(null);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  };

  const fetchSpecificMovie = async () => {
    try {
      const url = `${API_BASE_URL}/movie/${selectedMovieId}?language=en-US`;
      const response = await fetch(url, API_OPTIONS);
      const movie = await response.json();
      setCurrentMovie(movie);
      console.log(movie);
    } catch (err) {
      console.error("Error fetching movie:", err);
    }
  };

  useEffect(() => {
    if (selectedMovieId) {
      fetchSpecificMovie();
    }
  }, [selectedMovieId]);

  if (!selectedMovieId) {
    return (
      <h2 className="text-center text-xl text-white mt-10">
        No Movie Selected
      </h2>
    );
  }

  if (!currentMovie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen text-white">
      {/* Background Image */}
      {currentMovie.poster_path && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${currentMovie.backdrop_path})`,
          }}
        ></div>
      )}

      {/* Overlay to improve readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Movie Title */}
      {/* <h2 className="relative text-3xl font-bold">{currentMovie.title}</h2> */}
      <div className="flex flex-col md:flex-row justify-center md:items-center">
        <div className="relative w-70 md:w-96 top-10 left-7.5 md:left-[-100px]">
          <img
            className="w-full rounded-2xl"
            src={`https://image.tmdb.org/t/p/w780/${currentMovie.poster_path}`}
            alt=""
          />
        </div>
        <div className="relative top-16 md:left-30 left-10 w-[70%] md:w-[700px]">
          <h1 className="md:text-6xl text-start">
            {currentMovie.original_title}
          </h1>
          <div className="flex md:gap-6 gap-1 md:mt-5">
            <div className="flex items-center">
              <FaStar className="text-amber-400 md:text-3xl text-xl" />
              <span className="md:text-3xl ml-2">
                {currentMovie.vote_average.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center md:text-5xl">
              <span>•</span>
            </div>
            <div className="flex items-center  md:text-5xl">
              <span className="md:text-3xl">
                {currentMovie.genres[0].name}{" "}
              </span>
            </div>
            <div className="flex items-center  md:text-5xl">
              <span>•</span>
            </div>
            <div className="flex items-center">
              <IoIosTime className=" md:text-3xl text-xl" />
              <span className="md:text-3xl ml-2">
                {currentMovie.runtime} minutes
              </span>
            </div>
          </div>
          <div className="mt-10">
            <span className="md:text-3xl">Overview</span>
            <div className="flex">
              {currentMovie.genres
                .filter((el, index) => index <= 4 && index !== 0) // Ensure index is not 0
                .map((el, index, arr) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-3 mt-2.5"
                  >
                    <span className="md:text-xl">{el.name}</span>
                    {index !== arr.length - 1 && (
                      <span className="text-2xl mr-3">•</span>
                    )}
                  </div>
                ))}
            </div>
            <p className="mt-5">{currentMovie.overview}</p>
            <div className="mt-10 text-xl">
              <span>By : {currentMovie.production_companies[0].name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
