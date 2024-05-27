import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useMediaLibraryPermissions from '../Components/useMediaLibraryPermissions';
import { globalStyles } from '../styles/GlobalStyles';
import Header from '../Components/Header.js';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const tabBarHeight = screenHeight;

const PickPhoto = () => {
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
        await requestMediaLibraryPermission();
        const { status: mediaLibraryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
        setMediaLibraryPermissionGranted(mediaLibraryStatus === 'granted');
    };

    if (mediaLibraryPermissionGranted === null) {
        return <View><Text>Loading permissions...</Text></View>;
    }

    if (!mediaLibraryPermissionGranted) {
        return (
            <View style={styles.page}>
                <Header title='Permissions'/>
                <View style={styles.column}>
                    <Text style={styles.title}>Album photos:</Text>
                    <Text style={{textAlign: 'center' }}>
                        Nous avons besoin de votre permission pour accéder à vos photos.
                    </Text>
                    <Text style={{marginBottom: 20, textAlign: 'center' }}>
                        L'accès à vos photos vous permet de sélectionner la photo correspondante à la clé à créer ou à modifier.
                    </Text>
                    <TouchableOpacity style={globalStyles.smallButton} onPress={handleRequestPermission}>
                        <Text>Donner la permission</Text>
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center', marginTop:20}}>Si le bouton n'a aucun effet, c'est peut-être que vous avez désactivé manuellement l'accès à vos photos.</Text>
                    <Text style={{marginBottom: 20, textAlign: 'center' }}>
                        Veuillez modifier manuellement l'autorisation via : 
                    </Text>
                    <Text style={{marginBottom: 20, textAlign: 'center' }}>
                        IOS = Réglages &gt;  Trackey &gt; Photos
                    </Text>
                    <Text style={{marginBottom: 20, textAlign: 'center' }}>
                        Android = Paramètres &gt; Applications &gt; Trackey &gt; Autorisations &amp; Fichiers et médias : Activer
                    </Text>
                </View>
            </View>
        );
    }else{return(
        <View style={styles.page}>
        <Header title='Permissions'/>
        <View style={styles.column}>
        <Text style={styles.title}>Accès aux photos accordées !</Text>
        <TouchableOpacity style={[globalStyles.button]} onPress={()=>navigation.goBack()}>
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

export default PickPhoto;
