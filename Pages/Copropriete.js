import React, {useState, useContext, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Linking, Button,Image,  FlatList, TouchableOpacity, SafeAreaView, Dimensions, ScrollView} from 'react-native';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import PopupOTP from '../Components/PopupOTP';
import SearchBar from "../Components/SearchBar";
import AuthContext from '../context/AuthContext';
import { globalStyles } from '../styles/GlobalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const tabBarHeight = screenHeight;


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
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const[copros, setCopros]=useState([])
  const[popup, setPopup]=useState(false)
  const[coproprietes, setCoproprietes] = useState([]) //les valeurs de copros sont stockées pour les récupérers si copros est changés et qu'on veut la reinitialisé
  
  useEffect(()=>{
    if(!user || !authTokens){
      logoutUser()
    }else{
      getUser()
      getCopro()
    }
  },[user, authTokens])

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
          }else if (response.status===401){
            logoutUser()
          }}

  return(
    <View style={backgroundColor='#FCFDFA'}>
    {user?(popup?<PopupOTP setPopup={setPopup}/>:
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
        <SafeAreaView>
          <View style={styles.page}>
              <TouchableOpacity style={[globalStyles.smallButton, styles.marge]} onPress={() => alert('Pour ajouter des copropriétés veuillez vous connecter au site web')}>
                  <Text>Nouvelle Copropriété</Text>
              </TouchableOpacity>
              <FlatList
                data={copros}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <CoproprieteItem copro={item} />}
              />
          </View>
          </SafeAreaView>
        </View>):(<Button title="Connexion" onPress={()=> navigation.navigate("Compte",{screen:"Connexion"})}/>)}
    </View>
  )
}

const styles = StyleSheet.create({
    marge:{
      marginBottom:10,
    },
    image:{
      width:25,
      height:25,
    },
    SearchBar:{
      flexDirection:'row',
      width:'100%',
      alignItems:'center',
    },
    page:{
      flexDirection:'column',
      width:'100%',
      alignItems:'center',
      marginTop:'4%',
      height:tabBarHeight*0.78
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
