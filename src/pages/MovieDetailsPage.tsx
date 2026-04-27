import React, { useEffect, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonButtons,
  IonBackButton, IonTitle, IonContent, IonButton,
  IonCard, IonCardContent, IonSpinner,IonList,IonItem,IonLabel,IonToggle,IonTextarea
} from "@ionic/react";
import { useParams } from "react-router";
import { fetchMovieDetails } from "../api/omdbApi";
import "./MovieDetailsPage.css";
import ShareSheet from "../components/ShareSheet";
import RecommendedMovies from "../components/RecommendedMovies";




export interface MovieDetails {
  Title: string;
  Year: string;
  Genre: string;
  Runtime: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
}


const MovieDetailsPage: React.FC = () => {

  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);

  // --- Load Movie ---
  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);

        // Check if already favorited
        const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(fav.some((m: any) => m.imdbID === id));

      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id]);


  // --- Add/Remove Favorite ---
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    let updated;
    if (isFavorite) {
      updated = favorites.filter((m: any) => m.imdbID !== id);
    } else {
      updated = [...favorites, movie];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };



  if (loading || !movie) {
    return (
      <IonPage>
        <IonContent className="center-loading">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="top">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{movie.Title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding detailpage">

        <IonCard className="details-card">
          <img
            className="details-poster"
            src={movie.Poster !== "N/A" ? movie.Poster : "/assets/no-image.jpg"}
            alt={movie.Title}
          />

          <IonCardContent>
            <h2>{movie.Title}</h2>
            <p>
              <strong>Year:</strong> {movie.Year} <br />
              <strong>Genre:</strong> {movie.Genre} <br />
              <strong>Runtime:</strong> {movie.Runtime} <br />
              <strong>Director:</strong> {movie.Director} <br />
              <strong>Actors:</strong> {movie.Actors} <br />
              <strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}
            </p>

            <h3>Plot</h3>
            <p className="plot">{movie.Plot}</p>

            <IonButton
              expand="block" className="favorite_btn"
              color={isFavorite ? "danger" : "primary"}
              onClick={toggleFavorite}
            >
              {isFavorite ? "Remove from Favorites ❤️" : "Add to Favorites 🤍"}
            </IonButton>

          </IonCardContent>
        </IonCard>

         {/* Share Section */}
    <ShareSheet movie={movie} />

    {/* Recommended Movies */}
<RecommendedMovies genre={movie.Genre} />


      </IonContent>
    </IonPage>
  );
};

export default MovieDetailsPage;
