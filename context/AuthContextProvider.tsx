'use client';

import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { auth as googleAuth } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserAuth {
    id: '',
    firstName: '',
    lastName: '',
    otherName: '',
    displayName: '',
    email: '',
    phone: '',
    role: '',
    avatar: '',
    token: ''
}

interface UserAuthContextProps {
    auth: UserAuth | null;
    setAuth: any;
    googleAuth: any;
    logout: () => void;
}

export const AuthContext = createContext({} as UserAuthContextProps);

export const AuthContextProvider = ({ children }: {
    children: React.ReactNode;
}) => {
    const router = useRouter();
    const [auth, setAuth] = useLocalStorage("katangwa-user", {} as UserAuth);
    const [googleAuthUser, setGoogleAuthUser] = useState<User | null>(null);

    const logout = () => {
        localStorage.removeItem('katangwa-user');
        if (googleAuthUser) {
            signOut(googleAuth).then(() => router.replace('/'));
        } else {
            router.replace('/');
        }
        setAuth({} as UserAuth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(googleAuth, (currentUser) => {
            setGoogleAuthUser(currentUser);
        });
        return () => unsubscribe();
    }, [googleAuthUser]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, googleAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}