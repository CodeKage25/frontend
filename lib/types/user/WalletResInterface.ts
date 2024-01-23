export interface WalletResInterface {
    status: boolean
    message: string
    data: Data
}

export interface Data {
    id: number
    balance: number
    status: string
    createdAt: string
    updatedAt: string
}