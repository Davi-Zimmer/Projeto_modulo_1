import { Text } from "react-native"
import { useEffect, useState } from "react"
import { globalStyle } from "../styleSheets/globalStyleSheet"

export function Loader( loading:boolean ) {

    const textLoading = (loadingText:string, cantLoad:string) =>  {

        return loading ?
        <Text style={globalStyle.loadingTexts}>{loadingText}</Text> :
        <Text style={globalStyle.loadingTexts}>{cantLoad}</Text>
    }

    return { textLoading }

}