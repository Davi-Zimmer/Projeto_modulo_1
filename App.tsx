// React \\
import {View, Text, SafeAreaView, Alert, TouchableOpacity, StyleSheet, StatusBar} from "react-native"
import {useState, useEffect} from "react"


// React Navigation \\
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()


// Others \\
import axios from "axios"


// Custom Screens \\
import Login from "./src/pages/Login"
import Home from "./src/pages/Home"
import ProductList from "./src/pages/ProductList"
import ManageUsers from "./src/pages/ManageUsers"


export default function App() {
  /*
    axios.get( process.env.EXPO_PUBLIC_API_URL + '/products').then( res => {
      console.log( res )
    }).catch( err => {
      console.error( err )
    })
  */

  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>

          <Stack.Screen name="Login" component={ Login } options={{header: () => <></>}}></Stack.Screen>
          <Stack.Screen name="Home"  component={ Home } ></Stack.Screen>
          <Stack.Screen name="ProductList"  component={ ProductList } ></Stack.Screen>
          <Stack.Screen name="ManageUsers"  component={ ManageUsers } ></Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>

    </SafeAreaView>
  )
}