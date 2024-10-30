
// React \\
import { View, Text, TextInput, StyleSheet, Image, FlatList } from "react-native"
import { useEffect, useState } from "react"


// Others \\
import axios from "axios"


// Others \\
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import { FilterList } from "../scripts/FilterItems"

import AppBar from "../components/AppBar"
import { ProductProps } from "../Props/ProductProps"


type ProductArray = Array<ProductProps>


export default function ProductList({navigation}: any) {

    const [products, setProducts] = useState<ProductArray>([])

    const [filteredItems, setFilteredItems] = useState<ProductArray>([])

    const [filter, setFilter] = useState('')

    // pega os produtos do backend
    useEffect(() => {
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/products')
            .then( res =>  setProducts( res.data ))
            .catch( console.error )
    }, [])

    // filtra os produtos de acordo com a pesquisa
    useEffect(() => {
        const filteredList = FilterList(products, ['product_name', "branch_name"], filter)
        setFilteredItems( filteredList )
        console.log('d')
    }, [filter, products])

    function Product({product_name, branch_name, image_url, quantity, description}: ProductProps){
        return (
            <View style={styles.productContainer}>

                <Image source={{uri: image_url}} style={styles.productImage}/>
                
                <Text style={[styles.productname, styles.mainColorText, globalStyle.font]}>{product_name}</Text>

                <View style={styles.productInfo}>
                    <Text style={[globalStyle.font,  styles.mainColorText]}>{branch_name}</Text>
                    <Text style={[globalStyle.buttonText, globalStyle.font]}>{quantity} Unid</Text>
                </View>

                <Text style={[styles.mainColorText, globalStyle.font]}>{description}</Text>

            </View>
        )
    }

    return (
        <View style={[globalStyle.container, {flex:1}]}>

            <AppBar pageName="O que você procura?" goBack={ navigation.goBack } />
            
            <View style={styles.inputContainer}>

                <TextInput 
                    value={filter} onChangeText={setFilter} 
                    style={[globalStyle.textInput, styles.mainColorText, styles.textInput]}
                    placeholder="Digete o nome do produto ou loja"
                    placeholderTextColor={'#60687D'} />

                <Text style={[globalStyle.font,  styles.mainColorText, styles.text]}>Nós encrontramos {filteredItems.length} produtos.</Text>
            </View>

            <FlatList data={filteredItems}
                renderItem={({item}) => Product(item)}
                contentContainerStyle={{ width: "100%" }}
                style={{ marginTop: 10 }}
            >

            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({

    text: {
        margin: 10,
        fontSize: 15
    },

    textInput: {
        padding: 10,
        fontSize: 15,
    },

    mainText: {
        fontSize: 20,
        padding: 10
    },

    inputContainer: {
        paddingHorizontal: 10,
        backgroundColor: globalColors.casing
    },

    mainColorText: {
        color: globalColors.mainColor
    },

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
        alignSelf: 'center',
        borderRadius: 5
    },

    productContainer:{
        backgroundColor: globalColors.casing,
        margin: 10,
        marginHorizontal: 40,
        padding: 20,
        borderRadius: 5
    },

    filterInput: {
        padding: 10,
        borderBottomWidth: 1,
        margin: 5
    }

})