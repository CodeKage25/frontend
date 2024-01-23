export interface SubCategoryInterface {
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
    categoryId: number
    createdAt: string
    updatedAt: string
}
