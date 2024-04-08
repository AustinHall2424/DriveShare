// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATI3W2LfVpMR5lk0YRJn9vTVCxUrYg6aA",
  authDomain: "cis476termproject.firebaseapp.com",
  projectId: "cis476termproject",
  storageBucket: "cis476termproject.appspot.com",
  messagingSenderId: "146134621213",
  appId: "1:146134621213:web:105ea8f52d464ffa4efaf4",
  measurementId: "G-3PD9NXWKJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);