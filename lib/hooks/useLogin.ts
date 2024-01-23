import { useMutation } from "@tanstack/react-query";
import { LoginResInterface } from "../types/auth/LoginResInterface";
import { AxiosError } from "axios";
import { LoginReqInterface } from "../types/auth/LoginReqInterface";
import { login } from "@/api/auth/endpoints";

interface LoginInterface {
    onSuccess: (data: any) => void;
    onError: (error: AxiosError) => void;
}

export const useLogin = ({ onSuccess, onError }: LoginInterface) => {
    const loginMutate = useMutation<LoginResInterface, AxiosError, LoginReqInterface>({
        mutationFn: (req: LoginReqInterface) => login(req),
        onSuccess(data, variables, context) {
            onSuccess(data);
        },
        onError(error, variables, context) {
            onError(error);
        },
    });

    return loginMutate;
}