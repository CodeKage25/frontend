import { axiosInstance } from "@/api/axiosInstance";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookie = cookies();
    const value = cookie.get('katangwa-user')?.value;
    const token = JSON.parse(value ?? '');

    try {
        const response = await axiosInstance.get('/api/user-plan', {
            headers: {
                Authorization: `Bearer ${token['access-token']}`
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