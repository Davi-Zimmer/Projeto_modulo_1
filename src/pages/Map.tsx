// React \\
import {View, Text, TouchableOpacity, StyleSheet, Button } from "react-native"
import {useState, useEffect} from "react"

import MapView, { Marker } from "react-native-maps"
import { useRoute } from "@react-navigation/native"


// Others \\
import { LocalizationProps } from "../Props/ProductProps"
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import { HaversineFormula } from "../scripts/calculeDistance"
import AppBar from "../components/AppBar"

type CoordinatesProps = {
    userLocation: LocalizationProps
    destinationLocation: LocalizationProps
}

export default function Map({navigation}:any) {

    const route = useRoute() 

    const {userLocation, destinationLocation} : CoordinatesProps = route.params as CoordinatesProps

    const [focusInUser, setFocusInUser] = useState( true )

    const [opacityTimeout, setOpacityTimeout] = useState<NodeJS.Timeout | void>()

    const [isMoving, setIsMoving] = useState( false )

    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 5,
        longitudeDelta: 5,
    });

    const updateRegion = (newLatitude: number, newLongitude: number) => {
        setRegion({
            ...region,
            latitude: newLatitude,
            longitude: newLongitude,
        });
    }
    
    const Distance = HaversineFormula(
            userLocation.latitude,
            userLocation.longitude,
            destinationLocation.latitude,
            destinationLocation.longitude 
        ).toFixed(1)


    // altera as coordenadas pra mostrar o motorista ou o destino
    useEffect( () => {

        let [lati, long] = [userLocation.latitude, userLocation.longitude]

        if( focusInUser ){
            [ lati, long ] = [destinationLocation.latitude, destinationLocation.longitude]
        }

        updateRegion( lati, long )

    }, [focusInUser])
    
    function handleTouch(){
        
        // debouncer
        if(opacityTimeout){
            setOpacityTimeout( clearTimeout( opacityTimeout ))
            setIsMoving( true )
        }

        const timeout = setTimeout(() => setIsMoving( false ), 2000)

        setOpacityTimeout( timeout )

    }

    const goToDesteny = () => setFocusInUser( !focusInUser )

    return (
        
        <View style={styles.container}>

            <AppBar pageName="Mapa" goBack={navigation.goBack}/>

            <View style={[styles.infoContainer, {opacity: (isMoving? .2 : 1)}]} >
                <Text style={styles.text}>{`Distância: ${Distance} Km`}</Text>
                
                <TouchableOpacity onPress={goToDesteny} style={styles.button}>
                    <Text style={styles.buttonText}>{focusInUser ? 'Ir para destino' : 'Ir para origem'}</Text>
                </TouchableOpacity>

            </View>


            <MapView style={styles.map} onTouchEnd={() => handleTouch()}
                provider='google'
                
                region={region}
                onRegionChangeComplete={setRegion}
            >

                <Marker
                    title='Destino' 
                    coordinate={{
                        latitude: destinationLocation.latitude,
                        longitude: destinationLocation.longitude
                    }}>

                </Marker>

                <Marker
                    title='Destino' 
                    coordinate={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude
                    }}>

                </Marker>
                
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: globalColors.anyContainerBackground
    },

    infoContainer: {
        zIndex: 20,
        position: 'absolute',
        padding: 10,
        top: 50,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    },

    button: {
        backgroundColor: globalColors.alternativeButtonColor,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    },

    buttonText: {
        fontSize: 15,
        color: 'white'
    },

    map: {
        width: '100%',
        height: '100%',
    },

    text: {
        color: 'white',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, .5)'
    }
})