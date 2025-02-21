// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBiy0wd6V8gTs0fWt69arU2I9ZXWPO30Bc',
  authDomain: 'soen341-dd46d.firebaseapp.com',
  projectId: 'soen341-dd46d',
  storageBucket: 'soen341-dd46d.firebasestorage.app',
  messagingSenderId: '951261275366 ',
  appId: '1:951261275366:web:499ceb58cd0902c3ce4727',
  measurementId: 'G-VYN6706G1B' 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;