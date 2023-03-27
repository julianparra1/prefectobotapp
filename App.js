import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FaceRecognitionScreen from './screens/FaceRecognitionScreen';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import HomeScreen from './screens/HomeScreen'
import PrefectoScreen from './screens/PrefectoScreen';
import QrCodeScreen from './screens/QrCodeScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{ colors: { background: '#000' }}}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#26153A',
          },
          headerTintColor: '#fff',
        }}>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          
          options={{title: 'PrefectoBot',
          headerShown: false,
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}/>
        <Stack.Screen name="FaceRec" options={{headerShow: false, unmountOnBlur: true}} component={FaceRecognitionScreen} />
        <Stack.Screen name="QrCode" component={QrCodeScreen} />
        <Stack.Screen name="Prefecto" component={PrefectoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

registerForPushNotificationsAsync().then(token => console.log(token));
