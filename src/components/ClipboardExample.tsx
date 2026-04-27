import React, { useState } from 'react';
import {
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonToast,
  IonIcon
} from '@ionic/react';
import { Clipboard } from '@capacitor/clipboard';
import { copyOutline } from 'ionicons/icons';

const ClipboardExample: React.FC = () => {
  const [text, setText] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const copyText = async () => {
    try {
      if (!text.trim()) {
        setToastMessage("Please enter some text first.");
        setShowToast(true);
        return;
      }

      await Clipboard.write({ string: text });
      setToastMessage("Text copied to clipboard!");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Failed to copy text.");
      setShowToast(true);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <IonItem>
        <IonInput
          value={text}
          onIonChange={(e) => setText(e.detail.value!)}
          label="Write Text"
          labelPlacement="floating"
          placeholder="Enter text"
        />
        {/* Copy Icon on Right */}
        <IonIcon
          icon={copyOutline}
          slot="end"
          style={{ cursor: text.trim() ? "pointer" : "not-allowed" }}
          onClick={copyText}
          color={text.trim() ? "primary" : "medium"}
        />
      </IonItem>

      {pastedText && (
        <IonText style={{ marginTop: 20, display: "block" }}>
          <strong>Pasted Text:</strong> {pastedText}
        </IonText>
      )}

      {/* Toast Notifications */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={1500}
        onDidDismiss={() => setShowToast(false)}
        position="bottom"
      />
    </div>
  );
};

export default ClipboardExample;
