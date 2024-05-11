import React, {useState, useEffect}from "react";
import { TextInput} from 'react-native';

//fonctionne seulement avec l'array copropriete et non avec key ou autre
const SearchBar = ({setCopros, coproprietes}) => {
    const [value, setValue] = useState()
    
    useEffect(()=>{
        if (value){
            HandleChange(value)
        }
    },[value])
    const HandleChange = (value) =>{
        if ((value).length > 0){
            const result = coproprietes.filter((item)=>{
                return(
                    String(item.Numero).includes(value)||
                    item.name.toLowerCase().includes((value).toLowerCase()) ||
                    item.adresse.toLowerCase().includes((value).toLowerCase())
                );
            });
            setCopros(result)
        }else{
            setCopros(coproprietes)
        }
    };


    return(
        <TextInput placeholder="Rechercher..." value={value} onChangeText={setValue}/>
    )
}
export default SearchBar;