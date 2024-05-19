import React, {useContext, useState, useEffect, useCallback} from 'react';
import AuthContext from '../context/AuthContext';
import { StyleSheet, Text, View, Linking, Button,  FlatList, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../Components/Header.js'
import { globalStyles } from '../styles/GlobalStyles';


const ListKeyCommon=({item, copro}) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={()=> navigation.navigate("DetailCommonKey",{state: item, copro: copro})}
        style={item.available ? (globalStyles.Etiquette1):(globalStyles.Etiquette2)}>
            <Text style={globalStyles.Attri1}>{item.name}</Text>
            <Text style={globalStyles.Attri2}>{item.acces}</Text>
            <Text style={globalStyles.Attri3}>{item.available ? ('Disponible'):('Indisponible')}</Text>
        </TouchableOpacity>
    )
}
const ListKeyPrivate=({item, copro}) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={()=> navigation.navigate("DetailPrivateKey",{state: item, copro: copro })}
        style={item.available ? (globalStyles.Etiquette1):(globalStyles.Etiquette2)} scrollEnabled={false}>
            <Text style={globalStyles.Attri1}>{item.name}</Text>
            <Text style={globalStyles.Attri2}>{item.acces}</Text>
            <Text style={globalStyles.Attri3}>{item.available ? ('Disponible'):('Indisponible')}</Text>
        </TouchableOpacity>
    )
}

function DetailCopro(){
    const{contextData} = useContext(AuthContext)
    const{user} = contextData;
    let{authTokens} = contextData; 
    let{logoutUser} = contextData; 
    const [count, setCount] = useState(0);
    //On récupère la copropriété clické par l'user 
    const route = useRoute()
    const {id} = route.params;
    const navigation = useNavigation()
    const[copropriete, setCopropriete] = useState([])
    const[commonkeys, setCommonkeys] = useState([])
    const[privatekeys, setPrivatekeys] = useState([])
    
    useEffect(()=> {
        if (!user || !authTokens){
            logoutUser()
        }else{
            getCopropriete()
        }
    },[user, authTokens])

    useFocusEffect(
        useCallback(() => {
          const loadData = async () => {
            setTimeout(() => {
                if (authTokens && user){
                    getCopropriete()
                }else{
                    logoutUser()
                }
                setCount(c => c + 1);
            }, 3000);
          };
          loadData();
        }, [authTokens, logoutUser])
      );

    let getCopropriete = async() =>{
        let response = await fetch(`https://www.apitrackey.fr/api/Copropriete/${id}/`,{
            method:'GET',
            headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${authTokens.access}`}
            });
        if (response.ok){
            let data = await response.json()
            setCopropriete(data);
            setCommonkeys(data.commonkey_set || []);
            setPrivatekeys(data.privatekey_set || []);
        } else {
            alert("Créer vos premières clés");
            setCopropriete([])
            setCommonkeys([]);
            setPrivatekeys([]);
        }}
   
    return(
        <View style={backgroundColor='#FCFDFA'}>
        <Header title={copropriete.name}/>
        <View style={height='100%'}>
        <SafeAreaView style={backgroundColor='#D3E7A6'}>
            <View style={globalStyles.containerkey}>
                <View style={globalStyles.inlineContainer}>
                    <Text style={globalStyles.textForm}>Clés communes:</Text>
                    <TouchableOpacity style={globalStyles.smallButton} onPress={() =>  navigation.navigate("CreateCommonKey",{ id : copropriete.id , copropriete: copropriete})}>
                        <Text>Nouvelle clé commune</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={commonkeys}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <ListKeyCommon item={item} copro={copropriete}/>}
                />
            </View>
            <View style={globalStyles.containerkey}>
                <View style={globalStyles.inlineContainer}>
                    <Text style={globalStyles.textForm}>Clés privatives:</Text>
                    <TouchableOpacity style={globalStyles.smallButton} onPress={() => navigation.navigate("CreatePrivateKey", {id : copropriete.id , copropriete: copropriete})}>
                        <Text>Nouvelle clé privative</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={privatekeys}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <ListKeyPrivate item={item} copro={copropriete} />}
                />
            </View>
        </SafeAreaView>
        </View>
        </View>
    )
}
const styles = StyleSheet.create({
    reditem:{
      backgroundColor:'#D3E7A6',
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    item: {
      backgroundColor:'#EEF6D6',
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    acces: {
      marginRight: 10,
      fontWeight: 'bold',
    },
    name: {
      flex: 1,
    },
    available: {
      fontStyle: 'italic',
    }
  });
export default DetailCopro;