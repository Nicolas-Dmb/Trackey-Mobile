import React, {useContext, useState} from 'react';
import { View, TextInput, Button, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import AuthContext from '../context/AuthContext';
import  MPoublie from './MPoublie.js';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/GlobalStyles';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Account = () => {

    const{contextData} = useContext(AuthContext)
    let{loginUser} = contextData; 
    let{user} = contextData;
    let{logoutUser} = contextData;
    const navigation = useNavigation();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (<SafeAreaProvider>{user ? (
        <View style={globalStyles.deconnectPage}>
            <TouchableOpacity style={styles.button} onPress={() => logoutUser()}>
                <Text style={globalStyles.textForm}>Déconnexion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => Linking.openURL('https://trackey.fr/contact')}>
                <Text style={globalStyles.textForm}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => Linking.openURL('https://trackey.fr/Donnees')}>
                <Text style={globalStyles.textForm}>Politique de Confidentialité</Text>
            </TouchableOpacity>
        </View>):(
        <View style={globalStyles.page}>
            <View style={globalStyles.component}>
                <Text style={globalStyles.textForm}>Identifiant(Email):</Text>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder="Identifiant(Email)"
                    autoCapitalize="none"
                    value = {email}
                    onChangeText = {setEmail}
                    keyboardType="email-address"/>
                
                <Text style={globalStyles.textForm}>Mot de Passe:</Text>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder="Mot de passe"
                    value = {password}
                    onChangeText = {setPassword}
                    secureTextEntry={true} />
                <View style={globalStyles.inlineContainer}>
                <TouchableOpacity style={globalStyles.smallButton} onPress={() => navigation.navigate('Mot de passe oublié')}>
                    <Text style={globalStyles.text}>Mot de passe oublié</Text>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.smallButton} onPress={() => navigation.navigate("CreateAccount")}>
                    <Text style={globalStyles.text}>Créer un compte</Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity style={globalStyles.button} onPress={() => loginUser(email, password)}>
                    <Text style={globalStyles.textForm}>Connexion</Text>
                </TouchableOpacity>
            </View>
        </View>)}
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    smallButton:{
        width: '70%',
        height: 30,
        backgroundColor: '#D3E7A6',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#8DB654',
        justifyContent: 'center',
        alignItems: 'center',
        margin:10
    },
    button:{
        width: '70%',
        height: 50,
        backgroundColor: '#D3E7A6',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#8DB654',
        justifyContent: 'center',
        alignItems: 'center',
        color:'#37401C',
        margin:20,
    }
  });
  export default Account;