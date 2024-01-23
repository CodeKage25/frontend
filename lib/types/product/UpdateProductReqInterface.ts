export interface UpdateProductReqInterface {
    name: string;
    description: string;
    type: string;
    condition: string;
    categoryId: number;
    price: number
    subcategoryId: number;
    image: any;
    lan: number;
    log: number;
    address: string;
}