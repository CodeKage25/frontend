import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import userIcon from '../../public/user.svg'
import emailIcon from '../../public/mailLight.svg'
import passwordIcon from '../../public/lock.svg'
import googleIcon from '../../public/google.svg'
import logo from '../../public/logo.svg'
import { nunito } from '@/app/font';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { SignupValues } from './SignupForm';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/utils';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContextProvider';
import { checkUserExists } from '@/api/user/endpoints';
import { useLogin } from '@/lib/hooks/useLogin';
import { useSignup } from '@/lib/hooks/useSignup';
import { useTokenMutation } from '@/lib/hooks/useTokenMutation';

const validationSchema = Yup.object().shape({
    fullname: Yup.string().required('Enter your full name')
        .trim()
        .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)+$/, 'Invalid full name format. Please enter first name and last name.'),
    email: Yup.string().email('This email is invalid').required('Enter your email address'),
    password: Yup.string().required('Enter your password').min(8, 'Enter a password with 8 or more characters'),
    agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms')
});

const StepOneSignup = ({ onNext, data }: {
    onNext: (data: SignupValues, final: boolean) => void, data: SignupValues
}) => {
    const [error, setError] = useState<string | null>('');
    const { setAuth } = useContext(AuthContext);
    const router = useRouter();
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
            router.push('/');
        },
        onError: (error) => {
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
            router.push('/');
        },
        onError: (error) => {
            setError((error.response?.data as any).message ?? 'Something went wrong!');
        }
    })

    const handleSubmit = (values: SignupValues) => { onNext(values, false) }

    return (
        <Formik
            initialValues={data}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {
                (formik) => {
                    return (
                        <Form className='flex flex-col w-full items-center bg-[#FCFCFD] md:w-[60%] lg:w-[50%]'>
                            <div className='relative w-full mt-4 md:mt-[32px]'>
                                <div className=' w-[45%] h-[45px] md:w-[5%] md:h-[70px]'>
                                    <Image src={logo} alt='Katangwa Logo' fill objectFit="contain" />
                                </div>
                                <p className='hidden absolute text-[11px] top-12 right-2 font-semibold italic md:block lg:text-[12px] lg:top-12 lg:right-20'>Exchange with connections</p>
                            </div>
                            <div className='flex flex-col w-full p-6 items-center text-textPrimary shadow-[6px_6px_16px_0px_#D1CDC740] lg:px-[80px] lg:py-[50px]'>
                                <h1 className='text-center text-xl font-semibold mt-4 md:text-3xl lg:text-[32px] md:mt-0'>Create a Katangwa account</h1>
                                <h3 className='text-center text-[14px] font-medium mt-4'>Register now to get started on Katangwa</h3>
                                <div className='w-full space-y-6 rounded-[12px] p-2 shadow-[6px_6px_16px_0px_#D1CDC740]'>
                                    <p className={`${nunito.className} mb-6 text-center font-bold text-[14px] text-textPrimary`}>Enter Your Details Below</p>
                                    {error && <p className={`${nunito.className} mb-6 text-center font-bold text-[14px] text-red-600`}>{error}</p>}
                                    <FormikControl
                                        type="text"
                                        name="fullname"
                                        label="Full name"
                                        control="input"
                                        icon={userIcon} />

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

                                    <Field name="agreeToTerms">
                                        {
                                            ({ field, form }: FieldProps) => {
                                                return (
                                                    <div className="flex space-x-[8px]">
                                                        <Checkbox className='rounded-none' {...field} name={'agreeToTerms'} checked={form.getFieldProps('agreeToTerms').value}
                                                            onCheckedChange={e => form.setFieldValue('agreeToTerms', e)} />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <label
                                                                htmlFor="agreeToTerms"
                                                                className="text-[12px] font-normal tracking-[0.25px] text-[#737373]"
                                                            >
                                                                By creating an account, you agree to our terms of service and privacy policy
                                                            </label>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        }
                                    </Field>

                                    <Button type='submit' className='w-full mt-6' disabled={loginMutate.isPending || signUpMutate.isPending}>
                                        Continue <ArrowRight className='ml-3' color="#ffffff" />
                                    </Button>
                                </div>

                                <div className='flex w-full justify-between items-center space-x-4 mt-6 max-w-[80%]'>
                                    <hr className='w-full h-[1px] bg-[#737373]' />
                                    <p className='text-black text-[14px] font-normal'>OR</p>
                                    <hr className='w-full h-[1px] bg-[#737373]' />
                                </div>

                                {/* <Button onClick={() => handleGoogleSignIn()} type='button'
                                    variant={'outline'} className='inline-flex justify-center mt-6 font-semibold text-black text-md py-[24px] w-full md:w-[80%]'>
                                    <Image src={googleIcon} className='mr-[10px]' width={20} height={20} alt={''} />
                                    Sign in with Google
                                </Button> */}
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
                                    variant={'outline'} isLoading={loginMutate.isPending || signUpMutate.isPending} disabled={loginMutate.isPending || signUpMutate.isPending} className='inline-flex justify-center mt-6 font-semibold text-black text-md py-[24px] w-full md:w-[80%]'>-
                                    <Image src={googleIcon} className='mr-[10px]' width={20} height={20} alt={''} />
                                    Sign in with Google
                                </Button>
                            </div>
                        </Form>
                    )
                }
            }
        </Formik>
    )
}

export default StepOneSignup;