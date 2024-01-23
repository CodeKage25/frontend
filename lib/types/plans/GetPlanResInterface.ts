export interface GetPlanResInterface {
    status: boolean
    message: string
    data: Data[]
}

export interface Data {
    id: number
    name: string
    price: string
    coins: string
    createdAt: string
    updatedAt: string
}