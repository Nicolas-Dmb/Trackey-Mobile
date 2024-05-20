import React, {useState, useEffect} from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/GlobalStyles';
import Header from '../Components/Header.js'

function MPoublie(){

    const[retour, setRetour] = useState('')
    const[email, setEmail] = useState('')

    let sendEmail = async() =>{
        let formData = new FormData();
        formData.append('email', email);
        let response = await fetch('http://127.0.0.1:8000/api/MPoublie/get',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'},
            body:formData
        })
        if(response.ok){
            setRetour('mail envoyé avec succès')
        }else if(response.status === 401){
                setRetour("Cette adresse mail n'a jamais été vérifiée, nous ne pouvons pas vous transmettre de lien")
        }else if(response.status === 404){
                setRetour("Cette adresse mail n'est associée à aucun compte")
            }
    }
    return(
        <View style={backgroundColor='#FCFDFA'}>
            <Header title='Mot de Passe oublié'/>   
            <View style={styles.page}>
            <Text style={styles.textForm}>Veuillez saisir votre adresse Email</Text>
            <TextInput
                placeholder="Identifiant(Email)"
                style={styles.textInput} 
                autoCapitalize="none"
                value = {email}
                onChangeText = {setEmail}
                keyboardType="email-address"/>
            <Text style={styles.textForm}>{retour}</Text>
            <TouchableOpacity style={styles.button} onPress={()=>sendEmail} >
                    <Text style={globalStyles.text}>Envoyer</Text>
            </TouchableOpacity>
            </View>     
        </View>)
}

const styles = StyleSheet.create({
    page:{
      flexDirection: 'column',
      alignItems:'center',
      color:'#37401C',
      width:'100%',
      padding: 10,
      height:'100%',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
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
        fontSize:'20',
        width:'80%',
        height:'5%',
        backgroundColor:'#EEF6D6',
        borderRadius: 20,
        textAlign:'center',
        color:'#37401C',
    }
  });
export default MPoublie;