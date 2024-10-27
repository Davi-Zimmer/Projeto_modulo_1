import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet";

type UserProps = {
    name: string
    image: string
}

export default function User({ name, image } : UserProps){

    return (
        <View style={styles.userContainer}>
            <Image source={{uri: image}} style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: '#86FC91'
            }}/>

            <Text style={[{fontSize: 15, color:globalColors.mainColor}, globalStyle.font]} >{name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10

        // justifyContent: 'space-between'
    }
})