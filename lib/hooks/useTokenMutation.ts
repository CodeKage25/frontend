import { setToken } from "@/api/user/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useTokenMutation = () => {
    const tokenMutation = useMutation({
        mutationFn: (token: string) => setToken(token)
    });

    return tokenMutation;
}