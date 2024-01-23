export interface LocationResInterface {
    status: boolean
    message: string
    data: Data
}

export interface Data {
    id: number
    lan: number
    log: string
    userId: number
    updatedAt: string
    createdAt: string
}

export interface CheckLocationResInterface {
    status: boolean
    message: string
    data: LocationData
}

export interface LocationData {
    message: boolean
}