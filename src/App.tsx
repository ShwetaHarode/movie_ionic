import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect } from 'react';

import { PushNotifications } from '@capacitor/push-notifications';

import MovieSearch from './pages/MovieSearch';
import MovieDetailsPage from './pages/MovieDetailsPage';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';

setupIonicReact();

/* ---------------- PUSH NOTIFICATION FUNCTIONS ---------------- */

const addListeners = async () => {
  await PushNotifications.addListener('registration', token => {
    console.info('Registration token:', token.value);
  });

  await PushNotifications.addListener('registrationError', err => {
    console.error('Registration error:', err.error);
  });

  await PushNotifications.addListener(
    'pushNotificationReceived',
    notification => {
      console.log('Push notification received:', notification);
    }
  );

  await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    notification => {
      console.log(
        'Push notification action performed',
        notification.actionId,
        notification.inputValue
      );
    }
  );
};

const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    console.warn('Push permission not granted');
    return;
  }

  await PushNotifications.register();
};

/* ---------------- APP COMPONENT ---------------- */

const App: React.FC = () => {
  useEffect(() => {
    const initPush = async () => {
      await addListeners();
      await registerNotifications();
    };

    initPush();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Movie Search Page */}
          <Route exact path="/movies" component={MovieSearch} />

          {/* Movie Details Page */}
          <Route exact path="/movie/:id" component={MovieDetailsPage} />

          {/* Default redirect */}
          <Route exact path="/">
            <Redirect to="/movies" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
