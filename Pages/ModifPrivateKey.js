import React, {useContext, useState} from 'react';
import AuthContext from '../context/AuthContext';
import { StyleSheet, Text,TextInput, View, Button, Image} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

function ModifPrivateKey(){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{user}= contextData
    //info copro
    const route = useRoute()
    const {key} = route.params || {}
    const {copro} = route.params || {}
    //navigate
    const navigation = useNavigation()
    //Form Value
    const [name, setName] = useState(key.name)
    const [acces, setAcces] = useState(key.acces)
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

    let PutKey = async() =>{
        let formData = new FormData();
        formData.append('name', name);
        formData.append('acces', acces);
        if (image) {
            formData.append('image', { uri: image, type: 'image/jpeg', name: 'photo.jpg' });
        }
        formData.append('id_Agency', user.user_id);
        formData.append('available', key.available);
        formData.append('qr_code', key.qr_code);
        formData.append('id_Copro', copro.id);
        let response = await fetch(`https://www.apitrackey.fr/api/PrivateKey/${key.id}/`,{
            method:'PATCH',
            headers:{
                'Authorization': `Bearer ${authTokens.access}`},
        body:formData
        })
        if (response.ok) {
            navigation.goBack()
        } else {
            alert('Nom de clé déjà utilisée');
        }
    }

    return(
        <View className='Main'>
                <Text>Nom du propriétaire :</Text>
                    <TextInput placeholder='Nom' value={name} onChangeText={setName}/>
                <Text>Accès :</Text>
                    <TextInput placeholder='Accès' value={acces} onChangeText={setAcces} maxLength={27}/>
                <Text>Photo des clés :</Text>
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                    <Button title="Take a photo" onPress={takePhoto} />
                    {image ? (<Image source={{ uri: image }} style={{ width: 200, height: 200 }}/>):(<Image source={{ uri: key.image }} style={{ width: 200, height: 200 }}/>)}
                <Button title='Valider' onPress={()=>PutKey()}/>
        </View>
    )
}
export default ModifPrivateKey;