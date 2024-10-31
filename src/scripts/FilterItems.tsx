export function FilterList( list:Array<any>, props:Array<string>, filter:string ){
    
    let filterWord = filter.toLowerCase()

    const filteredList = list.filter(itemToFilter => {
        
        let string = ''
        
        props.forEach( elm => string += itemToFilter[ elm ].toLowerCase() )

        return string.includes( filterWord )

    })

    return filteredList

}
