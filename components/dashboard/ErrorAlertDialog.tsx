import { FC } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import Image from "next/image";
import { Button } from "../ui/button";

export interface ErrorAlertInterface {
    title: string;
    errorMessage: string;
    errorReason: string;
    icon: any;
    positiveText: string;
    negativeText: string;
    positiveAction: () => void;
    negativeAction: () => void;
}

const ErrorAlertDialog: FC<ErrorAlertInterface & { open: boolean, setOpen: any }> = (props) => {
    return (
        <AlertDialog open={props.open} onOpenChange={props.setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle asChild>
                        <div className="flex flex-col items-center">
                            {props.title}
                        </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="flex flex-col items-center">
                            <p className="text-[#5F5F5F] text-[14px]">{props.errorMessage}</p>
                            <p className="font-normal text-[#253B4B] text-[14px] mt-3">Reason</p>
                            <p className="text-red-600 font-normal text-[14px]">{props.errorReason}</p>
                            <Image width={60} height={60} src={props.icon} alt="" className="my-3" />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="w-full flex flex-col items-center space-y-4">
                    <Button className="w-full max-w-[70%]" onClick={props.positiveAction}>{props.positiveText}</Button>
                    <Button className="w-full max-w-[70%]" variant='outline' onClick={props.negativeAction}>{props.negativeText}</Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ErrorAlertDialog;