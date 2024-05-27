import React, { useState, useEffect, useContext,useCallback} from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity, FlatList, Image, SafeAreaView, Dimensions} from "react-native";
import { CameraView, useCameraPermissions} from "expo-camera";
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AuthContext from '../context/AuthContext';
import Header from '../Components/Header.js'
import { globalStyles } from '../styles/GlobalStyles';


const screenHeight = Dimensions.get('window').height;
const tabBarHeight = screenHeight;

const KeyItem = ({ item, setListKey, listKey}) => {
  const renderRightActions = (progress, dragX) => {
    const supprimer = () => {
      setListKey(currentKeys =>
        currentKeys.filter(value => value.unique !== item.unique)
      );
    }
    return(
          <TouchableOpacity style={globalStyles.supprimer} onPress={supprimer}>
            <Text>Supprimer</Text>
          </TouchableOpacity>
)
  }
  const[onclick, setOnclick] = useState(0) //doit cliquer deux fois pour changer l'action
  //permet à l'user de choisir s'il veut que la clé revienne ou revienne et reparte directement. 
  const HandleChangeItem =()=>{
    setOnclick(0)
    if (!item.action){
      let change = item.action===null ? false:null;
      setListKey(key=>
        key.map(value =>
          value.unique === item.unique ? {...item, action:change} : value
        )
      )
    }
  }
  return (
    <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity style={item.action ? (globalStyles.Etiquette1):(globalStyles.Etiquette2)} onPress={()=>onclick===1?HandleChangeItem():setOnclick(onclick+1)}>
          <Text style={globalStyles.Attri1}>{item.copro}</Text>
          <Text style={globalStyles.Attri2}>{item.name}</Text>
          <Text style={globalStyles.Attri2}>{item.acces}</Text>
          <Text style={globalStyles.Attri3}>{item.action===null?('Retour/Départ'):(item.action?('Départ'):('Retour'))}</Text>
        </TouchableOpacity>
    </Swipeable>
  );
}
export default function App() {
  //Auth
  let{contextData} = useContext(AuthContext)
  let {user} = contextData;
  let {authTokens} = contextData; 
  let {logoutUser} = contextData;
  //Config
  const [Permission, setPermission] = useCameraPermissions();
  const [scan, setScan] = useState(false)
  const navigation = useNavigation()
  //données
  const [listKey, setListKey] = useState([]) //Liste des clés scannées 
  //const [tempoKey, setTempoKey] = useState([])//liste temporaire pour la réinitialisation


  useFocusEffect(
    useCallback(() => {
      if(!authTokens || !user ){
        logoutUser()
      }else{
        //Si on refocus on supprime la liste scannée
        getUser()
        setListKey([])
        setScan(false)
      }
    }, [])
  );
  let getUser = async() =>{
    let response = await fetch(`https://www.apitrackey.fr/api/user/account`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${authTokens.access}`}
        });
        let data = await response.json()
        if (data.email_verif === false) {
          navigation.navigate('Données')
        }else if (response.status===401){
          logoutUser()
        }}
  //Requêtes 
  let getTrack = async (info) => {
    const response = await fetch(`https://www.apitrackey.fr/api/${info.type?'TrackC':'TrackP'}/update/${info.id}/info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
        }
    });
    const data = await response.json();
    if (response.status === 202) {
      //Dans le cas ou la fonction retourne 202 (clé enregistrée comme retourné ce qui ne devrai pas être le cas)
      alert(`Retour de la clé ${data.key.name} enregistrée`)
    }else if (response.status === 307){
      const key = {
        ...data.key,
        copro: data.copro, // obtenir le numéro de copro de la clé 
        action : data.key.available, //action à réaliser
        type: info.type, //permet de continuer à distinger les private des communes (true = common)
        unique: (data.key.id).toString()+info.type//unique identifiant
      };
      setListKey(prevKeys => ([...prevKeys,key]));
    }else if (response.status === 404) {
        navigation.navigate("Erreur_Agence", { Agence: data.Name, Adresse: data.Adresse });
    } else if (response.status === 400) {
        alert("Aucune correspondance");
    } else if (response.status === 401) {
        logoutUser();
    }else {
      alert("Aucune correspondance");
  }
  };

  useEffect(()=>{
    if (!user || !authTokens){
      logoutUser()
    }
  },[])
  
  if (!Permission) {
    return <View/>;
  }
  if (!Permission.granted) {
    return (
      <View style={globalStyles.page}>
        <View style={globalStyles.header}>
          <SafeAreaView style={globalStyles.SearchBar}>
            <Text style={globalStyles.title}>Scan</Text>
          </SafeAreaView>
        </View>
        <Text style={{marginTop:'15%', textAlign: 'center'}}>Nous avons besoin de votre permission pour accéder à la camera</Text>
        <Text  style={{ textAlign: 'center', marginBottom:20}}>L'accès à la caméra permet de scanner les Qrcodes des clés et vous permettre de créer des départs et retours de clés.</Text>
        <TouchableOpacity style={globalStyles.smallButton} onPress={setPermission}>
              <Text>Donner la permission</Text>
        </TouchableOpacity>
        <Text style={{marginTop: 20, textAlign: 'center' }}>Si le bouton n'a aucun effet c'est peut-être que vous avez désactivé manuellement l'accès à la caméra.</Text>
        <Text style={{marginBottom: 20, textAlign: 'center' }}>
            Veuillez modifier manuellement l'autorisation via : 
        </Text>
        <Text style={{marginBottom: 20, textAlign: 'center' }}>
            IOS = Réglages &gt;  Trackey &gt; App. photo : on
        </Text>
        <Text style={{marginBottom: 20, textAlign: 'center' }}>
            Android = Paramètres &gt; Applications &gt; Trackey &gt; Autorisations &gt; Caméra : Activer
        </Text>

      </View>);
  }


  const handleBarCodeScanned = ({ data }) => {
    //init data
    setScan(true) 
    //set data
    let type = '';
    let idkey = '';
    //set type
    if (data.includes("CommonKey")){
        type = true
    }else if (data.includes("PrivateKey")){
        type = false
    }
    //set Id Key
    let i = data.length
    while(i >= 0){
      letter = Number.parseInt(data[i])
      if (Number.isInteger(letter)){
        idkey = data[i]+idkey
      }else if (idkey.length > 1){
        break
      }
      i--
    }
    data = null
    //check if all informations is set
    if (idkey === '' || type === ''){
      alert("erreur de détection de la clé")
    }
    let info={
        'type':type,
        'id':idkey,
    }
    let unique = idkey+type
    const matches = listKey.filter(key =>key.unique.toString() === unique.toString());
    if(matches.length === 0){
      getTrack(info)
    }else{
      alert('clé déjà scannée')
    }
  };

  return (
    <View style={globalStyles.page}>
      <View style={globalStyles.header}>
        <SafeAreaView style={globalStyles.SearchBar}>
          <Text style={globalStyles.title}>Scan</Text>
        </SafeAreaView>
      </View>
      <CameraView
        onBarcodeScanned={(event) =>scan? undefined: handleBarCodeScanned(event)} // dans tous les cas je le met permettant de laver la data (a voir si ca marche)
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        facing={'back'}
        style={globalStyles.camera}
      />
      {scan &&
      <View style={globalStyles.inlineContainer}>
          <TouchableOpacity style={globalStyles.smallButton} onPress={() => setScan(false)}>
              <Text>scanner d'autres clés</Text>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.smallButton} onPress={() => navigation.navigate("Départ/Retour", {Liste: listKey})}>
              <Text>Gérer les clés</Text>
          </TouchableOpacity>
      </View>}
      <View style={styles.page}>
      <FlatList
      data={listKey}
      keyExtractor={item => item.unique.toString()}
      renderItem={({ item }) => <KeyItem item={item} setListKey={setListKey} ListKey={listKey}/>}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page:{
    flexDirection:'column',
    width:'100%',
    marginTop:'4%',
    height:tabBarHeight*0.30,
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

