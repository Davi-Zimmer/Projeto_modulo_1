// React \\
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Touchable, Alert, Button, FlatList, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react"

// Custom Things \\
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import { storage } from "../scripts/localStorage";
import { MovementProps  } from "../Props/ProductProps";
import ItemTexts from "../components/ItemTexts";
import { MaterialCommunityIcons } from '@expo/vector-icons'


import axios from "axios"
import * as ImagePicker from 'expo-image-picker';
import AppBar from "../components/AppBar";


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

            }).catch( console.log )
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

                <View style={styles.line} />

                <ItemTexts title='Origem:' description={item.origem.nome}></ItemTexts>
                <ItemTexts title='Destino:' description={item.destino.nome}></ItemTexts>
                <ItemTexts title='Status:' description={item.status}></ItemTexts>
                <ItemTexts title='Pedido em:' description={item.historico[0].data}></ItemTexts>

                {
                    
                    status != 'Coleta finalizada' ? (
                       <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={ styles.button } onPress={
                                () => updateMovement(status, item )}>

                                <Text style={ styles.buttonText }>{
                                    status == 'created' ? 'Iniciar Entrega' : 'Encerrar Entrega'
                                }</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={ styles.button } onPress={() => {
                                    gotToMap( item )
                                }}>
                                <Text style={ styles.buttonText }>Mapa</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }

            </View>
        )
    }

    return (
        <View style={globalStyle.container}>
            <View style={globalStyle.appBarContainer}>

                <AppBar pageName="Movements List" noLine />

                <TouchableOpacity onPress={() => { storage.set('user', null);  navigation.navigate('Login')}}>
                    <MaterialCommunityIcons name="logout" size={30} color={globalColors.mainColor} />
                </TouchableOpacity>

            </View>


            <View style={styles.flatListContainer}>
                
                <FlatList data={movements}
                    contentContainerStyle={{ width:"100%" }}
                    renderItem={({item}) => renderCard( item )}>
                </FlatList>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    flatListContainer: {
        backgroundColor: globalColors.casing,
        margin: 20
    },

    quantity: {
        fontWeight: 'bold',
        textAlign: 'right',
        color: globalColors.mainColor,
    },

    productName: {
        fontSize: 20,
        color: globalColors.mainColor
    },

    productInfo: {
        
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'

    },

    buttonText: {
        color: globalColors.casing,
        padding: 10,
        borderRadius: 5
    },

    button: {
        backgroundColor: '#B386FC',
        alignItems: 'center',
    },

    line: {
        borderBottomWidth: 1,
        borderColor: globalColors.mainColor // '#B386FC'
    },

    productContainer: {
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom: 10,
    },

    imageCard:{
        width: 100,
        height: 100,
        borderWidth: 3,
        borderColor: globalColors.mainColor,
        borderRadius: 5
    },

    itemContainer:{
        width: "80%",
        alignSelf:'center',
        marginVertical: 20,
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 5
    },

    container: {
        width: "100%",
        height: "100%"
    }

})