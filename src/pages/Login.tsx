// React \\
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image} from "react-native"
import { useEffect, useState } from "react"


// React Navigation \\
import { CommonActions } from "@react-navigation/native"


// Others \\
import axios from "axios"


// Custom Scripts \\
import { storage } from "../scripts/localStorage"
import { globalStyle } from "../styleSheets/globalStyleSheet"


// Functions \\
function getRouteByProfile( userProfile:string ){

    // default drivers route
    let route = 'Products List' // movimentação motoristas

    if( userProfile === 'admin'){
        route = 'Home'
    } 
    
    else if(userProfile === 'filial'){
        // movimentação
        route = 'Movements List'
    }

    return route
}

export default function Login({navigation}:any) {

    const [ email, setEmail ]       = useState('w@gmail.com') // ('A@gmail.com') // admin@gmail.com
    const [ password, setPassword ] = useState('1')          // ('12')          // 123456

    // storage.set('user', null)


    // login e redirecionamento automatico apartir da conta no storage
    useEffect(() => {

       (async function autoLogin(){
            const user = await storage.get('user')

            if( user ){
                const route = getRouteByProfile( user.profile )

                navigation.dispatch( CommonActions.reset({
                    index: 0,
                    routes: [{name: route}]
                }))

            }

        })()

    }, [])

    // consulta da conta na API, registro no storage e redirecionamento de rota
    function handleLogin(){

        axios.post(process.env.EXPO_PUBLIC_API_URL + '/login', { email, password }).then( res => {

            const userProfile = res.data.profile
            
            const asd = res.data
            storage.set('user', asd)
            
            const route = getRouteByProfile( userProfile )
            navigation.navigate( route )
            
        }).catch( err => {
            console.log( err )
      
            Alert.alert('Não foi possível fazer login')

        })

    }

    return (
        <View style={styles.container}>

            <Image source={require('../../assets/favicon.png')} style={styles.image}/>

            <View style={styles.rowContainer}>
                <Text style={styles.textInput}>Email</Text>
                <TextInput style={globalStyle.textInput} keyboardType="email-address" placeholder="user@gmail.com" value={email} onChangeText={setEmail}></TextInput>
            </View>

            <View style={styles.rowContainer}>
                <Text style={styles.textInput}>Senha</Text>
                <TextInput style={globalStyle.textInput} secureTextEntry value={password} onChangeText={setPassword}></TextInput>
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

})
