'use client'

import * as React from 'react'
import { useState } from 'react'
import { Maximize2, Minimize2, RefreshCw, Film, Tv, AlertCircle } from 'lucide-react'
import { useStreamSource } from '@/hooks/use-stream-source'
import { SourceSwitcher } from '@/components/player/source-switcher'
import { movieStreamUrl, seriesStreamUrl } from '@/config/sources'
import { cn } from '@/lib/utils'

interface PlayerProps {
  id?: number | string
  tmdbId?: number | string
  type: 'movie' | 'tv'
  season?: number
  episode?: number
  title?: string
  className?: string
}

export default function Player({
  id,
  tmdbId,
  type,
  season = 1,
  episode = 1,
  title,
  className,
}: PlayerProps) {
  const rawId = id ?? tmdbId ?? 0
  const numericId = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId
  const mediaKey = type === 'movie' ? `movie:${numericId}` : `tv:${numericId}:${season}:${episode}`
  const control = useStreamSource(mediaKey)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [hasError, setHasError] = useState(false)

  const streamUrl =
    type === 'movie'
      ? movieStreamUrl(control.source, numericId)
      : seriesStreamUrl(control.source, numericId, { season, episode })

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1)
    setHasError(false)
  }

  const toggleFullscreen = () => {
    const container = document.getElementById('cinema-player-container')
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  return (
    <div
      id="cinema-player-container"
      className={cn(
        'relative w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl transition-all duration-300 flex flex-col',
        className
      )}
    >
      {/* Video Viewport */}
      <div className="relative w-full aspect-video bg-zinc-950 flex items-center justify-center">
        {hasError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
            <AlertCircle className="w-10 h-10 text-amber-500 animate-bounce" />
            <p className="text-sm font-semibold text-zinc-200">Playback issue with current server</p>
            <p className="text-xs text-zinc-400 max-w-md">
              Please switch to another server using the buttons below or retry.
            </p>
            <button
              onClick={() => {
                control.advance()
                reloadIframe()
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition"
            >
              Switch to Next Server
            </button>
          </div>
        ) : (
          <iframe
            key={`${streamUrl}-${iframeKey}`}
            src={streamUrl}
            title={title ?? 'Stream Player'}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        )}
      </div>

      {/* Control Bar & Source Switcher */}
      <div className="p-3 sm:p-4 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400 text-xs truncate max-w-full">
          {type === 'movie' ? (
            <Film className="w-4 h-4 text-red-500 shrink-0" />
          ) : (
            <Tv className="w-4 h-4 text-blue-500 shrink-0" />
          )}
          <span className="font-semibold text-zinc-200 truncate">
            {title ? title : type === 'movie' ? 'Movie Playback' : `Season ${season}, Episode ${episode}`}
          </span>
        </div>

        {/* Source Switcher */}
        <SourceSwitcher control={control} loaded={true} className="py-0" />

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={reloadIframe}
            title="Reload Video Frame"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
