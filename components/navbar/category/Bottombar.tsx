'use client'

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import CategoryMenu from "../CategoryMenu";
import { getCategory } from "@/api/category/endpoints";
import logo from '@/public/logo.svg';
import { CategoryInterface } from "@/lib/types/category/CategoryInterface";
import { Button } from "../../ui/button";
import notificationIcon from "@/public/notification.svg"
import messageIcon from "@/public/mailDark.svg"
import userIcon from "@/public/userDark.svg"
import { Separator } from "../../ui/separator";
import { userLoggedIn } from "@/lib/utils";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContextProvider";
import { LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import dynamic from "next/dynamic";
import { getUnReadMessageCount } from "@/api/user/endpoints";

const Searchbar = dynamic(() => import("@/components/ui/searchbar"))

export const Bottombar = () => {
    const { auth, logout } = useContext(AuthContext);
    const [isClient, setIsClient] = useState(false);
    const [searchOverlay, setSearchOverlay] = useState<boolean>(false);
    const category = useQuery<CategoryInterface>({ queryKey: ['category'], queryFn: getCategory });

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data } = useQuery({
        queryKey: ['msg-count', auth?.id],
        queryFn: () => getUnReadMessageCount(auth?.id ?? ''),
        enabled: !!auth?.id
    });

    return (
        <div className="hidden bg-white w-full border-b border-b-[#C4C4C4] py-3 px-[60px] justify-between items-center font-semibold text-[14px] lg:flex lg:items-center">
            <div className="flex w-[30%] justify-between items-center">
                <Link href="/" passHref legacyBehavior >
                    <a>
                        <Image src={logo} alt='Katangwa Logo' width={180} height={180} className="hover:cursor-pointer" />
                    </a>
                </Link>
                <CategoryMenu  {...category.data ?? {} as CategoryInterface} />
            </div>

            {/* <div className="relative flex items-center w-full max-w-[40%] mx-auto">
                <Input type={'text'} className="block border-0 py-6 ring-[1px] ring-input rounded-full w-full font-normal text-xs bg-[#F0F0F1] md:text-sm"
                    placeholder={'Search for items'} />
                <Button className="absolute top-1/2 right-0 transform -translate-y-1/2 py-6 font-semibold px-3 rounded-tr-full rounded-br-full">
                    <Search className='w-6 h-6' strokeWidth='1.5px' />
                </Button>
            </div> */}
            <Searchbar styleName="max-w-[40%] -translate-y-[12%]" />
            {/* {
                (searchOverlay) && <div className="absolute top-0 left-0 h-screen w-screen z-20 bg-transparent" onClick={() => {
                    setSearchOverlay(false);
                }} />
            } */}

            {(isClient && userLoggedIn(auth)) ?
                <div className="flex justify-between space-x-4">
                    <div className="flex justify-evenly space-x-3">
                        <Button variant={"outline"} className="rounded-full border-[#B1B5C3]" size="icon">
                            <Image src={notificationIcon} width={18} height={18} alt="" />
                        </Button>
                        <Link href="/dashboard/messages" passHref legacyBehavior>
                            <Button variant={"outline"} className="relative rounded-full border-[#B1B5C3]" size="icon">
                                <Image src={messageIcon} width={18} height={18} alt="" />
                                {(data ?? 0) > 0 &&
                                    <div className="absolute grid p-2 text-xs place-content-center rounded-full text-white bg-primary w-[15px] h-[15px] top-0 -right-1">
                                        {data}
                                    </div>
                                }
                            </Button>
                        </Link>
                        <Separator orientation="vertical" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"} className="rounded-full border-[#B1B5C3]" size="icon">
                                    <Image src={userIcon} width={18} height={18} alt="" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="font-medium text-[14px] text-black space-y-1">
                                <DropdownMenuItem className="pointer-events-none">{`Hi, ${auth?.firstName + " " + auth?.lastName}!`}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <Link href="/dashboard" passHref legacyBehavior>
                                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Button variant="ghost" className="flex font-medium text-[14px] text-red-600 justify-between" onClick={() => {
                                        logout();
                                    }}>
                                        Log Out<LogOut className="w-5 h-5 text-red-600 ml-2" />
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    <Link href="/dashboard" legacyBehavior passHref>
                        <Button className="text-white font-semibold text-md px-3 py-4">Sell Now</Button>
                    </Link>
                </div> :
                <Link href="/login" legacyBehavior passHref>
                    <Button className="px-10 py-0 text-white" variant={'default'}>Login</Button>
                </Link>
            }
        </div>
    )
}

export default Bottombar;