// React \\
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, FlatList, Button} from "react-native"
import { useDeferredValue, useEffect, useState } from "react"
import { MaterialCommunityIcons } from '@expo/vector-icons'

// React Navigation \\
import { CommonActions } from "@react-navigation/native"

// Others \\
import axios from "axios"

// Custom Components \\
import Header from "../components/Header"

// Custom Scripts \\
import { storage } from "../scripts/localStorage"
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import User from "../components/User"

import ItemTexts from "../components/ItemTexts";

import { MovementProps  } from "../Props/ProductProps";

export default function MovementsList({navigation}:any){

    const [movements, setMovements] = useState<Array<MovementProps>>([])
    const [userName, setUserName] = useState('')

    useEffect(() => {
        
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/movements').then( res => {
            
            setMovements( res.data )
            
        }).catch( console.error )

        storage.get('user').then( user => setUserName(user.name)).catch( console.error )
    }, []) 

    function addMoviment() {
        navigation.navigate('Register Movement')
    }

    function viewMovements() {
        navigation.navigate('View Movements')
    }
    
    function backToLogin(){
        storage.set('user', null)
        navigation.navigate('Login')
    }

    function render({ origem, destino, produto, status }:MovementProps){
        return (
            <View style={ styles.ItemContainer }>
                <ItemTexts title="Origem" description={origem.nome}></ItemTexts>
                <ItemTexts title="Destino" description={destino.nome}></ItemTexts>
                <ItemTexts title="Produto" description={produto.nome}></ItemTexts>
                <ItemTexts title="Status"  description={status}></ItemTexts>
            </View>
        )
    }

    return (
        <View style={globalStyle.container}>

            <Header style={globalStyle.header}>
                <User name={'Ola, ' + userName} image="https://placehold.co/200.png" />
                <TouchableOpacity onPress={backToLogin}>
                    {
                        // <Text style={{color: '#86A5FC'}}>Logout</Text>
                        <MaterialCommunityIcons name="logout" color={globalColors.mainColor} size={25}/>
                    }
                </TouchableOpacity>
            </Header>

            <TouchableOpacity style={styles.button} onPress={addMoviment}>
                <Text style={styles.text}>Adicionar Movimento</Text>
            </TouchableOpacity>

            <View style={styles.flatListContainer}>
                <FlatList
                    data={movements}
                    style={styles.asd}
                    renderItem={({ item }) => render(item)}
                    ListFooterComponent={<View style={{ height: 180}} />} >
                </FlatList>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    flatListContainer: {
        // padding: 20,
    },
    button: {
        backgroundColor: globalColors.alternativeButtonColor,
        padding: 10,
        width: 200,
        alignSelf: 'center',
        margin: 10
    },

    text: {
        fontSize: 15,
          textAlign: 'center',
          borderRadius: 10
    },

    asd: {
        width: '100%',
        height: '100%',
        // backgroundColor: 'rgba(0, 0, 0, .1)',
        padding: 20,
    },

    ItemContainer: {
        borderWidth: 1,
        padding: 10,
        gap: 10,
        marginVertical: 10,
        backgroundColor: globalColors.casing,
    }
})


/*
 <View style={globalStyle.optionsContainer}>
            
    <TouchableOpacity onPress={addMoviment} style={globalStyle.optionButton}>
        <Text style={[globalStyle.optionText, globalStyle.font]}>Adicionar Movimentação</Text>
    </TouchableOpacity>
    
    {
        <TouchableOpacity onPress={viewMovements} style={globalStyle.optionButton}>
            <Text style={[globalStyle.optionText, globalStyle.font]}>Visualizar movimentos</Text>
        </TouchableOpacity>
    }

    </View>
*/