import React, { useState, useEffect, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../context/AuthContext';


//Envoie la réquête permettant de savoir si c'est un retour enregistré ou si c'est un départ ...
export const UseKey = ({info}) => {
    
    };



/*const { contextData } = useContext(AuthContext);
    const { authTokens} = contextData;
    const { logoutUser } = contextData;
    const navigation = useNavigation();
    const [key, setKey] = useState()
    alert('dans useKey')

    useEffect(() => {
        if(info.type === 'CommonKey'){
            getCommonTrack()
        }else{
            getPrivateTrack()
        }
    }, [setKey, authTokens, logoutUser, navigation, info ])

    let getCommonTrack = async () => {
        alert('dans getCommonTrack')
        try {
            const response = await fetch(`https://www.apitrackey.fr/api/TrackC/update/${info.idkey}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                }
            });
            const data = await response.json();
            if (response.status === 202 || response.status === 307) {
                alert('retour 200')
                setKey(data.key);
            } else if (response.status === 404) {
                navigation.navigate("Erreur_Agence", { Agence: data.Name, Adresse: data.Adresse });
            } else if (response.status === 400) {
                alert("Aucune correspondance");
            } else if (response.status === 401) {
                logoutUser();
            }
        } catch (error) {
            console.error("Failed to fetch: ", error);
        }
    };
    let getPrivateTrack = async () => {
        try {
            const response = await fetch(`https://www.apitrackey.fr/api/TrackP/update/${info.idkey}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                }
            });
            const data = await response.json();
            if (response.status=== 202 || response.status === 307) {
                setKey(data.key);
            } else if (response.status === 404) {
                navigation.navigate("Erreur_Agence", { Agence: data.Name, Adresse: data.Adresse });
            } else if (response.status === 400) {
                alert("Aucune correspondance");
            } else if (response.status === 401) {
                logoutUser();
            }
        } catch (error) {
            console.error("Failed to fetch: ", error);
        }*/