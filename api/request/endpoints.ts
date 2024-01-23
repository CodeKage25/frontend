import { SpecialRequestInterface } from "@/lib/types/request/SpecialRequestInterface";
import { axiosInstance } from "../axiosInstance";
import { getToken } from "@/lib/utils";
import { ProductInterface } from "@/lib/types/category/ProductInterface";
import { SpecialRequestResponseInterface } from "@/lib/types/request/SpecialRequestResponseInterface";

export const createRequest = async (params: SpecialRequestInterface): Promise<any> => {
    const formData = new FormData();
    if (params.type === 'PRODUCT') {
        formData.append('name', params?.name ?? '');
        formData.append('description', params?.description ?? '');
        formData.append('categoryId', params?.categoryId ?? '');
        formData.append('subcategoryId', params?.subcategoryId ?? '');
        formData.append('type', params?.type ?? '');
        formData.append('lan', '0.0');
        formData.append('log', '0.0');
        formData.append('address', params?.address ?? '');
        params?.image?.forEach((item: any, index: number) => formData.append('image', params.image[index]));
    } else if (params.type === 'SERVICE') {
        formData.append('serviceType', params.serviceType ?? '');
        formData.append('lan', '0.0');
        formData.append('log', '0.0');
        formData.append('address', params?.address ?? '');
        formData.append('frequency', params?.frequency ?? '');
        formData.append('type', params?.type ?? '');
        formData.append('rate', params?.rate ?? '');
    }
    const response = await axiosInstance.post(`/api/create-request`, formData, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const getAllRequest = async (): Promise<ProductInterface> => {
    const response = await axiosInstance.get('api/getall-request');
    return response.data;
}

export const getSingleRequest = async (id: string): Promise<SpecialRequestResponseInterface> => {
    const response = await axiosInstance.get(`api/get-single-request?id=${id}`);
    return response.data;
}