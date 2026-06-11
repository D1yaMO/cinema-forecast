import { useState } from "react";
import { getWeather, getMovies } from "./services/api";

function App() {
  const [city, setCity] = useState("");
  const [movieQuery, setMovieQuery] = useState("");

  const [weather, setWeather] = useState(null);
  const [movies, setMovies] = useState([]);
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

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
  🌤 Weather + 🎬 Movie Finder
</h1>

      {/* WEATHER SECTION */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>🌤 Weather Search</h2>

        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            marginRight: "10px",
          }}
        />

        <button
  onClick={handleWeatherSearch}
  disabled={loadingWeather}
>
  {loadingWeather ? "Loading..." : "Get Weather"}
</button>
{weatherError && (
  <p style={{ color: "red", marginTop: "10px" }}>
    ❌ {weatherError}
  </p>
)}

        {weather && (
          <div style={{ marginTop: "20px" }}>
            <h3>{weather.name}</h3>
            <p>🌡 Temperature: {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌥 Condition: {weather.weather[0].main}</p>
          </div>
        )}
      </div>

      {/* MOVIE SECTION */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <h2>🎬 Movie Search</h2>

        <input
          type="text"
          placeholder="Enter movie name"
          value={movieQuery}
          onChange={(e) => setMovieQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            marginRight: "10px",
          }}
        />

        <button
  onClick={handleMovieSearch}
  disabled={loadingMovies}
>
  {loadingMovies ? "Searching..." : "Search Movies"}
</button>
{movieError && (
  <p style={{ color: "red", marginTop: "10px" }}>
    ❌ {movieError}
  </p>
)}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
         {movies.map((movie) => (
  <div
    key={movie.id}
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "10px",
      textAlign: "center",
    }}
  >
    {movie.poster_path ? (
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{
          width: "100%",
          borderRadius: "8px",
        }}
      />
    ) : (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ccc",
        }}
      >
        No Poster
      </div>
    )}

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
    </div>
  );
}

export default App;