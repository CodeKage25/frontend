export interface ProductInterface {
    status: boolean
    message: string
    data: Data[]
}

export interface Data {
    id: number
    name: string
    description: string
    address?: string
    price: number
    image: Image
    locationId: number
    userId: number
    type: string
    status: string
    reason: string
    condition: string
    categoryId: number
    subcategoryId: number
    createdAt: string
    updatedAt: string
    category: Category
}

export interface Image {
    images: string[]
}

export interface Category {
    name: string
}  