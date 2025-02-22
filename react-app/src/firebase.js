
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: 'AIzaSyBiy0wd6V8gTs0fWt69arU2I9ZXWPO30Bc',
  authDomain: 'soen341-dd46d.firebaseapp.com',
  projectId: 'soen341-dd46d',
  storageBucket: 'soen341-dd46d.firebasestorage.app',
  messagingSenderId: '951261275366 ',
  appId: '1:951261275366:web:499ceb58cd0902c3ce4727',
  measurementId: 'G-VYN6706G1B' 
};


const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);


export const db = getFirestore(app);

export default app;