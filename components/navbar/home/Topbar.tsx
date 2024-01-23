'use client'

import { getCategory } from "@/api/category/endpoints"
import { CategoryInterface } from "@/lib/types/category/CategoryInterface"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { FC, useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/AuthContextProvider"
import Link from "next/link"
import { userLoggedIn } from "@/lib/utils"
import logo from '@/public/logoLight.svg'
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronRight, Heart, LayoutGrid, LogOut, Mail, Settings, Store } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { nanoid } from 'nanoid';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const TopbarDrawer: FC<CategoryInterface> = ({ data }) => {
    const { auth, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [threshold] = useState<number>(Math.floor(data?.length / 2));
    const fallbackAvatarFirstName = auth?.firstName?.at(0)?.toUpperCase() ?? 'K';
    const fallbackAvatarlastName = auth?.lastName?.at(0)?.toUpperCase() ?? 'T';

    useEffect(() => {
        setIsClient(true);
    }, [])

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="w-10 h-10 p-[1px]" variant="ghost" size="icon"><LayoutGrid /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="px-0 py-6 overflow-y-scroll no-scrollbar">
                <div className="flex flex-col">
                    {/* FIRST GROUP */}
                    <div className="flex flex-col px-6">
                        {(isClient && userLoggedIn(auth)) &&
                            <div className="flex space-x-4 mt-6">
                                <Avatar>
                                    <AvatarImage src={auth?.avatar} />
                                    <AvatarFallback>{fallbackAvatarFirstName + fallbackAvatarlastName}</AvatarFallback>
                                </Avatar>
                                <div className="text-[#253B4B]">
                                    <p className="font-medium text-[14px]">{auth?.firstName + " " + auth?.lastName}</p>
                                    <p className="font-normal text-[12px]">{auth?.email}</p>
                                </div>
                            </div>
                        }
                    </div>
                    {/* SECOND GROUP */}
                    {(isClient && userLoggedIn(auth)) && <>
                        <Separator className="mt-2" />
                        <div className="mt-6 pl-6 pr-3">
                            <p className="text-[#253B4B] font-medium text-[14px]">My Account</p>
                            <div className="flex flex-col mt-5 space-y-6 text-[#5F5F5F]">
                                <Link legacyBehavior passHref href="/dashboard">
                                    <div className="flex items-center">
                                        <LayoutGrid className="w-5 h-5 text-black" />
                                        <p className="ml-2 mr-auto">Dashboard</p>
                                        <ChevronRight />
                                    </div>
                                </Link>
                                {/* <Link legacyBehavior passHref href="/dashboard/wallet">
                                    <div className="flex items-center">
                                        <Store className="w-5 h-5 text-black" />
                                        <p className="ml-2 mr-auto">Wallet</p>
                                        <ChevronRight />
                                    </div>
                                </Link> */}
                                <Link legacyBehavior passHref href="/dashboard/messages">
                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 text-black" />
                                        <p className="ml-2 mr-auto">Messages</p>
                                        <ChevronRight />
                                    </div>
                                </Link>
                                <Link legacyBehavior passHref href="/dashboard/likes">
                                    <div className="flex items-center">
                                        <Heart className="w-5 h-5 text-black" />
                                        <p className="ml-2 mr-auto">Likes</p>
                                        <ChevronRight />
                                    </div>
                                </Link>
                                <div className="flex items-center">
                                    <Settings className="w-5 h-5 text-black" />
                                    <p className="ml-2 mr-auto">Settings</p>
                                    <ChevronRight />
                                </div>

                                <Button className="flex p-0 text-red-600" variant="ghost" onClick={logout}>
                                    <LogOut className="w-5 h-5" />
                                    <p className="ml-2 mr-auto">Log Out</p>
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    </>
                    }
                    {/* THIRD GROUP */}
                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="pl-6 pr-3 space-y-2 mt-6"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-[#253B4B]">
                                Categories
                            </h4>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="p-0 text-primary">
                                    View all
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <div className="flex flex-col space-y-3 text-[#5F5F5F] text-[14px]">
                            {
                                data?.slice(0, threshold).map((item) =>
                                (<Link key={item.id} href={`/${item.name.toLowerCase()}?catId=${item.id}`}>
                                    {item.name}
                                </Link>
                                ))
                            }
                        </div>
                        <CollapsibleContent className="flex flex-col space-y-3 text-[#5F5F5F] text-[14px]">
                            {
                                data?.slice(threshold, data.length).map((item) =>
                                (<Link key={item.id} href={`/${item.name.toLowerCase()}?catId=${item.id}`}>
                                    {item.name}
                                </Link>
                                ))
                            }
                        </CollapsibleContent>
                    </Collapsible>
                    {/* THIRD GROUP */}
                    <Separator className="my-6" />
                    {
                        (isClient && userLoggedIn(auth)) ?
                            <>
                                <div className="flex flex-col w-full space-y-3 px-4 font-semibold text-[16px]">
                                    <Link href="/dashboard" legacyBehavior passHref>
                                        <Button>Sell Now</Button>
                                    </Link>
                                    <Link href='/view-requests' passHref legacyBehavior>
                                        <Button className="border border-primary text-primary" variant="outline">View Request</Button>
                                    </Link>
                                </div>
                            </> :
                            <>
                                <div className="flex flex-col w-full space-y-3 px-4 font-semibold text-[16px]">
                                    <Link href="/signup" legacyBehavior passHref><Button>Register</Button></Link>
                                    <Link href="/login" legacyBehavior passHref><Button className="border border-primary text-primary" variant="outline">Login</Button></Link>
                                </div>
                            </>
                    }

                </div>
            </SheetContent>
        </Sheet>
    )
}

const Topbar = () => {
    const [isClient, setIsClient] = useState(false);
    const { auth } = useContext(AuthContext);

    const category = useQuery<CategoryInterface>({ queryKey: ['category'], queryFn: getCategory })

    useEffect(() => {
        setIsClient(true);
    }, [])

    return (
        <div className="flex w-full bg-[rgb(9,37,59)] py-5 px-4 justify-between items-center font-semibold text-[14px] text-white lg:py-3 lg:px-[60px]">
            <div className="hidden space-x-4 justify-evenly lg:flex">
                {category.data?.data.map((item) => <Link key={nanoid()} href={`/${encodeURIComponent(item.name.toLowerCase())}?catId=${item.id}`} className="text-[12px] hover:underline">{item.name} </Link>)}
            </div>
            <div className="flex items-center space-x-2 lg:hidden">
                <TopbarDrawer {...category.data ?? {} as CategoryInterface} />
                <Link href="/" passHref legacyBehavior>
                    <Image src={logo} alt='Katangwa Logo' width={120} height={120} />
                </Link>
            </div>

            {isClient && userLoggedIn(auth) ?
                <Button className="px-3 py-0" variant={'ghost'}>View Requests</Button>
                :
                <Link href="/signup" legacyBehavior passHref>
                    <Button className="px-3 py-0" variant={'ghost'}>Register</Button>
                </Link>
            }
        </div>
    )
}

export default Topbar;