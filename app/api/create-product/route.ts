import { axiosInstance } from "@/api/axiosInstance";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const cookie = cookies();
    const value = cookie.get('katangwa-user')?.value;
    const token = JSON.parse(value ?? '');

    try {
        // const formData = new FormData();
        // formData.append('name', body.name);
        // formData.append('description', body.description);
        // formData.append('price', body.price);
        // formData.append('categoryId', body.categoryId);
        // formData.append('subcategoryId', body.subcategoryId);
        // formData.append('type', body.type);
        // formData.append('condition', body.condition);
        // body.image.forEach((item: any) => formData.append('image', item));
        const response = await axiosInstance.post('/api/create-product', formData, {
            headers: {
                Authorization: `Bearer ${token['access-token']}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = response.data;
        return new NextResponse(JSON.stringify(data), {
            status: response.status
        });
    } catch (error) {
        const e = error as AxiosError;
        return new NextResponse(JSON.stringify(e.response?.data), { status: e.response?.status });
    }
}