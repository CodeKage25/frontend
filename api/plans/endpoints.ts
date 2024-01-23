import { GetPlanResInterface } from "@/lib/types/plans/GetPlanResInterface";
import { axiosInstance } from "../axiosInstance"

export const getPlans = async (): Promise<GetPlanResInterface> => {
    const response = await axiosInstance.get('/api/get-plans');
    return response.data;
}