import React, {useContext, useEffect, useState, useCallback} from 'react';
import AuthContext from '../context/AuthContext';
import { Text, View, StyleSheet, Button, BackHandler, TouchableOpacity, TextInput, FlatList } from "react-native";
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
    
    //désactiver le backAction
    const handleBackPress =() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Scan_Unique' }],
        });
        return true; // Empêche le comportement par défaut (retour)
      }

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
                    let cle = ListKey[i]
                    setSucces(prevKey=>([...prevKey,cle]))
                }else{
                    alert(`Error pour ${ListKey[i].name}, info: ${keyError[i].name}:${keyError[i].message} `)
                }
                i++
            }
        }
        //désactiver le backAction
        const unsubscribe = navigation.addListener('blur', () => {
            handleBackPress();
        });
        return unsubscribe;
    },[])
    //Activer desactiver backAction si focus ou non 
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
              handleBackPress();
              return true;
            };
      
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
            return () => {
              BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
          }, [handleBackPress])
      );

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
        width:'100%',
        flexDirection: "column",//obligatoire pour avoir un scroll
        alignItems:'center',//obligatoire pour avoir un scroll
      },
    liste:{
        width:'100%',
        margin:'auto'
    },  
    item: {
        backgroundColor:'#EEF6D6',
        height: 30,
        width:'90%',
        flexDirection: 'column',
        justifyContent:'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    haut: {
        flex: 1,
        width:'90%',
        flexDirection: 'row',
        justifyContent:'space-between',
      },
    bas: {
        flex: 1,
        width:'90%',
        flexDirection: "row",
        textAlign:'center',
      },
    name: {
      flex:1,
      fontWeight: 'bold',
    },
    acces:{
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