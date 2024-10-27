// React \\
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Touchable, Alert, Button, FlatList, ImageBackground } from "react-native";
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet";


export type ItemTextsProps = {
    title:string
    description:string
}

export default function ItemTexts({title, description}: ItemTextsProps) {
    return (
        <View style={styles.itemTextContainer}>
            <Text style={[{fontWeight: 'bold'}, styles.fistText]}>{title}</Text>
            <Text style={styles.secondText}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    fistText: {
        color: globalColors.mainColor,
    },

    secondText: {
        color: globalColors.mainColor,
    },

    itemTextContainer: {
        marginVertical: 10,
    }

})