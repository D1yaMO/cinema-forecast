
import { useState } from "react";
import "./App.css";
import {
  getWeather,
  getMovies,
  getMovieByTitle,
} from "./services/api";

function App() {
  const [city, setCity] = useState("");
  const [movieQuery, setMovieQuery] = useState("");

  const [weather, setWeather] = useState(null);
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
const [loadingMovies, setLoadingMovies] = useState(false);
const [weatherError, setWeatherError] = useState("");
const [movieError, setMovieError] = useState("");

  const handleWeatherSearch = async () => {
  if (!city.trim()) return;

  try {
    setWeatherError("");
    setWeather(null);
    setLoadingWeather(true);

    const weatherData = await getWeather(city);
    setWeather(weatherData);
    let recommendedTitles = [];

const condition = weatherData.weather[0].main;

if (condition === "Clear") {
  recommendedTitles = [
    "La La Land",
    "Mamma Mia!",
    "Luca",
    "The Secret Life of Walter Mitty",
  ];
} else if (condition === "Clouds") {
  recommendedTitles = [
    "Interstellar",
    "Harry Potter",
    "Knives Out",
    "Arrival",
  ];
} else if (condition === "Rain") {
  recommendedTitles = [
    "The Batman",
    "Blade Runner 2049",
    "Shutter Island",
    "Prisoners",
  ];
}
const movieResults = await Promise.all(
  recommendedTitles.map(async (title) => {
    try {
      const movie = await getMovieByTitle(title);
      return movie || null;
    } catch (err) {
      return null;
    }
  })
);

const validMovies = movieResults.filter(Boolean);

setRecommendedMovies(validMovies);
  } catch (err) {
  

  setWeather(null);
  setWeatherError("City not found");

  console.error("Weather Error:", err);


  } finally {
    setLoadingWeather(false);
  }
};

  const handleMovieSearch = async () => {
  if (!movieQuery.trim()) return;

  try {
    setMovieError("");
    setLoadingMovies(true);

   const movieData = await getMovies(movieQuery);

if (movieData.results?.length > 0) {
  setMovies(movieData.results);
} else {
  setMovies([]);
  setMovieError("No movies found");
}
  } catch (err) {
  setMovies([]);
  setMovieError("Failed to fetch movies");
  console.error("Movie Error:", err);

  } finally {
    setLoadingMovies(false);
  }
};
let mood = "";

if (weather) {
  const condition = weather.weather[0].main;

  if (condition === "Clear") {
    mood = "☀ Sunny Escapes";
  } else if (condition === "Clouds") {
    mood = "☁ Cozy Evening Cinema";
  } else if (condition === "Rain") {
    mood = "🌧 Rainy Day Picks";
  } else if (condition === "Thunderstorm") {
    mood = "⚡ Dark & Intense";
  } else if (condition === "Snow") {
    mood = "❄ Winter Wonders";
  } else {
    mood = "🎬 Movie Time";
  }
}

console.log("weather:", weather);
console.log("recommendedMovies:", recommendedMovies);


  return (
    <div className="app">
      <div className="hero">
  <h1>🎬 Cinema Forecast</h1>
  <p className="subtitle">
    Discover movies that match today's atmosphere.
  </p>
</div>

      {/* WEATHER SECTION */}
      <div className="section">
        <h2>🌤 Weather Search</h2>

        <div className="search-row">

 <input
  className="search-input"
  type="text"
  placeholder="Enter city name"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  
/>

<button
  className="search-button"
  onClick={handleWeatherSearch}
  disabled={loadingWeather}
>
  {loadingWeather ? "Loading..." : "Get Weather"}
</button>
</div>
{weatherError && (
  <p style={{ color: "red", marginTop: "10px" }}>
    ❌ {weatherError}
  </p>
)}

        {weather && (
          <div className="weather-details">
            <h3>{weather.name}</h3>
            <p>🌡 Temperature: {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌥 Condition: {weather.weather[0].main}</p>
            <h3>Today's Mood</h3>
            <p>{mood}</p>


          </div>
        )}
      </div>
      {recommendedMovies.length > 0 && (
  <div className="section">
    <h2>🎬 Recommended For You!</h2>

    <div className="recommendation-row">
      {recommendedMovies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />

          <h4>{movie.title}</h4>

          <p>
            {movie.release_date
              ? movie.release_date.substring(0, 4)
              : "Unknown Year"}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

      {/* MOVIE SECTION */}
      <div className="section">
        <h2>🎬 Movie Search</h2>

<div className="search-row">
  <input
    className="search-input"
    type="text"
    placeholder="Enter movie name"
    value={movieQuery}
    onChange={(e) => setMovieQuery(e.target.value)}
  />

  <button
    className="search-button"
    onClick={handleMovieSearch}
    disabled={loadingMovies}
  >
    {loadingMovies ? "Searching..." : "Search Movies"}
  </button>
</div>

{movieError && (
  <p style={{ color: "red", marginTop: "10px" }}>
    ❌ {movieError}
  </p>
)}

        <div className="movie-grid">
         {movies.map((movie) => (
  <div key={movie.id} className="movie-card">

    {movie.poster_path ? (
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
    ) : (
      <div className="no-poster">
        No Poster
      </div>
    )}

    <div className="movie-info">
      <h4>{movie.title}</h4>

      <p>
        {movie.release_date
          ? movie.release_date.substring(0, 4)
          : "Unknown Year"}
      </p>
    </div>

  </div>
))}
        </div>
      </div>
    </div>
  );
}

export default App;