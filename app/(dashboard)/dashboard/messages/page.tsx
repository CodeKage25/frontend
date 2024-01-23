import MessagePane from "@/components/messages/MessagePane";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Messaging | Buy on Katangwa',
    description: '...',
}

export interface SelectedChat {
    pos: number;
    chat: any
}

const Messages = () => {
    return <MessagePane />
}

export default Messages;