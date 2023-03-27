import { Camera, CameraType } from 'expo-camera';
import { MaterialCommunityIcons  } from '@expo/vector-icons'; 
import * as FaceDetector from 'expo-face-detector';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default PrefectoScreen = ({navigation}) => {
  const [type, setType] = useState(CameraType.front);
  const [faceDetection, setFaceDetection] = useState(true);
  const [detection, setDetection] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  
  requestPermission();
  
  if (!permission) {
    navigation.goBack
  }

  function toggleCameraType() {
    setFaceDetection(false)
    setType(current => (current === CameraType.front ? CameraType.back : CameraType.front));
  }
  
  
  const handleFacesDetected = ({ faces }) => { 
    if (faceDetection) {
      if (faces.length > 0) {
        setDetection(true)
      } else {
        setDetection(false)
      };
    };
  };

  return (
    <View style={styles.container}>
      <Camera ratio='1:1' type={type} onFacesDetected={handleFacesDetected}
              faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.none,
                minDetectionInterval: 1000,
              }} 
              style={styles.camera} 
              >
      </Camera>

        <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: detection ?  "#A25AD6" : "#808080", borderRadius: 18 }]}>
          <Pressable disabled={!detection} style={styles.button} onPress={toggleCameraType}>
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