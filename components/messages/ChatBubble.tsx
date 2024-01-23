import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { Check, CheckCheck, Clock3, Loader2 } from "lucide-react";
import Image from "next/image";

const ChatBubble = ({ chat, userId }: { userId: string, chat: any }) => {
    let createdDateStr;
    if (chat.createdAt)
        createdDateStr = parseISO(chat.createdAt?.toDate().toISOString());

    const categorizeUrl = (s: string) => {
        if (s.includes('https://firebasestorage.googleapis.com')) {
            var pos = s.lastIndexOf('.');
            const result = s.substring(pos + 1, s.length).toString().toLowerCase();
            if (result.includes('jpg') ||
                result.includes('jpeg') ||
                result.includes('png') ||
                result.includes('gif')) {
                return 'image';
            } else if (result.includes('pdf') ||
                result.includes('doc') ||
                result.includes('docx') ||
                result.includes('xls') ||
                result.includes('xlsx') ||
                result.includes('ods') ||
                result.includes('txt') ||
                result.includes('csv') ||
                result.includes('html')) {
                return 'doc';
            } else if (result.includes('wav') || result.includes('mp3')) {
                return 'audio';
            }
        } else {
            return 'link';
        }
    }

    const isMessageImage = categorizeUrl(chat.message);
    return (
        <div className={`flex flex-col max-w-[50%] my-1 ${chat.chatId.startsWith(`katangwa_${userId}`) ? 'ml-auto' : 'mr-auto'}`}>
            <div className={`flex flex-col p-2 rounded-tl-lg rounded-tr-lg ${chat.chatId.startsWith(`katangwa_${userId}`) ? 'rounded-bl-lg rounded-br-none' : 'rounded-bl-none rounded-br-lg'}
            ${chat.chatId.startsWith(`katangwa_${userId}`) ? 'bg-[#70A300]' : 'bg-gray-100'} ${chat.chatId.startsWith(`katangwa_${userId}`) ? 'text-white' : 'text-[#253B4B]'}`}>
                {(chat.productImage || isMessageImage === 'image') &&
                    <Image src={(isMessageImage === 'image') ? chat.message : chat.productImage} alt={''} width={0} height={0} sizes="100vw" style={{ width: '100%', height: '50%' }} />
                }
                {(isMessageImage !== 'image') &&
                    <p className='text-sm'>
                        {
                            `${chat.message}`
                        }
                    </p>
                }
            </div>
            {createdDateStr ?
                <div className="flex space-x-1">
                    <Check className="self-start text-primary w-4 h-4" />
                    <p className='font-normal text-xs text-gray-500'>
                        {`${format(createdDateStr, 'HH:mm')}`}
                    </p>
                </div> : <Clock3 className="text-gray-400 h-3.5 w-3.5 mt-[1px]" />
            }
        </div>
    );
}

export default ChatBubble;