'use client'
/* Cinema Index component: a quiet lazy-loading bridge for DAM’s editorial media rails. */
import * as React from 'react'
import { useState, useEffect } from 'react'
import Carousel from './MediaRail'

interface LazyCarouselProps {
  title: string
  fetcher?: () => Promise<any>
  items?: any[]
  type?: 'movie' | 'tv'
  className?: string
}

export default function LazyCarousel({
  title,
  fetcher,
  items: initialItems,
  type = 'movie',
  className = '',
}: LazyCarouselProps) {
  const [items, setItems] = useState<any[]>(initialItems ?? [])
  const [loading, setLoading] = useState(!initialItems || initialItems.length === 0)

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems)
      setLoading(false)
      return
    }
    if (!fetcher) return
    let active = true
    async function load() {
      try {
        const res = await fetcher()
        if (active && res) {
          const results = res.results ?? (Array.isArray(res) ? res : [])
          setItems(results)
        }
      } catch (err) {
        // fail gracefully
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [fetcher, initialItems])

  if (loading) {
    return (
      <div className={`space-y-4 my-8 px-4 md:px-8 ${className}`}>
        <div className="h-6 w-48 bg-zinc-800/60 rounded animate-pulse" />
        <div className="flex gap-4 overflow-hidden py-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-none w-[150px] sm:w-[180px] md:w-[210px] aspect-[2/3] rounded-xl bg-zinc-900/60 border border-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) return null

  return <Carousel title={title} items={items} type={type} className={className} />
}
