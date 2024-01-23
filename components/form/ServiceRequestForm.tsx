import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import * as Yup from 'yup';
import FormikControl from "../form-controls/FormikControl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoryInterface, Subcategory } from "@/lib/types/category/CategoryInterface";
import { useState } from "react";
import { getCategory } from "@/api/category/endpoints";
import PlacesAutocomplete from "../product/PlacesAutocomplete";
import Dropzone from "react-dropzone";
import { Input } from "../ui/input";
import { nanoid } from "nanoid";
import { Button } from "../ui/button";
import { SpecialRequestInterface } from "@/lib/types/request/SpecialRequestInterface";
import { createRequest } from "@/api/request/endpoints";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ServiceFormInterface {
    service: string
    rate: string
    location: {
        address: string
        lat: number
        lng: number
    }
    frequency: string
}

const validationSchema = Yup.object().shape({
    service: Yup.string().required('Item name must be provided!'),
    rate: Yup.number().required('Rate must be provided!'),
    location: Yup.object().shape({
        lat: Yup.number().required('Provide product location'),
        lng: Yup.number().required('Provide product location')
    }).nullable().required(),
    frequency: Yup.string().required('Product condition must be selected!')
})

const ServiceRequestForm = () => {
    const router = useRouter();
    const initialData: ServiceFormInterface = {
        service: '',
        rate: '',
        location: {
            address: '',
            lat: 0.0,
            lng: 0.0
        },
        frequency: 'ONEOFF'
    }
    const [frequencyType, setFrequencyType] = useState(0);
    const requestMutation = useMutation({
        mutationFn: (params: SpecialRequestInterface) => createRequest(params),
        onSuccess(data, variables, context) {
            toast.success(`${variables.serviceType} service has been submitted successfully`);
            router.replace('/');
        },
    });

    return (
        <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                console.log('hi')
                requestMutation.mutate({
                    serviceType: values.service,
                    address: values.location.address,
                    lan: values.location.lat.toString(),
                    log: values.location.lng.toString(),
                    frequency: values.frequency,
                    type: 'SERVICE',
                    rate: values.rate,
                })
            }}
        >
            {
                (formik) => (
                    <Form className="mt-8 space-y-4">
                        <FormikControl
                            placeholder="Tell us what you are looking for"
                            label="Type of Service"
                            type="text"
                            control="input-label"
                            name="service"
                        />

                        <FormikControl
                            placeholder="Input hourly rate"
                            label="Rate"
                            type="text"
                            control="input-label"
                            name="rate"
                        />

                        <PlacesAutocomplete
                            name={'location'}
                            onLocationSelect={(lat: number, lng: number, address: string) => {
                                formik.setFieldValue('location.address', address);
                                formik.setFieldValue('location.lat', lat);
                                formik.setFieldValue('location.lng', lng);
                            }}
                        />

                        <Field name="frequency">
                            {
                                ({ field }: FieldProps) => (
                                    <div className="flex rounded-full border justify-start p-1 w-fit">
                                        <Button className={`${frequencyType === 0 ? 'text-white' : 'text-black'} rounded-full py-0`}
                                            variant={`${frequencyType === 0 ? 'default' : 'ghost'}`}
                                            onClick={() => {
                                                setFrequencyType(0);
                                                formik.setFieldValue('frequency', 'ONEOFF');
                                            }}
                                            {...field}>
                                            One-Off
                                        </Button>
                                        <Button className={`${frequencyType === 1 ? 'text-white' : 'text-black'} rounded-full py-0`}
                                            variant={`${frequencyType === 1 ? 'default' : 'ghost'}`}
                                            onClick={() => {
                                                setFrequencyType(1);
                                                formik.setFieldValue('frequency', 'RECURRING');
                                            }}
                                            {...field}>
                                            Recurring
                                        </Button>
                                    </div>
                                )
                            }

                        </Field>
                        <ErrorMessage name={'frequency'} render={msg => <small className="text-red-500 text-xs">{msg}</small>} />

                        <Button
                            disabled={requestMutation.isPending}
                            isLoading={requestMutation.isPending}
                            type="submit" className="w-full">Submit</Button>
                    </Form>
                )
            }
        </Formik>
    )
}

export default ServiceRequestForm;