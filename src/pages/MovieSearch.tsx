import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonGrid, IonRow, IonCol, IonSpinner,
  IonSearchbar,
  IonCard
} from "@ionic/react";

import { fetchMovies } from "../api/omdbApi";
import MovieCard from "../components/MovieCard";
import ClipboardExample from "../components/ClipboardExample";
import FileDemo from "../components/FileDemo";
import FileManager from "../components/FileManager";
import Login from "../components/Login";
 

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}


const MovieSearch: React.FC = () => {
  

  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async () => {
    if (!query.trim()) {
      setError("Please enter movie name");
      return;
    }
     setLoading(true);
    setError("");

    try {
      const results = await fetchMovies(query, type);
      setMovies(results);
    }
    catch (err) {
     setError(err instanceof Error ? err.message : "Unexpected error");
      setMovies([]);
    }
   finally {
    setLoading(false);
  }
  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar className="top">
          <IonTitle>🎬 Movie Finder</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding movie-bg">

        {/* Search Box */}
        <IonItem className="search-box">
          <IonSearchbar
            value={query}
            placeholder="Enter movie title..."
            onIonChange={(e) => setQuery(e.detail.value!)}
          />
        </IonItem>

        {/* Type Select */}
        <IonItem className="select">
          <IonLabel>Type</IonLabel>
          <IonSelect
            value={type}
            placeholder="Select type"
            onIonChange={(e) => setType(e.detail.value)} slot="end"
          >
            <IonSelectOption value="">All</IonSelectOption>
            <IonSelectOption value="movie">Movie</IonSelectOption>
            <IonSelectOption value="series">Series</IonSelectOption>
            <IonSelectOption value="episode">Episode</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* Search Button */}
        <IonButton expand="block" onClick={searchMovies} className="search_btn">
          Search
        </IonButton>

        {loading && (
          <div className="center-loading">
            <IonSpinner name="crescent" />
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        {/* Movie Results */}
        <IonGrid>
          <IonRow>
            {movies.map((m) => (
              <IonCol size="12" size-md="6" size-lg="4" key={m.imdbID}>
                <MovieCard
                 imdbID={m.imdbID}
                  title={m.Title}
                  year={m.Year}
                  type={m.Type}
                  poster={m.Poster}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
 

  <ClipboardExample />
  <FileDemo/>

 
  

      </IonContent>
      
    </IonPage>

  
  );
};

export default MovieSearch;
