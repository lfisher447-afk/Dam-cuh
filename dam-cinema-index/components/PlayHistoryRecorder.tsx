'use client'

import { useEffect } from 'react'
import { recordTaste } from '@/lib/taste'

interface HistoryItem {
  id: number | string
  type: 'movie' | 'tv' | string
  title: string
  poster_path?: string | null
  backdrop_path?: string | null
  genre_ids?: number[]
  date?: string | null
  vote_average?: number | null
  season?: number
  episode?: number
  [key: string]: any
}

interface PlayHistoryRecorderProps {
  id?: number | string
  type?: 'movie' | 'tv' | string
  title?: string
  poster_path?: string | null
  backdrop_path?: string | null
  genre_ids?: number[]
  item?: HistoryItem
}

export default function PlayHistoryRecorder(props: PlayHistoryRecorderProps) {
  const rawItem = props.item || {
    id: props.id!,
    type: props.type!,
    title: props.title!,
    poster_path: props.poster_path,
    backdrop_path: props.backdrop_path,
    genre_ids: props.genre_ids,
  }

  const { id, type, title, poster_path, backdrop_path, genre_ids } = rawItem
  useEffect(() => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id
    if (!numId || isNaN(numId)) return

    recordTaste(
      {
        id: numId,
        media_type: (type === 'tv' ? 'tv' : 'movie'),
        title,
        poster_path,
        backdrop_path,
        genre_ids,
      },
      5 // High signal for playing video
    )

    // Also record in local watch history list
    try {
      const HISTORY_KEY = 'cinestream_watch_history'
      const raw = localStorage.getItem(HISTORY_KEY)
      const list = raw ? JSON.parse(raw) : []
      const updated = [
        {
          id: numId,
          type,
          title,
          poster_path,
          backdrop_path,
          watchedAt: new Date().toISOString(),
        },
        ...list.filter((item: any) => item.id !== numId || item.type !== type),
      ].slice(0, 50)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    } catch {
      // ignore storage errors
    }
  }, [id, type, title, poster_path, backdrop_path, genre_ids])

  return null
}
