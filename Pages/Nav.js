import React, {useContext, useEffect} from 'react';
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

const Tab = createBottomTabNavigator();
const AccountStack = createStackNavigator();
const DataStack = createStackNavigator();
const ScanStack = createStackNavigator();

function AccountStackNavigator(){
  return(
    <AccountStack.Navigator>
      <AccountStack.Screen name="Connexion" component={Account}/>
      <AccountStack.Screen name="Mot de passe oublié" component={MPoublie}/>
    </AccountStack.Navigator>
  )
}

function DataStackNavigator(){
  return(
    <DataStack.Navigator>
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
function ScanStackNavigator(){
  return(
    <ScanStack.Navigator>
      <ScanStack.Screen name="Scan_Unique" component={Scan}/>
      {/*<ScanStack.Screen name="ScanMultiple" component={ScanMultiple}/>
      <ScanStack.Screen name="Form" component={Form}/>*/}
    </ScanStack.Navigator>
  )
}

const Nav=()=>{
  const contextData = useContext(AuthContext);
    const { user } = contextData
  return (
      user? 
        (<NavigationContainer style={{backgroundColor: '#FCFDFA'}}>
          <Tab.Navigator initialRouteName="Données">
              <Tab.Screen name="Données" component={DataStackNavigator}/>
              <Tab.Screen name="Scan" component={ScanStackNavigator}/>
              <Tab.Screen name="Compte" component={AccountStackNavigator}/>
            </Tab.Navigator>
          </NavigationContainer>):
          (<NavigationContainer style={{backgroundColor: '#FCFDFA'}}>
              <Tab.Navigator initialRouteName="Compte">
                  <Tab.Screen name="Compte" component={AccountStackNavigator}/>
              </Tab.Navigator>
          </NavigationContainer>)
  );
}
export default Nav;
