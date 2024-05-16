import React, {useContext, useEffect, useState}from "react";
import AuthContext from'../context/AuthContext';
import { View, TextInput, Button, Text} from 'react-native';

function PopupOTP({setPopup, verif_mail}){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{sendOTP} = contextData; 
    const [otp, setOtp] = useState()

    useEffect(() =>{
        sendOTP()
    },[])
    
    let verifyOTP = async() =>{
        let response = await fetch('https://www.apitrackey.fr/api/otp/verify',{
            method:'POST',
            headers:{
                'Content-Type':'application/json', 
                'Authorization': `Bearer ${authTokens.access}`},
                body:JSON.stringify({ otp })
            });
        if(response.status === 200){
            //on annule le popup
            setPopup(false)
        }else if(response.status === 408){
            sendOTP()
            alert('Temps écoulé, mail renvoyé');
        }else{
            const data = await response.json();
            alert(data.error);
        }
    }
    return(
            <View>
                {verif_mail?(<Text>Avant de continuer veuillez vérifier votre adresse Email</Text>):(<Text>Page sécurisée</Text>)}
                <Text>Veuillez récupérer le code reçu par Email</Text>
                <Text> Code :</Text>
                    <TextInput value={otp} keyboardType='numeric' onChangeText={setOtp} />
                <Button title="Valider" onPress={() => verifyOTP()} />
            </View>
    )
}
export default PopupOTP;