import { Field, FieldProps, Form, Formik } from "formik";
import * as Yup from 'yup';
import FormikControl from "../form-controls/FormikControl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoryInterface, Subcategory } from "@/lib/types/category/CategoryInterface";
import { useState } from "react";
import { getCategory } from "@/api/category/endpoints";
import PlacesAutocomplete from "../product/PlacesAutocomplete";
import Dropzone from "react-dropzone";
import { Input } from "../ui/input";
import { PlusSquare, XCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "../ui/button";
import { createRequest } from "@/api/request/endpoints";
import { SpecialRequestInterface } from "@/lib/types/request/SpecialRequestInterface";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface RequestFormInterface {
    itemName: string
    categoryId: string
    subcategoryId: string
    condition: string
    location: {
        address: string
        lat: string
        lng: string
    }
    itemDescription: string
    image: any
}

const validationSchema = Yup.object().shape({
    itemName: Yup.string().required('Item name must be provided!'),
    categoryId: Yup.string().required('One product category must be selected!'),
    subcategoryId: Yup.string().required('One product sub category must be selected!'),
    condition: Yup.string().required('Product condition must be selected!'),
    itemDescription: Yup.string().required('Product description must be provided')
        .min(15, 'Provide sufficient product description'),
    location: Yup.object().shape({
        address: Yup.string().required('Provide address'),
        lat: Yup.number().required('Provide product location'),
        lng: Yup.number().required('Provide product location')
    }).nullable().required(),
    image: Yup.mixed().required('Provide a product image')
})

const ItemRequestForm = () => {
    const router = useRouter();
    const [initialData, setInitialData] = useState<RequestFormInterface>({
        itemName: '',
        categoryId: '',
        subcategoryId: '',
        condition: '',
        location: {
            address: '',
            lat: '',
            lng: ''
        },
        itemDescription: '',
        image: null
    });

    const category = useQuery<CategoryInterface>({ queryKey: ['category'], queryFn: getCategory });

    const [subCat, setSubCat] = useState<Subcategory[]>([]);
    const [previewImage, setPreviewImage] = useState<any[]>([]);

    const requestMutation = useMutation({
        mutationFn: (params: SpecialRequestInterface) => createRequest(params),
        onSuccess(data, variables, context) {
            toast.success(`${variables.name} request has been submitted successfully`);
            router.replace('/');
        },
    });

    return (
        <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                requestMutation.mutate({
                    name: values.itemName,
                    categoryId: values.categoryId,
                    subcategoryId: values.subcategoryId,
                    condition: values.condition,
                    address: values.location.address,
                    lan: values.location.lat,
                    log: values.location.lng,
                    description: values.itemDescription,
                    type: 'PRODUCT',
                    image: values.image,
                });
            }}
        >
            {
                (formik) => (
                    <Form className="mt-8 space-y-4">
                        <FormikControl
                            placeholder="Tell us what you are looking for"
                            label="Item Name"
                            type="text"
                            control="input-label"
                            name="itemName"
                        />

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

                        <PlacesAutocomplete
                            name={'location'}
                            onLocationSelect={(lat: number, lng: number, address: string) => {
                                formik.setFieldValue('location.address', address);
                                formik.setFieldValue('location.lat', lat);
                                formik.setFieldValue('location.lng', lng);
                            }}
                        />

                        <FormikControl
                            placeholder="Add a short description of the product"
                            label="Item Description"
                            type="text"
                            control="textarea"
                            name="itemDescription"
                        />

                        <div className="flex flex-col space-y-2">
                            <Field name="image">
                                {
                                    (props: FieldProps) => (
                                        <Dropzone maxFiles={4} accept={{
                                            'image/jpeg': [],
                                            'image/png': []
                                        }} onDrop={acceptedFiles => {
                                            console.log(acceptedFiles)
                                            props.form.setFieldValue('image', acceptedFiles);
                                            acceptedFiles.forEach((file) => {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    setPreviewImage(prev => ([...prev, reader.result]));
                                                }
                                                reader.readAsDataURL(file);
                                            })
                                        }}>
                                            {({ getRootProps, getInputProps, isDragActive }) => (
                                                <div {...getRootProps()} className="flex flex-col items-center text-center p-10 rounded-lg border-2 border-dashed border-primary cursor-pointer">
                                                    <Input {...getInputProps()} />

                                                    {
                                                        isDragActive ?
                                                            <p className="text-primary font-semibold text-lg">Drop the files here ...</p> :
                                                            <div className="flex space-x-2 items-center">
                                                                <PlusSquare />
                                                                <p className="text-sm font-medium text-primary">Add image <span className="text-[#444A5B]">or drop image here</span></p>
                                                            </div>
                                                    }
                                                    {/* <p className="text-[#444A5B] text-[14px] font-normal">Maximum file size: 50 MB</p> */}
                                                </div>
                                            )}
                                        </Dropzone>
                                    )
                                }
                            </Field>

                            {
                                formik.errors && <p className="text-xs text-red-600 font-normal">{formik.errors?.image?.toString()}</p>
                            }
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

                        <Button disabled={requestMutation.isPending}
                            isLoading={requestMutation.isPending}
                            type="submit" className="w-full">Submit</Button>
                    </Form>
                )
            }
        </Formik>
    )
}

export default ItemRequestForm;