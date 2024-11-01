export type ProductProps = {
    product_name: string
    quantity: number
    image_url: string
    description: string
    branch_name: string
    location: string
    latitude: string
    longitude: string
}

export type LocalizationProps = {
    nome: string
    latitude: number
    longitude: number
}

type ProductSimpleProps = {
    nome: string
    imagem:string 
}

type HistoricItemProps = {
    id: number
    descricao: string
    data: string
    file: string
}

export type MovementProps = {
    id: number
    produto: ProductSimpleProps
    quantidade: number
    status: string
    origem: LocalizationProps
    destino: LocalizationProps
    dataCriacao: string
    historico: Array<HistoricItemProps>
}