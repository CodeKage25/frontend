// 'use client'

// import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik"
// import { ProductValues } from "./ProductUploadForm";
// import * as Yup from 'yup';
// import { Button } from "../ui/button";
// import { ArrowLeft } from "lucide-react";

// import { getPlans } from "@/api/plans/endpoints";
// import { Data, GetPlanResInterface } from "@/lib/types/plans/GetPlanResInterface";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { FC, useContext, useState } from "react";
// import { currencyFormatter, flutterWaveConfig } from "@/lib/utils";
// import { confirmTransaction, getUserPlan, getWallet, payWithCoin } from "@/api/user/endpoints";
// import { WalletResInterface } from "@/lib/types/user/WalletResInterface";
// import { UserPlanResInterface } from "@/lib/types/user/UserResInterface";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { Label } from "../ui/label";
// import { AuthContext } from "@/context/AuthContextProvider";
// import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
// import { toast } from "react-toastify";
// import { PayCoinReqInterface } from "@/lib/types/user/PayCoinReqInterface";

// interface PaymentInterface {
//     planName: string,
//     planId: number,
//     planAmount: number,
//     paymentOption: number
// }

// interface ConfirmTransactionInterface {
//     planId: number,
//     amount: number,
//     ref: string
// }

// const validationSchema = Yup.object().shape({
//     planId: Yup.number().required()
//         .typeError('No post plan has been selected')
// })

// const StepFourProductForm = ({ isSubmitting, onPrev, onNext, data }:
//     {
//         isSubmitting: boolean,
//         onPrev: (data: ProductValues) => void,
//         onNext: (data: ProductValues, final: boolean) => void,
//         data: ProductValues
//     }) => {
//     const { auth } = useContext(AuthContext);

//     const [open, setOpen] = useState(false);
//     const [plan, setPlan] = useState<PaymentInterface>({ planName: '', planId: -1, planAmount: 0, paymentOption: 1 });
//     const [error, setError] = useState('');

//     const plans = useQuery<GetPlanResInterface>({ queryKey: ['plans'], queryFn: getPlans });
//     const { data: wallet, refetch: refetchWallet } = useQuery<WalletResInterface>({ queryKey: ['wallet'], queryFn: getWallet });
//     const { data: userPlan, refetch: refetchUserPlan, isFetching: isUserPlanLoading } = useQuery<UserPlanResInterface>({ queryKey: ['user-plan'], queryFn: getUserPlan });
//     const paymentConfig = flutterWaveConfig(auth?.firstName + ' ' + auth?.lastName, auth?.email || '', plan.planAmount)
//     const handlePayment = useFlutterwave(paymentConfig);
//     data.planId = userPlan?.data?.plan?.id || 0;

//     const confirmTxn = useMutation(
//         ({ amount, ref, planId }: ConfirmTransactionInterface) => confirmTransaction(planId, amount, ref),
//         {
//             onSuccess(data, variables, context) {
//                 refetchUserPlan();
//                 toast.success('Transaction successful!');
//                 closePaymentModal();
//             },
//             onError() {
//                 toast.error('Unable to verify transaction');
//             }
//         }
//     );

//     const payCoin = useMutation(
//         ({ amount, planId }: PayCoinReqInterface) => payWithCoin(amount, planId), {
//         onSuccess(data, variables, context) {
//             refetchUserPlan();
//             refetchWallet();
//             toast.success('Transaction successful!');
//         }
//     });

//     return (
//         <Formik
//             initialValues={data}
//             validationSchema={validationSchema}
//             onSubmit={(values) => { onNext(values, true) }}
//         >
//             {
//                 (formik) => (
//                     <Form className="flex flex-col w-full rounded-lg bg-[#FCFCFD] justify-center mt-5 lg:mt-10">
//                         <AlertDialog open={open} onOpenChange={setOpen}>
//                             <AlertDialogContent>
//                                 <AlertDialogHeader>
//                                     <AlertDialogTitle>{`${plan.planName} Plan Subscription`}</AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                         It&apos;s important to note that each plan offers access to exclusive features that are available for one month from the moment you subscribe.
//                                     </AlertDialogDescription>
//                                 </AlertDialogHeader>
//                                 <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction onClick={() => {
//                                         handlePayment({
//                                             callback: (response) => {
//                                                 confirmTxn.mutate({
//                                                     planId: plan.planId || 0,
//                                                     amount: plan.planAmount,
//                                                     ref: response.tx_ref
//                                                 })
//                                             },
//                                             onClose: () => { }
//                                         })
//                                     }}>Continue</AlertDialogAction>
//                                 </AlertDialogFooter>
//                             </AlertDialogContent>
//                         </AlertDialog>
//                         <div className="flex flex-col w-full mx-auto p-1 space-y-8 lg:p-11">
//                             <div className="flex flex-col justify-between lg:flex-row">
//                                 <div className="flex flex-col">
//                                     <p className="font-medium text-[#253B4B] text-[14px]">Subscription Plans</p>
//                                     {!userPlan?.data?.plan ?
//                                         <p className="font-normal text-[#5F5F5F] text-[14px]">
//                                             You are not subscribed to any plan. Please select a plan below.
//                                         </p>
//                                         :
//                                         userPlan?.data?.status ?
//                                             <p className="font-normal text-[#5F5F5F] text-[14px]">{`You are subscribed to ${userPlan.data.plan.name} plan.`}</p>
//                                             :
//                                             <p className="font-normal text-[#5F5F5F] text-[14px]">{`Your subscription plan to ${userPlan.data.plan.name} has expired.`}</p>
//                                     }
//                                 </div>
//                                 <div className="flex items-center space-x-2 mt-2 lg:mt-0">
//                                     <p className="text-[#253B4B] text-[14px]">Wallet Balance</p>
//                                     <p className="border-[#C4C4C4] border-[1px] rounded-full px-2 py-1 text-center font-semibold">{`${wallet?.data?.balance ?? 0} coins`}</p>
//                                 </div>
//                             </div>

//                             <Field name="planId">
//                                 {
//                                     (props: FieldProps) => (
//                                         <div className="w-full flex flex-col space-y-4 justify-between lg:flex-row lg:space-y-0">
//                                             {
//                                                 plans.data?.data.map((item) => (
//                                                     <PostPlan key={item.id} {...item}
//                                                         selected={item.id === props.form.getFieldProps('planId').value}
//                                                         disabled={userPlan?.data?.status}
//                                                         handleClick={() => {
//                                                             props.form.setFieldValue('planId', item.id);
//                                                             setPlan(prev => ({ ...prev, planId: item.id, planName: item.name, planAmount: Number(item.price) }));
//                                                         }} />
//                                                 ))
//                                             }
//                                         </div>
//                                     )
//                                 }
//                             </Field>
//                             <ErrorMessage name={"planId"} render={msg => <small className="text-red-500 text-sm">{msg}</small>} />
//                             {error && <small className="text-red-500 text-sm">{error}</small>}

//                             <RadioGroup defaultValue="1" className="space-y-2" onValueChange={(value) => setPlan(prev => ({ ...prev, paymentOption: Number(value) }))}
//                                 disabled={userPlan?.data?.status}>
//                                 <div className="flex items-center space-x-2">
//                                     <RadioGroupItem value="1" id="r1" />
//                                     <div className="flex flex-col space-y-1">
//                                         <Label htmlFor="r1" className="font-normal text-black text-[14px]">Pay with Cards, Bank Transfer or USSD</Label>
//                                         <Label htmlFor="r1" className="font-normal text-[#737373] text-[12px]">You will be redirected to Flutterwave checkout page</Label>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                     <RadioGroupItem value="2" id="r2" />
//                                     <div className="flex flex-col space-y-1">
//                                         <Label htmlFor="r2" className="font-normal text-black text-[14px]">Pay with Katangwa Coins</Label>
//                                         <Label htmlFor="r2" className="font-normal text-[#737373] text-[12px]">You will be charged from your wallet balance</Label>
//                                     </div>
//                                 </div>
//                             </RadioGroup>

//                             <div className="flex flex-col w-full space-y-3 items-center justify-between">
//                                 <Button variant="outline" className="w-full max-w-[50%] py-1" onClick={() => onPrev(formik.values)}><ArrowLeft className="mr-2" /> Prev</Button>
//                                 {userPlan?.data?.status ?
//                                     // {!userPlan?.data?.status ?
//                                     <div className="flex flex-col items-center space-y-2">
//                                         <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="w-full max-w-[50%] py-1">
//                                             Upload product
//                                         </Button>
//                                         <Label className="text-center text-[12px] text-[#737373]">
//                                             By clicking on Upload Product, you accept the Terms of Use, confirm that you will abide by the Safety Tips, and declare that this upload does not include any Prohibited Items.
//                                         </Label>
//                                     </div>
//                                     :
//                                     <Button type="button" isLoading={payCoin.isLoading || isUserPlanLoading} disabled={payCoin.isLoading || isUserPlanLoading} className="w-full max-w-[50%] py-1" onClick={() => {
//                                         if (plan.planName.length <= 0) {
//                                             setError('No Post plan has been selected');
//                                             return;
//                                         }
//                                         setError('');
//                                         if (plan.paymentOption === 1)
//                                             setOpen(true); // pay with flutterwave
//                                         else {
//                                             payCoin.mutate({
//                                                 amount: plan.planAmount,
//                                                 planId: plan.planId
//                                             });
//                                         }
//                                     }}>
//                                         Subscribe
//                                     </Button>
//                                 }
//                             </div>
//                         </div>
//                     </Form>
//                 )
//             }
//         </Formik>
//     )
// }

// export default StepFourProductForm;

// const PostPlan: FC<Data & { selected: boolean, disabled?: boolean, handleClick: () => void }> = ({ name, coins, price, selected, disabled, handleClick }) => {
//     return (
//         // <div className={` ${selected ? 'border-[#70A300] scale-105 hover:scale-105 lg:scale-110 lg:hover:scale-110' : 'border-[#D1CDC7]'} flex flex-col items-center justify-between rounded-lg border-[2px] space-y-5 p-8 text-center transition-all duration-100 hover:cursor-pointer hover:scale-105`}
//         <div className={` ${selected ? 'border-[#70A300] scale-105 hover:scale-105 lg:scale-110 lg:hover:scale-110' : 'border-[#D1CDC7]'} ${disabled ? 'pointer-events-none opacity-50 hover:cursor-not-allowed' : 'hover:cursor-pointer'} flex flex-col items-center justify-between rounded-lg border-[2px] space-y-5 p-8 text-center transition-all duration-100 hover:scale-105`}

//             onClick={handleClick}>
//             <p className="text-[#253B4B] font-semibold">{`${name} Post`}</p>
//             <div className="flex flex-col items-center">
//                 <p className="text-primary text-2xl">{`${coins} coins`}</p>
//                 <p className="text-black text-xl"><span className="text-[#253B4B]">/</span>{`${currencyFormatter(Number(price))}`}</p>
//             </div>
//         </div>
//     )
// }