'use client';

import { currencyFormatter } from "@/lib/utils";
import { Label } from "../ui/label";
import { ProductValues } from "./ProductUploadForm";
import getQueryClient from "@/lib/getQueryClient";
import { CategoryInterface } from "@/lib/types/category/CategoryInterface";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Form, Formik } from "formik";

const StepThreeProductForm = ({ isSubmitting, onPrev, onNext, data }:
    {
        isSubmitting: boolean,
        onPrev: (data: ProductValues) => void,
        onNext: (data: ProductValues, final: boolean) => void,
        data: ProductValues
    }) => {
    const queryClient = getQueryClient();

    const [categoryInfo, setCategoryInfo] = useState<{
        categoryName: string, subcategoryName: string
    }>({
        categoryName: '', subcategoryName: ''
    });
    const [previewImage, setPreviewImage] = useState<any[]>([]);

    useEffect(() => {
        const categoryData = queryClient.getQueryData<CategoryInterface>(['category']);
        const category = categoryData?.data.find((item) => Number(item.id) === Number(data.categoryId));
        const categoryName = category?.name ?? '';
        const subcategoryName = category?.subcategory.find((item) => Number(item.id) === Number(data.subcategoryId))?.name ?? '';
        setCategoryInfo({
            categoryName,
            subcategoryName
        });
    
        const readerPromises = data.image.map((file: any) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
            });
        });
    
        Promise.all(readerPromises)
            .then((results) => {
                setPreviewImage((prev) => [...prev, ...results]);
            })
            .catch((error) => {
                console.error('Error reading images:', error);
            });
    
        // Clean up object URLs when the component is unmounted
        return () => {
            readerPromises.forEach((promise) => {
                promise.then((result) => URL.revokeObjectURL(result));
            });
        };
    }, [data.image]);
    
    
    
    
        
    
    return (
        <Formik
            initialValues={data}
            validationSchema={null}
            onSubmit={(values) => { onNext(values, true) }}>

            <Form className="flex flex-col">
                <p className="text-md font-semibold">Confirm details you have provided</p>
                <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className="flex flex-col">
                        <Label className="text-[#253B4B] text-xs">Product name</Label>
                        <p className="text-sm font-semibold">{data.name}</p>
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-[#253B4B] text-xs">Product price</Label>
                        <p className="text-sm font-semibold">{currencyFormatter(Number(data.price))}</p>
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-[#253B4B] text-xs">Category</Label>
                        <p className="text-sm font-semibold">{categoryInfo.categoryName}</p>
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-[#253B4B] text-xs">Subcategory</Label>
                        <p className="text-sm font-semibold">{categoryInfo.subcategoryName}</p>
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-[#253B4B] text-xs">Condition</Label>
                        <p className="text-sm font-semibold">{data.condition}</p>
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-[#253B4B] text-xs">Type</Label>
                        <p className="text-sm font-semibold">{data.type}</p>
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-[#253B4B] text-xs">Location</Label>
                        <p className="text-sm font-semibold">{data.location.address}</p>
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-[#253B4B] text-xs">Description</Label>
                        <p className="text-sm font-semibold">{data.description}</p>
                    </div>
                </div>

                <div className="flex space-x-2 justify-center bg-slate-200 p-2 mt-2">
    {previewImage.map((img, index) => (
        <Image key={nanoid()} src={img} width={"150"} height={"150"} alt={`Preview ${index}`} />
    ))}
</div>


                <div className="flex flex-col w-full space-y-3 items-center justify-between mt-4">
                    <Button variant="outline" className="w-full max-w-[50%] py-1" onClick={() => onPrev(data)}><ArrowLeft className="mr-2" /> Prev</Button>
                    <div className="flex flex-col items-center space-y-2">
                        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="w-full max-w-[50%] py-1">
                            Upload product
                        </Button>
                        <Label className="text-center text-[12px] text-[#737373]">
                            By clicking on Upload Product, you accept the Terms of Use, confirm that you will abide by the Safety Tips, and declare that this upload does not include any Prohibited Items.
                        </Label>
                    </div>
                </div>
            </Form>
        </Formik>
    )
}

export default StepThreeProductForm;