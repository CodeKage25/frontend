// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {

    apiKey: 'AIzaSyCvYsEvszWJB4lpM34xmidg-taCenyQrPc',

    authDomain: 'project-1-5b15a.firebaseapp.com',

    databaseURL: 'https://project-1-5b15a.firebaseio.com',

    projectId: 'project-1-5b15a',

    storageBucket: 'project-1-5b15a.appspot.com',

    messagingSenderId: '314538261340',

    appId: '1:314538261340:web:b395506e854fa73096df99'
}

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message ", payload);

    const notification = payload.data;
    const notificationOptions = {
        ...notification
    };

    self.registration.showNotification(notification.title, notificationOptions);
});