// Função de Haversine\\
const toRadius = (deg:number) => deg * (Math.PI / 180) 

export function HaversineFormula(lat1:number, long1:number, lat2:number, long2:number) {
    const radius = 6371

    const radLat = toRadius(lat2 - lat1)
    const radLong = toRadius(long2 - long1)

    const [cos, sin] = [Math.cos, Math.sin]
       
    const a =   sin(radLat / 2)**2 +
                cos( toRadius(lat1)  ) * cos( toRadius(lat2) ) * 
                sin(radLong / 2)**2

    const c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1 - a) )
    const distance = radius * c
    
    return distance
}