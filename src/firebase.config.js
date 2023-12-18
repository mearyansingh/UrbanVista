import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBorXW3fwT3o4Vd3yhwbzfS7PeJpJZ9dyk",
  authDomain: "house-marketplace-app-8effe.firebaseapp.com",
  projectId: "house-marketplace-app-8effe",
  storageBucket: "house-marketplace-app-8effe.appspot.com",
  messagingSenderId: "467615069616",
  appId: "1:467615069616:web:65187f9fd441453a395275",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
