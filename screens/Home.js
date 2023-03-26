import { MaterialCommunityIcons  } from '@expo/vector-icons'; 
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
const PrefectoBotImage = require('../assets/images/prefectobot.png');

export default HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image source={PrefectoBotImage} style={styles.image} />
        </View>
        <Text style={styles.title}>Prefecto
            <Text style={{color: '#A25AD6'}}>Bot</Text>
        </Text>
        <Text style={{ paddingLeft: 8, color: '#fff', fontSize: 16, fontWeight: '100' }}>A p l i c a c i o n  M o v i l</Text>
        <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#A25AD6", borderRadius: 18 }]}>
          <Pressable style={styles.button} onPress={() => navigation.navigate('FaceRecognition')}>
            <MaterialCommunityIcons name="face-recognition" size={16} color="black" />
            <Text style={{ paddingLeft: 8, color: '#151718', fontSize: 16 }}>Registrar asistencia</Text>
          </Pressable>
        </View>
        <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#A25AD6", borderRadius: 18 }]}>
          <Pressable style={styles.button} onPress={() => navigation.navigate('FaceRecognition')}>
            <MaterialCommunityIcons name="face-recognition" size={16} color="black" />
            <Text style={{ paddingLeft: 8, color: '#151718', fontSize: 16 }}>Acceso prefectura</Text>
          </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    image: {
        width: 300,
        height: 300
    },
    container: {
        flex: 1,
        backgroundColor: '#26153A',
        alignItems: 'center',
        justifyContent: 'center'
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
    },
    title: {
        marginTop: 40,
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }
});
