// React \\
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, TextInput } from "react-native"
import React, { useEffect, useState } from "react"


// Custom Components\\
import ItemTexts from "../components/ItemTexts"
import AppBar from "../components/AppBar"


// Others \\
import axios from "axios"

import * as ImagePicker from 'expo-image-picker'

import * as Progress from 'react-native-progress';


import * as Location from 'expo-location';


import { MaterialCommunityIcons } from '@expo/vector-icons'

import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import { LocalizationProps, MovementProps  } from "../Props/ProductProps"
import { storage } from "../scripts/localStorage"
import { HaversineFormula } from "../scripts/calculeDistance"
import { Loader } from "../hooks/Loader"

async function getLocation(): Promise<LocalizationProps | null> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return null
    }
  
    const location = await Location.getCurrentPositionAsync({})
    const { latitude, longitude } = location.coords
    
    return { latitude, longitude } as LocalizationProps
}

function getProgressByDistance({origem, destino}:MovementProps, {latitude, longitude}:LocalizationProps){
    const branchDistance = 
    HaversineFormula(
        origem.latitude,
        origem.longitude,
        destino.latitude,
        destino.longitude
    )

    let driverDistance =
    HaversineFormula(
        latitude,
        longitude,
        destino.latitude,
        destino.longitude
    )

    // driverDistance *= .9

    // console.log(branchDistance / driverDistance )
    
    return branchDistance / driverDistance
}

type progressBarProps = {
    item: MovementProps,
    ended: boolean
}

function ProgressBar ({item, ended}:progressBarProps) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {

        if(ended){
            
            setProgress( 1 )
            
        } else {
            getLocation().then( res => {
                if(res){
                    const distance = getProgressByDistance( item, res )
    
                    setProgress( distance )
                }
            })
        }

      
    }, [])

    return <Progress.Bar progress={ progress } style={styles.progressBar} />
}

export default function ViewMovements({navigation}:any){

    const [userName, setUserName] = useState('')
    const [movements, setMovements] = useState<Array<MovementProps>>([])
    const [ loading, setLoading ] = useState(true)

    const [shownMovements, setShownMovements] = useState<Array<MovementProps>>([])


    const [filter, setFilter] = useState('')

    const { textLoading } = Loader( loading ) 

    useEffect(() => {

        const newMovementList = movements.filter(elm => {
            const st = (elm.produto.nome + elm.status).toLowerCase()

            return st.includes( filter.toLowerCase() )
        })

        setShownMovements( newMovementList )
    }, [movements, filter])


    const [dummy, setDummy] = useState( true )

    const reload = () => setDummy(!dummy)

    function getMovements(){
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/movements')
        .then( res => setMovements(res.data) )
        .catch( console.error )
        .finally( () => setLoading( false ))
    }

    useEffect( getMovements, [dummy])

    useEffect( () => {
        
        getMovements()

        storage.get('user').then( res => setUserName( res.name ))

    }, [])
  
    async function openCamera(){
        const permission = await ImagePicker.requestCameraPermissionsAsync()

        if( !permission.granted ){
            Alert.alert('Não foi possível usar a camera.')
            return
        }

        const cam = await ImagePicker.launchCameraAsync()

        const asset = cam.assets?.[0]
        
        if( !asset || cam.canceled ) return
        
        return {
            uri: asset.uri,
            type: asset.mimeType as string,
            name: 'image' + Date.now()
        }
        
    }

    // inicia e encerra a entrega de acordo com o status
    function updateMovement( status:string, { id } : MovementProps ){
        
        let endPoint = ''

        if( status == 'created') endPoint = 'start' // iniciar entrega
        else endPoint = 'end' // encerrar entrega

        openCamera().then( imgObject => {

            if( !imgObject ) return
            
            const data = new FormData()
            
            data.append('motorista', userName)

            //@ts-ignore      tenho medo da linha de baixo
            data.append('file', imgObject)
    
            axios.put(process.env.EXPO_PUBLIC_API_URL + `/movements/${id}/${endPoint}`, data, {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
            )
            .then( reload )
            .catch( console.log )
        })
        
    }

    // abre o mapa mostrnado a origem e o destino
    function gotToMap( {origem, destino} : MovementProps){

        navigation.navigate('Map', {
            userLocation: origem,
            destinationLocation: destino
        })
    }

    function renderCard( item:MovementProps ){
        const status = item.status

        let color = globalColors.positiveColor

        if( status == 'created')     color = globalColors.pink;  else
        if( status == 'em transito') color = globalColors.yellow

        return (
            <View style={[styles.itemContainer, {borderColor: color}]}>
                
                <View style={styles.productContainer}>
                    <Image style={[styles.imageCard, {borderColor: color}]} source={{uri:`${item.produto.imagem}`}}/>

                    <View>
                        <Text style={styles.productName}>{item.produto.nome}</Text>
                        <Text style={styles.quantity}>{item.quantidade + ' Unidades'}</Text>
                    </View>

                </View>

                <View style={styles.line}/>

                
                <ProgressBar item={item} ended={status == 'Coleta finalizada'}/>
                    

                <ItemTexts title='Origem:' description={item.origem.nome} />
                <ItemTexts title='Destino:' description={item.destino.nome} />
                <ItemTexts title='Status:' description={item.status} color={color} />
                <ItemTexts title='Pedido em:' description={item.historico[0].data} />

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

            <View>
                <TextInput
                    value={filter}
                    onChangeText={setFilter}
                    style={styles.filterStyle}
                    placeholder="Buscar"
                    placeholderTextColor={'#60687D'} 
                    />
                    
            </View>


            <View style={styles.flatListContainer}>
                
                <FlatList data={shownMovements}
                    contentContainerStyle={{ width:"100%" }}
                    renderItem={({item}) => renderCard( item )}
                    ListFooterComponent={<View style={{ height: 40}} />}
                    ListEmptyComponent={textLoading('Carregando', 'Não há movimentos')}>
                </FlatList>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    filterStyle: {
        padding: 10,
        backgroundColor: globalColors.casing,
        color: globalColors.mainColor
    },

    progressBar: {
        width: '100%'
    },


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
        backgroundColor: globalColors.alternativeButtonColor,
        alignItems: 'center',
    },

    line: {
        borderBottomWidth: 1,
        borderColor: globalColors.mainColor
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
        borderRadius: 5,
        borderWidth: 2
    }

})