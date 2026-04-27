const API_KEY = "3e16eb71";
const BASE_URL = "https://www.omdbapi.com/";

export const fetchMovies = async (title: string, type: string = "") => {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${title}&type=${type}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data.Search;
};

export const fetchMovieDetails = async (imdbID: string) => {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "False") {
   throw new Error(data.Error || "Failed to load movie");
  }

  return data;
};


export async function fetchRecommendedMovies(genre: string) {
  try {       
    const response = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(
        genre
      )}&type=movie&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data.Search) {
      return data.Search.slice(0, 6); // return first 6 results
    }

    return [];
  } catch (err) {
    console.error("Error fetching recommended movies:", err);
    return [];
  }
}