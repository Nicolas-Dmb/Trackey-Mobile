import React, {useState, useEffect} from 'react';
import { View, TextInput, Button, Text, StyleSheet} from 'react-native';

function MPoublie(){

    const[retour, setRetour] = useState('')
    const[email, setEmail] = useState('')

    let sendEmail = async(email) =>{
        let response = await fetch('http://127.0.0.1:8000/api/MPoublie/get',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'},
            body:JSON.stringify({email})
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
        <View className='Main'>        
            <Text>Veuillez saisir votre adresse Email</Text>
            <TextInput
                placeholder="Identifiant(Email)"
                autoCapitalize="none"
                value = {email}
                onChangeText = {setEmail}
                keyboardType="email-address"/>
            <Button
                title="Envoyer"
                onPress={() => sendEmail(email)}/>
        </View>)
}
export default MPoublie;