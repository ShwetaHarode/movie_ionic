import React, { useState } from 'react';
import { Camera } from '@capacitor/camera';

import {IonButton} from "@ionic/react";

const ImagePicker: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  const pickImages = async () => {
    try {
      const result = await Camera.pickImages({
        quality: 80,
        limit: 10,        // max images (default unlimited)
        width: 1024,      // optional resize
        height: 1024,
      });

      const imageUrls = result.photos.map(photo => photo.webPath!);
      setPhotos(imageUrls);

    } catch (err) {
      console.error('Error picking images', err);
    }
  };

  return (
    <div>
      <IonButton onClick={pickImages}>Pick Images</IonButton>

      <div style={{ marginTop: "20px" }}>
        {photos.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="selected"
            style={{ width: "120px", marginRight: "10px", borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImagePicker;


