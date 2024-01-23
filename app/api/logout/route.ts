import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// @ts-ignore
import { serialize } from "cookie";

export async function POST() {
    const cookie = cookies();

    try {
        cookie.delete('katangwa-user');
        const serializedCookie = serialize('katangwa-user', '', {
            httpOnly: true,
            path: "/",
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict"
        });
        return new NextResponse(JSON.stringify({ status: true, message: 'Logout successful' }), {
            headers: {
                'Set-Cookie': serializedCookie
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ status: false, message: 'Logout unsuccessful' }));
    }
}