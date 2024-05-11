import * as React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from "./context/AuthContext.js";
import Account from './Pages/Account.js';
import Copropriete from './Pages/Copropriete.js';
import Scan from './Pages/Scan.js';
import MPoublie from './Pages/MPoublie.js'
import DetailCopro from './Pages/DetailCopro.js';
import CreatePrivateKey from './Pages/CreatePrivateKey.js';
import CreateCommonKey from './Pages/CreateCommonKey.js';
import DetailCommonKey from './Pages/DetailCommonKey.js';
import DetailPrivateKey from './Pages/DetailPrivateKey.js';
import ModifCommonKey from './Pages/ModifCommonKey.js';
import ModifPrivateKey from './Pages/ModifPrivateKey.js';


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
      <DataStack.Screen name="Coproprietes" component={Copropriete}/>
      <DataStack.Screen name="DetailCopro" component={DetailCopro} options={{id :'copro.id'}}/>
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

export default function App() {
  return (
    <NavigationContainer style={{backgroundColor: '#FCFDFA'}}>
      <AuthProvider>
      <Tab.Navigator initialRouteName="Data">
        <Tab.Screen name="Données" component={DataStackNavigator}/>
        <Tab.Screen name="Scan" component={ScanStackNavigator}/>
        <Tab.Screen name="Compte" component={AccountStackNavigator}/>
      </Tab.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

