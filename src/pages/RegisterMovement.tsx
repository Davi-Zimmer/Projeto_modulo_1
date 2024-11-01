// React \\
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react"
import { Picker } from "@react-native-picker/picker";


// Others \\
import axios from "axios"

import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import { ProductProps } from "../Props/ProductProps";
import AppBar from "../components/AppBar";


type BranchProps = {
    id: number
    name: string
    location: string
    latitude: number
    longitude: number
}

type CustomPickerProps = {
    selectedValue: string
    items: Array< BranchProps | ProductProps>
    label?: string
    setter: (a:string) => void
    mapping: (elm: any, i: number) => JSX.Element
    initialItem?: JSX.Element
}

function CustomPicker({selectedValue, setter, items, mapping, label, initialItem }:CustomPickerProps){
    return (
        <View style={styles.inputsContainers}>
            <Text style={[styles.buttonText, globalStyle.font]}>{label}</Text>
            <View style={styles.picker}>
                <Picker selectedValue={ selectedValue } onValueChange={ setter }  style={styles.picker}>
                        
                        { initialItem ? initialItem : null }
                        { items.map( mapping ) }
                        
                </Picker>
            </View>
        </View>
    )
}

export default function RegisterMovement({navigation} : any) {

    const [originBranchId, setOriginBranchId]           = useState('1')
    const [destinationBranchId, setDestinationBranchId] = useState('1')
    const [desiredProductId, setDesiredProductId]       = useState('')

    const [branches, setBranches] = useState<Array<BranchProps>>([])

    const [products, setProducts] = useState<Array<ProductProps>>([])
    const [allProducts, setAllProducts] = useState<Array<ProductProps>>([])

    const [productQuantity, setProductQuantity] = useState('1')
    const [description, setDescription] = useState('')
    
    // pega a lista de produtos e a lista de filiais
    useEffect(() => {

        axios.get(process.env.EXPO_PUBLIC_API_URL + '/products').then( res => 
            setAllProducts( res.data )
        ).catch( console.error )


        axios.get(process.env.EXPO_PUBLIC_API_URL + '/branches/options').then( res => 
            setBranches( res.data )
        ).catch( console.error )

    }, [])

    function clearInputs(){
        setDescription('')
        setProductQuantity('1')
    }

    // salva o movimento no backend
    function register( productId: number) {
        
        const movement = {
            originBranchId,
            destinationBranchId,
            productId,
            quantity: productQuantity,
            description
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
        
        if( destinationBranchId == originBranchId ){
            Alert.alert('a filial de origem e destino não podem ser as mesmas')
            return 
        }
        
        let productID = null
        const product = allProducts.find((elm, i) => elm.product_name == desiredProductId && (productID = i) )

        if( !product || !productID){
            Alert.alert('Selecione um produto')
            return
        }

        if( parseInt(productQuantity) > product.quantity ){
            Alert.alert(`A quantia disponível do produto atualmente é de ${ product.quantity} Unidades.`)
            return 
        }

        register( productID )

    }

    // pega os produtos da filial
    function getBranchProducts(){
        
        if( !branches[0] ) return

        const branchName = branches[ parseInt(originBranchId)-1 ].name

        const filteredItens = allProducts.filter(elm => elm.branch_name == branchName)

        setProducts( filteredItens )

    }

    function changeOriginBranch( branchId:string ){
       setOriginBranchId( branchId )
       setDesiredProductId( '0' )
    }

    useEffect(() => getBranchProducts( ), [originBranchId, branches, allProducts])

    return(
        <>
            <AppBar pageName="Register Movement" goBack={navigation.goBack }/>
            <ScrollView style={[globalStyle.container, styles.container]}>

                <View style={styles.posContainer}>

                    <CustomPicker 
                        selectedValue={originBranchId}
                        setter={changeOriginBranch}
                        items={branches}
                        label="Filial de origem"
                        mapping={ (elm, i) => <Picker.Item style={styles.pickerItem}
                            label={elm.name}
                            value={elm.id}
                            key={i} /> 
                        }
                    />

                    <CustomPicker 
                        selectedValue={destinationBranchId}
                        setter={setDestinationBranchId}
                        label="Filial de destino"
                        items={branches}
                            mapping={ (elm, i)=> <Picker.Item style={ styles.pickerItem }
                                label={elm.name}
                                value={elm.id}
                                key={i} 
                            />
                        }
                    />

                    <CustomPicker
                        selectedValue={desiredProductId}
                        setter={setDesiredProductId}
                        label="Produto"
                        items={products}
                        initialItem={ <Picker.Item style={ styles.pickerItem } label="Escolha um item" value={null} /> }
                            mapping={ (elm, i) => <Picker.Item style={ styles.pickerItem }
                                label={elm.product_name + `: ${elm.quantity} Un.`}
                                value={elm.product_name}
                                key={i}
                                
                            />
                        }
                    />

                    <View style={styles.inputsContainers}>
                        <Text style={[styles.buttonText, globalStyle.font]}>Quantia Desejada</Text>
                        <TextInput style={globalStyle.textInput} value={productQuantity} keyboardType="numeric" onChangeText={setProductQuantity}></TextInput>
                    </View>

                    <View style={styles.inputsContainers}>
                        <Text style={[styles.buttonText, globalStyle.font]}>Observações</Text>
                        <TextInput style={[globalStyle.textInput, styles.padding]} multiline value={description} onChangeText={setDescription}></TextInput>
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
    padding: {padding: 20},

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
        fontSize: 15,
        marginLeft: 10
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