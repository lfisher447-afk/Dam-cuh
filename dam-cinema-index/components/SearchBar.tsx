"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react"

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="mt-6 flex justify-center">
      <div className="relative w-full max-w-2xl">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={20}
        />

        <input 
          type="text"
          placeholder="Search for a movie"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            w-full
            rounded-xl
            border
            border-gray-700
            bg-[#161B22]
            pl-12
            pr-5
            py-4
            text-white
            placeholder:text-gray-500
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/40"
         />
      </div>
    </div>
  );
}
