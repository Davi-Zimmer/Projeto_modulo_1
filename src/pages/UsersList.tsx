// React \\
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, FlatList, Switch, Touchable, Alert } from "react-native";
import { useEffect, useState } from "react";


// Others \\
import axios from "axios";


// Scripts \\
import { storage } from "../scripts/localStorage"
import { globalStyle } from "../styleSheets/globalStyleSheet";


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

function clone( item:UserDataProps ){
    return new Array(6).fill( item )
}

type UserProps = {
    name: string
    status: number
    onChange?: () => void
}

function User({name, status, onChange}:UserProps){

    const [isActived, setIsActivec] = useState( status==1 )

    const newStyle = isActived ? ({
        borderColor: 'green'
    }) : ({backgroundColor: 'red'}) 

    // função de ativação com onPress
    function handleStatus(){
        setIsActivec( !isActived )
        onChange?.()
    }

    return (
        <View style={[styles.userContainer, newStyle]}>
            <Switch value={isActived} onChange={handleStatus}/>
            <Text>{name}</Text>
        </View>
    )
}

export default function UsersList({navigation} : any) {

    const [users, setUsers] = useState<Array<UserDataProps>>([])

    console.log(users.length)

    // pega todos os usuários da database
    function getUsers() {
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/users').then( res => {
          
            // const item = clone( res.data[0] )
            setUsers( res.data )

        })
    }

    useEffect( getUsers, [])

    // atualiza o status do usuario de acordo com o id
    function updateUser( id:number, status:number ){

        axios.patch(process.env.EXPO_PUBLIC_API_URL + `/users/${id}/toggle-status`, {status}).then( () => {
            getUsers()
        } ).catch( err => {
            console.error( err )
            Alert.alert('Não foi possível atualizar o status do usuário.')
        })
    
        
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity style={globalStyle.button} onPress={() => navigation.navigate('Register User')}>
                <Text style={globalStyle.buttonText}>Novo Usuário</Text>
            </TouchableOpacity>

            <FlatList data={users}
                style={styles.flatList}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    padding: 5
                }}

                renderItem={({item}) => {

                    return <User name={item.name} status={item.status} onChange={
                        () => updateUser(item.id, item.status)
                    }/>

                }} 
            />
           

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        //alignItems:'center'
    },

    flatList: {
        padding: 20
    },
    
    userContainer: {
        borderWidth: 1,
        width: "45%"
    }
})