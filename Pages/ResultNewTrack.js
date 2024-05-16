import React, {useContext, useEffect, useState} from 'react';
import AuthContext from '../context/AuthContext';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, FlatList } from "react-native";
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

const KeyItem = ({item}) => {
   return (
    <TouchableOpacity style={styles.item}>
        <View style={styles.haut}>
            <Text style={styles.copro}>{item.copro}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.type}>{item.type?'Commune':'Privative'}</Text>
        </View>
        <View style={styles.bas}>
            <Text style={styles.available}>Action:{item.action===null?('Retour/Départ'):(item.action ?('Départ'):('Retour'))}</Text>
        </View>
    </TouchableOpacity>
    );
}
function ResultTrack(){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{user} = contextData; 
    let{logoutUser} = contextData;
    const route = useRoute()
    const {ListKey, keyError} = route.params;
    const navigation = useNavigation()

    //Clés enregistrées avec succès
    const[succes, setSucces]= useState([])

    //Vérifier que l'utilisateur est identifié et si des départs de clés sont à faire ou non 
    useEffect(()=>{
        if (!user && !authTokens){
            logoutUser()
        }else{
            let i = 0
            while(ListKey.length > i){
                let matches = keyError.filter(key => key.unique===ListKey[i].unique)
                //Si la clé est en Retour/Départ ou en Retour
                if (matches.length === 0){
                    const cle = ListKey[i]
                    setSucces(prevKey=>([...prevKey,cle]))
                }
                i++
            }
        }
    },[ListKey, keyError])

    return(
        <View style={styles.container}>
            {succes.length!==0? (
            <View>
                <Text>{succes.length > 1 ? 'Toutes les clés ci-dessous ont été enregistrées avec succès !':'Clé enregistrée avec succès :'}</Text>
                <FlatList
                style = {styles.liste}
                data={succes}
                keyExtractor={item => item.unique.toString()}
                renderItem={({ item }) => <KeyItem item={item}/>}
                />
            </View>):(
            <View>
                <Text>Aucune clé n'a pu être identifiée. Veuillez réessayer ou contacter le support : contact@trackey.fr</Text>
            </View>
            ) }
            <Button title="Page principale" onPress={()=>navigation.navigate("Scan_Unique")}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",//obligatoire pour avoir un scroll
        alignItems:'center',//obligatoire pour avoir un scroll
      },
    liste:{
        width:'100%',
    },  
    item: {
        backgroundColor:'#EEF6D6',
        padding: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    haut: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
      },
    bas: {
        flex: 1,
        flexDirection: "column",
        justifyContent:"Center",
        alignItems:'center',
      },
    name: {
      flex:1,
      fontWeight: 'bold',
    },
    acces:{
      marginLeft:'10%',
      flex:1,
    },
    available: {
      flex:1,
    },
    copro:{
      flex:1,
    },
    message:{
        flex:1,
    }
  });
export default ResultTrack;