import { CategoryInterface } from "@/lib/types/category/CategoryInterface";
import { axiosInstance } from "../axiosInstance"
import { SubCategoryInterface } from "@/lib/types/category/SubCategoryInterface";
import { ProductInterface } from "@/lib/types/category/ProductInterface";

export const getCategory = async (): Promise<CategoryInterface> => {
    const response = await axiosInstance.get(`/api/get-category?type=PRODUCT`);
    console.log(response.data)
    return response.data;
}
// export const getCategoryNav = async (): Promise<CategoryInterface> => {
//     const response = await axiosInstance.get('/api/get-category?type=&limit=6');
//     // console.log(response.data)
//     return response.data;
// }

export const getSubCategory = async (id: number): Promise<SubCategoryInterface> => {
    const response = await axiosInstance.get(`api/get-subcategory?id=${id}`);
    return response.data;
}

export const getCategoryProducts = async (
    id?: string,
    subId?: string,
    condition?: string,
    minPrice?: string,
    maxPrice?: string,
    log?: string,
    lan?: string
): Promise<ProductInterface> => {
    const query = {
        condition,
        minPrice,
        maxPrice,
        log,
        lan,
        categoryId: id,
        subcategoryId: subId
    }
    const queryUrl = Object.entries(query)
        .filter(([key, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    const response = await axiosInstance.get(`/api/get-products?${queryUrl}`);
    return response.data;
}