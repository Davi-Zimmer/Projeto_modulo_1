import { View, Text, Button } from "react-native";

export default function Home({navigation}: any){
    
    function backToLogin(){
        navigation.navigate('Login')
        console.log('uhum')
    }
    
    return (
    <View>
        <Text>Home</Text>

        <Button title='uhum'  onPress={backToLogin}></Button>
    </View>
)
}