import * as React from 'react';
import { AuthProvider } from './context/AuthContext.js';
import Nav from './Pages/Nav.js';
import {StyleSheet} from "react-native";

function App(){
  return (
    <AuthProvider>
      <Nav style={styles.general}/>
    </AuthProvider>
  );
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FCFDFA',
  },
});