// React \\
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";


import { storage } from "../scripts/localStorage";



// Custom Components \\
import Header from "../components/Header";
import User from "../components/User";




export default function Home({navigation}: any){
    
    const navigateTo = (pageName:string) => navigation.navigate( pageName )

    function backToLogin(){
        storage.set('user', null)
        navigateTo('Login')
    }


    return (
    <View>
        <Header>
            <User name='Wall Termite' image="https://placehold.co/200.png" />
        </Header>

        <Button title='Logout' onPress={backToLogin}></Button>

        <View style={styles.cardContainer}>

            <TouchableOpacity style={styles.button} onPress={() => navigateTo("Products List")}>
                <Text>Estoque</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigateTo("Users")}>
                <Text>Usuários</Text>
            </TouchableOpacity>

        </View>

        
    </View>
    )
}


const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'red',
        width: "80%",
        margin: 10
    },

    cardContainer: {
        padding: 10,
        alignItems: 'center',
        marginTop: 20
    },

    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

// https://coolors.co/image-picker