// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBlRlkdGLKbGp3VoGLDEFf9VdZ5P-FbKSE",
    authDomain: "glam-your-kitchen.firebaseapp.com",
    projectId: "glam-your-kitchen",
    storageBucket: "glam-your-kitchen.firebasestorage.app",
    messagingSenderId: "951818646070",
    appId: "1:951818646070:web:7cdc7a565806376c7b1e97",
    measurementId: "G-TDK3GPZ2Y1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app) 
