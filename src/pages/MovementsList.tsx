// React \\
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, FlatList} from "react-native"
import { useDeferredValue, useEffect, useState } from "react"


// React Navigation \\
import { CommonActions } from "@react-navigation/native"


// Others \\
import axios from "axios"


// Custom Components \\
import Header from "../components/Header"


// Custom Scripts \\
import { storage } from "../scripts/localStorage"
import { globalStyle } from "../styleSheets/globalStyleSheet"
import User from "../components/User"


type MovementProps = {
    originBranchId: number
    destinationBranchId: number
    productId: number
    quantity: number
}



export default function MovementsList({navigation}:any){

    const [movements, setMovements] = useState<Array<MovementProps>>([])

    useEffect(() => {
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/movements').then( res => {
            setMovements( res.data )
        }).catch( console.error )
    }, [])


    function addMoviment() {
        // navigation.navigate('')
    }


    function render({originBranchId}:MovementProps){
        return (
            <Text>{originBranchId}</Text>
        )
    }

    return (
        <View style={styles.container}>
            <Header>
                <User name='Wall Termite' image="https://placehold.co/200.png" />
            </Header>

            <TouchableOpacity onPress={addMoviment} style={globalStyle.button}>
                <Text style={globalStyle.buttonText}>Adicionar Movimentação</Text>
            </TouchableOpacity>

            <FlatList
                data={movements}
                renderItem={({item}) => render(item)}
                contentContainerStyle={{ width: "100%" }}>

            </FlatList>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    }
})