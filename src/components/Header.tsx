// React \\
import {View, StyleSheet, ViewStyle } from "react-native"


// Style \\
import { globalColors } from "../styleSheets/globalStyleSheet"


type HeaderProps = {
    children?: React.ReactNode,
    style?: ViewStyle
}

export default function Header({children, style} : HeaderProps){

    return (
        <View style={[styles.header, style]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        backgroundColor: globalColors.casing,
    }
})