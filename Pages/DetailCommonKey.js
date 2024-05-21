import React, {useContext, useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text,Image, View, Linking, Button,  FlatList, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';
import AuthContext from '../context/AuthContext';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../Components/Header.js'
import { globalStyles } from '../styles/GlobalStyles';

const screenHeight = Dimensions.get('window').height;
const tabBarHeight = screenHeight;

function formatDate(dateString){
    const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
    return new Date(dateString).toLocaleString('fr-FR', options);
}
const ListTracks=({item}) => {
    return (
        <TouchableOpacity
        style={styles.Etiquette}>
            <View style={styles.listItem}>
                <Text style={styles.numero}>{item.entreprise}</Text>
                <Text style={styles.name} >{item.tel}</Text>
            </View>
            <View style={styles.listColumnItem} >
                <Text style={styles.depart}>Départ: {formatDate(item.depart)}- Retour : {item.retour!==null && formatDate(item.retour)}</Text>
                <Text style={styles.adresse}>{item.notes}</Text>
            </View>
        </TouchableOpacity>
    )
}
function DetailCommonKey(){
    //Auth
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    const{user} = contextData;
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
        if (authTokens && user){
            getKey()
        }else{
            logoutUser()
        }
    },[user, authTokens, logoutUser])

    useFocusEffect(
        useCallback(() => {
          const loadData = async () => {
            setTimeout(() => {
                if(authTokens && user){
                    getKey()
                }else{
                    logoutUser()
                }
                setCount(c => c + 1);
            }, 3000);
          };
          loadData();
        }, [authTokens, logoutUser, user])
      );

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
    
    return(authorize?(
        <View style={globalStyles.page}>
        <Header title={`Clé n° ${key.name}`}/>
        <View style={height='100%'}>
        <SafeAreaView style={backgroundColor='#D3E7A6'}>
            <View style={styles.page}>
                <TouchableOpacity style={[globalStyles.smallButton, styles.marge]} onPress={() => navigation.navigate("ModifCommonKey", {copro: copro, key: key})}>
                    <Text>Modifier la clé</Text>
                </TouchableOpacity>
                <Image source={{ uri: key.image }} style={styles.image } alt='image des clés'/>
                <Text style={globalStyles.textForm}>Accès : <Text>{key.acces}</Text></Text>
                <Text style={globalStyles.textForm}>Disponibilité : {key.available ? 
                    (<Text>Disponible</Text>):
                    (<Text>Indisponible</Text>)}
                </Text>
            </View>
            <FlatList
                data={tracks}
                style={styles.liste}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <ListTracks item={item}/>}
            />
        </SafeAreaView>
        </View>
        </View>):( <Button title="Connexion" onPress={()=> navigation.navigate("Compte",{screen:"Connexion"})}/>)
    )
}
const styles = StyleSheet.create({
    marge:{
      margin:11,
    },
    image:{
      margin:11,
      width: tabBarHeight*0.2, 
      height: tabBarHeight*0.2,
    },
    page:{
      flexDirection:'column',
      width:'100%',
      alignItems:'center',
      marginTop:'4%',
    },
    liste:{
      marginTop:'10%',
      width:'100%',
    },
    Etiquette:{
      flexDirection:'column',
      width:'100%',
      padding: 10,
      borderBottomWidth: 1,
      fontWeight:'bold',
      borderBottomColor: '#ccc',
      justifyContent:'space-between',
      backgroundColor:'#D3E7A6',

    },  
    listItem:{
      flexDirection:'row',
      width:'100%',
      justifyContent:'space-between',

    },
    listColumnItem:{
        flexDirection:'column',
        width:'100%',
        justifyContent:'space-between',
    },
    numero: {
      fontWeight: 'bold',
    },
    name:{
      marginLeft:'3%'
    },
    adresse: {
      fontStyle: 'italic',
      textAlign:'center',
    },
    depart:{
        textAlign:'center',
    }
  });
export default DetailCommonKey;