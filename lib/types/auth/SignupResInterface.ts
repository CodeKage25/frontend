export interface SignupResInterface {
    status: boolean
    message: string
    data: Data
}

export interface Data {
    type: string
    token: string
    user: User
}

export interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    otherName: any
    displayName: any
    avatar: any
    phone: string
    status: string
    pin: boolean
    type: string
}
