"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

// ✅ Force account chooser (fixes popup-closed issue)
provider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error: any) {
    if (error.code !== "auth/popup-closed-by-user") {
      console.error("Google Login Error:", error);
      alert("Google login failed. Please try again.");
    }
  }
};

export const logout = async () => {
  await signOut(auth);
};
