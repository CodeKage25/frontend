import { AuthContext } from "@/context/AuthContextProvider";
import { Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from 'yup';
import FormikControl from "../form-controls/FormikControl";
import passwordIcon from '../../public/lock.svg'
import { Button } from "../ui/button";

interface PasswordInterface {
    currentPassword: string,
    password: string,
    confirmPassword: string
}

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Enter your password').min(8, 'Enter a password with 8 or more characters'),
    password: Yup.string().required('Enter your password').min(8, 'Enter a password with 8 or more characters'),
});

const PasswordUpdateForm = () => {
    const initialValues: PasswordInterface = {
        currentPassword: '',
        password: '',
        confirmPassword: ''
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={() => { }}
        >
            {
                (formik) => {
                    return (
                        <Form className="space-y-4 p-2">
                            <FormikControl
                                type="password"
                                name="currentPassword"
                                label="Current Password"
                                control="input-label"
                                icon={passwordIcon} />

                            <FormikControl
                                type="password"
                                name="password"
                                label="Password"
                                control="input-label"
                                icon={passwordIcon} />

                            <FormikControl
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                control="input-label"
                                icon={passwordIcon} />

                            <Button className="w-full" disabled={!formik.isValid}>
                                Save changes
                            </Button>
                        </Form>
                    )
                }
            }
        </Formik>
    )
}

export default PasswordUpdateForm;