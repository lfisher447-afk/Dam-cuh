"use client";

import Link from "next/link";

interface Cast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

export default function MovieCastGrid({ cast = [] }: { cast: Cast[] }) {
  if (!cast.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {cast.slice(0, 12).map((c) => (
        <Link
          key={c.id}
          href={`/person/${c.id}`}
          className="group flex flex-col items-center p-3 rounded-lg bg-neutral-900/50 border border-white/5 hover:bg-neutral-800/80 transition-colors"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-neutral-800 mb-2">
            {c.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                alt={c.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-500">
                {c.name[0]}
              </div>
            )}
          </div>
          <p className="text-xs font-semibold text-white text-center line-clamp-1">{c.name}</p>
          {c.character && (
            <p className="text-[10px] text-neutral-400 text-center line-clamp-1">{c.character}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
