import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAzCb75UNqTM1V0RJUAOCP4-SkGsAwQtuU",
  authDomain: "kiritosdown.firebaseapp.com",
  projectId: "kiritosdown",
  storageBucket: "kiritosdown.firebasestorage.app",
  messagingSenderId: "991668522994",
  appId: "1:991668522994:web:dae5ba36af5bd0319c256b",
  measurementId: "G-1QGR56GJYE"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
