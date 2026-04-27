import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from "@ionic/react";
import "./MovieCard.css";
import { useHistory } from "react-router-dom";


interface MovieCardProps {
  title: string;
  year: string;
  type: string;
  poster: string;
  imdbID: string
}

const MovieCard: React.FC<MovieCardProps> = ({ title, year, type, poster, imdbID }) => {
  const history = useHistory();
 

  return (
    <IonCard onClick={() => history.push(`/movie/${imdbID}`)} className="movie-card">
      <IonImg src={poster !== "N/A" ? poster : "/assets/no-poster.png"} alt={title} />
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p><strong>Year:</strong> {year}</p>
        <p><strong>Type:</strong> {type}</p>
      </IonCardContent>
    </IonCard>
  );
};

export default MovieCard;
