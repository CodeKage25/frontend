import { AuthContext } from "@/context/AuthContextProvider";
import { Form, Formik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import * as Yup from 'yup';
import FormikControl from "../form-controls/FormikControl";
import userIcon from '../../public/user.svg';
import nigeriaIcon from '../../public/nigeriaIcon.svg';
import emailIcon from '../../public/mailLight.svg'
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { PenTool, User } from "lucide-react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/api/auth/endpoints";
import { UpdateUserReqInterface } from "@/lib/types/user/UpdateUserReqInterface";
import { toast } from "react-toastify";

interface ProfileInterface {
    fullname: string,
    phone: string,
    email: string,
    image: string | null
}

const validationSchema = Yup.object().shape({
    fullname: Yup.string().required('Enter your full name')
        .trim()
        .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)+$/, 'Invalid full name format. Please enter first name and last name.'),
    email: Yup.string().email('This email is invalid').required('Enter your email address'),
    phone: Yup.string()
        .required('Enter your phone number')
        .matches(/^(\+234|0|234)([789][01]|2[0-9])[0-9]{8}$/, 'Invalid phone number format')
        .test('valid-phone', 'Invalid phone number format', (value) => {
            if (!value) return true;
            const phoneRegex = /^(\+234|0|234)([789][01]|2[0-9])[0-9]{8}$/;
            return phoneRegex.test(value);
        }),
    image: Yup.mixed()
});

const ProfileUpdateForm = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { auth, setAuth } = useContext(AuthContext);
    const [profile, setProfile] = useState<ProfileInterface>({} as ProfileInterface);
    const [file, setFile] = useState<any>();

    useEffect(() => {
        setProfile({
            fullname: auth?.firstName + ' ' + auth?.lastName,
            phone: auth?.phone ?? '',
            email: auth?.email ?? '',
            image: auth?.avatar ?? ''
        })
    }, []);

    const updateMutation = useMutation({
        mutationFn: (req: UpdateUserReqInterface) => updateProfile(req),
        onSuccess(data, variables, context) {
            console.log(data);
            setAuth({
                ...auth,
                firstName: variables.fullname.split(' ')[0],
                lastName: variables.fullname.split(' ')[1],
                phone: variables.phone,
                // avatar: variables.fullname
            });
            toast.success('Profile updated successfully');
        },
    })

    return (
        <Formik
            initialValues={profile}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                updateMutation.mutate({
                    avatar: values.image,
                    fullname: values.fullname,
                    phone: values.phone
                });
            }}
            enableReinitialize
        >
            {
                (formik) => {
                    const imageProps = formik.getFieldProps('image');
                    const { value, ...rest } = imageProps
                    return (
                        <Form className="space-y-4 p-2">
                            <Button className="relative w-[100px] h-[100px] overflow-clip rounded-full bg-gray-100" onClick={() => {
                                inputRef.current?.click();
                            }}>
                                <Image src={file ?? auth?.avatar ?? '/user.svg'}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: '100%', height: 'auto' }} alt="" />

                                <PenTool className="absolute w-6 h-6 p-[2px] bg-primary rounded-full bottom-0 left-[40%]" />
                            </Button>
                            <Input accept="image/jpeg, image/png" ref={inputRef} type="file"
                                {...rest}
                                onChange={(e) => {
                                    // @ts-ignore
                                    formik.setFieldValue('image', e.target.files[0])
                                    // @ts-ignore
                                    setFile(URL.createObjectURL(e.target.files[0]));
                                }}
                                className="hidden" />

                            <FormikControl
                                type="text"
                                name="fullname"
                                label="Full name"
                                control="input-label"
                                icon={userIcon} />

                            <FormikControl
                                type="email"
                                name="email"
                                label="Email"
                                control="input-label"
                                disabled={true}
                                icon={emailIcon} />

                            <FormikControl
                                type="text"
                                name="phone"
                                label="Phone"
                                control="input-label"
                                icon={nigeriaIcon} />

                            <Button className="w-full" disabled={((!(formik.isValid && formik.dirty)) || updateMutation.isPending)}
                                isLoading={updateMutation.isPending}>
                                Save changes
                            </Button>
                        </Form>
                    )
                }
            }
        </Formik>
    )
}

export default ProfileUpdateForm;