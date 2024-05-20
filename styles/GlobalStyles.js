import { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';

export const globalStyles = StyleSheet.create({
    text:{
        textAlign: 'center',
        color:'#37401C',
    },
    container: {
        flex: 1, // Prendre toute la hauteur disponible
      },
    page: {
        flex: 1,
        flexDirection: "column",
        alignItems:'center',
        backgroundColor:'#FCFDFA',
        color:'#37401C',
        width:'100%',
    },
    component:{
        flex: 1,
        width:'85%',
        margin:'30%',
        height:'50%',
        flexDirection: "column",
        justifyContent:'space-evenly',
        alignItems:'center',
        backgroundColor:'#FCFDFA',
        backgroundColor:'#F8FAF3',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D3E7A6',
        borderStyle: 'solid',
    },
    split:{
        height:'50%',

    },
    inlineContainer:{
        flexDirection: 'row',
        padding: 10,
        justifyContent:'space-between',
        marginTop:20,

    },
    button: {
        width: '70%',
        height: 50,
        backgroundColor: '#D3E7A6',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#8DB654',
        justifyContent: 'center',
        alignItems: 'center',
        color:'#37401C',
    },
    SearchBar:{
        height:80 
    },
    containerkey:{
        flexDirection:'column',
        height:334,
    },
    smallButton:{
        width: '50%',
        height: 30,
        backgroundColor: '#D3E7A6',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#8DB654',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera:{
        marginTop:5,
        width:'90%',
        height:'40%',
    },
    //Liste
    liste:{
        width:'100%',
    },  
    listkey:{
    },
    Etiquette1:{
        backgroundColor:'#D3E7A6',
        flexDirection: 'row',
        width:'100%',
        padding: 10,
        borderBottomWidth: 1,
        fontWeight:'bold',
        borderBottomColor: '#ccc',
        justifyContent:'space-between',
    },
    Etiquette2: {
        backgroundColor:'#EEF6D6',
        flexDirection: 'row',
        padding: 10,
        width:'100%',
        fontWeight:'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        justifyContent:'space-between',
    },
    //Attibut de liste 
    Attri1: {
        flex:1,
        fontWeight: 'bold',
        color:'#37401C',
    },
    Attri2:{
        flex:1,
        color:'#37401C',
    },
    Attri3: {
        //marginLeft:'10%',
        fontStyle: 'italic',
        color:'#37401C',
    },
    supprimer:{
        fontStyle: 'normal',
        fontWeight:'bold',
        backgroundColor:'#DB0D0F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    //Form
    textForm: {
        fontSize: 20,
        textAlign: 'center',
        color:'#37401C',
    },
    textInput:{
        fontSize:'20',
        width:'80%',
        height:'8%',
        backgroundColor:'#EEF6D6',
        borderRadius: 20,
        textAlign:'center',
        color:'#37401C',
    },
//Page déconnexion
    deconnectPage:{
        width:'100%',
        heihgt:'100%',
        margin:'auto',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    //Header
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAF3'  // Assurez-vous que la couleur de fond s'étend sur toute la hauteur
    },
    header: {
        width: '100%',
        height: '30px',  // Corrigez 'heigh' en 'height'
        borderBottomEndRadius: 20, 
        borderBottomStartRadius: 20, // Pourcentage non supporté pour borderRadius, utilisez un nombre
        backgroundColor: '#F8FAF3',
        flexDirection: 'column',
        padding: 10,
        position: 'relative',  // 'sticky' n'est pas directement supporté par React Native
    
        // Styles spécifiques à React Native pour ajouter une ombre
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,  // Décalage vertical positif pour l'ombre en bas
        },
        shadowOpacity: 0.3,  // Transparence de l'ombre
        shadowRadius: 5,  // Flou de l'ombre
    
        // Pour iOS, 'elevation' est pour Android
        elevation: 8,
    },
    title:{
        fontSize: 20,
        fontWeight:'bold',
        textAlign:'center',
        color:'#37401C',
    }

});