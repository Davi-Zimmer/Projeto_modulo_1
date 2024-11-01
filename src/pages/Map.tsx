// React \\
import {View, Text, TouchableOpacity, StyleSheet } from "react-native"
import {useState, useEffect} from "react"

import MapView, { Marker } from "react-native-maps"
import { useRoute } from "@react-navigation/native"


// Others \\
import { LocalizationProps } from "../Props/ProductProps"
import { globalColors } from "../styleSheets/globalStyleSheet"

type CoordinatesProps = {
    userLocation: LocalizationProps
    destinationLocation: LocalizationProps
}

export default function Map() {

    const route = useRoute() 

    const {userLocation, destinationLocation} : CoordinatesProps = route.params as CoordinatesProps

    const [focusInUser, setFocusInUser] = useState( true )

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
    };


    // altera as coordenadas pra mostrar o motorista ou o destino
    useEffect( () => {

        let [lati, long] = [userLocation.latitude, userLocation.longitude]

        if( focusInUser ){
            [ lati, long ] = [destinationLocation.latitude, destinationLocation.longitude]
        } 

        updateRegion( lati, long )

    }, [focusInUser])


    const goToDesteny = () => setFocusInUser( !focusInUser )

    return (
        
        <View style={styles.container}>

            <TouchableOpacity onPress={goToDesteny}>
                <Text style={styles.text}>{focusInUser ? 'Ir para destino' : 'Ir para origem'}</Text>
            </TouchableOpacity>

            {/* <Text>{'Distância: '}</Text> */}

            <MapView style={styles.map}
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

    map: {
        width: '100%',
        height: '100%',
    },

    text: {
        color: globalColors.mainColor
    }
})