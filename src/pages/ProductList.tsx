
// React \\
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, FlatList, Button} from "react-native"
import { useEffect, useState } from "react"


// Others \\
import axios from "axios"


// Custom Scripts \\
import { globalStyle } from "../styleSheets/globalStyleSheet"
import { useFocusEffect } from "@react-navigation/native"
import { FilterList } from "../scripts/FilterItems"
import { storage } from "../scripts/localStorage"

type ProductProps = {
    product_name: string
    quantity: number
    image_url: string
    description: string
    branch_name: string
    location: string
    latitude: string
    longitude: string
}

type ProductArray = Array<ProductProps>


export default function ProductList({navigation}: any) {

    const [products, setProducts] = useState<ProductArray>([])

    const [filteredItems, setFilteredItems] = useState<ProductArray>([])

    const [filter, setFilter] = useState('')

    
    useEffect(() => {
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/products').then( res => {

            setProducts( res.data )

        }).catch( err => console.warn(err) )
    }, [])


    useEffect(()=> {
        const filteredList = FilterList(products, ['product_name', "branch_name"], filter)
        setFilteredItems( filteredList )
    }, [products])


    function Product({product_name, branch_name, image_url, quantity, description}: ProductProps){
        return (
            <View style={styles.productContainer}>

                <Image source={{uri: image_url}} style={styles.productImage}/>
                
                <Text style={styles.productname}>{product_name}</Text>

                <View style={styles.productInfo}>
                    <Text>{branch_name}</Text>
                    <Text>Unidades: {quantity}</Text>
                </View>

                <Text>{description}</Text>

            </View>
        )
    }

    function backToLogin(){
        storage.set('user', null)
        navigation.navigate('Login')
    }

    return (
        <View style={styles.container}>
             <Button title='Logout' onPress={backToLogin}></Button>

            <Text>O que você procura?</Text>
            <TextInput value={filter} onChangeText={setFilter} style={styles.filterInput} placeholder="digete o nome do produto ou loja"/>
            <Text>Nós encrontramos {filteredItems.length} produtos.</Text>

            <FlatList data={filteredItems}
                renderItem={({item}) => Product(item)}
                contentContainerStyle={{ width: "100%" }}
                style={styles.flatList}
            >

            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({

    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10 
    },

    productname: {
        fontSize: 17,
        alignSelf: 'center',
        marginVertical: 10
    },

    productImage: {
        width: 150,
        height: 150,
        alignSelf: 'center'
    },

    productContainer:{
        backgroundColor: 'gray',
        margin: 10,
        marginHorizontal: 40,
        padding: 20,
    },

    flatList: {
        marginTop: 10
    },

    filterInput: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'blue',
        margin: 5
    },

    container: {
        flex: 1,
    }
})