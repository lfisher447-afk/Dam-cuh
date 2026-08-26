"use client";

import Link from "next/link";

interface Rec {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
}

export default function MovieRecsGrid({ recs = [] }: { recs: Rec[] }) {
  if (!recs.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {recs.slice(0, 12).map((item) => (
        <Link
          key={item.id}
          href={`/movie/${item.id}`}
          className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-900 border border-white/10 transition-transform duration-200 hover:scale-105"
        >
          {item.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
              alt={item.title || item.name || ""}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-neutral-500">
              {item.title || item.name}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
            <span className="text-xs font-semibold text-white line-clamp-2">
              {item.title || item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
