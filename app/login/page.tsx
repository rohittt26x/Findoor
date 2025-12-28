"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { signInWithGoogle, logout } from "@/app/lib/auth";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking login status...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
      <div className="w-full max-w-md border border-white/10 rounded-xl p-8 text-center">
        {!user ? (
          <>
            <h1 className="text-2xl font-bold mb-6">Login to FINDOOR</h1>
            <button
              onClick={signInWithGoogle}
              className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Continue with Google
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-2">You are logged in</h1>
            <p className="text-gray-400 mb-6">{user.email}</p>
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
