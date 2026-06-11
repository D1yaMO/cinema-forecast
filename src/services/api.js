const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

// Safety check (helps debugging)
if (!WEATHER_KEY || !TMDB_KEY) {
  console.warn("Missing API keys in .env file");
}

// WEATHER API
export async function getWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
  );

  if (!res.ok) {
    throw new Error("Weather API failed");
  }

  const data = await res.json();

return data;
}

// MOVIE API
export async function getMovies(query) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${TMDB_KEY}`
  );

  if (!res.ok) {
    throw new Error("Movie API failed");
  }

  return res.json();
}
export async function getMovieByTitle(title) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${TMDB_KEY}`
  );

  if (!res.ok) {
    throw new Error("Movie lookup failed");
  }

  const data = await res.json();

  return data.results[0];
}