import React, {useContext, useEffect, useState} from 'react';
import AuthContext from '../context/AuthContext';
import { View, TextInput, Button, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import {ValidEmail, ValidMP, ValidMPconf} from '../Components/ValidData.js';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/GlobalStyles';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const screenHeight = Dimensions.get('window').height;
const tabBarHeight = screenHeight;

function CreateAccount(){
    const{contextData} = useContext(AuthContext)
    let{newAccount} = contextData;
    const navigation = useNavigation()
    //Données de validation
    const[name, setName] = useState('')
    const[adresse, setAdresse] = useState('')
    const[email, setEmail] = useState('')
    const[Mp, setMP] = useState('')
    const[confirmMp, setConfirmMP] = useState('')
    const[validemail, setValidEmail] = useState(false)
    const[validMp, setValidMP] = useState(false)
    const[validconfirmMp, setValidConfirmMP] = useState(false)
    const[successNewAccount , setSuccessNewAccount] = useState(false)
    //Submit
    const handleSubmit= () =>{
        if (name && Mp && confirmMp && name && adresse && email){
            if(validemail && validMp && validconfirmMp){
                newAccount(name, email, adresse, Mp, confirmMp, setSuccessNewAccount)
            }else{
                alert('Données transmises invalides.')
            }
        }else{
            alert('Informations manquantes')
        }
    }
    useEffect(()=>{
        if(successNewAccount){
            navigation.navigate("Connexion")
        }
    },[successNewAccount])

    return (
        <ScrollView>
        <View style={styles.page}>
            <View style={globalStyles.component}>
                <Text style={globalStyles.textForm}>Identifiant(Email):</Text>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder='trackey@gmail.com'
                    autoCapitalize="none"
                    value = {email}
                    maxLength="100"
                    onChangeText = {setEmail}
                    keyboardType="email-address"/>
                <ValidEmail setValidEmail={setValidEmail} valeur={email}/>
                <Text style={globalStyles.textForm}>Nom de l'entreprise:</Text>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder="Nom de l'entreprise"
                    value = {name}
                    maxLength="100"
                    onChangeText = {setName}/>
                <Text style={globalStyles.textForm}>Adresse de l'agence:</Text>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder='1 Rue Trackey, 75001 Paris'
                    maxLength="100"
                    value = {adresse}
                    onChangeText = {setAdresse}/>
                <Text style={globalStyles.textForm}>Mot de Passe:</Text>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder="Mot de passe"
                    value = {Mp}
                    onChangeText = {setMP}
                    secureTextEntry={true} />
                <ValidMP setValidMP={setValidMP} valeur={Mp}/>
                <Text style={globalStyles.textForm}>Confirmez le mot de passe :</Text>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder='Confirmez le mot de passe'
                    value = {confirmMp}
                    onChangeText = {setConfirmMP}
                    secureTextEntry={true} />
                <ValidMPconf setValidConfirmMP={setValidConfirmMP} valeurMP={Mp} valeur={confirmMp}/>
                <View style={globalStyles.inlineContainer}>
                </View>
                <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
                    <Text style={globalStyles.textForm}>Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.smallButton} onPress={() => navigation.navigate("Connexion")}>
                    <Text style={globalStyles.text}>Connexion</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        alignItems:'center',
        backgroundColor:'#FCFDFA',
        color:'#37401C',
        width:'100%',
        height:tabBarHeight
    },
  });
export default CreateAccount;