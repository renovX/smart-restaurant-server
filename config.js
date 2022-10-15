import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyCn17nwWOohP22NKCOu6Qse5mZ0_FYpbR0",
    authDomain: "projectx-db0e5.firebaseapp.com",
    projectId: "projectx-db0e5",
    storageBucket: "projectx-db0e5.appspot.com",
    messagingSenderId: "253664950199",
    appId: "1:253664950199:web:9f545283f67d2c11f2da32",
    measurementId: "G-PG707M5YV3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db