// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "urbannest-8566e.firebaseapp.com",
  projectId: "urbannest-8566e",
  storageBucket: "urbannest-8566e.appspot.com",
  messagingSenderId: "1035465573282",
  appId: "1:1035465573282:web:104fa09b2d61ba8108a8fb",
  measurementId: "G-TD4V6GS3ZN",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
