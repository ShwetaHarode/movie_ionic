import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonToggle,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { personOutline, eyeOffOutline } from "ionicons/icons";
import "./Login.css";

export default function Login() {
  return (
    <IonPage>
      <IonContent fullscreen className="login-bg">

        <div className="login-container">

          <div className="login-card">

            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">
              Welcome back please login to your account
            </p>

            {/* Username */}
            <IonItem className="input-box" lines="none">
              <IonInput placeholder="User Name" />
              <IonIcon icon={personOutline} slot="end" className="input-icon" />
            </IonItem>

            {/* Password */}
            <IonItem className="input-box" lines="none">
              <IonInput type="password" placeholder="Password" />
              <IonIcon icon={eyeOffOutline} slot="end" className="input-icon" />
            </IonItem>

            {/* Remember Me */}
            <div className="remember-row">
              <IonToggle checked />
              <IonText>Remember Me</IonText>
            </div>

            {/* Login Button */}
            <IonButton expand="block" className="login-btn">
              Login
            </IonButton>

            {/* Signup Link */}
            <p className="signup-text">
              Don't have an account? <span>Signup</span>
            </p>

            <p className="credit">Created by anggidwiiputra</p>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
}
