import { LocationReqInterface } from "@/lib/types/user/LocationReqInterface"
import { CheckLocationResInterface, LocationResInterface } from "@/lib/types/user/LocationResInterface"
import { UserPlanResInterface } from "@/lib/types/user/UserResInterface";
import { WalletResInterface } from "@/lib/types/user/WalletResInterface";
import { firestoreDb, getToken, storage } from "@/lib/utils";
import axios from "axios"
import { collection, doc, getCountFromServer, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { axiosInstance } from "../axiosInstance";
import { CategoryInterface } from "@/lib/types/category/CategoryInterface";
import { ProductInterface } from "@/lib/types/category/ProductInterface";
import { SellerResInterface } from "@/lib/types/user/SellerResInterface";

export const sendLocation = async (req: LocationReqInterface): Promise<LocationResInterface> => {

    const response = await axiosInstance.post('/api/send-location', { ...req }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const checkLocation = async (): Promise<CheckLocationResInterface> => {
    const response = await axiosInstance.get('/api/check-location-set', {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const checkUserExists = async (email: string): Promise<any> => {
    const response = await axiosInstance.post('/api/check-email', {
        email: email
    });
    return response.data;
}

// !!!!!!!!! HACK - MANUALLY SET TOKEN IN COOKIE AS I CAN'T SET CUSTOM COOKIES AFTER GOOGLE AUTH !!!!!!!!!!!!!!!!!
export const setToken = async (token: string): Promise<any> => {
    const response = await axios.post('/api/set-token', { token });
    return response.data;
}

export const getWallet = async (): Promise<WalletResInterface> => {
    const response = await axiosInstance.get('/api/get-wallet', {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const confirmTransaction = async (planId: number, amount: number, ref: string): Promise<any> => {
    const response = await axiosInstance.post('/api/confirm-transaction', {
        planId, amount, ref
    }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const getUserPlan = async (): Promise<UserPlanResInterface> => {
    const response = await axiosInstance.get('/api/user-plan', {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const getSellerProfile = async (id: string): Promise<SellerResInterface> => {
    const response = await axiosInstance.get(`/api/get-other-productservice?type=PRODUCT&id=${id}`);
    return response.data;
}

export const payWithCoin = async (amount: number, planId: number): Promise<any> => {
    const response = await axiosInstance.post('/api/pay-with-coin', { amount, planId }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const checkChatExists = async (
    chatId1: string, chatId2: string
) => {
    const refSender = doc(collection(firestoreDb,
        'UserChat', `katangwa_${chatId2}`, 'individual'), `katangwa_${chatId1}`);
    const refReceiver = doc(collection(firestoreDb,
        'UserChat', `katangwa_${chatId1}`, 'individual'), `katangwa_${chatId2}`);

    const refSenderSnap = await getDoc(refSender);
    const refReceiverSnap = await getDoc(refReceiver);

    return refSenderSnap.exists() && refReceiverSnap.exists();
}

export const initiateChat = async (
    chatId1: string,  // current user/sender id
    chatId2: string,  // receiver user id
    senderName: string,
    receiverName: string,
    senderAvatar: string,
    receiverAvatar: string,
    senderMobile: string,
    receiverMobile: string,
    senderToken: string,
    receiverToken: string
) => {
    const exists = await checkChatExists(chatId1, chatId2);
    if (exists) return;
    const newChatId1 = `katangwa_${chatId1}`;
    const newChatId2 = `katangwa_${chatId2}`;

    const refSender = doc(collection(firestoreDb,
        'UserChat', newChatId2, 'individual'), newChatId1);
    const refReceiver = doc(collection(firestoreDb,
        'UserChat', newChatId1, 'individual'), newChatId2);

    await setDoc(refSender, {
        chatid: newChatId1,
        read: false,
        idUser: chatId1,
        name: senderName,
        receiveruserId: newChatId1,
        block: false,
        userMobile: senderMobile,
        lastMessage: '',
        urlAvatar: senderAvatar,
        lastMessageTime: serverTimestamp(),
        fcmToken: senderToken
    });

    await setDoc(refReceiver, {
        chatid: newChatId1,
        read: false,
        idUser: chatId2,
        name: receiverName,
        receiveruserId: newChatId2,
        block: false,
        userMobile: receiverMobile,
        lastMessage: '',
        urlAvatar: receiverAvatar,
        lastMessageTime: serverTimestamp(),
        fcmToken: receiverToken
    });
}

export const getChatList = async (userId: string) => {
    const newUserId = `katangwa_${userId}`
    const chatListQuery = query(
        collection(firestoreDb,
            'UserChat', newUserId, 'individual'),
        orderBy('lastMessageTime', 'desc')
    );
    const chatListSnapshot = await getDocs(chatListQuery);
    return chatListSnapshot.docs.map((item) => item.data());
}

export const getChatMessages = async (chatId1: string,
    chatId2: string) => {
    const newChatId1 = `katangwa_${chatId1}`;
    const newChatId2 = `katangwa_${chatId2}`;
    return new Promise<any[]>((resolve, reject) => {
        const chatMsgQuery = query(
            collection(firestoreDb, 'chats', newChatId1, 'messages'),
            where('chatId', 'in', [`${newChatId1}-${newChatId2}`, `${newChatId2}-${newChatId1}`]),
            orderBy('createdAt', 'asc')
        );

        const chats: any[] = [];
        const unsubscribe = onSnapshot(chatMsgQuery, (querySnapshot) => {
            chats.length = 0; // Clear the existing chats array

            querySnapshot.forEach((item) => {
                chats.push(item.data());
            });

            resolve(chats); // Resolve the Promise with the updated chats array
        }, (error) => {
            reject(error); // Reject the Promise if an error occurs
        });
    });
}

export const sendMessage = async (name: string, msg?: string, file?: any,
    chatId1: string = '',
    chatId2: string = '',
    username: string = '') => {
    const msgImgRef = ref(storage, `image/${name}`);
    let newMsg: any;

    const newChatId1 = `katangwa_${chatId1}`;
    const newChatId2 = `katangwa_${chatId2}`;

    const refMsg1 = doc(collection(firestoreDb,
        'chats', newChatId1, 'messages'));
    const refMsg2 = doc(collection(firestoreDb,
        'chats', newChatId2, 'messages'));

    if (file) {
        uploadBytes(msgImgRef, file).then(() => {
            getDownloadURL(msgImgRef).then(async (url) => {
                newMsg = {
                    productImage: url,
                    message: msg?.trim() ?? '',
                    chatId: `${newChatId1}-${newChatId2}`,
                    idUser: chatId1,
                    urlAvatar: '',
                    username: username.trim(),
                    createdAt: serverTimestamp(),
                    read: false
                }
                await setDoc(refMsg1, newMsg);
                await setDoc(refMsg2, newMsg);
            });
        });
    } else {
        newMsg = {
            productImage: null,
            message: msg?.trim(),
            chatId: `${newChatId1}-${newChatId2}`,
            idUser: chatId1,
            urlAvatar: '',
            username: username.trim(),
            createdAt: serverTimestamp(),
            read: false
        }
        await setDoc(refMsg1, newMsg);
        await setDoc(refMsg2, newMsg);
    }

    const refSender = doc(firestoreDb, 'UserChat', newChatId1, 'individual', newChatId2);
    const refReceiver = doc(firestoreDb, 'UserChat', newChatId2, 'individual', newChatId1);

    let lastMsg;
    if (msg === null || file === true) {
        lastMsg = 'A file';
    } else if (msg || file === false) {
        lastMsg = msg;
    } else {
        lastMsg = msg;
    }

    await updateDoc(refSender, {
        chatid: `${newChatId1}`,
        lastMessageTime: serverTimestamp(),
        lastMessage: lastMsg,
        read: false
    });

    await updateDoc(refReceiver, {
        chatid: `${newChatId2}`,
        lastMessageTime: serverTimestamp(),
        lastMessage: lastMsg,
        read: false
    });
}

export const updateFcmToken = async (token: string): Promise<any> => {
    const response = await axiosInstance.post('/api/update-user-profile', { token }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const sendNotification = async (receiver: string, body: string): Promise<any> => {
    const response = await axios.post('https://fcm.googleapis.com/fcm/send',
        {
            to: receiver,
            notification: { title: 'Katangwa', body }
        },
        {
            headers: {
                Authorization: `key=${process.env.fcmToken}`
            }
        });

    return response.data;
}

export const getUnReadMessageCount = async (chatId: string): Promise<number> => {
    const chatMsgQuery = query(
        collection(firestoreDb, 'UserChat', `katangwa_${chatId}`, 'individual'),
        where('read', '==', false)
    );

    const unReadCount = await getCountFromServer(chatMsgQuery)
    return unReadCount.data().count;
}

export const updateReadStatus = async (
    chatId1: string = '',
    chatId2: string = '') => {

    const newChatId1 = `katangwa_${chatId1}`;
    const newChatId2 = `katangwa_${chatId2}`;

    const refSender = doc(firestoreDb, 'UserChat', newChatId1, 'individual', newChatId2);
    const refReceiver = doc(firestoreDb, 'UserChat', newChatId2, 'individual', newChatId1);

    await updateDoc(refSender, {
        read: true
    });

    await updateDoc(refReceiver, {
        read: true
    });
}