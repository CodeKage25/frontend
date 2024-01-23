export interface UserPlanResInterface {
    status: boolean
    message: string
    data: Data
}

export interface Data {
    status: boolean
    message: string
    plan?: Plan
}

export interface Plan {
    id: number
    name: string
    price: string
    coins: string
}