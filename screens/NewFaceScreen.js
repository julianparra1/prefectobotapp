import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { manipulateAsync } from 'expo-image-manipulator';
import { MaterialCommunityIcons  } from '@expo/vector-icons'; 
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';



export default NewFaceScreen = ({route, navigation}) => {
  const { user } = route.params
  const [type, setType] = useState(CameraType.back);
  const [detection2, setDetection2] = useState(false);
  const [userName, setUserName] = useState('');

  const isFocused = useIsFocused();
  
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
    let url = "http://192.168.1.200:5000/new";

    let uriArray = uri.split(".");
    let fileType = uriArray[uriArray.length - 1];

    let formData = new FormData();

    formData.append("photo", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    formData.append("user", `${userName}`);

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
    console.log('Capturing...')

    if(!this.newfacecam){
      console.log('Camera somehow not working wth!!!!');
    }

    if(userName === ''){
      Alert.alert('No text', 'El campo de usuario no puede estar vacio!!');
      return
    }

    // if (!detection2) {
    //   console.log('no face');
    // };

    const imgopts = {
      imageType: "jpg",
      quality: 0, 
      skipProcessing: true
    }


    this.newfacecam.takePictureAsync(imgopts).then(async ({uri}) => {
      const resizedImg = await resizeImgAsync(uri)
      const response = await sendCapturedImageAsync(resizedImg.uri)
      const responeJSON = await response.json()
      console.log(responeJSON)
      if(responeJSON.response === "200 Success" && responeJSON.user){
        this.newfacecam.pausePreview()
        navigation.navigate('HomeScreen', {user: responeJSON.user })
    }});

  };
  
  const handleFacesDetected = async ({ faces }) => { 
    if (faces.length > 0) {
      setDetection2(true)
    } else {
      setDetection2(false)
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Camera ref={(r) => {this.newfacecam = r}}  ratio='1:1' type={type} onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 1000,
          }} 
          style={styles.camera} 
          />
      </View> 
      <TextInput
          value={userName}
          onChangeText={(userName) => setUserName(userName)}
          placeholder={'Nombre de usuario'}
          style={styles.input}
        />
      <View style={[styles.buttonContainer, { borderColor: detection2 ?  "#A25AD6" : "#808080" }]}>
        <Pressable disabled={!detection2} style={styles.button} onPress={captureFaceAsync}>
          <MaterialCommunityIcons name="face-recognition" size={16} color="black" />
          <Text style={{ paddingLeft: 8, color: '#151718', fontSize: 16 }}>Registrar nuevo usuario</Text>
        </Pressable>
      </View>
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
  input: {
    textAlign: 'center',
    borderColor: "#8ED65A",
    borderRadius: 8,
    borderWidth: 4,
    padding: 20,
    marginTop: 10,
    width: 300,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    borderRadius: 18,
    borderWidth: 4,
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