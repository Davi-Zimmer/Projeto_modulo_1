
// React \\
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image} from "react-native"
import { useEffect, useState } from "react"


// React Navigation \\
import { CommonActions } from "@react-navigation/native"


// Others \\
import axios from "axios"


// Custom Scripts \\
import { storage } from "../scripts/localStorage"


// Functions \\
function getRouteByProfile( userProfile:string ){

    let route = 'Home' // movimentação motoristas

    if( userProfile === 'admin'){
        route = 'Home'
    } 
    
    else if(userProfile === 'filial'){
        // movimentação
        route = 'Home'
    }

    return route
}

export default function Login({navigation} : any) {

    const [ email, setEmail ] = useState('admin@gmail.com')
    const [ password, setPassword ] = useState('123456')

    //storage.set('user', null)


    // login automatico apartir da conta no storage
    useEffect(() => {

       (async function autoLogin(){
            const data = await storage.get('user')

            if( data ){

                navigation.dispatch( CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}]
                }))

            }

       })()

    }, [])

    // consulta da conta na API, registro no storage e redirecionamento de rota
    function handleLogin(){

        const userObject = { email, password }

        axios.post(process.env.EXPO_PUBLIC_API_URL + '/login', userObject).then( res => {

            const userProfile = res.data.profile

            const route = getRouteByProfile( userProfile )

            navigation.navigate( route )

            storage.set('user', userObject)

        }).catch( err => {
            console.log( err )
            Alert.alert('Email ou senha incorretos')
        })

    }

    return (
        <View style={styles.container}>

            <Image source={require('../../assets/favicon.png')} style={styles.image}/>

            <View style={styles.rowContainer}>
                <Text style={styles.textInput}>Email</Text>
                <TextInput style={styles.input} placeholder="user@gmail.com" value={email} onChangeText={setEmail}></TextInput>
            </View>

            <View style={styles.rowContainer}>
                <Text style={styles.textInput}>Senha</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword}></TextInput>
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    button: {
        marginTop: 10,
        backgroundColor: 'lime',
        padding: 10,
        alignItems: 'center',
        width: 150,
        alignSelf: 'center'
    },

    buttonText: {
        fontSize: 15
    },

    image: {
        width: 150,
        height: 150,
        alignSelf: 'center'
    },

    rowContainer: {
        marginVertical: 10
    },

    container: {
        margin: 40,
    },
    
    textInput: {},

    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'red'
    },
})
