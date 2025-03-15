import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Search from "./Search.jsx";
import Loader from "./Loader.jsx";
import MovieCard from "./MovieCard.jsx";
import useCustomDebounce from "../hooks/useCustomDebounce.js";
import { updateSearchCount, getTrendingMovies } from "../appwrite.js";
import { useMovie } from "../context/movieContext.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedMovieId } = useMovie();

  const getPageFromURL = () => {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get("page")) || 1;
  };

  const handleClick = (id) => {
    setSelectedMovieId(id);
    navigate(`/movie/${id}`);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(getPageFromURL());
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageTrending, setErrorMessageTrending] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const debounceSearch = useCustomDebounce(searchTerm, 1000);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("page", pageNumber);
    navigate(`?${params.toString()}`, { replace: true });
  }, [pageNumber, navigate]);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setIsLoadingTrending(true);
        const trendingMoviesData = await getTrendingMovies();
        setTrendingMovies(trendingMoviesData);
      } catch (err) {
        setErrorMessageTrending(err.message);
      } finally {
        setIsLoadingTrending(false);
      }
    };
    loadTrendingMovies();
  }, []);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?&page=${pageNumber}&sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Unable to fetch Data");
      }
      const data = await response.json();
      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearch);
  }, [debounceSearch, pageNumber]);

  function handleNext() {
    setPageNumber((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePrev() {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  return (
    <>
      <Header />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <section className="min-h-[400px]">
        {isLoadingTrending ? (
          <div className="mt-7">
            <Loader />
          </div>
        ) : errorMessageTrending ? (
          <div className="text-red-500 text-center mt-8">
            {errorMessageTrending}
          </div>
        ) : (
          trendingMovies.length > 0 && (
            <div className="flex justify-center">
              <section className="trending flex flex-col justify-center items-center max-w-[90%] overflow-auto">
                <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li
                      key={movie.$id}
                      className="cursor-pointer"
                      onClick={() => handleClick(movie.movie_id)}
                    >
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )
        )}
      </section>
      <h2 className="text-center">ALL MOVIES</h2>
      <section className="flex justify-center mt-10 min-h-[400px]">
        {isLoading ? (
          <Loader />
        ) : errorMessage ? (
          <div className="text-red-500">{errorMessage}</div>
        ) : (
          <div className="flex justify-center gap-8 flex-wrap">
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <div className="text-white mt-5 mb-10 flex justify-center gap-4 items-center">
        <button
          className="border px-5 py-1 rounded-lg cursor-pointer disabled:opacity-50"
          onClick={handlePrev}
          disabled={pageNumber === 1}
        >
          Prev
        </button>
        <button
          className="border px-5 py-1 rounded-lg cursor-pointer"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Home;
