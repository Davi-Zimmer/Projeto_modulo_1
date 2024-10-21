// React \\
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Touchable, Alert, Button } from "react-native";
import React, { useEffect, useState } from "react";



import { globalStyle } from "../styleSheets/globalStyleSheet";
import axios from "axios";


type InfoInputProps = {
    content: string
    value: string
    onChange?: React.Dispatch<React.SetStateAction<string>>
}

function InfoInput({content, value, onChange} : InfoInputProps) {
    
    function handleChanges( newValue:string ) {
        onChange?.( newValue )
    }
    
    return (
        <View style={styles.inputContainer}>
            <Text>{content}</Text>
            <TextInput value={value} onChangeText={handleChanges} style={globalStyle.textInput}/>
        </View>
    )
}

type ButtonSelectionProps = {
    label: string
    onPress?: () => void

}

function ButtonSelection({label, onPress}:ButtonSelectionProps) {
    
    function handlePress(){
        onPress?.()
    }

    return (
        <TouchableOpacity onPress={ handlePress } style={styles.ButtonSelection}>
            <Text>{label}</Text>
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
    
    function toggleSelection( index: number ){
        onChange( index === 0 )
    }

    return (
        <View style={styles.DoubleSelectionStyle}>
            {React.Children.map(children, (child, index) => {
                return (React.cloneElement( child, { 
                    onPress: () => toggleSelection(index)
                }))
            })}
        </View>
    )
}



export default function RegisterUser(){
    
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

        }).catch( console.log )

    }

    return (
        <View>
            
            <DoubleSelection firstSelected={isDriver} onChange={setIsDriver}>
                <ButtonSelection label="Motorista" />
                <ButtonSelection label="Filial" />
            </DoubleSelection>

            <InfoInput content="Nome completo" value={name} onChange={setName}/>
            <InfoInput content={isDriver == true ? 'CPF' : 'CNPJ'} value={document}  onChange={setDocument}/>

            <InfoInput content="Endereço" value={address} onChange={setAddress}/>
            <InfoInput content="Email" value={email} onChange={setEmail}/>
            <InfoInput content="Senha" value={password} onChange={setPassword}/>
            <InfoInput content="Confirme a senha" value={confirmPassword} onChange={setConfirmPassword}/>
            
            <TouchableOpacity style={globalStyle.button} onPress={handleRegister}>
                <Text style={globalStyle.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

        </View>
    )
}


const styles = StyleSheet.create({
    ButtonSelection: {
        borderWidth: 1,
        borderColor: 'blue',
        padding: 20
    },

    inputContainer: {
        margin: 10
    },
     
    DoubleSelectionStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }

})


// useFocusEffect