// React \\
import { View, Text, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useState } from "react"


// Custom Components \\
import Header from "../components/Header"
import User from "../components/User"

// Others \\
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import { storage } from "../scripts/localStorage"


type IconProps = {
    name: string
    size: number
    color: string
}

type CustomButtonProps = {
    onPress: () => void
    text: string
    icon: IconProps
}

function CustomButton({onPress, text, icon}:CustomButtonProps){
    return (
        <TouchableOpacity style={globalStyle.optionButton} onPress={onPress}>
            <Text style={[globalStyle.optionText, globalStyle.font]}>{text}</Text>
            <MaterialCommunityIcons name={icon.name as any} color={icon.color} size={icon.size}/>
        </TouchableOpacity>
    )
}

export default function Home({navigation}: any){
    
    const navigateTo = (pageName:string) => navigation.navigate( pageName )

    function logout(){
        storage.set('user', null)
        navigateTo('Login')
    }

    const [userName, setUserName] = useState('')
    
    // pega o usuario no storage
    useEffect(() => {
        storage.get('user')
        .then( user => setUserName( user.name ))
        .catch( console.warn )
    }, [])

    return (
        <View style={[globalStyle.container]}>
            <Header style={globalStyle.header}>
                <User name={"Olá, " + userName} image="https://placehold.co/200.png" />

                <TouchableOpacity onPress={logout}>
                    {
                        <MaterialCommunityIcons name="logout" color={globalColors.mainColor} size={25}/>
                    }
                </TouchableOpacity>
            </Header>

            <View style={globalStyle.optionsContainer}>

                <CustomButton text="Estoque" onPress={() => navigateTo("Products List")} icon={{
                    name:'store-check-outline',
                    color: globalColors.mainColor,
                    size: 40
                }}/>

                <CustomButton text="Usuários" onPress={() => navigateTo("Users")} icon={{
                    name:'account-group-outline',
                    color: globalColors.mainColor,
                    size: 40
                }}/>

            </View>
            
        </View>
    )
}