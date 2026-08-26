import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useUser() {
  const [user, setUser] = useState<object | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsPending(false);
    });
    return unsubscribe;
  }, []);

  return { isPending, isAuthenticated: !!user };
}
