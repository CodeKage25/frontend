import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "../../../api/axiosInstance";
import { AxiosError } from "axios";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const response = await axiosInstance.post('/api/check-email', {
            ...body
        });

        const data = response.data;

        return new NextResponse(JSON.stringify(data));
    } catch (error) {
        const e = error as AxiosError;
        return new NextResponse(JSON.stringify(e.response?.data), { status: e.response?.status });
    }
}