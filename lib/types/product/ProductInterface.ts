export interface ProductInterface {
    status: boolean
    message: string
    data: Data
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
    user: User
    location: Location
    category: Category
}

export interface Image {
    images: any[]
}

export interface User {
    createdAt: string
    updatedAt: string
    firstName: string
    lastName: string
    otherName: any
    email: string
    phone: string
    gender: any
    avatar: any
    displayName: any
    token: any
}

export interface Location {
    createdAt: string
    updatedAt: string
    lan: number
    log: number
}

export interface Category {
    name: string
}  