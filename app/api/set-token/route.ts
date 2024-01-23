import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "../../../api/axiosInstance";
// @ts-ignore
import { serialize } from "cookie";
import { AxiosError } from "axios";
import { getCookie, setCookie } from "cookies-next";
import { cookies } from "next/headers";

const MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(req: NextRequest) {
    const res = new NextResponse();
    const body = await req.json();

    console.log(body)
    try {
        cookies().set('katangwa-user', body.token);
        // const serializedCookie = serialize('katangwa-user', JSON.stringify({
        //     'access-token': body.token
        // }), {
        //     httpOnly: true,
        //     path: "/",
        //     maxAge: MAX_AGE,
        //     secure: false,
        //     sameSite: "strict"
        // });

        // console.log(getCookie('katangwa-user1'));

        return res
        // return new NextResponse(JSON.stringify({ message: 'token set' }), {
        //     headers: {
        //         'Set-Cookie': serializedCookie
        //     }
        // });
    } catch (error) {
        console.log('!!signup route', error);
        const e = error as AxiosError;
        return new NextResponse(JSON.stringify(e.response?.data), { status: e.response?.status });
    }
}