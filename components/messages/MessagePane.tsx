'use client';

import MessageBox from "@/components/messages/MessageBox";
import MessageList from "@/components/messages/MessageList";
import { AuthContext } from "@/context/AuthContextProvider";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import noMessage from '@/public/no_message.png';
import Image from "next/image";
import { firestoreDb } from "@/lib/utils";
import { SelectedChat } from "@/app/(dashboard)/dashboard/messages/page";

const MessagePane = () => {
    const { auth } = useContext(AuthContext);
    const searchParams = useSearchParams();
    const toReceiver = searchParams.get('to');
    const toReceiverId = searchParams.get('id');

    const [chatList, setChatList] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<SelectedChat>({
        pos: -1,
        chat: null,
    });

    const newUserId = `katangwa_${auth?.id}`
    const chatListQuery = query(
        collection(firestoreDb,
            'UserChat', newUserId, 'individual'),
        orderBy('lastMessageTime', 'desc')
    );

    useEffect(() => {
        const unsubscribe = onSnapshot(chatListQuery, (querySnapshot) => {
            let chatArr: any[] = [];

            querySnapshot.forEach((item) => {
                chatArr.push(item.data());
                if (toReceiver) {
                    (Number(item.data().idUser) === Number(toReceiverId))
                        ? setSelectedChat(prev => ({ ...prev, chat: item.data() })) : null;
                }
            });
            setChatList(chatArr);
        });

        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        // reset pos and current chat if receiver query is not in url
        if (!Array.from(searchParams.keys()).includes("to")) {
            setSelectedChat({
                pos: -1,
                chat: null,
            });
        }
    }, [searchParams]);

    if (chatList?.length <= 0) {
        return (
            <div className="flex flex-col h-full">
                <p className="font-medium">Messages</p>
                <div className="flex flex-col justify-center h-full p-8 items-center rounded-xl border-[0.5px] border-[#C4C4C4] mt-4">
                    <Image src={noMessage} width={200} height={200} alt={'You are yet to start a conversation'} />
                    <p className="font-medium text-[#737373]">You are yet to start a conversation</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <p className="hidden font-medium lg:block">Messages</p>
            <div className="h-full grid grid-cols-1 gap-x-4 border-0 rounded-xl px-2 lg:grid-cols-[1.5fr_3fr] lg:mt-4 lg:p-8 lg:border-[0.5px] lg:border-[#C4C4C4]">
                <MessageList
                    chatList={chatList}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />
                <MessageBox
                    selectedChat={selectedChat}
                />
            </div>
        </div>
    );
}

export default MessagePane;