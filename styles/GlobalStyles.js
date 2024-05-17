import { Component } from 'react';
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: "column",
        alignItems:'center',
        backgroundColor:'#FCFDFA',
        gap:'10px',
        color:'#37401C',
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
    inlineContainer:{
        flexDirection: 'row',
        padding: 10,
    },
    button:{
        width:'70%',
        height:'8%',
        margin:'0',
        backgroundColor:'#D3E7A6',
        borderRadius: 20,
        fontSize:'20',
        borderWidth: 3,
        borderColor: '#8DB654',
        borderStyle: 'solid',
    },
    camera:{
        borderRadius: '20%',
        marginTop:5,
        width:'90%',
        height:'40%',
    },
    //Liste
    liste:{
        width:'100%',
    },  
    Etiquette1:{
        backgroundColor:'#D3E7A6',
        flexDirection: 'row',
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
    },
    Attri2:{
        flex:1,
    },
    Attri3: {
        //marginLeft:'10%',
        fontStyle: 'italic',
    },
    supprimer:{
        fontStyle: 'normal',
    },
    //Form
    textForm:{
        fontSize:'20',
        textAlign:'center',
    },
    textInput:{
        fontSize:'20',
        width:'80%',
        height:'8%',
        backgroundColor:'#EEF6D6',
        borderRadius: 20,
        textAlign:'center',
    }
});