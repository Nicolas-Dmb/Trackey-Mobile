import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import AuthContext from '../context/AuthContext';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../Components/Header.js'
import { globalStyles } from '../styles/GlobalStyles';

const Error_Key = () => {
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{user} = contextData;

    const route = useRoute()
    const {Agence, Adresse} = route.params;

    useEffect(()=> {
        if (!authTokens || !user){
            logoutUser()
        }
    },[])
    return (
        <View styles={styles.container}>
            <Header title='Erreur clé'/>
            <View style={styles.page}>
            <Text style={globalStyles.textForm}>La clé appartient à l'agence :</Text>
            <Text style={styles.bold}>{Agence}</Text>
            <Text style={globalStyles.textForm}>Merci de les contacter ou de déposer la clé à l'adresse :</Text>
            <Text style={styles.bold}>{Adresse}</Text>
            <Text style={globalStyles.textForm}>Merci d'avance pour votre aide !</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container:{
        width:'100%',
        margin:'auto',
        textAlign:'center',
    },
    bold:{
        fontWeight: 'bold',
        color:'#37401C',
        fontSize: 20,
        textAlign: 'center',
    },
    page:{
        flexDirection: "column",
        alignItems:'center',
        marginTop:70,
    }
})
export default Error_Key;