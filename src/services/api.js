const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export async function getWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_KEY}&units=metric`
  );

  const data = await res.json();

  if (data.cod !== 200) {
    throw new Error(data.message || "City not found");
  }

  return data;
}

export async function getMovies(query) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB_KEY}`
  );

  if (!res.ok) {
    throw new Error("Movie API failed");
  }

  return res.json();
}

export async function getMovieByTitle(title) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${TMDB_KEY}`
  );

  if (!res.ok) {
    throw new Error("Movie lookup failed");
  }

  const data = await res.json();

  return data.results[0];
}