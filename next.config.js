/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL,
        DOMAIN: process.env.DOMAIN,
        FLUTTERWAVE_KEY: process.env.FLUTTERWAVE_KEY,
        apiKey: process.env.NEXT_APP_FIREBASE_APIKEY,
        authDomain: process.env.NEXT_APP_FIREBASE_AUTHDOMAIN,
        databaseURL: process.env.NEXT_APP_FIREBASE_DATABASE_URL,
        projectID: process.env.NEXT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderID: process.env.NEXT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appID: process.env.NEXT_APP_FIREBASE_APP_ID,
        measurementID: process.env.NEXT_APP_FIREBASE_MEASUREMENT_ID,
        vapidKey: process.env.VAPID_KEY,
        fcmToken: process.env.FCM_TOKEN
    },
    images: {
        domains: ['firebasestorage.googleapis.com', 'res.cloudinary.com']
    }
}

module.exports = nextConfig
