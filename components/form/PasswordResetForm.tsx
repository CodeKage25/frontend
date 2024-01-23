'use client'

import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import emailIcon from '../../public/mail.svg'
import passwordIcon from '../../public/lock.svg'
import googleIcon from '../../public/google.svg'
import logo from '../../public/logo.svg'
import { nunito } from '@/app/font';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Form, Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { VerifyOtpResInterface } from '@/lib/types/auth/VerifyOtpResInterface';
import { AxiosError } from 'axios';
import { ChangePassReqInterface } from '@/lib/types/auth/ChangePassReqInterface';
import { changePassword } from '@/api/auth/endpoints';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface ResetValues {
    password: string;
    confirmPassword: string;
}

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Enter your password').min(8, 'Enter a password with 8 or more characters'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Both passwords must match').required('Please confirm your password')
});

const PasswordResetForm = () => {
    const [error, setError] = useState('');

    const router = useRouter();
    const params = useSearchParams();
    const token = params.get('token');
    const handleSubmit = (values: ResetValues) => {
        changePasswordMutate.mutate({
            password: values.password,
            token: token!!
        });
    }

    const changePasswordMutate = useMutation<VerifyOtpResInterface, AxiosError, ChangePassReqInterface>({
        mutationFn: (req: ChangePassReqInterface) => changePassword(req),
        onSuccess(data, variables, context) {
            router.push('/password-reset/success');
        },
        onError(error, variables, context) {
            setError((error.response?.data as any).message ?? 'Something went wrong!');
        },
    });

    const initialValues: ResetValues = {
        password: '',
        confirmPassword: ''
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
                                <h3 className='text-center text-[12px] font-medium mt-4 md:text-[14px]'>
                                    It&apos;s time to create a new password. Choose a strong password that combines letters, numbers, and special characters for enhanced security
                                </h3>
                                <div className='w-full p-2 flex flex-col rounded-[12px] shadow-[6px_6px_16px_0px_#D1CDC740]'>
                                    <div className='flex flex-col space-y-6'>
                                        <p className={`${nunito.className} mt-[6px] text-center font-semibold text-[14px] text-textPrimary`}>
                                            Please Enter New Password
                                        </p>
                                        {
                                            changePasswordMutate.isError && <p className={`${nunito.className} mb-6 text-center font-semibold text-[14px] text-red-500`}>{error}</p>
                                        }

                                        <FormikControl
                                            type="password"
                                            name="password"
                                            label="Password"
                                            control="input"
                                            icon={passwordIcon} />

                                        <FormikControl
                                            type="password"
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            control="input"
                                            icon={passwordIcon} />
                                    </div>

                                    <Button type='submit' className='w-full mt-6' isLoading={changePasswordMutate.isPending} disabled={changePasswordMutate.isPending}>
                                        Continue <ArrowRight className='ml-3' color="#ffffff" />
                                    </Button>
                                </div>

                                <Button type='button' variant={'link'} className='mt-6 font-semibold text-[#737373] text-[14px] p-0'>
                                    Return to Log in
                                </Button>
                            </div>
                        </Form>
                    )
                }
            }
        </Formik >
    )
}

export default PasswordResetForm;