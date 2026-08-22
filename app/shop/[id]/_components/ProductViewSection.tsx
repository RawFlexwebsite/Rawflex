'use client'

import React, { useState } from 'react'
import ProductGallery from './ProductGallery'
import ProductDetailActions from './ProductDetailActions'

type ProductImage = {
  image_url: string
  color_name?: string | null
}

type ProductVariant = {
  id: string
  variant_name: string
  price: number
  original_price: number | null
  stock_quantity: number
}

type ProductViewSectionProps = {
  product: {
    id: string
    name: string
    badge: string | null
    rating: number | null
    short_description: string | null
    colors: { name: string; hex: string }[]
  }
  images: ProductImage[]
  variants: ProductVariant[]
  information: { label: string; value: string }[]
  categoryName: string
}

export default function ProductViewSection({
  product,
  images,
  variants,
  information,
  categoryName,
}: ProductViewSectionProps) {
  const uniqueColors = product.colors || []

  const [selectedColor, setSelectedColor] = useState<string | null>(
    uniqueColors.length > 0 ? uniqueColors[0].name : null
  )

  // Filter gallery images:
  // Show images matching the selected color, OR images that have NO color assigned (common fallback images)
  const filteredImages = images.filter((img) => {
    if (!selectedColor) return true
    return !img.color_name || img.color_name.toLowerCase().trim() === selectedColor.toLowerCase().trim()
  }).map((img) => img.image_url)

  // Ensure we have at least one image to display
  const displayImages = filteredImages.length > 0 ? filteredImages : (images.map(img => img.image_url) || ['/image.png'])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
      {/* Left: Product Image Gallery */}
      <ProductGallery images={displayImages} productName={product.name} badge={product.badge || undefined} />

      {/* Right: Product Details & Purchase Form */}
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-gold font-bold">
            {categoryName}
          </span>
          <h1 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-ink mt-2 leading-tight">
            {product.name}
          </h1>

          {!!product.rating && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-ink/60">
              <div className="flex text-gold">★★★★★</div>
              <span className="font-semibold text-ink">{product.rating} ★</span>
              <span className="text-ink/30">|</span>
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Dynamic Color Selector */}
        {uniqueColors.length > 0 && (
          <div>
            <p className="text-[12px] uppercase tracking-wider font-bold text-ink/70 mb-2">
              Color {selectedColor ? ` — ${selectedColor}` : ''}
              <span className="ml-1.5 font-semibold normal-case text-emerald">
                ({uniqueColors.length} colors available)
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {uniqueColors.map((colorObj) => {
                const isSelected = selectedColor?.toLowerCase().trim() === colorObj.name.toLowerCase().trim()
                return (
                  <button
                    key={colorObj.name}
                    type="button"
                    onClick={() => setSelectedColor(colorObj.name)}
                    title={colorObj.name}
                    className={`relative w-9 h-9 rounded-full border-2 overflow-hidden shrink-0 transition-all ${
                      isSelected
                        ? 'border-emerald scale-110 shadow-md ring-2 ring-emerald/20'
                        : 'border-cream-line hover:border-emerald/50'
                    }`}
                    style={{ backgroundColor: colorObj.hex }}
                  >
                    <span className="sr-only">{colorObj.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Purchase Actions client-side wrapper */}
        <ProductDetailActions
          product={{
            id: product.id,
            name: product.name,
            image_url: images[0]?.image_url || '/image.png',
            category_name: categoryName,
            variants: variants,
          }}
          selectedColor={selectedColor}
        />

        {product.short_description && (
          <div className="font-body text-ink/80 text-base leading-relaxed pt-2">
            <p>{product.short_description}</p>
          </div>
        )}

        {/* Dynamic Information Section */}
        {information.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cream-line/50">
            {information.map((info, idx) => (
              <div key={idx} className="p-3 bg-panel rounded-xl border border-cream-line shadow-sm">
                <p className="text-[10px] font-bold text-ink/50 uppercase tracking-wider">{info.label}</p>
                <p className="text-sm font-semibold text-emerald mt-1">{info.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
