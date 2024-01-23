'use client';

import { onMessageListener, requestPermission } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

function Notification() {
    const { toast } = useToast();
    const [notification, setNotification] = useState({ title: '', body: '' });
    useEffect(() => {
        // requestPermission();
        const unsubscribe = onMessageListener().then((payload: any) => {
            setNotification({
                title: payload?.notification?.title,
                body: payload?.notification?.body,
            });
            toast({
                title: payload?.notification?.title,
                description: payload?.notification?.body,
            })
        });
        return () => {
            unsubscribe.catch((err) => console.log('failed: ', err));
        };
    }, []);
    return null;
}
export default Notification;