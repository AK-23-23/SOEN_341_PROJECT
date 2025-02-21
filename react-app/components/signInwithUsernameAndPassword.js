import {collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import {signInWithEmailAndPassword } from 'firebase/auth';

export async function signInWithUsernameAndPassword(username, password) {
  // Query the "users" collection for a document that matches the provided username
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No user found with that username.");
  }

  // Assuming usernames are unique, take the first matching document
  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();
  const email = userData.email;

  // Use the corresponding email and provided password to sign in
  return await signInWithEmailAndPassword(auth, email, password);
}