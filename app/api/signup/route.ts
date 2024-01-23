import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "../../../api/axiosInstance";
// @ts-ignore
import { serialize } from "cookie";
import { AxiosError } from "axios";

const MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const response = await axiosInstance.post('/api/register', {
            ...body
        });

        const data = response.data;
        const serializedCookie = serialize('katangwa-user', JSON.stringify({
            'access-token': data.data.token
        }), {
            httpOnly: true,
            path: "/",
            maxAge: MAX_AGE,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict"
        });

        return new NextResponse(JSON.stringify(data), {
            status: response.status, headers: {
                'Set-Cookie': serializedCookie
            }
        });
    } catch (error) {
        const e = error as AxiosError;
        return new NextResponse(JSON.stringify(e.response?.data), { status: e.response?.status });
    }
}