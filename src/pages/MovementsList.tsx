// React \\
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native"
import { useEffect, useState } from "react"
import { MaterialCommunityIcons } from '@expo/vector-icons'


// Others \\
import axios from "axios"


// Custom Components \\
import Header from "../components/Header"
import ItemTexts from "../components/ItemTexts";
import User from "../components/User"


// Custom Scripts \\
import { storage } from "../scripts/localStorage"
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import { MovementProps  } from "../Props/ProductProps";
import { Loader } from "../hooks/Loader"


export default function MovementsList({navigation}:any){

    const [movements, setMovements] = useState<Array<MovementProps>>([])
    const [userName, setUserName] = useState('')

    const [loading , setLoading] = useState( true )

    const { textLoading } = Loader( loading )


    // pega a lista de movimentos do backend e o user no storage
    useEffect(() => {
        
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/movements')
            .then( res => setMovements( res.data ))
            .catch( console.error )
            .finally( () => setLoading(false) )

        storage.get('user').then( user => setUserName(user.name)).catch( console.error )

    }, []) 

    const addMoviment = () => navigation.navigate('Register Movement')
    
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
                        <MaterialCommunityIcons name="logout" color={globalColors.mainColor} size={25}/>
                    }
                </TouchableOpacity>
            </Header>

            <TouchableOpacity style={styles.button} onPress={addMoviment}>
                <Text style={styles.text}>Adicionar Movimento</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={movements}
                    style={styles.asd}
                    renderItem={({ item }) => render(item)}
                    ListEmptyComponent={textLoading('Carregando', 'Não há movimentos')}
                    ListFooterComponent={<View style={{ height: 40}} />} >
                </FlatList>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
 
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