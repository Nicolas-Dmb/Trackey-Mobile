import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useMediaLibraryPermissions from '../Components/useMediaLibraryPermissions';
import { globalStyles } from '../styles/GlobalStyles';
import Header from '../Components/Header.js';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const tabBarWidth = screenWidth;
const tabBarHeight = screenHeight;

const PickPhoto = () => {
    const[render, setRender] = useState(0)
    const { requestPermission: requestMediaLibraryPermission } = useMediaLibraryPermissions();
    const navigation = useNavigation();
    const [mediaLibraryPermissionGranted, setMediaLibraryPermissionGranted] = useState(null);
    

    useEffect(() => {
        (async () => {
            const { status: mediaLibraryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
            setMediaLibraryPermissionGranted(mediaLibraryStatus === 'granted');
        })();
    }, []);

    const handleRequestPermission = async () => {
        if (render===0){
            await requestMediaLibraryPermission();
            const { status: mediaLibraryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
            setMediaLibraryPermissionGranted(mediaLibraryStatus === 'granted');
        }
        setRender(render+1)
    };

    if (mediaLibraryPermissionGranted === null) {
        return <View><Text>Loading permissions...</Text></View>;
    }

    if (!mediaLibraryPermissionGranted) {
        if(render===0){
            return(<View style={styles.page}>
                <View style={globalStyles.header}>
                <SafeAreaView style={globalStyles.SearchBar}>
                  <Text style={globalStyles.title}>Accès Album</Text>
                </SafeAreaView>
                </View>
                <View style={styles.column}>
                    <Text style={styles.title}>
                    Nous avons besoin de votre permission pour accéder à vos photos.
                    </Text>
                    <Text style={{marginBottom: 20, textAlign: 'center', fontSize:20}}>
                        L'accès à vos photos vous permet :
                    </Text>
                    <Text style={{marginBottom: 20, textAlign: 'center', fontSize:20}}>
                      1- D'intégrer une photo de la clé à créer ou à modifier.
                    </Text>
                    <Video
                      source={require('../static/Album.mp4')}
                      style={styles.backgroundVideo}
                      isLooping
                      shouldPlay
                      resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.Button} onPress={handleRequestPermission}>
                        <Text>Donner la permission</Text>
                    </TouchableOpacity>
                  </View>
              </View>)
        }else if(render===1){
            return(
                <View style={styles.page}>
                    <Header title={'Accès Album'}/>
                    <View style={styles.column}>
                        <Text style={styles.title}>
                              Autorisation impossible 
                        </Text>
                        <Text style={{margin: 5, textAlign: 'center', fontSize:20 }}>
                            Veuillez modifier manuellement l'autorisation via : 
                        </Text>
                        <Text style={{margin: 5, textAlign: 'center', fontSize:15 }}>
                            IOS = Réglages &gt;  Trackey &gt; Photos
                        </Text>
                        <Text style={{margin: 5, textAlign: 'center', fontSize:15 }}>
                            Android = Paramètres &gt; Applications &gt; Trackey &gt; Autorisations &amp; Fichiers et médias : Activer
                        </Text>
                    </View>
                </View>
            )
        }
    }else{return(
        <View style={styles.page}>
        <Header title='Permissions'/>
        <View style={styles.column}>
        <Text style={styles.title}>Accès aux photos accordées !</Text>
        <TouchableOpacity style={[styles.Button]} onPress={()=>navigation.goBack()}>
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
      marginTop:5,
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

export default PickPhoto;
