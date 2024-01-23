import { useMutation } from "@tanstack/react-query";
import { SignupResInterface } from "../types/auth/SignupResInterface";
import { AxiosError } from "axios";
import { SignupReqInterface } from "../types/auth/SignupReqInterface";
import { signup } from "@/api/auth/endpoints";

interface SignupInterface {
    onSuccess: (data: any) => void;
    onError: (error: AxiosError) => void;
}

export const useSignup = ({ onSuccess, onError }: SignupInterface) => {
    const signUp = useMutation<SignupResInterface, AxiosError, SignupReqInterface>({
        mutationFn: (req: SignupReqInterface) => signup(req),
        onSuccess(data, variables, context) {
            onSuccess(data);
        },
        onError(error, variables, context) {
            onError(error);
        },
    });
    return signUp;
}