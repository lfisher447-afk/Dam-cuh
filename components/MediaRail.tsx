'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react'
import { getPosterImageURL } from '@/lib/utils'

interface CarouselProps {
  title?: string
  items?: any[]
  type?: 'movie' | 'tv'
  className?: string
  priority?: boolean
}

export default function Carousel({
  title,
  items = [],
  type = 'movie',
  className = '',
}: CarouselProps) {
  const rowRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75
      rowRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (!items || items.length === 0) return null

  return (
    <div className={`space-y-4 my-8 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 md:px-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-heading">
            {title}
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={rowRef}
        className="flex items-center gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 py-2 scroll-smooth"
      >
        {items.map((item) => {
          const itemType = item.media_type ?? type
          const href = itemType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`
          const itemTitle = item.title ?? item.name ?? 'Untitled'
          const poster = getPosterImageURL(item.poster_path, 'w342')
          const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : null

          return (
            <Link
              key={`${item.id}-${itemTitle}`}
              href={href}
              className="group relative flex-none w-[150px] sm:w-[180px] md:w-[210px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-300 hover:scale-[1.03] hover:border-white/20 hover:shadow-xl hover:shadow-black/50"
            >
              <div className="aspect-[2/3] relative w-full overflow-hidden bg-zinc-950">
                <Image
                  src={poster}
                  alt={itemTitle}
                  fill
                  sizes="(max-width: 768px) 150px, 210px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transform scale-75 group-hover:scale-100 transition-transform duration-200">
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </div>
                </div>

                {rating && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{rating}</span>
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate group-hover:text-red-400 transition-colors">
                  {itemTitle}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {(item.release_date ?? item.first_air_date ?? '').slice(0, 4) || 'Featured'}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
