import React, {useContext, useState, useEffect} from 'react';
import AuthContext from '../context/AuthContext';
import { StyleSheet, Text, View, Linking, Button,  FlatList, TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ListKeyCommon=({item, copro}) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={()=> navigation.navigate("DetailCommonKey",{state: item, copro: copro})}
        style={item.available ? (styles.item):(styles.reditem)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.acces}>{item.acces}</Text>
            <Text style={styles.available}>{item.available ? ('Disponible'):('Indisponible')}</Text>
        </TouchableOpacity>
    )
}
const ListKeyPrivate=({item, copro}) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={()=> navigation.navigate("DetailPrivateKey",{state: item, copro: copro })}
        style={item.available ? (styles.item):(styles.reditem)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.acces}>{item.acces}</Text>
            <Text style={styles.available}>{item.available ? ('Disponible'):('Indisponible')}</Text>
        </TouchableOpacity>
    )
}

function DetailCopro(){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    //On récupère la copropriété clické par l'user 
    const route = useRoute()
    const {id} = route.params;
    const navigation = useNavigation()
    const[copropriete, setCopropriete] = useState([])
    const[commonkeys, setCommonkeys] = useState([])
    const[privatekeys, setPrivatekeys] = useState([])

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
        }}

    useEffect(()=> {
        getCopropriete()
    },[])

   
    return(
        <View className='Main'>
            <View className='Partie'>
                <View className='clé_commune'>
                    <Text>Clés partie commune:</Text>
                    <Button  title="Nouvelle clé commune" onPress={()=> navigation.navigate("CreateCommonKey",{ id : copropriete.id , copropriete: copropriete})}/>
                </View>
                <FlatList
                    data={commonkeys}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <ListKeyCommon item={item} copro={copropriete}/>}
                />
            </View>
            <View className='Partie'>
                <View className='clé_privative'>
                    <Text>Clés partie privative:</Text>
                    <Button title="Nouvelle clé privative" onPress={()=> navigation.navigate("CreatePrivateKey", {id : copropriete.id , copropriete: copropriete})}/>
                </View>
                <FlatList
                    data={privatekeys}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <ListKeyPrivate item={item} copro={copropriete} />}
                />
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