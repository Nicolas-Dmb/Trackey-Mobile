import React, { useState, useEffect, useContext,useCallback} from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity, FlatList, Image} from "react-native";
import { CameraView, useCameraPermissions} from "expo-camera";
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AuthContext from '../context/AuthContext';
import { globalStyles } from '../styles/GlobalStyles';

/*

Il faut que j'intègre :
- une liste des clés scannés en dessous de la camera avec une note soit retour soit départ
- un bouton qui permet de lancer le questionnaire des départs
- une page qui résume les requetes (mettre un try excep sur la requete de départ de clé au cas ou une clé n'arrive pas à s'envoyer en départ)
- une gestion des user (on restart à la page d'origine si on deconnecte et on supprime les données scannées)
- pas deux fois la même clé 
- si c'est une clé retour on peut régler sur départ en même temps 

*/
const KeyItem = ({ item, setListKey, listKey}) => {
  const renderRightActions = (progress, dragX) => {
    const supprimer = () => {
      setListKey(currentKeys =>
        currentKeys.filter(value => value.unique !== item.unique)
      );
    }
    return(
          <Button style={globalStyles.supprimer} title='Supprimer' onPress={supprimer}/>
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
        setListKey([])
        setScan(false)
      }
    }, [])
  );

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
          <Button style={globalStyles.button} title="scanner d'autres clés" onPress={()=> setScan(false)}/> 
          <Button style={globalStyles.button} title="Envoyer Questionnaire" onPress={()=> navigation.navigate("Départ/Retour", {Liste: listKey})}/>
      </View>}
      <FlatList
      style = {globalStyles.liste}
      data={listKey}
      keyExtractor={item => item.unique.toString()}
      renderItem={({ item }) => <KeyItem item={item} setListKey={setListKey} ListKey={listKey}/>}
      />
    </View>
  );
}

