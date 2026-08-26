"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // this function is the listner which keeps track of the authentication state ie logged-in or logged-out
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe(); // when we dont need the nav bar component , end the listerner that is listeing for the change user like logged in or out , to avoid uncessary memory consumption
    };
  }, []);

  return (
    <header className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Lumora Logo" width={40} height={40} />
          <span className="text-2xl font-bold tracking-wide">Lumora</span>
        </Link>
        {/* Right Side */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white transition">
            Search
          </Link>

          <a
            href="https://github.com/AradhyaS2005/Lumora-Search"
            target="_blank"
            rel="noopener noreferrer" // Security best practice to prevent the new page from accessing the window.opener property
            className="text-gray-300 hover:text-white transition"
          >
            GitHub
          </a>

          {user ? (
            <>
              <span className="text-gray-300 text-sm">{user.email}</span>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="text-gray-300 hover:text-white transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
