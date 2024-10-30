// React \\
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native"
import React, { useState } from "react"


// Others \\
import { MaterialCommunityIcons } from '@expo/vector-icons'

import axios from "axios"

import { globalColors, globalStyle } from "../styleSheets/globalStyleSheet"
import AppBar from "../components/AppBar";


type InfoInputProps = {
    content: string
    value: string
    onChange?: React.Dispatch<React.SetStateAction<string>>
    secureTextEntry?: boolean
}

function InfoInput({content, value, onChange, secureTextEntry = false} : InfoInputProps) {
    
    const handleChanges = ( newValue:string ) => onChange?.( newValue )
    
    return (
        <View style={{ margin: 10 }}>
            <Text style={[globalStyle.font, styles.textInput]}>{content}</Text>
            <TextInput value={value} onChangeText={handleChanges} style={[globalStyle.textInput, {padding: 10}]} secureTextEntry={secureTextEntry} />
        </View>
    )
}

type ButtonSelectionProps = {
    icon: string
    onPress?: () => void,
    selected?: boolean
}

function ButtonSelection({ icon, onPress, selected }:ButtonSelectionProps) {
    
    const handlePress =() => onPress?.()

    const color = selected ? globalColors.positiveColor : globalColors.mainColor 

    return (
        <TouchableOpacity onPress={ handlePress } style={[styles.ButtonSelection, {borderColor: color}]}>
            <MaterialCommunityIcons name={icon as any} size={40} color={ color }/>
        </TouchableOpacity>
    )
}

type DoubleSelectionProps = {
    children: React.ReactElement<ButtonSelectionProps>[]
    firstSelected: boolean
    onChange: React.Dispatch<React.SetStateAction<boolean>>
}

function DoubleSelection({children, firstSelected, onChange}: DoubleSelectionProps){
    
    if( children.length != 2 ) throw new Error('Only 2 child nodes are allowed.')
    
    const toggleSelection = ( index: number ) => onChange( index === 0 )

    return (
        <View style={styles.DoubleSelectionStyle}>
            {React.Children.map(children, 
                (child, index) => {

                    return (React.cloneElement( child, { 
                        onPress: () => toggleSelection(index),
                        selected: (firstSelected ? 0 : 1) == index
                    }))

                })
                
            }
        </View>
    )
}

export default function RegisterUser({navigation}: any){
    
    const [ isDriver, setIsDriver ] = useState(true)
    const [ name, setName ] = useState('')
    const [ document, setDocument ] = useState('')
    const [ address, setAddress ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword] = useState('')
    const [ confirmPassword, setConfirmPassword] = useState('')
    
    function validData(){

        const isFieldEmpty = (s:string) => s.trim() === '' 

        const allFields = [name, document, address, email, password, confirmPassword]

        const emptyField = allFields.find( isFieldEmpty )

        const isValid = emptyField == undefined

        return isValid
    }

    function clearFormulary(){
        [setName, setDocument, setAddress, setEmail, setPassword, setConfirmPassword].forEach(elmFunc => elmFunc(''))
    }

    function handleRegister(){

        if( !validData() ) {
            Alert.alert('O formulário não está completo')
            return
        }

        if( password !== confirmPassword){
            Alert.alert('Confirme sua senha corretamente')
            return
        }

        axios.post(process.env.EXPO_PUBLIC_API_URL + '/register', {
            profile: isDriver ? 'motorista' : 'filial',
            full_address: address,
            name,
            document,
            email,
            password

        }).then( () => {
            Alert.alert('Usuário cadastrado')
            clearFormulary()
        }).catch( console.log ) // quando der erro, poderia guardar os dados no localStorage

    }

    return (

        <>
            <AppBar pageName="Register Movement" goBack={navigation.goBack }/>
            <View style={[globalStyle.container, {padding: 10}]}>
            
                <ScrollView style={styles.inputsContainer}>
                    <DoubleSelection firstSelected={isDriver} onChange={setIsDriver}>
                        <ButtonSelection icon="car-hatchback" />
                        <ButtonSelection icon="office-building-marker-outline" />
                    </DoubleSelection>

                    <InfoInput content="Nome completo" value={name} onChange={setName}/>
                    <InfoInput content={isDriver == true ? 'CPF' : 'CNPJ'} value={document}  onChange={setDocument}/>

                    <InfoInput content="Endereço" value={address} onChange={setAddress}/>
                    <InfoInput content="Email" value={email} onChange={setEmail}/>
                    <InfoInput content="Senha" value={password} onChange={setPassword} secureTextEntry />
                    <InfoInput content="Confirme a senha" value={confirmPassword} onChange={setConfirmPassword} secureTextEntry/>
                    
                    <TouchableOpacity style={globalStyle.button} onPress={handleRegister}>
                        <Text style={globalStyle.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>

                </ScrollView>

            </View>
        </>
    )
}


const styles = StyleSheet.create({

    inputsContainer: {
        padding: 10,
        gap: 10,
        backgroundColor: globalColors.casing,

    },

    textInput: {
        color: globalColors.mainColor,
        fontSize: 15
    },


    ButtonSelection: {
        borderWidth: 1,
        padding: 20,
        borderColor: globalColors.mainColor
    },
     
    DoubleSelectionStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }

})