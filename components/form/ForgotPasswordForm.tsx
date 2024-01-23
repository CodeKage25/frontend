'use client'

import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import emailIcon from '../../public/mailDark.svg'
import logo from '../../public/logo.svg'
import { nunito } from '@/app/font';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { Form, Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { SendOtpResInterface } from '@/lib/types/auth/SendOtpResInterface';
import { resetPassword, sendOtp } from '@/api/auth/endpoints';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SendOtpReqInterface } from '@/lib/types/auth/SendOtpReqInterface';
import { useCountDown } from '@/lib/hooks/useCountDown';
import { toast } from 'react-toastify';

interface PasswordResetValues {
    email: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('This email is invalid').required('Enter your email address')
});

const ForgotPasswordForm = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const { countDown, isComplete, setIsComplete, setCountDown } =
        useCountDown(0, false);

    const resetPasswordMutate = useMutation<SendOtpResInterface, AxiosError, string>({
        mutationFn: (email: string) => resetPassword(email),
        onSuccess(data, variables, context) {
            router.push(`/verify?action=reset&email=${variables}&token=${data.data}`);
        },
        onError(error, variables, context) {
            const e = error as AxiosError;
            const message = (e.response?.data as any).message;
            setError(message);
        }
    });

    const resendOtpMutate = useMutation<SendOtpResInterface, AxiosError, SendOtpReqInterface>({
        mutationFn: ({ email, type }: SendOtpReqInterface) => sendOtp(email, type),
        onSuccess(data, variables, context) {
            toast.success('OTP has been resent')
        }
    });

    const handleSubmit = (values: PasswordResetValues) => {
        resetPasswordMutate.mutate(values.email);
    }

    const initialValues: PasswordResetValues = {
        email: '',
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>

            {
                (formik) => {
                    return (
                        <Form className='flex flex-col w-full items-center bg-[#FCFCFD] md:w-[60%] lg:w-[50%]'>
                            <div className='relative w-full mt-[32px]'>
                                <div className=' w-[45%] h-[45px] md:w-[5%] md:h-[70px]'>
                                    <Image src={logo} alt='Katangwa Logo' fill objectFit="contain" />
                                </div>
                                <p className='hidden absolute text-[11px] top-12 right-2 font-semibold italic md:block lg:text-[12px] lg:top-12 lg:right-20'>Exchange with connections</p>
                            </div>
                            <div className='flex flex-col w-full p-6 items-center text-textPrimary shadow-[6px_6px_16px_0px_#D1CDC740] lg:px-[100px] lg:py-[50px]'>
                                <h1 className='text-center text-xl font-semibold mt-4 md:text-3xl lg:text-[32px] md:mt-0'>PASSWORD RESET</h1>
                                <h3 className='text-center text-[14px] font-medium mt-4'>No worries, we&apos;ve got your back. Resetting your password is easy.</h3>
                                <div className='w-full p-2 flex flex-col rounded-[12px] shadow-[6px_6px_16px_0px_#D1CDC740]'>
                                    <p className={`${nunito.className} my-6 text-center font-semibold text-[14px] text-textPrimary`}>
                                        Please Enter Your Registered Email Address
                                    </p>
                                    {
                                        resetPasswordMutate.isError && <p className={`${nunito.className} mb-6 text-center font-semibold text-[14px] text-red-500`}>{error ?? 'Something went wrong!'}</p>
                                    }

                                    <FormikControl
                                        type="email"
                                        name="email"
                                        label="Email"
                                        control="input"
                                        icon={emailIcon} />

                                    <Button type='submit' className='w-full mt-6' disabled={resetPasswordMutate.isPending}>
                                        Continue <ArrowRight className='ml-3' color="#ffffff" />
                                    </Button>
                                </div>

                                {isComplete ? <Button type='button' variant={'link'} className='justify-center mt-3 font-semibold text-[#737373] text-[14px]'
                                    onClick={() => {
                                        formik.setFieldTouched('email');
                                        formik.validateField('email');
                                        if ((formik.errors.email?.length ?? 0) <= 0) {
                                            setIsComplete(false);
                                            setCountDown(59);
                                            resendOtpMutate.mutate({
                                                email: formik.values.email,
                                                type: 'VERIFICATION'
                                            });
                                        }
                                    }}>
                                    Resend OTP
                                </Button> :
                                    <p className='text-[#737373] text-[14px] mt-6'>
                                        {`Resend code in 00:${countDown.toLocaleString("en-US", {
                                            minimumIntegerDigits: 2,
                                        })}`}
                                    </p>
                                }
                                <p className={`${nunito.className} mt-[14px] text-center font-semibold text-[14px] text-textPrimary`}>
                                    By signing up, you agree to our <span className='text-primary'>Terms & Privacy Policy.</span>
                                </p>
                            </div>
                        </Form>
                    )
                }
            }
        </Formik>
    )
}

export default ForgotPasswordForm;