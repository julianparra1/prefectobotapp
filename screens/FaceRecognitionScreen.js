import { Camera, CameraType } from 'expo-camera';
import { MaterialCommunityIcons  } from '@expo/vector-icons'; 
import * as FaceDetector from 'expo-face-detector';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useIsFocused } from '@react-navigation/native';

export default FaceRecognitionScreen = ({navigation}) => {
  const [type, setType] = useState(CameraType.front);
  const [faceDetection, setFaceDetection] = useState(true);
  const [detection, setDetection] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  
  const isFocused = useIsFocused();

  requestPermission();
  
  if (!permission) {
    navigation.goBack
  }
  async function resizeImgAsync(uri) {
    const resizedPhoto = await manipulateAsync(
      uri,
      [{ resize: { width: 780 } }],
      { compress: 1, format: 'jpeg' },
    );
  
    return resizedPhoto;
  };

  async function sendCapturedImageAsync(uri){
    
    // https://github.com/expo/examples/blob/master/with-formdata-image-upload/App.js
    let url = "http://192.168.1.200:5000/post";

    let uriArray = uri.split(".");
    let fileType = uriArray[uriArray.length - 1];

    let formData = new FormData();
    formData.append("photo", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    let options = {
      method: "POST",
      body: formData,
      mode: 'cors',
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    return await fetch(url, options)
  }

  async function captureFaceAsync() {
    console.log('capture')

    if(!this.camera){
      console.log('no cam');
    }

    if (!faceDetection) {
      console.log('no face');
    };

    const imgopts = {
      imageType: "jpg",
      quality: 0, 
      skipProcessing: true
    }


    this.camera.takePictureAsync(imgopts).then(async ({uri}) => {
      const resizedImg = await resizeImgAsync(uri)
      const response = await sendCapturedImageAsync(resizedImg.uri)
      const responeJSON = await response.json()
      console.log(responeJSON)
      if(responeJSON.response === "200 Success" && responeJSON.user){
        navigation.navigate('QrCode', {user: responeJSON.user })
      }
      
  });
    
  }
  
  
  const handleFacesDetected = async ({ faces }) => { 
    if (faces.length > 0) {
      setFaceDetection(true)
      setDetection(true)
    } else {
      setFaceDetection(false)
      setDetection(false)
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && <Camera ref={(r) => {this.camera = r}} ratio='1:1' type={type} onFacesDetected={handleFacesDetected}
              faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.none,
                minDetectionInterval: 1000,
              }} 
              style={styles.camera} 
              >
      </Camera> }

        <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: detection ?  "#A25AD6" : "#808080", borderRadius: 18 }]}>
          <Pressable disabled={!detection} style={styles.button} onPress={captureFaceAsync}>
            <MaterialCommunityIcons name="face-recognition" size={16} color="black" />
            <Text style={{ paddingLeft: 8, color: '#151718', fontSize: 16 }}>Log In!</Text>
          </Pressable>
        </View>

      <Text style={{ color: '#fff' }}>Bienvenido a la app!</Text>
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
