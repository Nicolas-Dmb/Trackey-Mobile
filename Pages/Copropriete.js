import React, {useState, useContext, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Linking, Button,  FlatList, TouchableOpacity} from 'react-native';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import PopupOTP from '../Components/PopupOTP';
import SearchBar from "../Components/SearchBar";
import AuthContext from '../context/AuthContext';

const CoproprieteItem = ({ copro }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Copropriété', { id : copro.id, title: copro.Numero })}
      style={styles.item}>
      <Text style={styles.numero}>{copro.Numero}</Text>
      <Text style={styles.name}>{copro.name}</Text>
      <Text style={styles.adresse}>{copro.adresse}</Text>
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
    setPopup(false)
    getUser()
  },[user])

  useFocusEffect(
    useCallback(() => {
      if(authTokens){
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
          } else {
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

  return(user?(
    popup? (<PopupOTP setPopup={setPopup} verif_mail={true}/>)
    :(
    <View className='Main'>
        <View className='lien'>
            <SearchBar setCopros={setCopros} coproprietes={coproprietes}/>
            <Button title="Nouvelle Copropriété" onPress={()=> alert('Pour ajouter des copropriétés veuillez vous connecter au site web')}/>
        </View>   
        <FlatList
          data={copros}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <CoproprieteItem copro={item} />}
        />
    </View>)
    ):(<Button title="Connexion" onPress={()=> navigation.navigate("Compte",{screen:"Connexion"})}/>)
  )
}

const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    numero: {
      marginRight: 10,
      fontWeight: 'bold',
    },
    name: {
      flex: 1,
    },
    adresse: {
      fontStyle: 'italic',
    }
  });
export default Copropriete;
