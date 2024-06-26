import React, {useContext, useState} from 'react';
import AuthContext from '../context/AuthContext';
import { StyleSheet, Text,TextInput, View, Button, Image, TouchableOpacity, Alert, Dimensions} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../Components/Header.js'
import { globalStyles } from '../styles/GlobalStyles';

const screenHeight = Dimensions.get('window').height;
const tabBarHeight = screenHeight;

function CreatePrivateKey(){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{user}= contextData
    let{logoutUser}=contextData
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

    const createTwoButtonAlert = () =>
        Alert.alert('Photo','Comment voulez vous récupérer la photo ?', [
          {
            text: 'Prendre une photo',
            onPress:()=>takePhoto(),
          },
          {text: 'Selectionner une photo', onPress:()=>pickImage(),},
        ]);

    const pickImage = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            navigation.navigate("PickPhoto");
        }else {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!pickerResult.canceled) {
                setImage(pickerResult.assets[0].uri);
            }
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.getCameraPermissionsAsync();
        if (status !== 'granted') {
            navigation.navigate("TakePhoto");
        }else {
            const cameraResult = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!cameraResult.canceled) {
                setImage(cameraResult.assets[0].uri);
            }
        }
    };
    

    //Requête
    const handlesubmit=()=>{
        if (!name || !acces || !image) {
            alert('Please fill all the fields');
            return;
        }else{
            postPrivateKey()
        }
    }

    let postPrivateKey = async( )=>{
        let formData = new FormData();
        formData.append('name', name);
        formData.append('acces', acces);
        formData.append('image', { uri: image, type: 'image/jpeg', name: 'photo.jpg' });
        formData.append('id_Agency', user.user_id);
        formData.append('available', 'True');
        formData.append('id_Copro', copropriete.id);
        let response = await fetch('https://www.apitrackey.fr/api/PrivateKey/',{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${authTokens.access}`,
                'Content-Type': 'multipart/form-data',},
            body:formData
        });
        await response.json()
        if (response.ok) {
            navigation.navigate("Copropriété",{id : copropriete.id})
        } else if(response.status===401){
           logoutUser()
        }else {
            alert(`Nom déjà utilisé`);
        }
    }

    return(
        <View style={globalStyles.page}>
        <Header title='Nouvelle Clé Commune'/>
            <Text style={styles.textForm}>Nom du propriétaire :</Text>
                <TextInput style={styles.textInput} placeholder='Nom' value={name} onChangeText={setName}/>
            <Text style={styles.textForm}>Accès :</Text>
                <TextInput  style={styles.textInput} placeholder='Accès' value={acces} onChangeText={setAcces} maxLength={36}/>
            <Text style={styles.textForm}>Photo des clés :</Text>
                <TouchableOpacity style={globalStyles.smallButton} onPress={()=>createTwoButtonAlert()} >
                    <Text style={globalStyles.text}>Photo</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={{ width: tabBarHeight*0.2, height: tabBarHeight*0.2, margin:10 }}/>}
            <TouchableOpacity style={styles.button} onPress={()=>handlesubmit()} >
                    <Text style={globalStyles.text}>Valider</Text>
            </TouchableOpacity>
    </View>
    )
}
const styles = StyleSheet.create({
    button:{
        width: '70%',
        height: 50,
        backgroundColor: '#D3E7A6',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#8DB654',
        justifyContent: 'center',
        alignItems: 'center',
        color:'#37401C',
        margin:'10%',
    },
    textForm: {
        fontSize: 20,
        textAlign: 'center',
        color:'#37401C',
        marginTop:'10%',
    },
    textInput:{
        fontSize:20,
        width:'80%',
        height:'5%',
        backgroundColor:'#EEF6D6',
        borderRadius: 20,
        textAlign:'center',
        color:'#37401C',
    }
  });
export default CreatePrivateKey;