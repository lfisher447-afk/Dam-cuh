'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

export function useHorizontalScroll(depKey?: any) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScroll()

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      el.scrollTo({
        left: el.scrollLeft + e.deltaY * 2,
        behavior: 'smooth',
      })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll, depKey])

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = direction === 'left' ? -el.clientWidth * 0.75 : el.clientWidth * 0.75
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }, [])

  const res = Object.assign(scrollRef, {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
  })

  return res
}
