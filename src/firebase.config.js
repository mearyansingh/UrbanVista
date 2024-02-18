/**Firebase configuration file */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDvUfXEKsVqsE1Da_KMHZ3II_J1P9hEJXA",
	authDomain: "house-marketplace-app-6d0ec.firebaseapp.com",
	projectId: "house-marketplace-app-6d0ec",
	storageBucket: "house-marketplace-app-6d0ec.appspot.com",
	messagingSenderId: "235612931124",
	appId: "1:235612931124:web:45d15dfd95c9630d71b661"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);

// Initialize Authentication service
// const auth = getAuth(app);
export const db = getFirestore();
// export { db, auth }