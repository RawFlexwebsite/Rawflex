'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

type ProductGalleryProps = {
  images: string[]
  productName: string
  badge?: string
}

type Point = {
  x: number
  y: number
}

function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null
  event.currentTarget.src = '/image.png'
}

export default function ProductGallery({ images, productName, badge }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center',
    transform: 'scale(1)'
  })
  const [isZooming, setIsZooming] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [lightboxPan, setLightboxPan] = useState<Point>({ x: 0, y: 0 })
  const pointerStartX = useRef<number | null>(null)
  const pointerDeltaX = useRef(0)
  const didDrag = useRef(false)
  const lightboxPointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStartDistance = useRef<number | null>(null)
  const pinchStartZoom = useRef(1)
  const pinchStartPan = useRef<Point>({ x: 0, y: 0 })
  const pinchStartFocal = useRef<Point | null>(null)
  const singlePointerStart = useRef<Point | null>(null)
  const singlePointerStartPan = useRef<Point>({ x: 0, y: 0 })
  const didLightboxMove = useRef(false)
  const lastTapAt = useRef(0)

  // Ensure we have at least one image to display
  const displayImages = images.length > 0 ? images : ['/image.png']
  const hasMultipleImages = displayImages.length > 1

  useEffect(() => {
    setActiveIndex(0)
    setDragOffset(0)
    setIsZooming(false)
    setIsLightboxOpen(false)
    setLightboxZoom(1)
    setLightboxPan({ x: 0, y: 0 })
  }, [images])

  useEffect(() => {
    if (!isLightboxOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen])

  useEffect(() => {
    setLightboxZoom(1)
    setLightboxPan({ x: 0, y: 0 })
    lightboxPointers.current.clear()
  }, [activeIndex])

  const showPrevious = () => {
    setActiveIndex(index => (index === 0 ? displayImages.length - 1 : index - 1))
  }

  const showNext = () => {
    setActiveIndex(index => (index === displayImages.length - 1 ? 0 : index + 1))
  }

  const finishDrag = (target: HTMLDivElement, pointerId: number) => {
    if (pointerStartX.current === null) return

    const swipeThreshold = Math.min(90, target.clientWidth * 0.16)
    const deltaX = pointerDeltaX.current

    if (deltaX > swipeThreshold) {
      showPrevious()
    } else if (deltaX < -swipeThreshold) {
      showNext()
    }

    pointerStartX.current = null
    pointerDeltaX.current = 0
    setDragOffset(0)

    if (target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId)
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    didDrag.current = false

    if (!hasMultipleImages) return

    pointerStartX.current = e.clientX
    pointerDeltaX.current = 0
    setDragOffset(0)
    setIsZooming(false)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return

    const deltaX = e.clientX - pointerStartX.current
    pointerDeltaX.current = deltaX

    if (Math.abs(deltaX) > 8) {
      didDrag.current = true
    }

    setDragOffset(deltaX)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(e.currentTarget, e.pointerId)
  }

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = null
    pointerDeltaX.current = 0
    setDragOffset(0)

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only zoom on desktop (touch devices don't have hover)
    if (window.innerWidth < 768) return
    if (pointerStartX.current !== null) return

    setIsZooming(true)
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)' // 200% zoom
    })
  }

  const handleMouseLeave = () => {
    setIsZooming(false)
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)'
    })
  }

  const openMobileLightbox = () => {
    if (window.innerWidth >= 768 || didDrag.current) return

    setLightboxZoom(1)
    setLightboxPan({ x: 0, y: 0 })
    setIsLightboxOpen(true)
  }

  const applyLightboxTransform = (zoom: number, pan: Point) => {
    const nextZoom = Math.min(4, Math.max(1, Number(zoom.toFixed(2))))

    if (nextZoom <= 1.01) {
      setLightboxZoom(1)
      setLightboxPan({ x: 0, y: 0 })
      return
    }

    setLightboxZoom(nextZoom)
    setLightboxPan(pan)
  }

  const getLightboxPointerDistance = () => {
    const points = Array.from(lightboxPointers.current.values())
    if (points.length < 2) return null

    const [first, second] = points
    return Math.hypot(second.x - first.x, second.y - first.y)
  }

  const getLightboxPointerMidpoint = () => {
    const points = Array.from(lightboxPointers.current.values())
    if (points.length < 2) return null

    const [first, second] = points
    return {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    }
  }

  const getFocalPoint = (point: Point, target: HTMLDivElement) => {
    const rect = target.getBoundingClientRect()
    return {
      x: point.x - rect.left - rect.width / 2,
      y: point.y - rect.top - rect.height / 2,
    }
  }

  const handleLightboxPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    lightboxPointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture(event.pointerId)
    didLightboxMove.current = false

    const distance = getLightboxPointerDistance()
    if (distance) {
      pinchStartDistance.current = distance
      pinchStartZoom.current = lightboxZoom
      pinchStartPan.current = lightboxPan
      const midpoint = getLightboxPointerMidpoint()
      pinchStartFocal.current = midpoint ? getFocalPoint(midpoint, event.currentTarget) : null
      return
    }

    singlePointerStart.current = { x: event.clientX, y: event.clientY }
    singlePointerStartPan.current = lightboxPan
  }

  const handleLightboxPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!lightboxPointers.current.has(event.pointerId)) return

    event.preventDefault()
    lightboxPointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (lightboxPointers.current.size === 1 && lightboxZoom > 1 && singlePointerStart.current) {
      const deltaX = event.clientX - singlePointerStart.current.x
      const deltaY = event.clientY - singlePointerStart.current.y

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        didLightboxMove.current = true
      }

      setLightboxPan({
        x: singlePointerStartPan.current.x + deltaX,
        y: singlePointerStartPan.current.y + deltaY,
      })
      return
    }

    const distance = getLightboxPointerDistance()
    const midpoint = getLightboxPointerMidpoint()
    if (!distance || !midpoint || !pinchStartDistance.current || !pinchStartFocal.current) return

    const nextZoom = pinchStartZoom.current * (distance / pinchStartDistance.current)
    const zoomRatio = nextZoom / pinchStartZoom.current
    const currentFocal = getFocalPoint(midpoint, event.currentTarget)

    didLightboxMove.current = true
    applyLightboxTransform(nextZoom, {
      x: currentFocal.x - zoomRatio * (pinchStartFocal.current.x - pinchStartPan.current.x),
      y: currentFocal.y - zoomRatio * (pinchStartFocal.current.y - pinchStartPan.current.y),
    })
  }

  const handleLightboxPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    lightboxPointers.current.delete(event.pointerId)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (lightboxPointers.current.size < 2) {
      pinchStartDistance.current = null
      pinchStartZoom.current = lightboxZoom
      pinchStartPan.current = lightboxPan
      pinchStartFocal.current = null
    }

    const remainingPoint = Array.from(lightboxPointers.current.values())[0]
    singlePointerStart.current = remainingPoint || null
    singlePointerStartPan.current = lightboxPan
  }

  const handleLightboxDoubleTap = (event: React.MouseEvent<HTMLDivElement>) => {
    if (didLightboxMove.current) return

    const now = Date.now()
    const elapsed = now - lastTapAt.current
    lastTapAt.current = now

    if (elapsed > 300) return

    if (lightboxZoom > 1) {
      applyLightboxTransform(1, { x: 0, y: 0 })
      return
    }

    const nextZoom = 2.5
    const focal = getFocalPoint({ x: event.clientX, y: event.clientY }, event.currentTarget)
    applyLightboxTransform(nextZoom, {
      x: focal.x * (1 - nextZoom),
      y: focal.y * (1 - nextZoom),
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      
      {/* Thumbnails (Left on desktop, Bottom on mobile) */}
      {displayImages.length > 1 && (
        <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-auto pb-2 md:pb-0 md:pr-2 scrollbar-hide md:w-[90px] shrink-0">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-24 md:w-full md:h-[110px] shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === index ? "border-emerald shadow-md" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={handleImageError}
                className="h-full w-full object-fill"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div 
        className={`order-1 md:order-2 relative w-full max-w-[640px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-soft border border-gold/15 bg-cream-deep select-none ${
          hasMultipleImages ? 'cursor-grab active:cursor-grabbing touch-pan-y' : 'cursor-crosshair'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={openMobileLightbox}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`flex h-full will-change-transform ${dragOffset === 0 ? 'transition-transform duration-300 ease-out' : ''}`}
          style={{ transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))` }}
        >
          {displayImages.map((img, index) => (
            <div key={`${img}-${index}`} className="relative h-full min-w-full">
              <img
                src={img}
                alt={`${productName} - Image ${index + 1}`}
                style={activeIndex === index ? zoomStyle : undefined}
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={handleImageError}
                className={`absolute inset-0 h-full w-full object-fill transition-transform ease-out ${isZooming && activeIndex === index ? 'duration-100' : 'duration-300'}`}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {hasMultipleImages && (
          <>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1.5 backdrop-blur-sm">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setActiveIndex(index)
                  }}
                  aria-label={`Show image ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === index ? 'w-5 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {badge && (
          <span className="absolute top-4 left-4 z-10 bg-emerald text-cream text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-sm pointer-events-none">
            {badge}
          </span>
        )}

      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100000] bg-black md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image viewer`}
        >
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
            <span className="max-w-[70vw] truncate text-sm font-semibold text-white">
              {activeIndex + 1} / {displayImages.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close image viewer"
              title="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="h-full w-full touch-none overflow-hidden px-4 pb-12 pt-16"
            onPointerDown={handleLightboxPointerDown}
            onPointerMove={handleLightboxPointerMove}
            onPointerUp={handleLightboxPointerEnd}
            onPointerCancel={handleLightboxPointerEnd}
            onClick={handleLightboxDoubleTap}
          >
            <div
              className="relative flex h-full w-full items-center justify-center"
              style={{
                transform: `translate3d(${lightboxPan.x}px, ${lightboxPan.y}px, 0) scale(${lightboxZoom})`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={displayImages[activeIndex]}
                alt={`${productName} - enlarged image ${activeIndex + 1}`}
                onError={handleImageError}
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
