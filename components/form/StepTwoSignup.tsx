import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from '../form-controls/FormikControl';
import nigeriaIcon from '../../public/nigeriaIcon.svg'
import logo from '../../public/logo.svg'
import { nunito } from '@/app/font';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, CalendarIcon, Loader2 } from 'lucide-react';
import { SignupStatus, SignupValues } from './SignupForm';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import format from 'date-fns/format';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import differenceInYears from 'date-fns/differenceInYears';
import parseISO from 'date-fns/parseISO';

const validationSchema = Yup.object().shape({
    phone: Yup.string()
        .required('Enter your phone number')
        .matches(/^(\+234|0|234)([789][01]|2[0-9])[0-9]{8}$/, 'Invalid phone number format')
        .test('valid-phone', 'Invalid phone number format', (value) => {
            if (!value) return true;
            const phoneRegex = /^(\+234|0|234)([789][01]|2[0-9])[0-9]{8}$/;
            return phoneRegex.test(value);
        }),
    dob: Yup.date().required('Date of birth is required')
        .test('dob', 'You must be 18 and above',
            value => {
                return differenceInYears(new Date(), parseISO(new Date(value).toISOString())) >= 18
            })
});

const StepTwoSignup = ({ onPrev, onNext, data, status }: {
    onPrev: (data: SignupValues) => void,
    onNext: (data: SignupValues, final: boolean) => void,
    data: SignupValues, status: SignupStatus
}) => {
    const handleSubmit = (data: SignupValues) => { onNext(data, true) }

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
                            <Button className='self-start mt-4' variant={'ghost'} onClick={() => onPrev(formik.values)}> <ArrowLeft className='mr-2' color="#000" /> Back</Button>
                            <div className='relative w-full mt-4 md:mt-[32px]'>
                                <div className=' w-[45%] h-[45px] md:w-[5%] md:h-[70px]'>
                                    <Image src={logo} alt='Katangwa Logo' fill objectFit="contain" />
                                </div>
                                <p className='hidden absolute text-[11px] top-12 right-2 font-semibold italic md:block lg:text-[12px] lg:top-12 lg:right-20'>Exchange with connections</p>
                            </div>
                            <div className='flex flex-col w-full p-6 items-center text-textPrimary shadow-[6px_6px_16px_0px_#D1CDC740] lg:px-[100px] lg:py-[50px]'>
                                <h1 className='text-center text-xl font-semibold mt-4 md:text-3xl lg:text-[32px] md:mt-0'>Phone Number and Date of Birth </h1>
                                <h3 className='text-center text-[14px] font-medium my-4'>Register an account now to get started on Katangwa</h3>
                                <div className='w-full space-y-6 p-2 rounded-[12px] shadow-[6px_6px_16px_0px_#D1CDC740]'>
                                    <p className={`${nunito.className} mb-6 text-center font-bold text-[14px] text-textPrimary`}>Enter Your Details Below</p>
                                    {
                                        !status.status && <p className={`${nunito.className} mb-6 text-center font-semibold text-[14px] text-red-500`}>{status.message}</p>
                                    }

                                    <FormikControl
                                        type="text"
                                        name="phone"
                                        label="Phone"
                                        control="input"
                                        icon={nigeriaIcon} />

                                    <Field name="dob">
                                        {
                                            ({ field, form }: FieldProps) => {
                                                console.log(field)
                                                return (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                type='button'
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full py-7 justify-start text-left font-normal bg-[#EBEBEB]",
                                                                    field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="bg-[#F0F0F1] mr-7 h-4 w-4" />
                                                                {field.value ? format(field.value, "PPP") : <span className='text-sm text-[#737373]'>Date of Birth (DD/MM/YY)</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                captionLayout="dropdown-buttons"
                                                                fromYear={1900}
                                                                toYear={2030}
                                                                selected={field.value}
                                                                onSelect={e => form.setFieldValue('dob', e)}
                                                                {...field}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )
                                            }
                                        }
                                    </Field>
                                    {
                                        formik.touched.dob && formik.errors.dob ? <small className='text-red-500 text-xs'>{formik.errors.dob}</small> : null
                                    }

                                    <Button type='submit' className='w-full mt-6' isLoading={status.isLoading} disabled={status.isLoading}>
                                        Continue <ArrowRight className='ml-3' color="#ffffff" />
                                    </Button>
                                </div>
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

export default StepTwoSignup;