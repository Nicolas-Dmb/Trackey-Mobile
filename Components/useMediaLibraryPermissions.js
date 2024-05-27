import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

const useMediaLibraryPermissions = () => {
  const [permissionGranted, setPermissionGranted] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPermissionGranted(status === 'granted');
  };

  return { permissionGranted, requestPermission };
};

export default useMediaLibraryPermissions;
