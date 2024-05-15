import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import AuthContext from '../context/AuthContext';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

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
            <Text>La clé appartient à l'agence :</Text>
            <Text>{Agence}</Text>
            <Text>Merci de les contacter ou de déposer la clé à l'adresse :</Text>
            <Text>{Adresse}</Text>
            <Text>Merci d'avance pour votre aide !</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container:{
        width:'100%',
        margin:'auto',
        textAlign:'center',
    },
})
export default Error_Key;