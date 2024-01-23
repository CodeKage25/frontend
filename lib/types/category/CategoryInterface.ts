export interface CategoryInterface {
    status: boolean
    message: string
    data: Data[]
}

export interface Data {
    id: number
    name: string
    description: string
    image: string
    type: string
    createdAt: string
    updatedAt: string
    subcategory: Subcategory[]
}

export interface Subcategory {
    id: number
    name: string
}
