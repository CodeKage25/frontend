'use client'

import { Form, Formik } from "formik"
import { ProductValues } from "./ProductUploadForm";
import * as Yup from 'yup';
import { Button } from "../ui/button";
import FormikControl from "../form-controls/FormikControl";
import { ArrowRight } from "lucide-react";
import React from "react";
import PlacesAutocomplete from "../product/PlacesAutocomplete";

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product name must be provided!'),
    price: Yup.number().required('Product price must be provided!')
        .min(500, 'Product price can\'t be lower than 500')
        .max(10000000, 'Product price can\'t be lower than 10000000'),
    description: Yup.string().required('Product description must be provided')
        .min(15, 'Provide sufficient product description'),
    location: Yup.object().shape({
        lat: Yup.number().required('Provide product location'),
        lng: Yup.number().required('Provide product location')
    }).nullable().required()
})

const StepOneProductForm = ({ onNext, data }:
    {
        onNext: (data: ProductValues, final: boolean) => void,
        data: ProductValues
    }) => {

    const handleSubmit = (newData: ProductValues) => onNext(newData, false);

    return (
        <Formik
            initialValues={data}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {
                (formik) => (
                    <Form className="flex flex-col w-full rounded-lg bg-[#FCFCFD] justify-center mt-5 lg:mt-10">
                        <div className="flex flex-col w-full mx-auto p-1 space-y-8 lg:p-11 lg:max-w-[80%]">
                            <FormikControl
                                placeholder="Enter Product Title"
                                label="Product Name"
                                type="text"
                                control="input-label"
                                name="name"
                            />
                            <FormikControl
                                placeholder="Enter Product Price"
                                label="Product Price"
                                type="text"
                                control="input-label"
                                name="price"
                            />

                            <PlacesAutocomplete
                                name={'location'}
                                onLocationSelect={(lat: number, lng: number, address: string) => {
                                    formik.setFieldValue('location.lat', lat);
                                    formik.setFieldValue('location.lng', lng);
                                    formik.setFieldValue('location.address', address);
                                }}
                            />

                            <FormikControl
                                placeholder="Add a short description of the product"
                                label="Product Description"
                                type="text"
                                control="textarea"
                                name="description"
                            />
                            <Button type="submit" onClick={() => {
                                !formik.isValid && document.getElementById('step-indicator')?.scrollIntoView({ behavior: 'smooth' });
                            }}>Next <ArrowRight className="ml-2" /> </Button>
                        </div>
                    </Form>
                )
            }
        </Formik>
    )
}

export default StepOneProductForm;