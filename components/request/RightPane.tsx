"use client"

import { MessageCircle, Play } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProduct } from "@/api/product/endpoints";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import parseISO from "date-fns/parseISO";
import { CreateChatReqInterface } from "@/lib/types/user/CreateChatReqInterface";
import { initiateChat } from "@/api/user/endpoints";
import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContextProvider";
import Link from "next/link";
import { getSingleRequest } from "@/api/request/endpoints";

const RightPane = () => {
    const { auth } = useContext(AuthContext);
    const router = useRouter();
    const pageParams = useParams();
    const { id } = pageParams;
    const { data } = useQuery({
        queryKey: ['request', id],
        queryFn: () => getSingleRequest(id as string),
        enabled: !!id
    });

    const [senderToken, setSenderToken] = useState<string | null>(null);
    const firstNameFallback = data?.data?.user?.firstName?.at(0) ?? 'K';
    const lastNameFallback = data?.data.user.lastName?.at(0) ?? 'T';
    useEffect(() => {
        setSenderToken(localStorage.getItem('fcmtoken') ?? null);
    }, []);

    const { mutate: createChatMutate, isPending: isLoadingCreateChat } = useMutation<any, AxiosError, CreateChatReqInterface>({
        mutationFn: async (createChat: CreateChatReqInterface) => initiateChat(
            createChat.chatid1,
            createChat.chatid2,
            createChat.senderName,
            createChat.receiverName,
            createChat.senderAvatar,
            createChat.receiverAvatar,
            createChat.senderMobile,
            createChat.receiverMobile,
            createChat.senderToken,
            createChat.receiverToken
        ),
        onSuccess() {
            router.push(`/dashboard/messages?to=${data?.data.user.firstName.toLowerCase()}-${data?.data.user.lastName.toLowerCase()}&id=${data?.data.userId}&token=${data?.data.user.token}`);
        }
    });

    return (
        <section className="flex flex-col">
            <div className="flex flex-col rounded-xl px-7 py-4 border border-[#828282] mt-9">
                <p className="uppercase text-[#253B4B] text-[12px] font-normal">seller</p>
                <div className="flex space-x-5 mt-6">
                    <Avatar className="w-[70px] h-[70px]">
                        <AvatarImage src={data?.data.user.avatar} />
                        <AvatarFallback>{firstNameFallback + lastNameFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                        <p className="text-[#253B4B] font-medium text-base">{data?.data.user.firstName + " " + data?.data.user.lastName}</p>
                        <p className="text-[#737373] font-normal text-[12px]">{`Last seen ${formatDistanceToNow(parseISO(data?.data.user.updatedAt ?? new Date().toISOString()), { addSuffix: true })}`}</p>
                        <p className="text-[#737373] font-normal text-[12px]">{`Joined ${formatDistanceToNow(parseISO(data?.data.user.createdAt ?? new Date().toISOString()), { addSuffix: true })}`}</p>
                    </div>
                </div>
                <Button className="mt-[18px]" isLoading={isLoadingCreateChat} disabled={isLoadingCreateChat || (Number(auth?.id) === data?.data.userId)}
                    onClick={() => {
                        createChatMutate({
                            chatid1: auth?.id || '',
                            chatid2: data?.data.userId.toString() || '',
                            senderName: auth?.firstName + ' ' + auth?.lastName,
                            receiverName: data?.data.user.firstName + ' ' + data?.data.user.lastName,
                            senderAvatar: auth?.avatar || '',
                            receiverAvatar: data?.data.user.avatar,
                            senderMobile: auth?.phone || '',
                            receiverMobile: data?.data.user.phone || '',
                            senderToken: senderToken || '',
                            receiverToken: data?.data.user.token
                        });
                    }}>
                    <MessageCircle className="mr-2" /> Chat Seller
                </Button>

                <div className="flex my-6 text-[#C4C4C4] justify-evenly items-center space-x-2 max-w-full">
                    <hr className="w-full" />
                    <p className="uppercase">or</p>
                    <hr className="w-full" />
                </div>

                {/* <Button className="font-semibold text-base text-primary p-0" variant="link">Request a call back</Button> */}
                <Link passHref legacyBehavior href={`/seller/${data?.data.userId}`}>
                    <Button className="font-semibold text-base text-primary p-0" variant="link">View Seller Profile</Button>
                </Link>
            </div>

            <div className="flex flex-col w-full items-start rounded-xl p-7 border border-[#828282] mt-9">
                <p className="font-medium text-base uppercase text-[#253B4B] self-center">safety tips</p>
                <div className="flex flex-col items-start space-y-6 font-medium text-[12px] text-black mt-7">
                    <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3" fill="black" />
                        <p>Remember, don&apos;t send any pre-payments</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3" fill="black" />
                        <p>Make the seller at a safe and secured locations</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3" fill="black" />
                        <p>Inspect the goods to make sure they meet your needs</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3" fill="black" />
                        <p>Report Suspicious Activity</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3" fill="black" />
                        <p>Meet the seller at a safe and secured locations</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3" fill="black" />
                        <p>Inspect the goods to make sure they meet your needs</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RightPane;