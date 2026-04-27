import React, { useState } from "react";
import { 
  IonFab, 
  IonFabButton, 
  IonFabList, 
  IonIcon, 
  IonModal,
  IonButton
} from "@ionic/react";
import { 
  logoFacebook, 
  logoTwitter, 
  logoWhatsapp, 
  logoInstagram, 
  shareSocial 
} from "ionicons/icons";
// import Share from Capacitor
import { Share } from "@capacitor/share";
import "./ShareSheet.css";

interface ShareSheetProps {
  movie: {
    Title: string;
    Poster: string;
  };
}

const ShareSheet: React.FC<ShareSheetProps> = ({ movie }) => {
  const [showModal, setShowModal] = useState(false);

  const shareGeneric = async (text?: string, url?: string) => {
    try {
      await Share.share({
        title: movie.Title,
        text,
        url,
        dialogTitle: "Share with friends"
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const shareWhatsApp = async () => {
    const message = `Check out ${movie.Title}!`;
    await shareGeneric(message, window.location.href);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed" className="share-fab">
        <IonFabButton color="primary">
          <IonIcon icon={shareSocial} />
        </IonFabButton>

        <IonFabList side="top">
          <IonFabButton onClick={copyLink} title="Copy Link">
            <IonIcon icon={logoInstagram}  className="social-icon reddit"/>
          </IonFabButton>

          <IonFabButton onClick={shareWhatsApp} title="Share via WhatsApp">
            <IonIcon icon={logoWhatsapp} className="social-icon whatsapp" />
          </IonFabButton>

          <IonFabButton onClick={() => setShowModal(true)} title="More Social">
            <IonIcon icon={shareSocial} className="social-icon facebook"  />
          </IonFabButton>
        </IonFabList>
      </IonFab>

      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        className="share-bottom-modal"
      >
        <div className="modal-content">
          <h2>Share on Social Media</h2>

          <div className="modal-icons-row">
            <IonIcon
              icon={logoFacebook}
              className="social-icon facebook"
              onClick={() => shareGeneric(`Check out ${movie.Title}!`, window.location.href)}
            />
            <IonIcon
              icon={logoTwitter}
              className="social-icon twitter"
              onClick={() => shareGeneric(`Check out ${movie.Title}!`, window.location.href)}
            />
            <IonIcon
              icon={logoWhatsapp}
              className="social-icon whatsapp"
              onClick={shareWhatsApp}
            />
            <IonIcon
              icon={logoInstagram}
             className="social-icon reddit"
              onClick={() => shareGeneric(`Check out ${movie.Title}!`, window.location.href)}
            />
          </div>

          <IonButton expand="block" className="modal-close-btn" onClick={() => setShowModal(false)}>
            Close
          </IonButton>
        </div>
      </IonModal>
    </>
  );
};

export default ShareSheet;
