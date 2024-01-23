'use client'

import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import emailIcon from '../../public/mailLight.svg'
import passwordIcon from '../../public/lock.svg'
import googleIcon from '../../public/google.svg'
import logo from '../../public/logo.svg'
import { nunito } from '@/app/font';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { Form, Formik } from 'formik';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContextProvider';
import Link from 'next/link';
import { useLogin } from '@/lib/hooks/useLogin';
import { useSignup } from '@/lib/hooks/useSignup';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { checkUserExists } from '@/api/user/endpoints';
import { auth } from '@/lib/utils';
import { setCookie } from 'cookies-next';
import { useTokenMutation } from '@/lib/hooks/useTokenMutation';

interface LoginValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('This email is invalid').required('Enter your email address'),
    password: Yup.string().required('Enter your password').min(8, 'Enter a password with 8 or more characters')
});

const MAX_AGE = 60 * 60 * 24 * 365;

const LoginForm = () => {
    const { setAuth } = useContext(AuthContext);
    const [error, setError] = useState();
    const router = useRouter();
    const handleSubmit = (values: LoginValues) => {
        loginMutate.mutate({
            email: values.email,
            password: values.password
        });
    }

    const tokenMutation = useTokenMutation();
    const loginMutate = useLogin({
        onSuccess: (data: any) => {
            setAuth({
                firstName: data.data.user.firstName,
                lastName: data.data.user.lastName,
                otherName: data.data.user.otherName,
                displayName: data.data.user.displayName,
                email: data.data.user.email,
                phone: data.data.user.phone,
                role: data.data.user.type,
                avatar: data.data.user.avatar,
                id: data.data.user.id,
                token: data.data.token
            });
            tokenMutation.mutate(data.data.token);
            // setCookie('katangwa-user', data.data.token, {
            //     httpOnly: true,
            //     path: "/",
            //     maxAge: MAX_AGE,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: "strict"
            // });
            toast.success(data.message);
            router.push('/');
        },
        onError: (error: AxiosError) => {
            setError((error.response?.data as any).message ?? 'Something went wrong!');
        }
    });

    const signUpMutate = useSignup({
        onSuccess: (data: any) => {
            setAuth({
                firstName: data.data.user.firstName,
                lastName: data.data.user.lastName,
                otherName: data.data.user.otherName,
                displayName: data.data.user.displayName,
                email: data.data.user.email,
                phone: data.data.user.phone,
                role: data.data.user.type,
                avatar: data.data.user.avatar,
                id: data.data.user.id,
                token: data.data.token
            });
            tokenMutation.mutate(data.data.token);
            // setCookie('katangwa-user', data.data.token, {
            //     httpOnly: true,
            //     path: "/",
            //     maxAge: MAX_AGE,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: "strict"
            // });
            router.push('/');
        },
        onError: (error) => {
            setError((error.response?.data as any).message ?? 'Something went wrong!');
        }
    })

    const initialValues: LoginValues = {
        email: '',
        password: ''
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>

            {
                (formik) => {
                    return (
                        <Form className='flex flex-col w-full items-center bg-[#FCFCFD] md:w-[65%] lg:w-[50%]'>
                            <div className='relative w-full mt-4 md:mt-[32px]'>
                                <div className=' w-[45%] h-[45px] md:w-[5%] md:h-[70px]'>
                                    <Image src={logo} alt='Katangwa Logo' fill objectFit="contain" />
                                </div>
                                <p className='hidden absolute text-[11px] top-12 right-2 font-semibold italic md:block lg:text-[12px] lg:top-12 lg:right-20'>Exchange with connections</p>
                            </div>
                            <div className='flex flex-col w-full p-6 items-center text-textPrimary shadow-[6px_6px_16px_0px_#D1CDC740] lg:px-[100px] lg:py-[50px]'>
                                <h1 className='text-center text-xl font-semibold mt-4 md:text-3xl lg:text-[32px] md:mt-0'>Log in</h1>
                                <h3 className='text-center text-[14px] font-medium mt-4'>Enter Your Login Details Below</h3>
                                <div className='w-full flex flex-col rounded-[12px] p-2 shadow-[6px_6px_16px_0px_#D1CDC740]'>
                                    {
                                        (loginMutate.isError || signUpMutate.isError) && <p className={`${nunito.className} mb-6 text-center font-semibold text-[14px] text-red-500`}>{error}</p>
                                    }
                                    <div className='flex flex-col space-y-6'>
                                        <FormikControl
                                            type="email"
                                            name="email"
                                            label="Email"
                                            control="input"
                                            icon={emailIcon} />

                                        <FormikControl
                                            type="password"
                                            name="password"
                                            label="Password"
                                            control="input"
                                            icon={passwordIcon} />
                                    </div>

                                    <Link href='/forgot-password' passHref legacyBehavior>
                                        <Button type='button' className='p-0 text-primary text-xs font-normal self-end' variant='link'>Forget Password?</Button>
                                    </Link>

                                    <Button type='submit' className='w-full mt-6' isLoading={loginMutate.isPending} disabled={loginMutate.isPending}>
                                        Continue <ArrowRight className='ml-3' color="#ffffff" />
                                    </Button>
                                </div>

                                <div className='flex w-full justify-between items-center space-x-4 mt-6 max-w-[80%]'>
                                    <hr className='w-full h-[1px] bg-[#737373]' />
                                    <p className='text-black text-[14px] font-normal'>OR</p>
                                    <hr className='w-full h-[1px] bg-[#737373]' />
                                </div>

                                <Button onClick={() => {
                                    const provider = new GoogleAuthProvider();
                                    signInWithPopup(auth, provider)
                                        .then(async (result) => {
                                            const user = result.user;
                                            const data = await checkUserExists(user?.email || '');
                                            console.log(data);
                                            if (data.status) {
                                                loginMutate.mutate({
                                                    email: user.email || '',
                                                    password: user.uid
                                                });
                                            } else {
                                                signUpMutate.mutate({
                                                    verifiedEmail: true,
                                                    firstName: user.displayName?.split(' ')[0] || '',
                                                    lastName: user?.displayName?.split(' ')[1] || '',
                                                    email: user?.email || '',
                                                    password: user.uid,
                                                    role: "",
                                                    dob: "",
                                                    phone: user?.phoneNumber || ''
                                                });
                                            }
                                        }).catch(error => {
                                            console.log(error);
                                        });
                                }} type='button'
                                    variant={'outline'} isLoading={loginMutate.isPending || signUpMutate.isPending} disabled={loginMutate.isPending || signUpMutate.isPending} className='inline-flex justify-center mt-6 font-semibold text-black text-md py-[24px] w-full md:w-[80%]'>
                                    <Image src={googleIcon} className='mr-[10px]' width={20} height={20} alt={''} />
                                    Sign in with Google
                                </Button>
                                <p className={`${nunito.className} mt-[14px] text-center font-semibold text-[14px] text-textPrimary`}>
                                    Don’t have an account?
                                    <Link href='/signup' legacyBehavior passHref>
                                        <Button type='button' variant={'link'} className='py-0 text-primary'>Sign up</Button>
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    )
                }
            }
        </Formik>
    )
}

export default LoginForm;