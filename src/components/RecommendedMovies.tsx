import React, { useEffect, useState } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
} from "@ionic/react";
import { fetchRecommendedMovies } from "../api/omdbApi";

interface MovieSummary {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
}

interface Props {
  genre: string; // e.g. "Action, Adventure, Sci-Fi"
}

const RecommendedMovies: React.FC<Props> = ({ genre }) => {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const mainGenre = genre.split(",")[0].trim(); // Use the first genre

  useEffect(() => {
    async function load() {
      const result = await fetchRecommendedMovies(mainGenre);
      setMovies(result || []);
      setLoading(false);
    }
    load();
  }, [genre]);

  if (loading) {
    return (
      <IonCard>
        <IonCardContent className="ion-text-center">
          <IonSpinner name="crescent" />
        </IonCardContent>
      </IonCard>
    );
  }

  if (movies.length === 0) {
    return (
      <IonCard>
        <IonCardContent>No recommended movies found.</IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard className="recomend_card">
      <IonCardHeader>
        <IonCardTitle>Recommended Movies</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <IonList>
          {movies.map((m) => (
            <IonItem
              key={m.imdbID}
              routerLink={`/movie/${m.imdbID}`}
              detail={true}
            >
              <IonThumbnail slot="start">
                <IonImg
                  src={
                    m.Poster !== "N/A"
                      ? m.Poster
                      : "/assets/no-image.jpg"
                  }
                />
              </IonThumbnail>

              <IonLabel>
                <h2>{m.Title}</h2>
                <p>{m.Year}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default RecommendedMovies;
