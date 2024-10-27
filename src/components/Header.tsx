import {View, Text, StyleSheet, ViewStyle } from "react-native"
import { globalColors } from "../styleSheets/globalStyleSheet"

interface HeaderStyle extends ViewStyle {}

type HeaderProps = {
    children?: React.ReactNode,
    style?: HeaderStyle
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