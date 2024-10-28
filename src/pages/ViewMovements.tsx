// React \\
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Touchable, Alert, Button, FlatList, ImageBackground } from "react-native";
import React, { useEffect, useState, useSyncExternalStore } from "react"


import { globalStyle } from "../styleSheets/globalStyleSheet"
import axios from "axios"
import { Picker } from "@react-native-picker/picker";
import { storage } from "../scripts/localStorage";
import * as ImagePicker from 'expo-image-picker';

import { LocalizationProps } from "../Props/ProductProps";


type ProductProps = {
    nome: string
    imagem:string 
}

type HistoricItemProps = {
    id: number
    descricao: string
    data: string
    file: string
}

type MovementProps = {
    id: number
    produto: ProductProps
    quantidade: number
    status: string
    origem: LocalizationProps
    destino: LocalizationProps
    dataCriacao: string
    historico: Array<HistoricItemProps>
}

type ItemTextsProps = {
    title:string
    description:string
}

function ItemTexts({title, description}: ItemTextsProps) {
    return (
        <View style={styles.ItemTextContainer}>
            <Text style={{fontWeight: 'bold'}}>{title}</Text>
            <Text>{description}</Text>

        </View>
    )
}


export default function ViewMovements({navigation}:any){

    const [userName, setUserName] = useState('')
    const [movements, setMovements] = useState<Array<MovementProps>>([])


    const [dummy, setDummy] = useState(true)

    const reload = () => setDummy(!dummy)


    function getMovements(){
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/movements').then( res => setMovements(res.data) )
        .catch( console.error )
    }

    useEffect( () => {
        getMovements()
    }, [dummy])


    useEffect( () => {
        
        getMovements()

        storage.get('user').then(res => {
            setUserName( res.name )
        })
    }, [])
  
    async function openCamera(){
        const cam = await ImagePicker.launchCameraAsync()

        const asset = cam.assets?.[0]
        
        if( !asset ) return
        
        return {
            uri: asset.uri,
            type: asset.mimeType as string,
            name: 'image' + Date.now()
        }
        
    }

    function updateMovement( status:string, {id, produto} : MovementProps ){
        
        let endPoint = ''

        if( status == 'created'){
            // iniciar entrega
            endPoint = 'start'

        } else {
            // encerrar entrega
            endPoint = 'end'
            
        }

        openCamera().then( imgObject => {

            const data = new FormData()
            
            data.append('motorista', userName)

            //@ts-ignore      tenho medo da linha de baixo (erro quântico: é blob, mas não é blob)
            data.append('file', imgObject)
    
            axios.put(process.env.EXPO_PUBLIC_API_URL + `/movements/${id}/${endPoint}`, data, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then(()=>{
                console.log('O produto foi atualizado')
                reload()

            }).catch( console.error )
        })
        
    }


    function gotToMap( {origem, destino} :MovementProps){

        navigation.navigate('Map', {
            userLocation: origem,
            destinationLocation: destino
        })
    }


    function renderCard( item:MovementProps ){
        const status = item.status

        let color = '#00800086'

        if( status == 'created'){
            color = 'gray'
        } else
    
        if( status == 'em transito'){
            color = 'salmon'
        } else 
        if( status == 'Coleta finalizada'){

        }

        return (
            <View style={[styles.itemContainer, {backgroundColor: color}]}>
                <View style={styles.productContainer}>
                    <Image style={styles.imageCard} source={{uri:`${item.produto.imagem}`}}/>

                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{item.produto.nome}</Text>
                        <Text style={styles.quantity}>{item.quantidade + ' Unidades'}</Text>
                    </View>

                </View>

                <ItemTexts title='Origem:' description={item.origem.nome}></ItemTexts>
                <ItemTexts title='Destino:' description={item.destino.nome}></ItemTexts>
                <ItemTexts title='Status:' description={item.status}></ItemTexts>
                <ItemTexts title='Pedido em:' description={item.historico[0].data}></ItemTexts>

                {
                    
                    status != 'Coleta finalizada' ? (
                       <>
                            <TouchableOpacity style={globalStyle.button} onPress={
                                () => updateMovement(status, item )}>

                                <Text style={globalStyle.buttonText}>{
                                    status == 'created' ? 'Iniciar Entrega' : 'Encerrar Entrega'
                                }</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={globalStyle.button} onPress={() => {
                                gotToMap( item )
                            }}>
                                <Text style={globalStyle.buttonText}>Mapa</Text>
                            </TouchableOpacity>
                        </>
                    ) : null
                }

            </View>
        )
    }

    return (
        <View style={styles.container}>

            <FlatList data={movements}
            contentContainerStyle={{ width:"100%" }}
            renderItem={({item}) => renderCard( item )}>
            
            </FlatList>   
        </View>
    )
}

const styles = StyleSheet.create({

    c: {
        width: 100,
        height: 50
    },

    ItemTextContainer: {
        marginVertical: 10
    },

    quantity: {
        fontWeight: 'bold',
        textAlign: 'right'
    },

    productName: {
        fontSize: 20
    },

    productInfo: {
        
    },

    productContainer: {
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom: 10
    },


    imageCard:{
        width: 100,
        height: 100
    },

    itemContainer:{
        width: "80%",
        backgroundColor: 'blue',
        alignSelf:'center',
        marginVertical: 30,
        marginHorizontal: 20,
        padding: 10
    },


    container: {
        width: "100%",
        height: "100%"
    }
})