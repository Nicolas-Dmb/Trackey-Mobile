import React, {useContext, useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text,Image, View, Linking, Button,  FlatList, TouchableOpacity} from 'react-native';
import AuthContext from '../context/AuthContext';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';


function formatDate(dateString){
    const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
    return new Date(dateString).toLocaleString('fr-FR', options);
}
const ListTracks=({item}) => {
    return (
        <TouchableOpacity
        style={styles.item}>
            <Text style={styles.entreprise}>{item.entreprise}</Text>
            <Text style={styles.depart}>Départ: {formatDate(item.depart)}- Retour : {item.retour!==null && formatDate(item.retour)}</Text>
            <Text >{item.tel}</Text>
            <Text >{item.notes}</Text>
        </TouchableOpacity>
    )
}
function DetailCommonKey(){
    //Auth
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{logoutUser} = contextData; 
    const navigation = useNavigation()
    const [count, setCount] = useState(0);
    //Variable
    const route = useRoute()
    const {state} = route.params;
    const {copro} = route.params;
    let idKey = state.id
    const[key, setKey] = useState([])
    const[tracks, setTracks] = useState([])
    const[authorize, setAuthorize]= useState(true)

    useEffect(()=>{
        alert('useEffect')
        if (authTokens){
            getKey()
        }else{
            logoutUser()
        }
    },[])

    let getKey = async() =>{
        let response = await fetch (`https://www.apitrackey.fr/api/CommonKey/${idKey}/`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${authTokens.access}`},
        });
        let data = await response.json()
        if(response.ok){
            setKey(data)
            setTracks(data.trackcommon_set)
       }else if (response.status===401){
            setAuthorize(false)
       }else{
            alert("Une erreur s'est produite")
       }
    }

    useFocusEffect(
        useCallback(() => {
          const loadData = async () => {
            setTimeout(() => {
                if(authTokens){
                    getKey()
                }else{
                    logoutUser()
                }
                setCount(c => c + 1);
            }, 3000);
          };
          loadData();
        }, [authTokens, logoutUser])
      );
    
    return(authorize?(
        <View className='Main'>
            <View className='firstFloor'>
                <Text>Clé numéro: {key.name}</Text>
                <Button
                title="modifier la clé"
                onPress={() => navigation.navigate("ModifCommonKey", {copro: copro, key: key})}
                />
                <Image source={{ uri: key.image }} style={{ width: 200, height: 200 }} alt='image des clés'/>
                <Text className='acces'>Accès : <Text>{key.acces}</Text></Text>
                <Text className='available'>Disponibilité : {key.available ? 
                    (<Text>Disponible</Text>):
                    (<Text>Indisponible</Text>)}
                </Text>
            </View>
            <FlatList
                data={tracks}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <ListTracks item={item} />}
            />
        </View>):( <Button title="Connexion" onPress={()=> navigation.navigate("Compte",{screen:"Connexion"})}/>)
    )
}
const styles = StyleSheet.create({
    item: {
      backgroundColor:'#EEF6D6',
      flexDirection: 'row',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    entreprise: {
      marginRight: 10,
      fontWeight: 'bold',
    },
    depart: {
      flex: 1,
    },
  });
export default DetailCommonKey;