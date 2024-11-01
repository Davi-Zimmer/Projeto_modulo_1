// React \\
import {View, Text, SafeAreaView, Alert, TouchableOpacity, StyleSheet, StatusBar} from "react-native"
import {useState, useEffect} from "react"
import { MaterialCommunityIcons } from '@expo/vector-icons'


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
import UsersList from "./src/pages/UsersList"
import RegisterUser from "./src/pages/RegisterUser"
import MovementsList from "./src/pages/MovementsList"
import RegisterMovement from "./src/pages/RegisterMovement"
import ViewMovements from "./src/pages/ViewMovements"
import Map from "./src/pages/Map"


function emptyHeader(){
  return {header: () => <></>}
}


export default function App() {

  const windows = [
    "Login", Login,
    "Home", Home,
    "Products List", ProductList,
    "Users", UsersList,
    "Register User", RegisterUser,
    "Movements List", MovementsList,
    "Register Movement", RegisterMovement,
    "View Movements", ViewMovements
  ]

  return (

    <SafeAreaView style={{flex:1}}>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' >

          <Stack.Screen name="Login" component={ Login } options={emptyHeader()} />
          <Stack.Screen name="Home"  component={ Home } options={ emptyHeader() } />
          <Stack.Screen name="Products List" component={ ProductList } options={ emptyHeader() } />
          <Stack.Screen name="Users" component={ UsersList } options={ emptyHeader() }/>
          <Stack.Screen name="Register User" component={ RegisterUser } options={ emptyHeader() } />
          <Stack.Screen name="Movements List" component={ MovementsList } options={ emptyHeader() }/>
          <Stack.Screen name="Register Movement" component={ RegisterMovement } options={ emptyHeader() }/>
          <Stack.Screen name="View Movements" component={ ViewMovements } options={ emptyHeader() } />
          <Stack.Screen name="Map" component={ Map } initialParams={{ userLocation:null, destinationLocation:null }}></Stack.Screen>
         
        </Stack.Navigator>
      </NavigationContainer>

    </SafeAreaView>
  )
}