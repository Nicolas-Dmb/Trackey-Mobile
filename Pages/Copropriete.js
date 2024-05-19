import React, {useState, useContext, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Linking, Button,Image,  FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import PopupOTP from '../Components/PopupOTP';
import SearchBar from "../Components/SearchBar";
import AuthContext from '../context/AuthContext';
import { globalStyles } from '../styles/GlobalStyles';


const CoproprieteItem = ({ copro }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Copropriété', { id : copro.id, title: copro.Numero })} style={styles.Etiquette}>
      <View style={styles.listItem}>
        <Text style={styles.numero}>{copro.Numero}</Text>
        <Text style={styles.name}>{copro.name}</Text>
      </View>
      <View>
        <Text style={styles.adresse}>{copro.adresse}</Text>
      </View>
    </TouchableOpacity>
  );
};


function Copropriete() {  
  let{contextData} = useContext(AuthContext)
  let {user} = contextData;
  let {authTokens} = contextData; 
  let {logoutUser} = contextData;

  
  const[popup, setPopup] = useState()
  const navigation = useNavigation();
  const[copros, setCopros]=useState([])
  const[coproprietes, setCoproprietes] = useState([]) //les valeurs de copros sont stockées pour les récupérers si copros est changés et qu'on veut la reinitialisé
  
  useEffect(()=>{
    if(!user || !authTokens){
      logoutUser()
    }else{
      setPopup(false)
      getUser()
    }
  },[user])

  useFocusEffect(
    useCallback(() => {
      if(authTokens && user){
        getCopro()
      }else{
        logoutUser()
      }
    }, [authTokens, logoutUser])
  );
  

  let getCopro = async() =>{
      let response = await fetch('https://www.apitrackey.fr/api/Copropriete/',{
          method:'GET',
          headers:{
              'Content-Type':'application/json',
              'Authorization': `Bearer ${authTokens.access}`}
          });
          let data = await response.json()
          if (Array.isArray(data)) {
              setCopros(data); 
              setCoproprietes(data);
          } else if (response.status===401){
            logoutUser()
          }else {
              alert("Créer vos premières copropriétés via le site internet");
              setCopros([])
              setCoproprietes([])
          }}

  let getUser = async() =>{
      let response = await fetch(`https://www.apitrackey.fr/api/user/account`,{
          method:'GET',
          headers:{
              'Content-Type':'application/json',
              'Authorization': `Bearer ${authTokens.access}`}
          });
          let data = await response.json()
          if (data.email_verif === false) {
              setPopup(true)
          }}

  return(
    <View style={backgroundColor='#FCFDFA'}>
    {user?(
    popup? (<PopupOTP setPopup={setPopup} verif_mail={true}/>)
    :(
    <View>
      <View style={globalStyles.header}>
        <SafeAreaView style={globalStyles.SearchBar}>
          <Text style={globalStyles.title}>Copropriétés</Text>
          <View style={styles.SearchBar}>
            <Image source={require('../static/Search.png')} style={styles.image}/>
            <SearchBar setCopros={setCopros} coproprietes={coproprietes}/>
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.page}>
          <TouchableOpacity style={globalStyles.smallButton} onPress={() => alert('Pour ajouter des copropriétés veuillez vous connecter au site web')}>
              <Text>Nouvelle Copropriété</Text>
          </TouchableOpacity>
          <FlatList
            data={copros}
            style={styles.liste}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <CoproprieteItem copro={item} />}
          />
      </View>
    </View>)
    ):(<Button title="Connexion" onPress={()=> navigation.navigate("Compte",{screen:"Connexion"})}/>)
  }</View>
  )
}

const styles = StyleSheet.create({
    image:{
      width:25,
      height:25
    },
    SearchBar:{
      flexDirection:'row',
      width:'100%',
    },
    page:{
      flexDirection:'column',
      width:'100%',
      gap:'11px',
      alignItems:'center',
      marginTop:'4%'
    },
    liste:{
      height:'79%'
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
    numero: {
      fontWeight: 'bold',
    },
    name:{
      marginLeft:'3%'
    },
    adresse: {
      fontStyle: 'italic',
    }
  });
export default Copropriete;
