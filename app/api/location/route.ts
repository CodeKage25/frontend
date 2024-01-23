import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const cookie = cookies();
    const value = cookie.get('katangwa-user')?.value;
    const token = JSON.parse(value ?? '');

    try {
        const response = await axiosInstance.post('/api/send-location', {
            ...body
        }, {
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

export async function GET() {
    const cookie = cookies();
    const value = cookie.get('katangwa-user')?.value;
    const token = JSON.parse(value ?? '');

    try {
        const response = await axiosInstance.get('/api/check-location-set', {
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