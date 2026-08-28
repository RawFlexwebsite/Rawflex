'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type ProductGalleryProps = {
  images: string[]
  productName: string
  badge?: string
}

export default function ProductGallery({ images, productName, badge }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center',
    transform: 'scale(1)'
  })
  const [isZooming, setIsZooming] = useState(false)
  const pointerStartX = useRef<number | null>(null)
  const pointerDeltaX = useRef(0)

  // Ensure we have at least one image to display
  const displayImages = images.length > 0 ? images : ['/image.png']
  const hasMultipleImages = displayImages.length > 1

  useEffect(() => {
    setActiveIndex(0)
    setDragOffset(0)
    setIsZooming(false)
  }, [images])

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
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={110}
                sizes="90px"
                className="object-cover"
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`flex h-full will-change-transform ${dragOffset === 0 ? 'transition-transform duration-300 ease-out' : ''}`}
          style={{ transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))` }}
        >
          {displayImages.map((img, index) => (
            <div key={`${img}-${index}`} className="relative h-full min-w-full">
              <Image
                src={img}
                alt={`${productName} - Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                style={activeIndex === index ? zoomStyle : undefined}
                className={`object-cover object-center transition-transform ease-out ${isZooming && activeIndex === index ? 'duration-100' : 'duration-300'}`}
                priority={index === 0}
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
                  onClick={() => setActiveIndex(index)}
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

    </div>
  )
}
