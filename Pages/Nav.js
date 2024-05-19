import React, {useContext, useEffect} from 'react';
import {Image, Text} from "react-native";
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AuthContext from "../context/AuthContext.js";
import Account from './Account.js';
import Copropriete from './Copropriete.js';
import Scan from './Scan.js';
import MPoublie from './MPoublie.js'
import DetailCopro from './DetailCopro.js';
import CreatePrivateKey from './CreatePrivateKey.js';
import CreateCommonKey from './CreateCommonKey.js';
import DetailCommonKey from './DetailCommonKey.js';
import DetailPrivateKey from './DetailPrivateKey.js';
import ModifCommonKey from './ModifCommonKey.js';
import ModifPrivateKey from './ModifPrivateKey.js';
import Error_Key from './Error_key.js';
import CreateTrack from './NewTrackKey.js';
import ResultTrack from './ResultNewTrack.js';

const Tab = createBottomTabNavigator();
const AccountStack = createStackNavigator();
const DataStack = createStackNavigator();
const ScanStack = createStackNavigator();

function AccountStackNavigator(){
  return(
    <AccountStack.Navigator screenOptions={{ headerShown: false}}>
      <AccountStack.Screen name="Connexion" component={Account}/>
      <AccountStack.Screen name="Mot de passe oublié" component={MPoublie}/>
    </AccountStack.Navigator>
  )
}

function DataStackNavigator(){
  return(
    <DataStack.Navigator screenOptions={{ headerShown: false}}>
      <DataStack.Screen name="Coproprietes" component={Copropriete} options={{title: 'Copropriétés'}}/>
      <DataStack.Screen name="Copropriété" component={DetailCopro} options={{id :'copro.id', title: 'copro.Numero'}}/>
      <DataStack.Screen name="DetailCommonKey" component={DetailCommonKey}/>
      <DataStack.Screen name="DetailPrivateKey" component={DetailPrivateKey}/>
      <DataStack.Screen name="CreateCommonKey" component={CreateCommonKey}/>
      <DataStack.Screen name="CreatePrivateKey" component={CreatePrivateKey}/>
      <DataStack.Screen name="ModifCommonKey" component={ModifCommonKey}/>
      <DataStack.Screen name="ModifPrivateKey" component={ModifPrivateKey}/>
    </DataStack.Navigator>
  )
}
function ScanStackNavigator({ navigation }){
  return(
    <ScanStack.Navigator screenOptions={{ headerShown: false}}>
      <ScanStack.Screen name="Scan_Unique" component={Scan}/>
      <ScanStack.Screen name="Erreur_Agence" component={Error_Key}/>
      <ScanStack.Screen name="Départ/Retour" component={CreateTrack}/>
      <ScanStack.Screen name="Résultats" component={ResultTrack}/>
    </ScanStack.Navigator>
  )
}

const Nav=()=>{
  const contextData = useContext(AuthContext);
    const { user } = contextData
  return (
      user? 
        (<NavigationContainer>
          <Tab.Navigator initialRouteName="Données"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'Scan') {
                // Affiche un logo uniquement pour l'onglet 'Scan'
                return <Image source={require('../static/scan.png')} style={{ width: 80, height: 80 }} />;
              } else {
                // Gestion des autres icônes avec Ionicons ou autre
                const icons = {
                  Home: focused ? 'ios-home-sharp' : 'ios-home-outline',
                  Favorites: focused ? 'ios-heart-sharp' : 'ios-heart-outline',
                  Data: focused ? 'ios-list-box' : 'ios-list',
                  Account: focused ? 'ios-person' : 'ios-person-outline'
                };
                const iconName = icons[route.name];
                return <Image name={iconName} size={size} color={color} />;
              }
            },
            tabBarLabel: ({ focused, color }) => {
              // Gérer les labels ici si vous voulez conditionnellement les afficher ou les styliser
              if (route.name === 'Scan') {
                return null; // Aucun texte pour 'Scan'
              }
              // Labels pour les autres onglets
              return <Text style={{ color, fontSize: 18 }}>{route.name}</Text>;
            },
            tabBarActiveTintColor: '#37401C',
            tabBarInactiveTintColor: '#5C7C2F',
            tabBarStyle: {borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#F8FAF3', position: 'absolute', height: 80 },
            tabBarLabelStyle: { paddingBottom: 3 },
          })}
          >
              <Tab.Screen name="Données" component={DataStackNavigator}/>
              <Tab.Screen name="Scan" component={ScanStackNavigator}/>
              <Tab.Screen name="Compte" component={AccountStackNavigator}/>
            </Tab.Navigator>
          </NavigationContainer>):
          (<NavigationContainer>
              <AccountStack.Navigator screenOptions={{ headerShown: false}}>
              <AccountStack.Screen name="Connexion" component={Account}/>
              <AccountStack.Screen name="Mot de passe oublié" component={MPoublie}/>
              </AccountStack.Navigator>
          </NavigationContainer>)
  );
}
export default Nav;

/*
          (<NavigationContainer>
              <Tab.Navigator initialRouteName="Compte" screenOptions={{ headerShown: false }}>
                  <Tab.Screen name="Compte" component={AccountStackNavigator}/>
              </Tab.Navigator>
          </NavigationContainer>)
*/