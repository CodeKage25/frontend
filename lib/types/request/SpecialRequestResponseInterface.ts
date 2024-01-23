export interface SpecialRequestResponseInterface {
    status: boolean
    message: string
    data: Data
}

export interface Data {
    id: number
    name: string
    address: string
    serviceType: any
    rate: any
    description: string
    frequency: any
    lan: string
    log: string
    image: Image
    condition: string
    userId: number
    type: string
    categoryId: number
    subcategoryId: number
    createdAt: string
    updatedAt: string
    user: User
    category: Category
}

export interface Image {
    images: string[]
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

export interface Category {
    id: number
    name: string
    description: string
    image: string
    type: string
    createdAt: string
    updatedAt: string
}
