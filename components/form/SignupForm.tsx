'use client'

import { useState } from 'react';
import StepOneSignup from './StepOneSignup';
import StepTwoSignup from './StepTwoSignup';
import { useMutation } from '@tanstack/react-query';
import { SignupResInterface } from '@/lib/types/auth/SignupResInterface';
import { AxiosError } from 'axios';
import { SignupReqInterface } from '@/lib/types/auth/SignupReqInterface';
import { sendOtp, signup } from '@/api/auth/endpoints';
import { useRouter } from 'next/navigation';
import { SendOtpResInterface } from '@/lib/types/auth/SendOtpResInterface';
import { SendOtpReqInterface } from '@/lib/types/auth/SendOtpReqInterface';
import { nanoid } from 'nanoid';

export interface SignupValues {
    fullname: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
    phone: string;
    dob: string;
}

export interface SignupStatus {
    isLoading: boolean;
    status: boolean;
    message: string;
}

export default function SignupForm() {

    const router = useRouter();
    const [data, setData] = useState<SignupValues>({
        fullname: '',
        email: '',
        phone: '',
        password: '',
        dob: '',
        agreeToTerms: false
    });
    const [status, setStatus] = useState<SignupStatus>({} as SignupStatus);

    const handleNextStep = (newData: SignupValues, final: boolean) => {
        setData(prev => ({ ...prev, ...newData }));

        if (final) {
            signupMutate.mutate({
                firstName: newData.fullname.split(' ')[0],
                lastName: newData.fullname.split(' ')[1],
                email: newData.email,
                phone: newData.phone,
                password: newData.password,
                dob: newData.dob,
                role: 'USER',
                verifiedEmail: false
            });
            return;
        }

        setCurrentStep(prev => ++prev);
    }

    const handlePrevStep = (newData: SignupValues) => {
        setData(prev => ({ ...prev, ...newData }));
        setCurrentStep(prev => --prev);
    }

    const signupMutate = useMutation<SignupResInterface, AxiosError, SignupReqInterface>({
        mutationFn: (req: SignupReqInterface) => signup(req),
        onSuccess(data, variables, context) {
            verifyMutate.mutate({
                email: variables.email,
                type: 'VERIFICATION'
            });
        },
        onError(error, variables, context) {
            const e = error as AxiosError;
            const newStatus = e.response?.data as SignupStatus ?? {
                status: false, message: e.message
            };
            setStatus({ ...newStatus, isLoading: false });
            console.log(e.status, e.message);
        },
        onMutate() {
            setStatus(prev => ({ ...prev, isLoading: signupMutate.isPending }));
        }
    });

    const verifyMutate = useMutation<SendOtpResInterface, AxiosError, SendOtpReqInterface>({
        mutationFn: ({ email, type }: SendOtpReqInterface) => sendOtp(email, type),
        onSuccess(data, variables, context) {
            router.push(`/verify?action=signup&email=${variables.email}&token=${data.data}`);
        }
    });

    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        <StepOneSignup key={nanoid()} onNext={handleNextStep} data={data} />,
        <StepTwoSignup key={nanoid()} onPrev={handlePrevStep} onNext={handleNextStep}
            data={data} status={status} />
    ];

    return (
        <div className='w-full flex justify-center'>
            {steps[currentStep]}
        </div>
    )
}