import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions , SafeAreaView} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { globalStyles } from '../styles/GlobalStyles';
import Header from '../Components/Header.js';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const tabBarWidth = screenWidth;
const tabBarHeight = screenHeight;


const TakePhoto = () => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const navigation = useNavigation();
    const[render, setRender] = useState(0)


    const handleRequestPermission = async() => {
        const camerastatus = await requestCameraPermission();
        setRender(render+1)
    };

    if (cameraPermission?.granted === null) {
        return <View><Text>Loading permissions...</Text></View>;
    }

    if (!cameraPermission?.granted) {
      if (render===0){
        return(
            <View style={styles.page}>
                <View style={globalStyles.header}>
                <SafeAreaView style={globalStyles.SearchBar}>
                  <Text style={globalStyles.title}>Accès Caméra</Text>
                </SafeAreaView>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title}>
                        Nous avons besoin de votre permission pour accéder à la caméra.
                    </Text>
                    <Text style={{marginBottom: 20, textAlign: 'center', fontSize:20}}>
                        L'accès à la caméra vous permet :
                    </Text>
                    <Text style={{marginBottom: 20, textAlign: 'center', fontSize:20}}>
                      1- De prendre une photo de la clé à créer ou à modifier.
                    </Text>
                    <Video
                      source={require('../static/Photo.mp4')}
                      style={styles.backgroundVideo}
                      isLooping
                      shouldPlay
                      resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.Button} onPress={()=>setRender(1)}>
                        <Text style={styles.textButton}>Continuer</Text>
                    </TouchableOpacity>
                  </View>
              </View>)
        }else if(render===1){
        return (<View style={styles.page}>
                    <View style={globalStyles.header}>
                      <SafeAreaView style={globalStyles.SearchBar}>
                        <Text style={globalStyles.title}>Accès Caméra</Text>
                      </SafeAreaView>
                    </View>
                    <View style={styles.column}>
                      <Text style={{margin: 20, textAlign: 'center', fontSize:20}}>
                        2- De scanner le QRcode pour gérer le Départ/Retour des clés. 
                      </Text>
                      <Video
                      source={require('../static/Scan.mp4')}
                      style={styles.backgroundVideo}
                      isLooping
                      shouldPlay
                      resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.Button} onPress={handleRequestPermission}>
                        <Text style={styles.textButton}>Continuer</Text>
                    </TouchableOpacity>
                    </View>
                </View>)
        }else if(render===2){
          return(<View style={styles.page}>
                    <Header title={'Accès Caméra'}/>
                    <View style={styles.column}>
                        <Text style={styles.title}>
                              Autorisation impossible 
                        </Text>
                        <Text style={{margin: 15, textAlign: 'center', fontSize:12 }}>
                            Veuillez modifier manuellement l'autorisation via : 
                        </Text>
                        <Text style={{marginBottom: 5, textAlign: 'center', fontSize:12 }}>
                            IOS = Réglages &gt;  Trackey &gt; App. photo : on
                        </Text>
                        <Text style={{marginBottom: 5, textAlign: 'center', fontSize:12 }}>
                          Android = Paramètres &gt; Applications &gt; Trackey &gt; Autorisations &gt; Caméra : Activer
                        </Text>
                      </View>
                  </View>)}
    }else{ return(
      <View style={styles.page}>
        <Header title='Permissions'/>
        <View style={styles.column}>
          <Text style={styles.title}>Accès à la caméra accordée !</Text>
          <TouchableOpacity style={styles.Button} onPress={()=>navigation.goBack()}>
                          <Text style={styles.textButton}>    Retour   </Text>
          </TouchableOpacity>
        </View>
      </View>)
  }
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: 'center',
    color: '#37401C',
    width: '100%',
    height: tabBarHeight,
    backgroundColor: '#D3E7A6'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#37401C',
    margin: 5
  },
  column: {
    flexDirection: "column",
    alignItems: 'center',
    marginTop: 5
  },
  Button:{
    width: '80%',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8DB654',
    justifyContent: 'center',
    alignItems: 'center',
    color:'#37401C',
    marginTop:10,
  },
  textButton:{
    fontSize: 20,
    color: '#37401C',
    fontWeight: 'bold',
  },
  backgroundVideo: {
    height:(1.164102*tabBarHeight)/2.5,
    width:(tabBarWidth)/2.5,
  },
});

export default TakePhoto;
