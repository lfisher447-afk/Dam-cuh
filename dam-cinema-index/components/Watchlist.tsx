'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Play, Bookmark, Film, Tv, Star } from 'lucide-react'
import { getPosterImageURL } from '@/lib/utils'

interface WatchlistItem {
  id: number
  type: 'movie' | 'tv'
  title: string
  poster_path?: string | null
  vote_average?: number
  addedAt?: string
}

const WATCHLIST_KEY = 'cinestream_watchlist'

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY)
      if (raw) {
        setItems(JSON.parse(raw))
      }
    } catch {
      // storage unavailable
    }
  }, [])

  const removeItem = (id: number, type: string) => {
    const updated = items.filter((item) => !(item.id === id && item.type === type))
    setItems(updated)
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated))
    } catch {}
  }

  const clearAll = () => {
    setItems([])
    try {
      localStorage.removeItem(WATCHLIST_KEY)
    } catch {}
  }

  if (!mounted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-16 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-heading">Your Watchlist is Empty</h3>
        <p className="text-sm text-zinc-400 mt-2 mb-6">
          Bookmark movies and TV series while exploring to build your personal streaming queue.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/movie"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-600/30"
          >
            Explore Movies
          </Link>
          <Link
            href="/tv"
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
          >
            Explore TV Series
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          You have <span className="font-semibold text-white">{items.length}</span> saved title{items.length === 1 ? '' : 's'}
        </p>
        <button
          onClick={clearAll}
          className="text-xs text-red-400 hover:text-red-300 font-medium transition flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item) => {
          const href = item.type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`
          const poster = getPosterImageURL(item.poster_path, 'w342')

          return (
            <div
              key={`${item.type}-${item.id}`}
              className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 flex flex-col"
            >
              <div className="aspect-[2/3] relative w-full overflow-hidden bg-zinc-950">
                <Image
                  src={poster}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 160px, 240px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                  {item.type === 'tv' ? (
                    <Tv className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Film className="w-3 h-3 text-red-400" />
                  )}
                  <span>{item.type}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeItem(item.id, item.type)
                  }}
                  title="Remove from Watchlist"
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-black/90 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <Link
                  href={href}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </Link>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <Link href={href}>
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h4>
                </Link>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                  <Link
                    href={href}
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    Watch Now
                  </Link>
                  {item.vote_average && (
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {Number(item.vote_average).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
