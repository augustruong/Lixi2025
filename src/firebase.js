import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDoztHFrGt_HVIg048HTqUv4MnsxzgjI-I",
    authDomain: "lixi2025-3c31d.firebaseapp.com",
    projectId: "lixi2025-3c31d",
    storageBucket: "lixi2025-3c31d.firebasestorage.app",
    messagingSenderId: "291523634435",
    appId: "1:291523634435:web:ab54d6234835e922c0b536",
    measurementId: "G-8V6LW5ZLPB"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 