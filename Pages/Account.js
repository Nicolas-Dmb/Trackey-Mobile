import React, {useContext, useState} from 'react';
import { View, TextInput, Button, Text, StyleSheet, Linking} from 'react-native';
import AuthContext from '../context/AuthContext';
import  MPoublie from './MPoublie.js';
import { useNavigation } from '@react-navigation/native';

const Account = () => {

    const{contextData} = useContext(AuthContext)
    let{loginUser} = contextData; 
    let{user} = contextData;
    let{logoutUser} = contextData;
    const navigation = useNavigation();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (user ? (
        <Button title="deconnexion" onPress={logoutUser}/>):(
        <View>
            <Text>Identifiant(Email):</Text>
            <TextInput
                placeholder="Identifiant(Email)"
                autoCapitalize="none"
                value = {email}
                onChangeText = {setEmail}
                keyboardType="email-address"/>

            <Text>Mot de Passe:</Text>
            <TextInput
                placeholder="Mot de passe"
                value = {password}
                onChangeText = {setPassword}
                secureTextEntry={true} />
            <Button
                title="mot de passe oublié"
                onPress={() => navigation.navigate('Mot de passe oublié')}
                />
            <Button
                title="connexion"
                onPress={() => loginUser(email, password)}/>
            <Button
                title="Créer un compte"
                onPress={() => Linking.openURL('https://trackey.fr/signIn')}/>
        </View>)
    );
};

  export default Account;