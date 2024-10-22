import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";

type UserProps = {
    name: string
    image: string
}

export default function User({ name, image } : UserProps){

    return (
        <View style={styles.userContainer}>
            <Image source={{uri: image}} style={{
                width: 60,
                height: 60,
                borderRadius: 50
            }}/>

            <Text style={{fontSize: 15}}>{name}</Text>
        </View>
    )
}



const styles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})