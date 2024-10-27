// React \\
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image} from "react-native"
import { useEffect, useState } from "react"


// React Navigation \\
import { CommonActions } from "@react-navigation/native"


// Others \\
import axios from "axios"


// Custom Scripts \\
import { storage } from "../scripts/localStorage"
import { globalStyle, globalColors } from "../styleSheets/globalStyleSheet"


// Functions \\
function getRouteByProfile( userProfile:string ){

    // default drivers route
    let route = 'View Movements' // movimentação motoristas

    if( userProfile === 'admin'){
        route = 'Home'
    } 
    
    else if(userProfile === 'filial'){
        // movimentação
        route = 'Movements List'
    }

    // console.warn( route )

    return route
}

export default function Login({navigation}:any) {

    const [ email, setEmail ]       = useState('admin@gmail.com') // ('A@gmail.com') // admin@gmail.com // w@gmail.com
    const [ password, setPassword ] = useState('123456')          // ('12')          // 123456 // 1

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

    // style={globalStyle.backgroundPage}

    return (
        <View style={ [globalStyle.container,  {backgroundColor: '#3D3152'}] }>
            <View style={[styles.posContainer]}>
                <Image source={require('../../assets/favicon.png')} style={styles.image}/>
                <View style={styles.loginContainer}>
                    
                    <View style={styles.rowContainer}>
                        <Text style={[styles.textInput, globalStyle.font]}>Email</Text>
                        <TextInput style={globalStyle.textInput} keyboardType="email-address" placeholder="user@gmail.com" value={email} onChangeText={setEmail}></TextInput>
                    </View>

                    <View style={styles.rowContainer}>
                        <Text style={[globalStyle.textInput, globalStyle.font]}>Senha</Text>
                        <TextInput style={globalStyle.textInput} secureTextEntry value={password} onChangeText={setPassword}></TextInput>
                    </View>

                    <TouchableOpacity onPress={handleLogin} style={globalStyle.button}>
                        <Text style={[globalStyle.buttonText, globalStyle.font]}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

            
        </View>
    )
}

const styles = StyleSheet.create({

    loginContainer: {
        backgroundColor: '#313a52',
        padding: 25,
        borderTopLeftRadius: 50,
        borderBottomRightRadius: 50,
        margin: 30,
        marginTop: "20%"
    },

    posContainer: {
        backgroundColor: globalColors.anyContainerBackground,
        height: "100%",
        borderTopRightRadius: 200,
        borderBottomLeftRadius: 200,
    },

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
        
    },
    
    textInput: {
        color: '#86A5FC'   
    },

})
