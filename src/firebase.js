// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBIivQgtqUbQ41sAWKf7KZL9NyvwUUu3fw",
  authDomain: "quora-b74fc.firebaseapp.com",
  projectId: "quora-b74fc",
  storageBucket: "quora-b74fc.appspot.com",
  messagingSenderId: "566706266498",
  appId: "1:566706266498:web:bdc275410ebd66e6c26f9b",
  measurementId: "G-W4VQVSVBT7"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();

const provider = new GoogleAuthProvider();
const db = getFirestore(firebaseApp);


export { auth, provider };
export default db;
