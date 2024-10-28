// React \\
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Touchable, Alert, Button } from "react-native";
import React, { useEffect, useState } from "react"


import { globalStyle } from "../styleSheets/globalStyleSheet"
import axios from "axios"
import { Picker } from "@react-native-picker/picker";

import { ProductProps } from "../Props/ProductProps";


type BranchProps = {
    id: number
    name: string
    location: string
    latitude: number
    longitude: number
}

type ProductsOptionsProps = {
    quantity: number
    branch_name: string
    product_id: number
    branch_id: number
}


export default function RegisterMovement() {

    const [originBranchId, setOriginBranchId]           = useState('1')
    const [destinationBranchId, setDestinationBranchId] = useState('1')
    const [desiredProductId, setDesiredProductId]       = useState('1')

    const [branches, setBranches] = useState<Array<BranchProps>>([])
    const [productsOptions, setProductsOptions] = useState<Array<ProductsOptionsProps>>([])

    const [products, setProducts] = useState<Array<ProductProps>>([])
    const [allProducts, setAllProducts] = useState<Array<ProductProps>>([])

    const [productQuantity, setProductQuantity] = useState('1')
    const [description, setDescription] = useState('')
    
    
    useEffect(() => {

        axios.get(process.env.EXPO_PUBLIC_API_URL + '/products').then( res => 
            setAllProducts( res.data )
        ).catch( console.error )


        axios.get(process.env.EXPO_PUBLIC_API_URL + '/branches/options').then( res => 
            setBranches( res.data )
        ).catch( console.error )


        axios.get(process.env.EXPO_PUBLIC_API_URL + '/products/options').then( res => 
            setProductsOptions( res.data )
        ).catch( console.error )

    }, [])

    function clearInputs(){
        setDescription('')
        setProductQuantity('1')
    }

    function register() {
         
        const movement = {
            originBranchId,
            destinationBranchId,
            productId: desiredProductId, 
            quantity: productQuantity,
            
        }

        axios.post(process.env.EXPO_PUBLIC_API_URL + '/movements', movement).then( () => {
            Alert.alert('Registro concluído')
            clearInputs()

        }).catch( err => {
            console.error( err )
            Alert.alert('Houve um erro ao registrar')
        })
        
    }

    function ValidateData(){
        
        if( destinationBranchId == originBranchId){
            Alert.alert('a filial de origem e destino não podem ser as mesmas')
            return 
        }
        
        const quantity = productsOptions[ parseInt(desiredProductId) ].quantity
        
        if( parseInt(productQuantity) > quantity ){
            Alert.alert(`A quantia disponível do produto atualmente é de ${quantity} Unidades.`)
            return 
        }

        register( )

    }

    function getBranchProducts(){
        
        if( !branches[0] ) return []

        const branchName = branches[ parseInt(originBranchId)-1 ].name

        const filteredItens = allProducts.filter(elm => elm.branch_name == branchName)

        setProducts( filteredItens )

    }

    useEffect(() => {
        getBranchProducts( )
    }, [originBranchId, branches, allProducts])


    return(
        <View style={styles.container}>
            <View>
                <Text>Filial de Origem</Text>
                <View style={styles.picker}>
                    <Picker selectedValue={ originBranchId } onValueChange={ setOriginBranchId } >
                        {
                            branches.map( (elm, i) => <Picker.Item label={elm.name} value={elm.id} key={i} />)
                        }
                    </Picker>
                </View>
            </View>

            <View>
                <Text>Filial de Destino</Text>
                <View style={styles.picker}>
                    <Picker selectedValue={ destinationBranchId } onValueChange={ setDestinationBranchId } style={styles.picker}>
                        {
                            branches.map( (elm, i)=> <Picker.Item label={elm.name} value={elm.id} key={i} />)
                        }
                    </Picker>
                </View>
            </View>

            <View>
                <Text>Produto Desejado</Text>
                <View style={styles.picker}>
                    <Picker selectedValue={ desiredProductId } onValueChange={ setDesiredProductId } style={styles.picker}>
                        {
                            products.map( (elm, i) => <Picker.Item label={elm.product_name + `: ${elm.quantity} Un.`} value={i} key={i} />)
                        }
                    </Picker>
                </View>
            </View>

            <View>
                <Text>Quantia Desejada</Text>
                <TextInput style={globalStyle.textInput} value={productQuantity} keyboardType="numeric" onChangeText={setProductQuantity}></TextInput>
            </View>

            <View>
                <Text>Observações</Text>
                <TextInput style={globalStyle.textInput} value={description} onChangeText={setDescription}></TextInput>
            </View>

            <TouchableOpacity style={styles.button} onPress={ValidateData}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        gap: 20,
    },

    picker: {
        borderWidth: 1,
        borderColor: 'red'
    },

    button: {
        backgroundColor: 'red',
        padding: 10,
        alignItems: 'center'
    },

    buttonText: {
        color: 'white'
    },
})