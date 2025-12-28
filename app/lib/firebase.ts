import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-nbJ5qxpiIXUNlZjT6Zs1ezJtVpZs1Hk",
  authDomain: "findoor-b7e02.firebaseapp.com",
  databaseURL: "https://findoor-b7e02-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "findoor-b7e02",
  storageBucket: "findoor-b7e02.firebasestorage.app",
  messagingSenderId: "372602619690",
  appId: "1:372602619690:web:b814a5cc8e85cdf604c053",
};

// ✅ prevent re-init
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
