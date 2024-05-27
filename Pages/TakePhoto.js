import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { globalStyles } from '../styles/GlobalStyles';
import Header from '../Components/Header.js';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const tabBarHeight = screenHeight;

const TakePhoto = () => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const navigation = useNavigation();

    const handleRequestPermission = async () => {
        const result = await requestCameraPermission();
    };

    if (cameraPermission?.granted === null) {
        return <View><Text>Loading permissions...</Text></View>;
    }

    if (!cameraPermission?.granted) {
        return (
            <View style={styles.page}>
                <Header title='Permissions'/>
                <View style={styles.column}>
                    <Text style={styles.title}>Camera :</Text>
                    <Text style={{textAlign: 'center', color:'#37401C'}}>
                        Nous avons besoin de votre permission pour accéder à la caméra.
                    </Text>
                    <Text style={{marginBottom: 20, textAlign: 'center'}}>
                        L'accès à la caméra vous permet de prendre une photo de la clé à créer ou à modifier.
                    </Text>
                    <TouchableOpacity style={globalStyles.smallButton} onPress={handleRequestPermission}>
                        <Text>Donner la permission</Text>
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center', marginTop:20}}>
                      Si le bouton n'a aucun effet c'est peut-être que vous avez désactivé manuellement l'accès à la caméra.
                      </Text>
                      <Text style={{marginBottom: 20, textAlign: 'center' }}>
                          Veuillez modifier manuellement l'autorisation via : 
                      </Text>
                      <Text style={{marginBottom: 20, textAlign: 'center' }}>
                          IOS = Réglages &gt;  Trackey &gt; App. photo : on
                      </Text>
                      <Text style={{marginBottom: 20, textAlign: 'center' }}>
                      Android = Paramètres &gt; Applications &gt; Trackey &gt; Autorisations &gt; Caméra : Activer
                      </Text>
                </View>
            </View>
        );
    }else{ return(
      <View style={styles.page}>
        <Header title='Permissions'/>
        <View style={styles.column}>
          <Text style={styles.title}>Accès à la caméra accordée !</Text>
          <TouchableOpacity style={globalStyles.smallButton} onPress={()=>navigation.goBack()}>
                          <Text>      retour     </Text>
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
    backgroundColor: '#FCFDFA'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#37401C',
    margin: 10
  },
  column: {
    flexDirection: "column",
    alignItems: 'center',
    marginTop: 10
  }
});

export default TakePhoto;
