import React, {useContext, useState} from 'react';
import AuthContext from '../context/AuthContext';
import { StyleSheet, Text,TextInput, View, Button, Image} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

function CreateCommonKey(){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{user}= contextData
    //info copro
    const route = useRoute()
    const {id} = route.params || {}
    const {copropriete} = route.params || {}
    //navigate
    const navigation = useNavigation()

    //Form Value
    const [name, setName] = useState()
    const [acces, setAcces] = useState()
    const [image, setImage] = useState(null)

    //Image
    const pickImage = async () => {
        // Laisser l'utilisateur choisir une image depuis la galerie
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (pickerResult.granted === false) {
            alert("Veuillez autoriser l'accès à vos photos!");
            return;
        }
        if (!pickerResult.canceled) {
            setImage(pickerResult.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // Laisser l'utilisateur prendre une photo
        const cameraResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (cameraResult.granted === false) {
            alert('Permission to use camera is required!');
            return;
        }
        if (!cameraResult.canceled) {
            setImage(cameraResult.assets[0].uri);
        }
    };

    //Requête
    const handlesubmit=()=>{
        if (!name || !acces || !image) {
            alert('Please fill all the fields');
            return;
        }else{
            postCommonKey()
            navigation.navigate('DetailCopro', { id : copropriete.id })
        }
    }

    let postCommonKey = async( )=>{
        let formData = new FormData();
        formData.append('name', name);
        formData.append('acces', acces);
        formData.append('image', { uri: image, type: 'image/jpeg', name: 'photo.jpg' });
        formData.append('id_Agency', user.user_id);
        formData.append('available', 'True');
        formData.append('id_Copro', copropriete.id);
        let response = await fetch('https://www.apitrackey.fr/api/CommonKey/',{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${authTokens.access}`},
            body:formData
        });
        await response.json()
        if (response.ok) {
            navigation.navigate("DetailCopro",{id : copropriete.id})
        } else {
            alert(`Numéro déjà utilisé`);
        }
    }

    return(
        <View className='Main'>
            <Text>Numero du trousseau :</Text>
                <TextInput placeholder='Nom' keyboardType='numeric' value={name} onChangeText={setName}/>
            <Text>Accès :</Text>
                <TextInput placeholder='Accès' value={acces} onChangeText={setAcces} maxLength={36}/>
            <Text>Photo des clés :</Text>
                <Button title="Pick an image from camera roll" onPress={pickImage} />
                <Button title="Take a photo" onPress={takePhoto} />
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }}/>}
            <Button title='Valider' onPress={()=>handlesubmit()}/>
        </View>
    )
}
export default CreateCommonKey;