import React,{useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';

function Scan() {
  const [hasPermission, setHasPermission] = useState();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');  // Doit être true ou false
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
        setHasPermission(false);  // En cas d'erreur, considérer que la permission n'est pas accordée
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <></>;
  }
  if (hasPermission === false) {
    return <Text>Veuillez vous rendre dans les paramètres de votre téléphone pour autoriser l'accès à la camera</Text>;
  }
  return (
    <>
      <Camera style={styles.camera} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  camera: {
    flex: 1
  }
});
export default Scan;