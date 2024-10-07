import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASYshrJU3GzYNM5hw7LmcpCcKEXWsZRlE",
  authDomain: "reactnativefitnessfusion.firebaseapp.com",
  projectId: "reactnativefitnessfusion",
  storageBucket: "reactnativefitnessfusion.appspot.com",
  messagingSenderId: "188769641844",
  appId: "1:188769641844:web:ab941e762ea117b809f821",
  measurementId: "G-YXJRW41HFJ"
};
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_DB =  getFirestore(app);
export const FIREBASE_STORAGE = getStorage(app);

console.log("Firebase initialized:",app);