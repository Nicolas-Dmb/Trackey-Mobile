import React, {useEffect} from "react";
import { View, TextInput, Button, Text, StyleSheet, Linking, TouchableOpacity, ScrollView} from 'react-native';


function ValidEmail({ setValidEmail, valeur }) {
    useEffect(() => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regex.test(valeur);
        setValidEmail(isValid);
    }, [valeur, setValidEmail]);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(valeur);

    return (
        !isValid && <Text style={{ color: 'red' }}>Adresse mail invalide</Text>
    );
}

export default ValidEmail;

function ValidMP({ setValidMP, valeur }) {
    useEffect(() => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const isValid = regex.test(valeur);
        setValidMP(isValid);
    }, [valeur, setValidMP]);

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const isValid = regex.test(valeur);

    return (
        !isValid && (
            <View style={{ color: 'red', padding: '0px', fontSize: '0.8em' }}>
                <Text style={{ color: 'red' }}>8 caractères</Text>
                <Text style={{ color: 'red' }}>1 majuscule</Text>
                <Text style={{ color: 'red' }}>1 minuscule</Text>
                <Text style={{ color: 'red' }}>1 chiffre</Text>
                <Text style={{ color: 'red' }}>1 caractère spécial</Text>
            </View>
        )
    );
}

function ValidMPconf({ setValidConfirmMP, valeurMP, valeur }) {
    useEffect(() => {
        const isValid = valeur === valeurMP;
        setValidConfirmMP(isValid);
    }, [valeur, valeurMP, setValidConfirmMP]);

    const isValid = valeur === valeurMP;

    return (
        !isValid && <Text style={{ color: 'red' }}>Invalide</Text>
    );
}

export { ValidEmail, ValidMP, ValidMPconf };