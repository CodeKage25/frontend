import { useMutation } from "@tanstack/react-query";
import { LoginResInterface } from "../types/auth/LoginResInterface";
import { AxiosError } from "axios";
import { LoginReqInterface } from "../types/auth/LoginReqInterface";
import { login } from "@/api/auth/endpoints";
import { LocationResInterface } from "../types/user/LocationResInterface";
import { LocationReqInterface } from "../types/user/LocationReqInterface";
import { sendLocation } from "@/api/user/endpoints";

interface LocationUpdateInterface {
    onSuccess: (data: any) => void;
    onError: (error: AxiosError) => void;
}

export const useLocationUpdate = ({ onSuccess, onError }: LocationUpdateInterface) => {
    const loginMutate = useMutation<LocationResInterface, AxiosError, LocationReqInterface>({
        mutationFn: (req: LocationReqInterface) => sendLocation(req),
        onSuccess(data, variables, context) {
            onSuccess(data)
        },
        onError(error, variables, context) {
            onError(error);
        }
    });

    return loginMutate;
}