import { SignupReqInterface } from "@/lib/types/auth/SignupReqInterface";
import { SignupResInterface } from "@/lib/types/auth/SignupResInterface";
import { axiosInstance } from "../axiosInstance";
import { SendOtpResInterface } from "@/lib/types/auth/SendOtpResInterface";
import { VerifyOtpReqInterface } from "@/lib/types/auth/VerifyOtpReqInterface";
import { VerifyOtpResInterface } from "@/lib/types/auth/VerifyOtpResInterface";
import { LoginReqInterface } from "@/lib/types/auth/LoginReqInterface";
import { LoginResInterface } from "@/lib/types/auth/LoginResInterface";
import axios from "axios";
import { ChangePassReqInterface } from "@/lib/types/auth/ChangePassReqInterface";
import { UpdateUserReqInterface } from "@/lib/types/user/UpdateUserReqInterface";
import { getToken } from "@/lib/utils";

export const signup = async (req: SignupReqInterface): Promise<SignupResInterface> => {
    const response = await axiosInstance.post('/api/register', { ...req });
    return response.data;
}

export const sendOtp = async (email: string, type: string): Promise<SendOtpResInterface> => {
    const response = await axiosInstance.post('/api/send-otp', { email, type });
    return response.data;
}

export const verifyOtp = async (req: VerifyOtpReqInterface): Promise<VerifyOtpResInterface> => {
    const response = await axiosInstance.post('/api/verify-otp', { ...req });
    return response.data;
}

export const login = async (req: LoginReqInterface): Promise<LoginResInterface> => {
    const response = await axiosInstance.post('/api/login', { ...req });
    return response.data;
}

export const resetPassword = async (email: string): Promise<SendOtpResInterface> => { // same response as sendOtp request
    const response = await axiosInstance.post('/api/reset-password', { email });
    return response.data;
}

export const changePassword = async (req: ChangePassReqInterface): Promise<VerifyOtpResInterface> => {
    const response = await axiosInstance.post('/api/change-password', { ...req });
    return response.data;
}

export const logout = async (): Promise<any> => {
    const response = await axios.post('/api/logout/');
    return response.data;
}

export const updateProfile = async (req: UpdateUserReqInterface): Promise<any> => {
    const formData = new FormData();
    formData.append('firstName', req.fullname.split(' ')[0]);
    formData.append('lastName', req.fullname.split(' ')[1]);
    formData.append('avatar', req.avatar);
    const response = await axiosInstance.post('/api/update-user-profile', formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}