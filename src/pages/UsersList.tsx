// React \\
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, Alert } from "react-native"
import { useEffect, useState, useCallback } from "react"

// Others \\
import axios from "axios";

import { MaterialCommunityIcons } from '@expo/vector-icons'


import AppBar from "../components/AppBar"
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import { useFocusEffect } from "@react-navigation/native";


type UserDataProps = {
    name: string
    createdAt?: string
    document?: string
    email?: string
    full_address?: string
    id: number
    password?: string
    profile?: string
    status: number
    updatedAt?: string
}

type UserProps = {
    name: string
    status: number,
    onChange?: () => void,
    profile: string
}

function User({name, status, onChange, profile}:UserProps){

    const [isActived, setIsActivec] = useState( status==1 )

    const newStyle = isActived ? ({
        borderColor: globalColors.positiveColor
    }) : ({borderColor: globalColors.negativeColor}) 

    // função de ativação com onPress
    function handleStatus(){
        setIsActivec( !isActived )
        onChange?.()
    }

    let profileType = 'account-alert'
    
    if( isActived ){
    
        if (profile == 'admin') profileType = 'account-cog-outline'; else
        if (profile == 'motorista') profileType = 'car-hatchback'; else
        if (profile == 'filial' ) profileType = 'office-building-marker-outline'
    
    } else profileType = 'account-cancel-outline'
    
    return (
        
        <View style={[styles.userContainer, newStyle]}>
            <Text style={[globalStyle.font, styles.userName]}>{name}</Text>
            <View style={styles.userInfo}>
                <MaterialCommunityIcons name={profileType as any} size={30} color={globalColors.mainColor}/>
                <Switch value={isActived} onChange={handleStatus}/>
            </View>
        </View>
    )
}

export default function UsersList({navigation} : any) {

    const [users, setUsers] = useState<Array<UserDataProps>>([])

    // pega todos os usuários da database
    function getUsers() {
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/users').then( res => setUsers( res.data ))
        console.log('pegando usuários')
    }

    useFocusEffect(
        useCallback(() => {
             getUsers()
        }, []) 
    );


    // atualiza o status do usuario de acordo com o id
    function updateUser( id:number, status:number ){

        axios.patch(process.env.EXPO_PUBLIC_API_URL + `/users/${id}/toggle-status`, {status})
        .then( getUsers )
        .catch( err => {
            console.error( err )
            Alert.alert('Não foi possível atualizar o status do usuário.')
        })
    
    }

    return (
        <View style={globalStyle.container}>

            <View style={globalStyle.appBarContainer}>
                <AppBar pageName="O que você procura?" goBack={ navigation.goBack } noLine />

                <TouchableOpacity style={styles.newAccount} onPress={() => navigation.navigate('Register User')}>
                    <MaterialCommunityIcons color={globalColors.positiveColor} size={30} name="account-plus-outline"/>
                </TouchableOpacity>
            </View>

            <View style={styles.flatListContainer}>
                <FlatList data={users}
                    style={{padding: 20}}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 10,
                        padding: 5
                    }}

                    renderItem={({item}) => {
                        return <User name={item.name} status={item.status} profile={item.profile || ''} onChange={
                            () => updateUser(item.id, item.status)
                        }/>

                    }}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 20
    },

    newAccount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'auto',
        borderWidth: 0,
        alignSelf: 'flex-end',
        margin: 10,
    },

    userName: {
        color: globalColors.mainColor,
        fontSize: 15,
        textAlign: 'center'
    },

    flatListContainer: {
        backgroundColor: 'rgba(0, 0, 0, .1)',
        margin: 20
    },

    userInfo:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    
    userContainer: {
        borderWidth: 1,
        width: "50%",
        backgroundColor: globalColors.casing
    }
})