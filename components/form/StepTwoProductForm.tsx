'use client'

import { Field, FieldProps, Form, Formik } from "formik"
import { ProductValues } from "./ProductUploadForm";
import * as Yup from 'yup';
import { Button } from "../ui/button";
import FormikControl from "../form-controls/FormikControl";
import { ArrowLeft, ArrowRight, X, XCircle } from "lucide-react";
import Dropzone from 'react-dropzone';
import { Input } from "../ui/input";
import Image from "next/image";

import fileUploadImage from '@/public/fileupload.svg';
import { useQuery } from "@tanstack/react-query";
import { CategoryInterface, Subcategory } from "@/lib/types/category/CategoryInterface";
import { getCategory } from "@/api/category/endpoints";
import { useState } from "react";
import { nanoid } from "nanoid";

const validationSchema = Yup.object().shape({
    categoryId: Yup.number().required('One product category must be selected!'),
    subcategoryId: Yup.number().required('One product sub category must be selected!'),
    condition: Yup.string().required('Product condition must be selected!'),
    type: Yup.string().required('Specify your type of product!'),
    image: Yup.mixed().required('Provide a product image')
})

const StepTwoProductForm = ({ onPrev, onNext, data }:
    {
        onPrev: (data: ProductValues) => void,
        onNext: (data: ProductValues, final: boolean) => void,
        data: ProductValues
    }) => {

    const handleSubmit = (newData: ProductValues) => onNext(newData, false);

    const category = useQuery<CategoryInterface>({ queryKey: ['category'], queryFn: getCategory });

    const [subCat, setSubCat] = useState<Subcategory[]>([]);
    const [previewImage, setPreviewImage] = useState<any[]>([]);

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
                            <div className="grid grid-cols-1 gap-y-5 lg:gap-x-5 lg:grid-cols-2">
                                <FormikControl
                                    placeholder="Select a category"
                                    label="Product category"
                                    type="select"
                                    control="select"
                                    name="categoryId"
                                    options={category.data?.data}
                                    handleChange={(id: number) => {
                                        setSubCat(category.data?.data?.find(item => item.id === id)?.subcategory ?? []);
                                    }}
                                />
                                <FormikControl
                                    placeholder="Select a subcategory"
                                    label="Product subcategory"
                                    type="select"
                                    control="select"
                                    name="subcategoryId"
                                    options={subCat}
                                />

                                <FormikControl
                                    placeholder="Select a condition"
                                    label="Condition"
                                    type="select"
                                    control="select"
                                    name="condition"
                                    options={['NEW', 'USED']}
                                />

                                <FormikControl
                                    placeholder="Select a type"
                                    label="Type"
                                    type="select"
                                    control="select"
                                    name="type"
                                    options={['Service', 'Product']}
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                {
                                    formik.errors && <p className="text-xs text-red-600 font-normal">{formik.errors?.image?.toString()}</p>
                                }

<Field name="image">
    {(props: FieldProps) => (
        <Dropzone
            maxFiles={4}
            accept={{
                'image/jpeg': [],
                'image/png': []
            }}
            onDrop={async acceptedFiles => {
                props.form.setFieldValue('image', acceptedFiles);
                const newImages = await Promise.all(
                    acceptedFiles.map(async (file) => {
                        const imageUrl = URL.createObjectURL(file);
                        setPreviewImage(prev => [...prev, imageUrl]);
                        return imageUrl;
                    })
                );
            }}
        >
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div {...getRootProps()} className="flex flex-col items-center text-center p-10 rounded-lg border-2 border-dashed border-primary">
                    <Input {...getInputProps()} />
                    <Image src={fileUploadImage} width={85} height={85} alt="" />
                    {isDragActive ? (
                        <p className="text-primary font-semibold text-lg">Drop the files here ...</p>
                    ) : (
                        <p className="text-[18px] font-medium text-primary">
                            Click to upload <span className="text-[#444A5B]">Or drag and drop</span>
                        </p>
                    )}
                    <p className="text-[#444A5B] text-[14px] font-normal">Maximum file size: 50 MB</p>
                </div>
            )}
        </Dropzone>
    )}
</Field>

                            </div>
                            {
                                previewImage.length > 0 &&
                                <div className="flex space-x-2 justify-center bg-slate-200 p-5">
                                    {
                                        previewImage.map((img, index) => (
                                            <div key={nanoid()} className="relative">
                                                <img src={img} width={"150px"} height={"auto"} alt="" />
                                                <div className="absolute inset-x-0 inset-y-0 w-full h-full opacity-0 bg-primary transition-all duration-300 hover:opacity-80 hover:cursor-pointer"
                                                    onClick={() => {
                                                        const images = formik.values.image;
                                                        images.splice(index, 1);
                                                        previewImage.splice(index, 1);
                                                        formik.setFieldValue('image', images);
                                                        setPreviewImage(previewImage);
                                                    }}>
                                                    <XCircle className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white w-8 h-8" strokeWidth={1} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }

                            <div className="flex justify-between">
                                <Button variant="outline" className="py-1" onClick={() => onPrev(formik.values)}><ArrowLeft className="mr-2" /> Prev</Button>
                                <Button type="submit" onClick={() => {
                                    !formik.isValid && document.getElementById('step-indicator')?.scrollIntoView({ behavior: 'smooth' });
                                }} className="py-1">Next <ArrowRight className="ml-2" /> </Button>
                            </div>
                        </div>
                    </Form>
                )
            }
        </Formik>
    )
}

export default StepTwoProductForm;