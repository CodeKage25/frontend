'use client';

import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { Dispatch, FC, SetStateAction, useContext } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Separator } from "../ui/separator";
import { SelectedChat } from "@/app/(dashboard)/dashboard/messages/page";
import { nanoid } from "nanoid";
import parseISO from "date-fns/parseISO";
import formatDistance from "date-fns/formatDistance";
import { useMutation } from "@tanstack/react-query";
import { updateReadStatus } from "@/api/user/endpoints";
import { AuthContext } from "@/context/AuthContextProvider";

const MessageList = ({ selectedChat, setSelectedChat, chatList }:
    {
        selectedChat?: SelectedChat,
        setSelectedChat: Dispatch<SetStateAction<SelectedChat>>,
        chatList?: any[]
    }) => {
    const { auth } = useContext(AuthContext);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const toReceiverId = searchParams.get('id');

    const readStatusMutation = useMutation({
        mutationFn: ({ chatId1, chatId2 }:
            { chatId1: string, chatId2: string }) => updateReadStatus(chatId1, chatId2)
    });

    function onMessageItemClick(chatPos: number, chatItem: any) {
        setSelectedChat((prev) => ({ ...prev, pos: chatPos, chat: chatItem }))
        if (!pathname.includes('to')) {
            router.push(`/dashboard/messages?to=${chatItem.name}&id=${chatItem.idUser}&token=${chatItem.fcmToken}`);
        }
        console.log(chatItem)
        readStatusMutation.mutate({
            chatId1: auth?.id ?? '',
            chatId2: chatItem.idUser
        });
    }

    return (
        <div className={`${(selectedChat!!.pos >= 0) || (toReceiverId) ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'} w-full justify-start`}>
            <div className="relative flex items-center w-full mx-auto">
                <Input type={'text'} className="block border-0 py-6 pl-10 ring-[1px] ring-input rounded-lg w-full font-normal text-xs placeholder:text-xs bg-[#F0F0F1] md:text-sm"
                    placeholder={'Search conversation'} />
                <Button variant="ghost" size="icon" className="absolute pointer-events-none top-1/2 left-0 transform -translate-y-1/2 py-6 font-semibold px-2 rounded-tl-full rounded-bl-full">
                    <Search className='w-8 h-8 text-[#737373]' strokeWidth='1.2px' />
                </Button>
            </div>

            <div className="flex flex-col space-y-4 mt-3">
                {chatList?.map((item, index) => {
                    return (
                        <React.Fragment key={nanoid()}>
                            <MessageListItem
                                pos={index}
                                item={item}
                                selected={(selectedChat?.pos === index) || (item.idUser) === (toReceiverId?.toString() || '')}
                                onClick={onMessageItemClick}
                            />
                            {index < chatList.length - 1 && <Separator />}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    )
}

export default MessageList;

const MessageListItem: FC<MessageItemType> = (props) => {
    let lastMsgStr;
    if (props.item.lastMessageTime)
        lastMsgStr = parseISO(props.item.lastMessageTime?.toDate().toISOString());

    return (
        <div className={`${props.selected ? 'bg-[#F9FFEB] rounded-xl' : ''} flex p-2 justify-between items-center hover:cursor-pointer`} onClick={() => {
            props.onClick(props.pos, props.item);
        }}>
            <Avatar className="w-[50px] h-[50px]">
                <AvatarImage src={props.item.urlAvatar} />
                <AvatarFallback>{`${props.item.name.split(' ')[0][0]}${props.item.name.split(' ')[1][0]}`}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col ml-1 mr-auto">
                <p className="font-medium text-[12px] text-black">{`${props.item.name}`}</p>
                <p className="font-medium text-[10px] text-[#6A6A6A]">{`${props.item.lastMessage}`}</p>
            </div>

            {lastMsgStr && <p className="font-normal text-center text-[12px] text-[#6A6A6A]">{`${formatDistance(lastMsgStr, new Date())}`}</p>}
        </div>
    )
}

interface MessageItemType {
    pos: number;
    item: any;
    selected: boolean;
    onClick: (pos: number, item: any) => void;
};