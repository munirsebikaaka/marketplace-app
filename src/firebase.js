// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTJHWBADpQVDsiO3HF1Ws_lzXIbvH92O4",
  authDomain: "market-place-fd898.firebaseapp.com",
  projectId: "market-place-fd898",
  storageBucket: "market-place-fd898.firebasestorage.app",
  messagingSenderId: "610421784820",
  appId: "1:610421784820:web:98efc2ef9b52d3c27c5ea1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
