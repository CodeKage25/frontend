export interface SellerResInterface {
    status: boolean
    message: string
    data: Data[]
}

export interface Data {
    id: number
    name: string
    description: string
    address: string
    price: number
    lan: any
    log: any
    image: Image
    locationId: number
    userId: number
    type: string
    status: string
    reason: any
    condition: string
    categoryId: number
    subcategoryId: number
    createdAt: string
    updatedAt: string
    user: User
    category: Category
}

export interface Image {
    images: string[]
    condition: string
    displayImage: string
}

export interface User {
    id: number
    firstName: string
    lastName: string
    otherName: any
    updatedAt: string
    createdAt: string
    avatar: any
}

export interface Category {
    id: number
    name: string
}
