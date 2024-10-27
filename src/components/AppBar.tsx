import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet";
import { MaterialCommunityIcons } from '@expo/vector-icons'

type AppBarProps = {
    pageName: string,
    goBack?: () => void,
    noLine?: boolean
}

export default function AppBar( {pageName, goBack, noLine}: AppBarProps) {

    let border = {borderBottomWidth: 1, borderBottomColor: globalColors.mainColor}

    return (
        <View style={[styles.container, !noLine ? border : null]}>
            {
                goBack ? (
                <TouchableOpacity onPress={ () => goBack() }>
                    <MaterialCommunityIcons name="chevron-left" size={50} color={globalColors.mainColor}/>
                </TouchableOpacity>) : null
            }

            <Text style={globalStyle.appHeaderText}>{pageName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: globalColors.casing,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 10
    }
})