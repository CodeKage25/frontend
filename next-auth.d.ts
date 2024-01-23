import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module "next-auth" {
    interface User extends DefaultUser {
        bearerToken: string | undefined;
        uid: string | undefined;
    }
    interface Session extends DefaultSession {
        accessToken: string | undefined;
        bearerToken: string | undefined;
        uid: string | undefined;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        accessToken: string | undefined;
        bearerToken: string | undefined;
        uid: string | undefined;
    }
}