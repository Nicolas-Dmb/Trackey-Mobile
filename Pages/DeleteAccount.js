import React, {useContext, useState, useEffect} from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import PopupOTP from '../Components/PopupOTP';
import { View, TextInput,Image, Button, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import { globalStyles } from '../styles/GlobalStyles.js';


function DeleteAccount({setTitle}){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{logoutUser} = contextData;
    const navigation = useNavigation()
    //information request 
    const[popup, setPopup] = useState(true)
    const[user, setUser] = useState()
    //useEffect 
    useEffect(()=>{
        getUser
    },[])

    //information du compte 
    let getUser = async() =>{
        let response = await fetch(`https://www.apitrackey.fr/api/user/account`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${authTokens.access}`}
            });
            let data = await response.json()
            if (response.ok) {
              setUser(data)
              setPopup(true)
            }else if (response.status===401){
              logoutUser()
            }}
   //Modifier les informations 
   let deleteAccount = async() =>{
        let response = await fetch('https://www.apitrackey.fr/api/user/delete',{
            method:'DELETE',
            headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${authTokens.access}`}
            });
        if (response.status===204){
            logoutUser()
            navigation.navigate("Connexion")
        } else if(response.status === 403){
            alert("code du mail invalide");
        } else if(response.status === 408){
            alert("Utilisateur non identifié")
        }else if (response.status===401){
            logoutUser()
        }else{
            alert("Demande invalide")
        }}

    return(popup?(
        <PopupOTP setPopup={setPopup}/>
    ):(
        <View style={globalStyles.page}>
            <View style={globalStyles.header}>
                <SafeAreaView style={globalStyles.SearchBar}>
                    <Text style={globalStyles.title}>Supprimer le compte</Text>
                    <TouchableOpacity style={globalStyles.callback} onPress={() => navigation.navigate("Connexion")}>
                        <Text> &lt; Retour</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
            <View style={styles.page}>
                <Text style={globalStyles.textForm}>Etes-vous certain de vouloir supprimer le compte {user} ?</Text>
                <Text style={styles.margin}>Toutes vos données seront supprimées</Text>
                <TouchableOpacity style={globalStyles.smallButton} onPress={()=>deleteAccount()}>
                    <Text style={globalStyles.textForm}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </View>)
    )
}

const styles = StyleSheet.create({
    margin:{
        margin:20,
    },
    page:{
        flex: 1,
        flexDirection: "column",
        alignItems:'center',
        color:'#37401C',
        width:'100%',
        marginTop:50
    }
  });
export default DeleteAccount;