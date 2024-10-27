// React \\
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Touchable, Alert, Button, ScrollView } from "react-native";
import React, { useEffect, useState } from "react"


import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import axios from "axios"
import { Picker } from "@react-native-picker/picker";

import { ProductProps } from "../Props/ProductProps";
import AppBar from "../components/AppBar";


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

export default function RegisterMovement({navigation} : any) {

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
        <>
            <AppBar pageName="Register Movement" goBack={navigation.goBack }/>
            <ScrollView style={[globalStyle.container, styles.container]}>

                <View style={styles.posContainer}>

                    <View style={styles.inputsContainers}>
                        <Text style={[styles.buttonText, globalStyle.font]}>Filial de Origem</Text>
                        <View style={styles.picker}>
                            <Picker selectedValue={ originBranchId } onValueChange={ setOriginBranchId }  style={styles.picker}>
                                {
                                    branches.map(
                                            (elm, i) => <Picker.Item style={styles.pickerItem}
                                            label={elm.name}
                                            value={elm.id}
                                            key={i}
                                        />
                                    )
                                }
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputsContainers}>
                        <Text style={[styles.buttonText, globalStyle.font]}>Filial de Destino</Text>
                        <View style={styles.picker}>
                            <Picker selectedValue={ destinationBranchId } onValueChange={ setDestinationBranchId } style={styles.picker}>
                                {
                                    branches.map( 
                                        (elm, i)=> <Picker.Item style={ styles.pickerItem }
                                            label={elm.name}
                                            value={elm.id}
                                            key={i} 
                                        />
                                    )
                                }
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputsContainers}>
                        <Text style={[styles.buttonText, globalStyle.font]}>Produto Desejado</Text>
                        <View style={styles.picker}>
                            <Picker selectedValue={ desiredProductId } onValueChange={ setDesiredProductId } style={styles.picker}>
                                {
                                    products.map( 
                                        (elm, i) => <Picker.Item style={ styles.pickerItem }
                                            label={elm.product_name + `: ${elm.quantity} Un.`}
                                            value={i}
                                            key={i} 
                                            
                                        />
                                    )
                                }
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputsContainers}>
                        <Text style={[styles.buttonText, globalStyle.font]}>Quantia Desejada</Text>
                        <TextInput style={globalStyle.textInput} value={productQuantity} keyboardType="numeric" onChangeText={setProductQuantity}></TextInput>
                    </View>

                    <View style={styles.inputsContainers}>
                        <Text style={[styles.buttonText, globalStyle.font]}>Observações</Text>
                        <TextInput style={[globalStyle.textInput, styles.description]} multiline value={description} onChangeText={setDescription}></TextInput>
                    </View>

                    <TouchableOpacity style={globalStyle.button} onPress={ValidateData}>
                        <Text style={globalStyle.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>

                </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    description: {
        padding: 20
    },

    textInput: {
        padding: 20
    },

    container: {
        padding: 10,
        gap: 20
    },

    pickerItem: {
        backgroundColor: globalColors.casing,
        color: globalColors.mainColor,
        padding: 5,

    },

    buttonText: {
        color: globalColors.mainColor,
        fontSize: 15
    },

    posContainer: {
        backgroundColor: globalColors.casing,
        padding: 20,
    },

    inputsContainers: {
        backgroundColor: 'rgba(0, 0, 0, .1)',
        marginVertical: 10
    },

    picker: {
        borderBottomWidth: 1,
        borderBottomColor: globalColors.mainColor,
        padding: 7
    },

})