import { Camera, CameraType } from 'expo-camera';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default QrCodeScreen = ({route, navigation}) => {
  const { user } = route.params
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  
  const isFocused = useIsFocused();

  requestPermission();
  
  if (!permission) {
    navigation.goBack
  }

  async function sendQrCodeAsync(qrdata){
    // https://github.com/expo/examples/blob/master/with-formdata-image-upload/App.js
    let url = "http://192.168.1.200:5000/post";

    const data = { string: qrdata };

    let options = {
      method: "POST",
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    return fetch(url, options)
  }
  
  const handleCodeScanned = async ({ data }) => { 
    if (data.length > 0) {
      sendQrCodeAsync(data)
    } else {
      console.log('No data!')
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && <Camera ref={(r) => {this.camera = r}} ratio='1:1' type={type} 
        onBarCodeScanned={handleCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        style={styles.camera} 
        /> }
      <Text style={{ color: '#fff' }}>Bienvenido {user}! escanea tu codigo QR en pantalla..</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    flex: 1,
    backgroundColor: '#26153A',
    alignItems: 'center',
    paddingTop: 20
},

  content: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#151718',
    alignItems: 'center',
  },
  camera: {
    width: 300,
    height: 300
  },
  buttonContainer: {
    marginTop: 10,
    width: 300,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  }
});
