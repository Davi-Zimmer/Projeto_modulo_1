// React \\
import {View, Text, SafeAreaView, Alert, TouchableOpacity, StyleSheet, StatusBar, Button} from "react-native"
import {useState, useEffect} from "react"
import MapView, { Marker } from "react-native-maps"
import { useRoute } from "@react-navigation/native"
import { LocalizationProps } from "../Props/ProductProps"

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

    useEffect( () => {



        if( focusInUser ){
            updateRegion( destinationLocation.latitude, destinationLocation.longitude)
   

        } else {

            updateRegion( userLocation.latitude, userLocation.longitude)


        }
    }, [focusInUser])



    function goToDesteny(){
        setFocusInUser( !focusInUser )
    }

    return (
        
        <View style={styles.container}>


            <Button title={focusInUser ? 'Ir para destino' : 'Ir para origem'} onPress={goToDesteny}/>
            <Text>{'Distância: '}</Text>
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

    },

    map: {
        width: '100%',
        height: '100%'
    }
})