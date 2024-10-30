// React \\
import { View, Text } from "react-native"

// Style \\
import { globalColors } from "../styleSheets/globalStyleSheet"

export type ItemTextsProps = {
    title:string
    description:string
    color?: string
}

export default function ItemTexts({title, description, color=globalColors.mainColor}: ItemTextsProps) {

    const style = { color }

    return (
        <View style={{ marginVertical: 10 }}>
            <Text style={[{fontWeight: 'bold'}, {color:globalColors.mainColor}]}>{title}</Text>
            <Text style={style}>{description}</Text>
        </View>
    )
}