import React, {useContext, useEffect, useState} from 'react';
import AuthContext from '../context/AuthContext';
import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, FlatList } from "react-native";
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

const KeyItem = ({item}) => {
   return (
    <TouchableOpacity style={styles.item}>
        <View style={styles.haut}>
            <Text style={styles.copro}>{item.copro}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.type}>{item.type?'Commune':'Privative'}</Text>
        </View>
        <View style={styles.bas}>
            <Text style={styles.available}>Action:{item.action===null?('Retour/Départ'):(item.action ?('Départ'):('Retour'))}</Text>
            <Text style={styles.message}>{item.message}</Text>
        </View>
    </TouchableOpacity>
    );
}
function CreateTrack(){
    const{contextData} = useContext(AuthContext)
    let{authTokens} = contextData; 
    let{user} = contextData; 
    const route = useRoute()
    const {Liste} = route.params;
    const [ListKey,setListKey] = useState(Liste)
    const navigation = useNavigation()
    let{logoutUser} = contextData;

    //Affichage
    const[Error, SetError]= useState(false)
    //Value Form
    const[entreprise, setEntreprise] = useState()
    const[tel, setTel] = useState()
    const[note, setNote] = useState()
    const[keyError, setKeyError] = useState([]) // Ressence les clés qui n'ont pas pu être mise à joure

    //Vérifier que l'utilisateur est identifié et si des départs de clés sont à faire ou non 
    useEffect(()=>{
        setKeyError([])
        SetError(false)
        if (!user && !authTokens){
            logoutUser()
        }else{
            let i = 0
            while(ListKey.length > i){
                //Si la clé est en Retour/Départ ou en Retour
                if (ListKey[i].available === false){
                    returnTrack(ListKey[i], i)
                }
                i++
            }
            let matches = ListKey.filter(key=> key.action!==false)
            //Si il n'y a pas de départ
            if (matches.length===0){
                if(keyError.length===0){
                    navigation.navigate("Résultats",{ListKey:ListKey,keyError:keyError})
                }else{
                    SetError(true)
                }
            }
        }
    },[])

    //Vérifier si toutes les valeurs sont saisies, puis itérer chaque clé 
    const SendForm = () =>{
        if(!entreprise || !tel ){
            alert("Informations manquantes")
        }else{
            let i = 0
            while(ListKey.length > i){
                // Pour chaque clé disponible et donc l'action n'est pas false
                if (ListKey[i].available === true && ListKey[i].action !== false){
                    CreateTrack(ListKey[i])
                }
                i++
            }
            if(keyError.length===0){
                navigation.navigate("Résultats",{ListKey:ListKey,keyError:keyError})
            }else{
                SetError(true)
            }
        }
    }
    //Requetes
    const updateAvailable = (index) => {
        setListKey(currentListKey => 
          currentListKey.map((item, idx) => 
            idx === index ? { ...item, available: true } : item
          )
        );
      };
    //Requête qui gère les clé avec un available=== false et available === null 
    let returnTrack = async (info,i) => {
        if (info.available===false){ //j'ai un problème de double envoie du return donc je mets ca 
        try{
            const response = await fetch(`https://www.apitrackey.fr/api/${info.type?'TrackC':'TrackP'}/update/${info.id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                }
            });
            if (response.status===202){
                //si retour correctement effectué alors on affecte available à true pour la clé
                alert(`202${info.name}`)
                updateAvailable(i)
            }else if (response.status === 307){
                alert(`307${info.name}`)
                const key = {
                    ...info,
                    message:'retour impossible',
                    unique_Error: info.unique+'Retour',
                }
                setKeyError(ErrorKey =>[ ...ErrorKey, key ])
            }else if (response.status === 404) {
                const key = {
                    ...info,
                    message:'Clé appartenant à une autre agence',
                    unique_Error: info.unique+'Retour',
                }
                setKeyError(ErrorKey =>[ ...ErrorKey, key ])
            } else if (response.status === 400) {
                const key = {
                    ...info,
                    message:"Aucune clé correspondante",
                    unique_Error: info.unique+'Retour',
                }
                setKeyError(ErrorKey =>[ ...ErrorKey, key ])
            } else if (response.status === 401) {
                logoutUser();
            }
        }catch{
            const key = {
                ...info,
                message:"Une erreur s'est produite lors du retour de la clé",
                unique_Error: info.unique+'Retour',
            }
            setKeyError(ErrorKey =>[ ...ErrorKey, key ])
        }
    }
    }
    //Pour gérer les départs
    let CreateTrack = async(key) =>{
        try{
            let response = await fetch(`https://www.apitrackey.fr/api/${key.type ?'TrackCommon':'TrackPrivate'}/`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${authTokens.access}`},
                body:JSON.stringify({'id_key':key.id,'entreprise':entreprise,'tel': tel,'notes':note})
                });
                await response.json()
                if (response.ok){
                }else if (response.status===401){
                    logoutUser()
                }else {
                    const donnee = {
                        ...key,
                        message:"Une erreur non identifié lors de la création du track",
                        unique_Error: key.unique+'Depart',
                    }
                    setKeyError(ErrorKey =>[ ...ErrorKey, donnee ])
                }
        }catch{
            const donnee = {
                ...key,
                message:"Catch NewTrack",
                unique_Error: key.unique+'Depart',
            }
            setKeyError(ErrorKey =>[ ...ErrorKey, donnee])
        }
    }

    return(Error ?(
        <View style={styles.container}>
            <Text>Les clés suivantes n'ont pas pu être identifiées. Veuillez réessayer ou contacter le support : contact@trackey.fr</Text>
            <FlatList
            style = {styles.liste}
            data={keyError}
            keyExtractor={item => item.unique_Error.toString()}
            renderItem={({ item }) => <KeyItem item={item}/>}
            />
            <Button title="Liste des clés correctement enregistrées" onPress={()=>navigation.navigate("Résultats",{ListKey:ListKey,keyError:keyError})}/>
        </View>
        ):(
        <View style={styles.container}>
            <Text>Nom de l'entreprise :</Text>
                <TextInput style={styles.input} value={entreprise} onChangeText={setEntreprise} maxLength="30"/>
            <Text>Numéro de téléphone :</Text>
                <TextInput  style={styles.input} value={tel} keyboardType='numeric' onChangeText={setTel}/>
            <Text>Remarques :</Text>
                <TextInput style={styles.input} value={note} onChangeText={setNote}/>
            <Button title='Valider' onPress={()=>SendForm()}/>
        </View>
    )
)
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",//obligatoire pour avoir un scroll
        alignItems:'center',//obligatoire pour avoir un scroll
      },
    input:{
        height:'50px',
        width:'40%',
        backgroundColor: '#EEF6D6',
        borderColor: '#ABC978',
        borderRadius: '20px',
        margin:'10px',
        textAlign:'center',
    },
    liste:{
        width:'100%',
    },  
    item: {
        backgroundColor:'#EEF6D6',
        padding: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    haut: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
      },
    bas: {
        flex: 1,
        flexDirection: "column",
        justifyContent:"Center",
        alignItems:'center',
      },
    name: {
      flex:1,
      fontWeight: 'bold',
    },
    acces:{
      marginLeft:'10%',
      flex:1,
    },
    available: {
      flex:1,
    },
    copro:{
      flex:1,
    },
    message:{
        flex:1,
    }
  });
export default CreateTrack;