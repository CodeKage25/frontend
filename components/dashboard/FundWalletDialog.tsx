import { FC, useContext, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AuthContext } from "@/context/AuthContextProvider";
import { useFlutterwave } from 'flutterwave-react-v3';
import { flutterWaveConfig } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { confirmTransaction } from "@/api/user/endpoints";
import { toast } from "react-toastify";
import getQueryClient from "@/lib/getQueryClient";

interface FundWalletInterface {
    title: string;
    message: string;
    planId?: number;
    open: boolean;
    setOpen: any;
    disabled: boolean;
}

interface ConfirmTransactionInterface {
    planId: number,
    amount: number,
    ref: string
}

const FundWalletDialog: FC<FundWalletInterface> = ({ title, message, planId, open, setOpen, disabled = false }) => {
    const { auth } = useContext(AuthContext);
    const [amount, setAmount] = useState<number>(0);
    const [error, setError] = useState('');
    const paymentConfig =
        flutterWaveConfig(auth?.firstName + ' ' + auth?.lastName, auth?.email ?? '', amount);
    const handlePayment = useFlutterwave(paymentConfig);
    const queryClient = getQueryClient();

    const confirmTxn = useMutation({
        mutationFn: ({ amount, ref, planId }: ConfirmTransactionInterface) => confirmTransaction(planId, amount, ref),

        onSuccess(data, variables, context) {
            console.log(data);
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            toast.success('Transaction successful!');
        },
        onError() {
            toast.error('Unable to verify transaction');
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="name"
                            defaultValue={auth?.email}
                            className="col-span-3"
                            disabled={true}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="username"
                            type="number"
                            placeholder="2999"
                            className="col-span-3"
                            disabled={disabled}
                            value={amount}
                            onChange={e => {
                                const userAmount = Number(e.currentTarget.value);
                                setAmount((prev) => {
                                    prev <= 0 ? setError('Provide a valid amount') : setError('');
                                    return userAmount;
                                });
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => {
                        handlePayment({
                            callback: (response) => {
                                confirmTxn.mutate({
                                    planId: planId || 0,
                                    amount: amount,
                                    ref: response.tx_ref
                                })
                            },
                            onClose: () => { }
                        })
                    }}>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FundWalletDialog;