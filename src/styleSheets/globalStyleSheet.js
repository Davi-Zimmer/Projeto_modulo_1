import { StyleSheet } from "react-native"

'#FCDB86'
'#FC9D86'
'#CBFC86'
'#B386FC'

'#000014'
'#1c222b'
'#202e66'
'#3850ab'
'#6793D5'

export const globalColors = {
    backgroundPages: '#3D3152',
    anyContainerBackground: '#596175',
    casing: '#313a52',
    mainColor: '#86A5FC',
    mainColorWeaker: 'rgba(134, 165, 252, .5)',
    positiveColor: '#86FC91',
    negativeColor: '#FF4135',
    alternativeButtonColor: '#B386FC',
    pink:'#FC86AC',
    yellow: '#FCDB86'

}
// rgb(65, 68, 75)

export const globalStyle = StyleSheet.create({
    button: {
        marginTop: 10,
        
        padding: 10,
        alignItems: 'center',
        width: 150,
        alignSelf: 'center',

        borderWidth: 1,
        borderColor: '#86FC91',
    },

    font: {
        borderWidth: 1
    },

    buttonText: {
        fontSize: 15,
        color: '#86FC91'
    },


    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#86A5FC',
        color: '#86A5FC'
    },

    backgroundPage: {

        height: "100%",
        padding: 10

    },

    container: {
        height: '100%',
        backgroundColor: globalColors.anyContainerBackground,
        flex: 1
    },

    linearBorderRight: {
        borderTopRightRadius: 200,
        borderBottomLeftRadius: 200,
    },

    appHeaderText:{
        color: globalColors.mainColor,
        fontSize: 20
    },

    appBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: globalColors.mainColor,
        backgroundColor: globalColors.casing,
        alignItems: 'center',
    },

    optionButton: {
        padding: 20,
        borderWidth: 0,
        width: "100%",
        margin: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: globalColors.casing,
        borderBottomWidth: 2,
        borderBottomColor: globalColors.mainColor,
        borderRadius: 5
    },

    optionText: {
        color: globalColors.mainColor,
        fontSize: 20,
    },

    optionsContainer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 20,

        margin: 20,
        backgroundColor: 'rgba(0, 0, 0, .1)',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#8C91A0'
    },


})