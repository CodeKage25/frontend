"use client"

import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSellerProfile } from "@/api/user/endpoints";
import parseISO from "date-fns/parseISO";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContextProvider";

const LeftPane = () => {
    const { auth } = useContext(AuthContext);
    const pageParams = useParams();
    const id = pageParams.id;
    const { data } = useQuery({
        queryKey: ['seller-profile', id as string],
        queryFn: () => getSellerProfile(id as string)
    });

    const sellerProfile = data?.data[0]?.user
    const firstNameFallback = sellerProfile?.firstName[0].toUpperCase() ?? 'K';
    const lastNameFallback = sellerProfile?.lastName[0].toUpperCase() ?? 'T';

    return (
        <section className="flex flex-col order-2 lg:order-1">
            <p className="uppercase text-[#253B4B] text-[14px] font-normal">seller profile</p>
            <div className="flex flex-col rounded-xl px-7 py-4 border border-[#828282] mt-2">
                <div className="flex space-x-5 mt-6">
                    <Avatar className="w-[70px] h-[70px]">
                        <AvatarImage src={sellerProfile?.avatar} />
                        <AvatarFallback>{firstNameFallback + lastNameFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                        <p className="text-[#253B4B] font-medium text-base">{sellerProfile?.firstName + " " + sellerProfile?.lastName}</p>
                        <p className="text-[#737373] font-normal text-[12px]">{`Last seen ${formatDistanceToNow(parseISO(sellerProfile?.updatedAt ?? new Date().toISOString()), { addSuffix: true })}`}</p>
                        <p className="text-[#737373] font-normal text-[12px]">{`Joined ${formatDistanceToNow(parseISO(sellerProfile?.createdAt ?? new Date().toISOString()), { addSuffix: true })}`}</p>
                    </div>
                </div>
                <Button className="mt-[18px]" disabled={(Number(auth?.id) === sellerProfile?.id)}>
                    <MessageCircle className="mr-2" /> Chat Seller
                </Button>

                <div className="flex my-6 text-[#C4C4C4] justify-evenly items-center space-x-5 max-w-full">
                    <hr className="w-full" />
                    <p className="uppercase">or</p>
                    <hr className="w-full" />
                </div>

                <Button className="font-semibold text-base text-primary p-0" variant="link">Request a call back</Button>
            </div>

            {/* <div className="flex flex-col justify-start rounded-xl px-7 py-4 border border-[#828282] space-y-3 mt-6">
                <p className="font-medium text-[#253B4B] text-base">About</p>
                <p className="font-normal text-[#202022] text-[14px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, perferendis!</p>
            </div>

            <div className="mt-6">
                <div className="flex justify-between items-center font-medium">
                    <p className="text-black">Review (4)</p>
                    <Button variant={'ghost'} className="text-primary p-0.5">Leave a review</Button>
                </div>
                <p className="font-normal text-[14px]">See what other  buyers are saying about this seller</p>

                <div className="flex flex-col space-y-2 mt-4 px-7 py-4 rounded-xl border border-[#828282]">
                    <div className="flex justify-between items-center">
                        <Avatar className="w-[70px] h-[70px]">
                            <AvatarImage src={'https://avatars.githubusercontent.com/u/124599?v=4'} />
                            <AvatarFallback>{firstNameFallback + lastNameFallback}</AvatarFallback>
                        </Avatar>

                        <p className="font-medium text-black">John Doe</p>
                    </div>
                    <p className="font-normal text-black text-[14px]">Lorem ipsum dolor sit amet consectetur. Netus nibh facilisi volutpat tristique orci.</p>
                    <p className="font-normal text-[#878787] text-[12px]">June 10, 2023</p>
                </div>
            </div> */}

        </section>
    )
}

export default LeftPane;