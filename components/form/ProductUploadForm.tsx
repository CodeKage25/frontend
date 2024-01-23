'use client'

import React, { useState } from "react";
import StepOneProductForm from "./StepOneProductForm";
import StepIndicator from "../ui/step-indicator";
import { Button } from "../ui/button";
import StepTwoProductForm from "./StepTwoProductForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProductReqInterface } from "@/lib/types/product/CreateProductReqInterface";
import { createProduct } from "@/api/product/endpoints";
import { AxiosError } from "axios";
import ErrorAlertDialog, { ErrorAlertInterface } from "../dashboard/ErrorAlertDialog";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import Image from "next/image";
import successCheck from '@/public/success.svg'
import errorIcon from '@/public/error.svg'
import { useLocationUpdate } from "@/lib/hooks/useLocationUpdate";
import { LocationType } from "@/lib/types/location/CoordinateInterface";
import StepThreeProductForm from "./StepThreeProductForm";

export interface ProductValues {
    name: string;
    description: string;
    price: string;
    type: string;
    categoryId: number;
    subcategoryId: number;
    condition: string;
    image: any;
    planId: number;
    location: {
        lat: number,
        lng: number,
        address: string
    }
}

const ProductUploadForm = () => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<ProductValues>({
        name: '',
        description: '',
        price: '',
        type: '',
        categoryId: NaN,
        subcategoryId: NaN,
        condition: '',
        image: null,
        planId: NaN,
        location: {
            lat: NaN,
            lng: NaN,
            address: ''
        }
    });
    const [location, setLocation] = useState<LocationType | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [validStep, setValidStep] = useState([false, false, false]);
    const [openDialog, setOpenDialog] = useState({
        openErrorDialog: false,
        openFundWalletDialog: false,
        openSuccessDialog: false,
        openLocationDialog: false
    });
    const [errorProps, setErrorProps] = useState<ErrorAlertInterface>({} as ErrorAlertInterface)

    const locationMutate = useLocationUpdate({
        onSuccess(data) {
            toast.success(data.message);
            setOpenDialog(prev => ({ ...prev, openLocationDialog: false }));
        },
        onError(error) {

        },
    });

    const onSuccess = (position: GeolocationPosition) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setOpenDialog(prev => ({ ...prev, openLocationDialog: false }));
        locationMutate.mutate({
            lan: latitude,
            log: longitude
        });
    }

    const onError = (position: GeolocationPositionError) => {
        setLocation({
            coord: {
                long: 0,
                lat: 0,
            },
            loaded: true,
            status: "ERROR",
            message: "Unable to retrieve your location",
        });
    }

    const onLocationGranted = () => {
        if (!(navigator.geolocation)) {
            setLocation(() => ({
                coord: {
                    long: 0,
                    lat: 0,
                },
                loaded: true,
                status: "ERROR",
                message: "Geolocation is not supported by your browser",
            }));
        } else {
            navigator.geolocation.getCurrentPosition(onSuccess, onError)
        }
    }

    const createProductMutation = useMutation({
        mutationFn: (req: CreateProductReqInterface) => createProduct(req),
        onSuccess(data, variables, context) {
            setOpenDialog(prev => ({ ...prev, openSuccessDialog: true }));
        },
        onError(error, variables, context) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 400) {
                // @ts-ignore
                toast.error(axiosError.response?.data?.message);
                // @ts-ignore
                if (axiosError.response?.data?.message.toLowerCase().includes('location')) {
                    setErrorProps({
                        title: 'Upload Failed',
                        errorMessage: 'Your listing was not successfully submitted',
                        // @ts-ignore
                        errorReason: axiosError.response?.data?.message ?? '',
                        positiveText: 'Set location',
                        negativeText: 'Close',
                        icon: errorIcon,
                        positiveAction: () => { onLocationGranted() },
                        negativeAction: () => { setOpenDialog(prev => ({ ...prev, openErrorDialog: false })) },
                    });
                    setOpenDialog(prev => ({ ...prev, openLocationDialog: true }));
                }
            }
        },
    }
    );

    const handleClose = () => {
        queryClient.invalidateQueries({ queryKey: ['seller-product'] });
        setOpenDialog(prev => ({ ...prev, openSuccessDialog: false }));
        setCurrentStep(0);
        setValidStep([false, false, false]);
        setData({} as ProductValues);
    }

    const handleNextStep = (newData: ProductValues, final: boolean) => {
        if (final) {
            createProductMutation.mutate({
                name: newData.name,
                price: Number(newData.price),
                description: newData.description,
                categoryId: newData.categoryId,
                subcategoryId: newData.subcategoryId,
                condition: newData.condition,
                type: newData.type,
                image: newData.image,
                lan: newData.location.lat,
                log: newData.location.lng,
                address: newData.location.address
            });
            return;
        }
        setValidStep(prev => {
            prev.splice(currentStep, 1, true);
            return prev;
        });
        document.getElementById('step-indicator')?.scrollIntoView({ behavior: 'smooth' });
        setData(prev => ({ ...prev, ...newData }));
        setCurrentStep(prev => ++prev);
    }

    const handlePrevStep = (newData: ProductValues) => {
        document.getElementById('step-indicator')?.scrollIntoView({ behavior: 'smooth' });
        setData(prev => ({ ...prev, ...newData }));
        setCurrentStep(prev => --prev);
    }

    const steps = [
        <StepOneProductForm key={nanoid()} onNext={handleNextStep} data={data} />,
        <StepTwoProductForm key={nanoid()} onPrev={handlePrevStep} onNext={handleNextStep} data={data} />,
        <StepThreeProductForm key={nanoid()} isSubmitting={createProductMutation.isPending}
            onPrev={handlePrevStep} onNext={handleNextStep} data={data} />
        // <StepThreeProductForm key={nanoid()} isSubmitting={createProductMutation.isLoading} onPrev={handlePrevStep} onNext={handleNextStep} data={data} />
    ];

    return (
        <div className="flex flex-col">

            <ErrorAlertDialog
                {...errorProps}
                open={openDialog.openErrorDialog}
                setOpen={(open: boolean) => setOpenDialog((prev) => ({ ...prev, openErrorDialog: open }))}
            />

            <AlertDialog open={openDialog.openSuccessDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle asChild>
                            <div className="flex flex-col items-center space-y-3">
                                <p className="font-medium text-xl">Request Submitted</p>
                                <p className="font-normal text-[14px]">Your request have been successfully submitted</p>
                            </div>
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="w-full flex flex-col items-center">
                                <Image src={successCheck} width={100} height={100} alt="" className="my-5" />
                                <Button className="font-semibold text-sm px-8 py-1 w-[70%]"
                                    onClick={handleClose}>
                                    Close
                                </Button>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog defaultOpen={false} open={openDialog.openLocationDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Location update!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Welcome to Katangwa! To provide you with a personalized experience, we would like to know your current location. This will help us tailor our content and services to your area. Would you be willing to share your location with us? You can click &apos;Continue&apos; to grant permission or &apos;Cancel&apos; to decline.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setOpenDialog(prev => ({ ...prev, openLocationDialog: false }));
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => onLocationGranted()}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex w-full justify-between items-center font-semibold">
                <p className="text-black">Upload Product</p>
                <Button className="text-primary py-1" variant="ghost">Clear</Button>
            </div>
            <div id="step-indicator" className="flex bg-[#FCFCFDDD] justify-center items-center py-5">
                {
                    steps.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <StepIndicator position={index + 1} selected={index === currentStep} completed={validStep[index]} />
                                {
                                    index < steps.length - 1 && <hr className="w-[5%] border border-black border-dashed" />
                                }
                            </React.Fragment>
                        )
                    })
                }
            </div>
            {steps[currentStep]}
        </div>
    )
}

export default ProductUploadForm;