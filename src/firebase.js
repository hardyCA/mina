// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBN0TczbQq68aeL5i-WSxHG7WZwxdZFkxI",
    authDomain: "cotizacion-app.firebaseapp.com",
    projectId: "cotizacion-app",
    storageBucket: "cotizacion-app.appspot.com",
    messagingSenderId: "398778154765",
    appId: "1:398778154765:web:34e4e01a125aa18ec1fa44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db