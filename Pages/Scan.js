import React, { useState, useEffect, useContext,} from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity, FlatList} from "react-native";
import { CameraView, useCameraPermissions} from "expo-camera";
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../context/AuthContext';
import {UseKey} from "../Components/GetScanKey";
/*

Il faut que j'intègre :
- une liste des clés scannés en dessous de la camera avec une note soit retour soit départ
- un bouton qui permet de lancer le questionnaire des départs
- une page qui résume les requetes 
- changer les données stockés du qr code 
- une gestion des user (on restart à la page d'origine si on deconnecte et on supprime les données scannées)

*/
const KeyItem = ({ item }) => {
  alert('keyItem')
  return (
    <TouchableOpacity style={item.available ? (styles.item):(styles.reditem)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.acces}>{item.acces}</Text>
      <Text style={styles.available}>{item.available ? ('Départ'):('Retour')}</Text>
    </TouchableOpacity>
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
  const [key, setKey] = useState()
  const [reset, setReset] = useState(false)
  const [listKey, setListKey] = useState([])

  //Requêtes 
  let getCommonTrack = async (info) => {
    const response = await fetch(`https://www.apitrackey.fr/api/TrackC/update/${info.idkey}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
        }
    });
    let data = await response.json();
    if (response.status === 202 || response.status === 307) {
        //alert(data.key.name)
        setKey(data.key);
    } else if (response.status === 404) {
        navigation.navigate("Erreur_Agence", { Agence: data.Name, Adresse: data.Adresse });
    } else if (response.status === 400) {
        alert("Aucune correspondance");
    } else if (response.status === 401) {
        logoutUser();
    }
  };
  let getPrivateTrack = async (info) => {
        const response = await fetch(`https://www.apitrackey.fr/api/TrackP/update/${info.idkey}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`
            }
        });
        const data = await response.json();
        if (response.status=== 202 || response.status === 307) {
            setKey(data.key);
        } else if (response.status === 404) {
            navigation.navigate("Erreur_Agence", { Agence: data.Name, Adresse: data.Adresse });
        } else if (response.status === 400) {
            alert("Aucune correspondance");
        } else if (response.status === 401) {
            logoutUser();
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
      <View>
        <Text style={{ textAlign: 'center' }}>Nous avons besoin de votre permission pour accéder à la camera</Text>
        <Button onPress={setPermission} title="Donner la permission" />
      </View>);
  }


  const handleBarCodeScanned = ({ data }) => {
    setScan(true)
    //set data
    let type = '';
    let idkey = '';
    //set type
    if (data.includes("CommonKey")){
        type = 'CommonKey'
    }else if (data.includes("PrivateKey")){
        type = 'PrivateKey'
    }
    //set Id Key
    let i = data.length
    while(i >= 0){
      letter = Number.parseInt(data[i])
      if (Number.isInteger(letter)){
        idkey = idkey + data[i]
      }else if (idkey.length > 1){
        break
      }
      i--
    }
    //check if all informations is set
    if (idkey === '' || type === ''){
      alert("erreur de détection de la clé")
    }
    let info={
        'type':type,
        'idkey':idkey,
    }
    data = null
    if(info.type === 'CommonKey'){
      getCommonTrack(info)
    }else{
      getPrivateTrack(info)
    }
    setReset(false)
    let list = []
    list.push(key)
    list.push(listKey)
    //alert(list.length)
    setListKey(list);
    alert(listKey.length)
    if(listKey.length > 0){
      let clé = listKey[1]
      alert(clé.acces)
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scan ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        facing={'back'}
        style={styles.camera}
      />
      {listKey.length > 0 &&
      <View>
          <Button title="scanner d'autres clés" onPress={()=> setScan(false)}/> 
          <Button title="Envoyer Questionnaire" onPress={()=> navigation.navigate('')}/>
      </View>}
      {reset &&
      <FlatList
      data={listKey}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <KeyItem item={item} />}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems:'center',
  },
  camera:{

    width:'90%',
    height:'40%',

  },
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
  name: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  acces: {
    flex: 1,
  },
  available: {
    fontStyle: 'italic',
  }
});