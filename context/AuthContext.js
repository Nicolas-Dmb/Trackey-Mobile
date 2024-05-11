import { createContext, useState, useEffect } from 'react'
import { jwtDecode, JwtPayload } from 'jwt-decode';
import "core-js/stable/atob";
import AsyncStorage from '@react-native-async-storage/async-storage';



const AuthContext = createContext(null)

export default AuthContext; 

export const AuthProvider = ({children}) => {

    //Pour conserver les jetons et l'id user : 
    const [authTokens, setAuthTokens] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedTokens = await AsyncStorage.getItem('authTokens');
                if (storedTokens) {
                    const tokens = JSON.parse(storedTokens);
                    setAuthTokens(tokens);
                    const decoded = jwtDecode(tokens.access);
                    setUser(decoded)
                }
            } catch (error) {
                logoutUser();
            }
        };

        loadAuthData();
    }, []);
    let [loading, setLoading]= useState(true)


    let loginUser = async(email, password)=> {
        let response = await fetch('https://www.apitrackey.fr/api/token/',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'},
           body:JSON.stringify({email,password})
        });
        let data = await response.json()
        if (response.status === 200){
            setAuthTokens(data)
            const access = data.access;
            const decoded = jwtDecode(data.access);
            setUser(decoded)
            await AsyncStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            alert('Identifiant ou Mot de passe incorrect')
        }
    }

    let updateToken = async() => {
        let response = await fetch('https://www.apitrackey.fr/api/token/refresh/',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'},
           body:JSON.stringify({'refresh':authTokens.refresh})
        });
        let data = await response.json()

        if(response.status === 200){

            setAuthTokens(prevTokens => ({
                ...prevTokens,
                access: data.access
            }));
            setUser(jwtDecode(data.access))
            AsyncStorage.setItem('authTokens', JSON.stringify({
                ...authTokens, 
                access: data.access
            }));
        }else{
            logoutUser()
        }
    }

    let logoutUser=()=>{
        setAuthTokens(null)
        setUser(null)
        AsyncStorage.removeItem('authTokens')
    }


    //OTP
    let sendOTP= async() =>{
        let response = await fetch('https://www.apitrackey.fr/api/otp',{
            method: 'GET', 
            headers:{
                'Content-Type':'application/json', 
                'Authorization': `Bearer ${authTokens.access}`},
            });
        if (response.ok){

        }else if(response.status===304){
            
        }else{
            alert(`error : ${response}`)
        }
    }
    

    let contextData={
        authTokens:authTokens,
        user:user,
        loginUser:loginUser,
        logoutUser:logoutUser,
        sendOTP : sendOTP,
    }

    useEffect(()=> {
        let fourminutes = 1000 * 60 * 4
        let interval = setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourminutes)
        return () => clearInterval(interval)
    }, [authTokens, loading])

    
    return (
        <AuthContext.Provider value={{contextData}}>
            {children}
        </AuthContext.Provider>
    )
}