import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * @returns any | null
 */
async function get( key:string ) {
    
    let storage = null

    try {
        const dataJSON = await AsyncStorage.getItem( key )
        
        if( dataJSON ) storage = JSON.parse( dataJSON )
        
    } catch( err ) {
        console.log( err )
    }

    return storage
}

/**
 * @returns Boolean
 */
async function set( key:string, newStorageData: any) {

    // retorna true se houver um erro
    let isError = false

    try {
        await AsyncStorage.setItem(key, JSON.stringify(newStorageData))
        isError = false

    } catch {
        isError = true
    }

    return isError
} 

export const storage = { get, set }