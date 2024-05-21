import React, {useContext, useEffect, useState}from "react";
import AuthContext from'../context/AuthContext.js';
import { View, TextInput,Image, Button, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import Header from '../Components/Header.js'
import { globalStyles } from '../styles/GlobalStyles.js';
import { useNavigation, useFocusEffect} from '@react-navigation/native';

function PopupOTP({setPopup}){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{logoutUser} = contextData;
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
        }else if (response.status===401){
            logoutUser()
        }else if(response.status === 408){
            sendOTP()
            alert('Temps écoulé, mail renvoyé');
        }else{
            const data = await response.json();
            alert(data.error);
        }
    }
    return(
        <View style={backgroundColor='#FCFDFA'}>
            <View style={globalStyles.header}>
                <SafeAreaView style={globalStyles.SearchBar}>
                    <Text style={globalStyles.title}>Valider votre adresse Email</Text>
                </SafeAreaView>
            </View>
            <SafeAreaView style={backgroundColor='#D3E7A6'}>
                <View style={styles.page}>
                    <Text style={[globalStyles.text]}>Avant de continuer veuillez vérifier votre adresse Email</Text>
                    <Text style={[globalStyles.text]}>Veuillez récupérer le code reçu par Email</Text>
                    <Text style={[globalStyles.textForm, styles.marge]}> Code :</Text>
                        <TextInput style={styles.textInput} keyboardType='numeric' onChangeText={setOtp} />
                    <TouchableOpacity style={[globalStyles.smallButton, styles.marge]} onPress={() => verifyOTP()}>
                            <Text>Valider</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    )
}
const styles = StyleSheet.create({
    marge:{
        margin:10,
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
    page: {
        flexDirection: "column",
        alignItems:'center',
        height:'100%',
        marginTop:30,
        color:'#37401C',
        width:'100%',
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
export default PopupOTP;