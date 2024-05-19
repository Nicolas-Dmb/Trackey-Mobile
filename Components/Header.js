import React, {useContext, useState} from 'react';
import { View, TextInput, Button, Text, StyleSheet, Linking, TouchableOpacity, SafeAreaView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../styles/GlobalStyles';

const Header = ({title}) => {
    const navigation = useNavigation()
    const route = useRoute()


    return (
        <View style={globalStyles.header}>
            <SafeAreaView>
                <Text style={globalStyles.title}>{title}</Text>
                <TouchableOpacity style={globalStyles.callback} onPress={() => navigation.goBack()}>
                        <Text> &lt; Retour</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
};

  export default Header;