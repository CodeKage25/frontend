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
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { Input } from '../ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { VerifyOtpResInterface } from '@/lib/types/auth/VerifyOtpResInterface';
import { AxiosError } from 'axios';
import { VerifyOtpReqInterface } from '@/lib/types/auth/VerifyOtpReqInterface';
import { sendOtp, verifyOtp } from '@/api/auth/endpoints';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { SendOtpResInterface } from '@/lib/types/auth/SendOtpResInterface';
import { SendOtpReqInterface } from '@/lib/types/auth/SendOtpReqInterface';
import { useCountDown } from '@/lib/hooks/useCountDown';


interface OtpValues {
    otp: string;
}

const validationSchema = Yup.object().shape({
    otp: Yup.number().required('Enter the otp sent to your mail').min(5, 'Invalid otp code')
});

const VerifyForm = () => {
    const router = useRouter();
    const params = useSearchParams();
    const action = params.get('action') ?? '';
    const email = params.get('email') ?? '';
    const token = params.get('token') ?? '';
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const { countDown, isComplete, setIsComplete, setCountDown } =
        useCountDown(59, false);

    const handleSubmit = (values: OtpValues) => {
        verifyMutate.mutate({
            token,
            client: email,
            otp: Number(values.otp),
            type: 'VERIFICATION'
        })
    }

    const verifyMutate = useMutation<VerifyOtpResInterface, AxiosError, VerifyOtpReqInterface>({
        mutationFn: (req: VerifyOtpReqInterface) => verifyOtp(req),
        onSuccess(data, variables, context) {
            if (action === 'signup')
                setOpen(true);
            else
                router.push(`/password-reset?&token=${token}`);
        },
        onError(error, variables, context) {
            setError((error.response?.data as any).message ?? 'Something went wrong!');
        }
    }
    );

    const resendOtpMutate = useMutation<SendOtpResInterface, AxiosError, SendOtpReqInterface>({
        mutationFn: ({ email, type }: SendOtpReqInterface) => sendOtp(email, type),
        onSuccess(data, variables, context) {

        }
    });

    const initialValues: OtpValues = {
        otp: ''
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
                            <AlertDialog defaultOpen={false} open={open} onOpenChange={setOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Signup successful!</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Welcome to Katangwa. To get started and access all the amazing features, please log in to your new account using the credentials you provided during registration. Simply enter your email and password, and you&apos;ll be ready to explore everything we have to offer. Thank you for choosing us, and we&apos;re excited to have you on board!
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogAction onClick={() => {
                                            router.push('/login');
                                            setOpen(false);
                                        }}>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <div className='relative w-full mt-4 md:mt-[32px]'>
                                <div className=' w-[45%] h-[45px] md:w-[5%] md:h-[70px]'>
                                    <Image src={logo} alt='Katangwa Logo' fill objectFit="contain" />
                                </div>
                                <p className='hidden absolute text-[11px] top-12 right-2 font-semibold italic md:block lg:text-[12px] lg:top-12 lg:right-20'>Exchange with connections</p>
                            </div>
                            <div className='flex flex-col w-full items-center p-6 text-textPrimary shadow-[6px_6px_16px_0px_#D1CDC740] lg:px-[100px] lg:py-[50px]'>
                                <h1 className='text-center text-xl font-semibold mt-4 md:text-3xl lg:text-[32px] md:mt-0'>OTP VERIFICATION</h1>
                                <h3 className='text-center text-[14px] font-medium mt-4'>Complete OTP verification to proceed, its important for account verification</h3>
                                <div className='w-full flex flex-col rounded-[12px] shadow-[6px_6px_16px_0px_#D1CDC740]'>
                                    <div className='w-full flex-col p-2 space-y-6'>
                                        <p className={`${nunito.className} mt-5 text-center font-semibold text-[14px] text-textPrimary`}>
                                            Please Enter OTP code sent to your registered email address
                                        </p>
                                        {
                                            verifyMutate.isError && <p className={`${nunito.className} mb-6 text-center font-semibold text-[14px] text-red-500`}>{error}</p>
                                        }

                                        <div>
                                            <Field name={'otp'}>
                                                {
                                                    (props: FieldProps) => (
                                                        <Input type={'text'} className="block border-0 ring-[1px] ring-input text-center rounded-[10px] w-full p-7 text-xl bg-[#F0F0F1]"
                                                            id={'otp'} {...props.field} />
                                                    )
                                                }
                                            </Field>
                                            <ErrorMessage name={'otp'} render={msg => <small className="text-red-500 text-xs">{msg}</small>} />
                                        </div>

                                        <Button type='submit' className='w-full mt-6' isLoading={verifyMutate.isPending} disabled={verifyMutate.isPending}>
                                            Continue <ArrowRight className='ml-3' color="#ffffff" />
                                        </Button>
                                    </div>
                                </div>

                                {isComplete ?
                                    <Button type='button' variant={'link'} className='mt-6 font-semibold text-[#737373] text-[14px] p-0'
                                        onClick={() => {
                                            setIsComplete(false);
                                            setCountDown(59);
                                            resendOtpMutate.mutate({
                                                email: email,
                                                type: 'VERIFICATION'
                                            });
                                        }}>
                                        Resend OTP
                                    </Button> :
                                    <p className='text-[#737373] text-[14px] mt-6'>
                                        {`Resend code in 00:${countDown.toLocaleString("en-US", {
                                            minimumIntegerDigits: 2,
                                        })}`}
                                    </p>
                                }

                                <p className={`${nunito.className} mt-[24px] text-center font-semibold text-[14px] text-textPrimary`}>
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

export default VerifyForm;