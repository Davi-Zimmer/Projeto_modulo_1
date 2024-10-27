// React \\
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { storage } from "../scripts/localStorage";


// Custom Components \\
import Header from "../components/Header";
import User from "../components/User";
import { useEffect, useState } from "react";
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet";

export default function Home({navigation}: any){
    
    const navigateTo = (pageName:string) => navigation.navigate( pageName )

    function backToLogin(){
        storage.set('user', null)
        navigateTo('Login')
    }

    const [userName, setUserName] = useState('')
    
    useEffect(() => {
        storage.get('user').then( user => {
            setUserName( user.name )
        }).catch( console.warn )

    }, [])


    return (
        <View style={[globalStyle.container]}>
            <Header style={globalStyle.header}>
                <User name={"Olá, " + userName} image="https://placehold.co/200.png" />

                <TouchableOpacity onPress={backToLogin}>
                    {
                        // <Text style={{color: '#86A5FC'}}>Logout</Text>
                        <MaterialCommunityIcons name="logout" color={globalColors.mainColor} size={25}/>
                    }
                </TouchableOpacity>
            </Header>

            <View style={globalStyle.optionsContainer}>

                <TouchableOpacity style={globalStyle.optionButton} onPress={() => navigateTo("Products List")}>
                    <Text style={[globalStyle.optionText, globalStyle.font]}>Estoque</Text>
                    <MaterialCommunityIcons name="store-check-outline" color={globalColors.mainColor} size={40}/>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyle.optionButton} onPress={() => navigateTo("Users")}>
                    <Text style={[globalStyle.optionText, globalStyle.font]}>Usuários</Text>
                    <MaterialCommunityIcons name="account-group-outline" color={globalColors.mainColor} size={40}/>
                </TouchableOpacity>

            </View>

            
        </View>
    )
}

const styles = StyleSheet.create({

    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})