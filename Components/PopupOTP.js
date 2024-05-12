import React, {useContext, useEffect, useState}from "react";
import AuthContext from'../context/AuthContext';
import { View, TextInput, Button, Text} from 'react-native';




function PopupOTP({setPopup, verif_mail}){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{sendOTP} = contextData; 

    useEffect(() =>{
        sendOTP()
    },[])

    const [otp, setOtp] = useState()
    let verifyOTP = async() =>{
        alert(otp)
        alert(authTokens.access)
        let response = await fetch('https://www.apitrackey.fr/api/otp/verify',{
            method:'POST',
            headers:{
                'Content-Type':'application/json', 
                'Authorization': `Bearer ${authTokens.access}`},
                body:JSON.stringify({'otp':otp})
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
            <View onSubmit={verifyOTP}>
                {verif_mail?(<Text>Avant de continuer veuillez vérifier votre adresse Email</Text>):(<Text>Page sécurisée</Text>)}
                <Text>Veuillez récupérer le code reçu par Email</Text>
                <Text> Code :</Text>
                    <TextInput value={otp} onChangeTexte={setOtp()}/>
                <Button title="Valider" onPress={() => verifyOTP()}/>
            </View>
    )
}
export default PopupOTP;