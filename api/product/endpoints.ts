import { axiosInstance } from "../axiosInstance"
import { CreateProductReqInterface } from "@/lib/types/product/CreateProductReqInterface";
import { UpdateProductReqInterface } from "@/lib/types/product/UpdateProductReqInterface";
import { getToken } from "@/lib/utils";
import { ProductInterface } from "@/lib/types/product/ProductInterface";
import { ProductInterface as CategoryProductInterface } from "@/lib/types/category/ProductInterface";
import axios from "axios";

export const getProduct = async (id: string): Promise<ProductInterface> => {
    const response = await axiosInstance.get(`/api/get-single-product?id=${id}`);
    return response.data;
}

export const getSellerProducts = async (id: number, type: string): Promise<CategoryProductInterface> => {
    const response = await axiosInstance.get(`/api/getseller-product-service?type=${type}&id=${id}`);
    return response.data;
}

export const getRelatedProducts = async (categoryId: number): Promise<CategoryProductInterface> => {
    const response = await axiosInstance.get(`/api/related-products?categoryId=${categoryId}`);
    return response.data;
}

export const createProduct = async (req: CreateProductReqInterface) => {
    const formData = new FormData();
    formData.append('name', req.name);
    formData.append('description', req.description);
    formData.append('price', req.price.toString());
    formData.append('categoryId', req.categoryId.toString());
    formData.append('subcategoryId', req.subcategoryId.toString());
    formData.append('type', req.type);
    formData.append('condition', req.condition);
    formData.append('lan', req.lan.toString());
    formData.append('log', req.log.toString());
    formData.append('address', req.address);
    req.image.forEach((item: any, index: number) => formData.append('image', req.image[index]));

    const response = await axiosInstance.post('api/create-product', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

// export const updateProduct = async (productId: number, updatedData: UpdateProductReqInterface) => {
//     const formData = new FormData();
//     formData.append('name', updatedData.name);
//     formData.append('description', updatedData.description);
//     formData.append('price', updatedData.price.toString());
//     formData.append('categoryId', updatedData.categoryId.toString());
//     formData.append('subcategoryId', updatedData.subcategoryId.toString());
//     formData.append('type', updatedData.type);
//     formData.append('condition', updatedData.condition);
//     formData.append('lan', updatedData.lan.toString());
//     formData.append('log', updatedData.log.toString());
//     formData.append('address', updatedData.address);
  
//     if (updatedData.image) {
//       updatedData.image.forEach((item: any, index: number) => formData.append('image', updatedData.image[index]));
//     }
  
//     const response = await axiosInstance.put(`/api/update-product?id=${productId}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${getToken()}`
//       }
//     });
  
//     return response.data;
//   };

  export const deleteProduct = async (productId: number) => {
    const response = await axiosInstance.delete(`/api/delete-product?id=${productId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  };

  export const requestCallBack = async (providerId: number) => {
    const response = await axiosInstance.post('/api/callback', {
      providerId: providerId
    });
  
    return response.data;
  }

  export const approveCallback = async (id: number) => {
    const response = await axiosInstance.get(`/api/approve-callback?id=${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const markFavorite = async (productId: number) => {
    const response = await axiosInstance.post('api/create-favourite', {
        productId
    }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const getFavorites = async (): Promise<ProductInterface[]> => {
    const response = await axiosInstance.get('api/get-favourite', {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    const likes = response.data.data;
    const arrayResponse = (await axios.all(likes.map((item: any) => axiosInstance.get<ProductInterface>(`/api/get-single-product?id=${item.productId}`))))
        .map((res: any) => res.data);
    return arrayResponse;
}

export const productSearch = async (searchTerm: string): Promise<CategoryProductInterface> => {
    const response = await axiosInstance.get(`api/search-productservice?search=${searchTerm}`);
    return response.data;
}

export const requestSearch = async (searchTerm: string): Promise<CategoryProductInterface> => {
    const response = await axiosInstance.get(`api/search-request?search=${searchTerm}`);
    return response.data;
}