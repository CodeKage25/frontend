'use client'

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Heart, Mail, Settings, Store, Wallet } from "lucide-react";
import { nanoid } from "nanoid";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContextProvider";

const PaneListItem = ({ title, icon, link, selected }: { title: string, icon: any, link: string, selected: boolean }) => {
    return <Link href={`/dashboard/${link}`} className={`${selected ? 'bg-primary rounded-lg py-4 hover:text-white' : ''} w-full flex justify-start space-x-3 text-white px-5 py-3 hover:text-primary`}>
        {icon}
        <p>{title}</p>
    </Link>
}

const LeftPane = () => {
    const { auth } = useContext(AuthContext);
    const pathname = usePathname();
    const urlArray = pathname.replace('/', '').split('/');
    const fullnameFallback = auth?.firstName?.at(0) + '' + auth?.lastName?.at(0)

    return (
        <section className="flex flex-col">
            <p className="text-base text-black font-medium">Account</p>
            <div className="relative rounded-xl border border-[#C4C4C4] p-4 mt-4">
                <div className="flex flex-col w-full bg-[#F9FFEB] py-6 justify-center items-center space-y-3">
                    <Avatar className="w-[70px] h-[70px]">
                        <AvatarImage src={auth?.avatar} />
                        <AvatarFallback>{fullnameFallback}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-base text-[#253B4B]">{auth?.firstName + ' ' + auth?.lastName}</p>
                </div>

                <div className="flex flex-col space-y-5 rounded-xl bg-[#101828] px-4 py-5 mt-6">
                    {
                        panelItems.map((item) => (
                            <PaneListItem
                                key={nanoid()}
                                title={item.title}
                                icon={item.icon}
                                link={item.link}
                                selected={item.title.toLowerCase() === (urlArray[1] ?? 'listings')} // when panel item is 'Listings' the root page in dashboard folder is navigated to, hence the no array element at index 1 so manually pass 'listings'
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default LeftPane;

const panelItems = [
    {
        title: "Listings",
        icon: <Store />,
        link: ''
    },
    // {
    //     title: "Wallet",
    //     icon: <Wallet />,
    //     link: 'wallet'
    // },
    {
        title: "Messages",
        icon: <Mail />,
        link: 'messages'
    },
    {
        title: "Likes",
        icon: <Heart />,
        link: 'likes'
    },
    {
        title: "Settings",
        icon: <Settings />,
        link: 'settings'
    },
]