import { SelectedChat } from "@/app/(dashboard)/dashboard/messages/page";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import ChatBubble from "./ChatBubble";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContextProvider";
import { nanoid } from "nanoid";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Image, Send, XCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { sendMessage, sendNotification } from "@/api/user/endpoints";
import { useSearchParams } from "next/navigation";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firestoreDb } from "@/lib/utils";

interface Message {
    filename: string;
    msg: string;
    file: any;
    chatId1: string;
    chatId2: string;
    username: string;
}

const MessageBox = ({ selectedChat }: {
    selectedChat?: SelectedChat
}) => {
    const searchParams = useSearchParams();
    const toReceiverId = searchParams.get('id');
    const receiverToken = searchParams.get('token');

    const { auth } = useContext(AuthContext);

    const lastMsgRef = useRef<HTMLDivElement>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const [msg, setMsg] = useState({
        msgText: '',
        msgImg: []
    });
    const [imageData, setImageData] = useState<any>(null);
    const [chatMsg, setChatMsg] = useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            //   setMsgImg(prev => ({[e.target.files[0]]}));
            // @ts-ignore
            setMsg(prev => ({ ...prev, msgImg: [e.target.files[0]] }));
        }
    }

    useEffect(() => {
        lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [chatMsg.length]);

    useEffect(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target?.result;
            setImageData(imageData);
        }
        if (msg.msgImg.length > 0) reader.readAsDataURL(msg.msgImg[0]);
    }, [msg.msgImg]);

    const notifyMutate = useMutation({
        mutationFn: ({ receiver, message }: { receiver: string, message: string }) =>
            sendNotification(receiver, message)
    })

    const sendMutate = useMutation<any, AxiosError, Message>({
        mutationFn: async ({ filename, msg, file, chatId1, chatId2, username }: Message) =>
            sendMessage(filename, msg, file, chatId1, chatId2, username),
        onSuccess(data, variables, context) {
            notifyMutate.mutate({
                message: variables.msg,
                receiver: receiverToken ?? ''
            })
        },
    });

    const chatId1 = `katangwa_${auth?.id}`;
    const chatId2 = `katangwa_${toReceiverId}`;
    const chatMsgQuery = query(
        collection(firestoreDb, 'chats', chatId1, 'messages'),
        where('chatId', 'in', [`${chatId1}-${chatId2}`, `${chatId2}-${chatId1}`]),
        orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(chatMsgQuery, (querySnapshot) => {
        let chatArr: any[] = [];

        querySnapshot.forEach((item) => {
            chatArr.push(item.data());
        });
        setChatMsg(chatArr);
    });

    if (((selectedChat!!.pos) <= -1) && (!toReceiverId)) {  // using -1 as default index to denote that no item has been selected
        return (
            <div className={`${selectedChat!!.pos >= 0 ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'} w-full flex flex-col justify-center p-10 items-center border border-[#D4D4D4] rounded-xl`}>
                <p className="text-black font-semibold text-xl">Welcome to Katangwa chats!</p>
                <p className="text-gray-500 text-sm text-center">Quickly get in touch with Katangwa sellers and buyers without leaving the platform.</p>
            </div>
        )
    }

    return (
        <div className={`${(selectedChat!!.pos >= 0) || (toReceiverId) ? 'flex flex-col' : 'hidden'} relative w-full h-full border border-[#D4D4D4] rounded-xl justify-start min-h-[80vh] max-h-[80vh]`}>
            <div className="flex items-center px-6 py-3 space-x-3">
                <Avatar className="w-[50px] h-[50px]">
                    <AvatarImage src={selectedChat?.chat?.urlAvatar} />
                    <AvatarFallback>{`${selectedChat?.chat?.name?.split(' ')[0][0]}${selectedChat?.chat?.name?.split(' ')[1][0]}`}</AvatarFallback>
                </Avatar>

                <p className="font-medium text-[12px] text-black">{`${selectedChat?.chat?.name}`}</p>
            </div>
            <Separator className="bg-[#D4D4D4]" />

            <div className="w-full flex flex-col overflow-y-scroll p-2 pb-4 no-scrollbar">
                {
                    chatMsg.map((item, index) => (
                        <div ref={(index === chatMsg?.length - 1) ? lastMsgRef : null} key={nanoid()}>
                            <ChatBubble userId={auth?.id || ''} chat={item} />
                        </div>
                    ))
                }
            </div>

            <Input ref={inputFileRef} className="hidden" type="file" accept="image/png, image/jpeg" onChange={handleChange} />

            <div className="absolute self-end bottom-0 w-full flex flex-col space-y-2 items-center px-4 py-3 border-t-[0.5px] border-t-[#D4D4D4] bg-[#F9F9F9] rounded-b-xl">
                {
                    imageData && (
                        <div className="relative">
                            <img src={imageData} width={"100px"} height={"100px"} alt="" />
                            <XCircle onClick={() => {
                                setImageData(null);
                                setMsg(prev => ({ ...prev, msgImg: [] }));
                            }} className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white w-8 h-8 hover:cursor-pointer" strokeWidth={'2px'} />
                        </div>
                    )
                }
                <div className="flex w-full space-x-4 self-end">
                    <Input value={msg.msgText}
                        onKeyDown={e => {
                            if (e.code !== 'Enter') return;
                            if (msg.msgText.length < 0 && imageData === null) return;
                            setMsg({ msgImg: [], msgText: '' });
                            setImageData(null);

                            sendMutate.mutate({
                                filename: msg.msgImg.length > 0 ? (msg.msgImg[0] as any).name : '',
                                msg: msg.msgText,
                                file: msg.msgImg.length > 0 ? msg.msgImg[0] : null,
                                chatId1: auth?.id || '',
                                chatId2: toReceiverId || '',
                                username: `${auth?.firstName} ${auth?.lastName}`
                            })
                        }}
                        onChange={e => setMsg(prev => ({ ...prev, msgText: e.target.value }))} placeholder="Type message..." className="border-[1px] border-[#C4C4C4] px-[10px] py-[12px] rounded-md placeholder:text-sm focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:outline-none"
                    />
                    <Button variant="ghost" size="icon" onClick={() => inputFileRef.current?.click()}><Image className="text-primary w-6 h-6" strokeWidth="1.5px" /></Button>
                    <Button size="sm" className="text-white rounded-md"
                        disabled={(msg.msgText.length <= 0) && (msg.msgImg.length <= 0)}
                        onClick={() => {
                            if (msg.msgText.length < 0 && imageData === null) return;
                            setMsg({ msgImg: [], msgText: '' });
                            setImageData(null);

                            sendMutate.mutate({
                                filename: msg.msgImg.length > 0 ? (msg.msgImg[0] as any).name : '',
                                msg: msg.msgText,
                                file: msg.msgImg.length > 0 ? msg.msgImg[0] : null,
                                chatId1: auth?.id || '',
                                chatId2: toReceiverId || '',
                                username: `${auth?.firstName} ${auth?.lastName}`
                            })
                        }}>
                        Send <Send className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default MessageBox;