import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken as getFirebaseToken, onMessage } from 'firebase/messaging';
import { updateFcmToken } from "@/api/user/endpoints";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MAX_AGE = 60 * 60 * 24 * 365;

export const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3600000 // 1 hr before data goes stale
    },
  },
};

export const userLoggedIn = (user: any) => {
  return Object.keys(user ?? {}).length > 0;
}

export const getToken = () => {
  if (typeof window === "undefined") return;
  const user = localStorage.getItem('katangwa-user') || '{}';
  return JSON.parse(user).token;
}

export const currencyFormatter = (price: number) => {
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return `₦${numberFormat.format(price)}`;
}

export const flutterWaveConfig = (name: string, email: string, amount: number) => {
  const config = {
    public_key: process.env.FLUTTERWAVE_KEY || '',
    tx_ref: Date.now().toLocaleString(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      phone_number: "",
      name: name,
    },
    customizations: {
      title: 'Katangwa coin purchase',
      description: 'Payment for Katangwa Premium Plan',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  }

  return config;
}

export const firebaseConfig = {

  apiKey: process.env.apiKey,

  authDomain: process.env.authDomain,

  databaseURL: process.env.databaseURL,

  projectId: process.env.projectID,

  storageBucket: process.env.storageBucket,

  messagingSenderId: process.env.messagingSenderID,

  appId: process.env.appID
}

export const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;
// console.log(auth)
export const requestPermission = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      // @ts-ignore
      return getFirebaseToken(messaging, { vapidKey: process.env.vapidKey })
        .then((currentToken) => {
          if (currentToken) {
            try {
              if (localStorage.getItem('fcmtoken') === null) {
                updateFcmToken(currentToken);
                localStorage.setItem('fcmtoken', currentToken);
              }
            } catch (e) {
              let axiosError = e as AxiosError;
              console.log(axiosError.message);
            }
          } else {
            console.log('Failed to generate the app registration token.');
          }
        })
        .catch((err) => {
          console.log('An error occurred when requesting to receive the token.', err);
        });
    } else {
      console.log("User Permission Denied.");
    }
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    // @ts-ignore
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });