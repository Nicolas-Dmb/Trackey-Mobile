import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, Linking, Button,  FlatList, TouchableOpacity} from 'react-native';
import { useNavigation} from '@react-navigation/native';
import PopupOTP from '../Components/PopupOTP';
import SearchBar from "../Components/SearchBar";
import AuthContext from '../context/AuthContext';

const CoproprieteItem = ({ copro }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailCopro', { id : copro.id })}
      style={styles.item}>
      <Text style={styles.numero}>{copro.Numero}</Text>
      <Text style={styles.name}>{copro.name}</Text>
      <Text style={styles.adresse}>{copro.adresse}</Text>
    </TouchableOpacity>
  );
};


function Copropriete() {
  const{contextData} = useContext(AuthContext)
  let{authTokens} = contextData; 
  const{user} = contextData; 
  const[popup, setPopup] = useState(false)
  useEffect(()=>{
    setPopup(false)
    if (user){
      getCopro()
      getUser()
    }
  },[user])
  const navigation = useNavigation();
  const[copros, setCopros]=useState([])
  const[coproprietes, setCoproprietes] = useState([]) //les valeurs de copros sont stockées pour les récupérers si copros est changés et qu'on veut la reinitialisé


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
              alert("Créer vos premières copropriétés avec le bouton 'Plus'👇");
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
          }
  }
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