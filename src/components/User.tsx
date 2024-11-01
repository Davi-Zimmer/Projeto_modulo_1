// React \\
import { View, Text, StyleSheet, Image } from "react-native"

// Style \\
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"

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
                borderColor: globalColors.positiveColor
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
    }
})