import * as React from 'react';
import { AuthProvider } from './context/AuthContext.js';
import Nav from './Pages/Nav.js';

function App(){
  return (
    <AuthProvider>
      <Nav />
    </AuthProvider>
  );
}
export default App;
