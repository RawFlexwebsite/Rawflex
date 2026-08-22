'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Plus, X, Star, Loader2 } from 'lucide-react'
import { addProductImage, deleteProductImage, setFeaturedImage } from '@/actions/products'
import Image from 'next/image'

type ProductImage = {
  id: string
  product_id: string
  image_url: string
  cloudinary_public_id?: string | null
  sort_order: number
  color_name?: string | null
}

type Product = {
  id: string
  featured_image_url: string | null
  color_name?: string | null
}

export function ProductImagesEditor({
  product,
  images,
}: {
  product: Product
  images: ProductImage[]
}) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('All')

  // Keep a ref to activeTab to prevent stale closures in the Cloudinary upload callback
  const activeTabRef = useRef(activeTab)
  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  const handleUploadSuccess = (result: any) => {
    setUploading(false)
    if (result.info && result.info.secure_url) {
      startTransition(async () => {
        const currentActiveTab = activeTabRef.current
        const uploadColor = currentActiveTab === 'All' || currentActiveTab === 'Default' ? null : currentActiveTab
        await addProductImage(product.id, result.info.secure_url, uploadColor, result.info.public_id || null)
      })
    }
  }

  const handleDelete = (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      startTransition(async () => {
        await deleteProductImage(imageId, product.id)
      })
    }
  }

  const handleSetFeatured = (imageUrl: string) => {
    startTransition(async () => {
      await setFeaturedImage(product.id, imageUrl)
    })
  }





  // Derive tabs from product.color_name (JSON or legacy comma-separated)
  const productColors = (() => {
    if (!product.color_name) return []
    try {
      if (product.color_name.startsWith('[')) {
        const parsed = JSON.parse(product.color_name) as { name: string; hex: string }[]
        return parsed.map(c => ({ name: c.name.trim(), hex: c.hex || '#E6DAC4' })).filter(c => c.name)
      }
    } catch (e) {}
    return product.color_name.split(',').map(c => ({ name: c.trim(), hex: '#E6DAC4' })).filter(c => c.name)
  })()
  const allColorTabs = productColors

  // Filter images for grid display
  const displayedImages = images.filter(img => {
    if (activeTab === 'All') return true
    if (activeTab === 'Default') return !img.color_name
    return img.color_name?.toLowerCase().trim() === activeTab.toLowerCase().trim()
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-ink">Product Images</h3>
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          onSuccess={handleUploadSuccess}
          onOpen={() => setUploading(true)}
          options={{
            multiple: true,
            maxFiles: 5,
            folder: "rawflex/products",
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"]
          }}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open()}
                disabled={uploading || isPending}
                className="admin-primary-action px-4 py-2 text-sm rounded-md"
              >
                {uploading || isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Upload Image
              </button>
            )
          }}
        </CldUploadWidget>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-cream-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('All')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'All'
              ? 'bg-panel text-ink'
              : 'text-ink/60 hover:bg-panel2'
          }`}
        >
          All ({images.length})
        </button>
        
        {allColorTabs.map((colorObj) => {
          const colorName = colorObj.name
          const colorHex = colorObj.hex
          const count = images.filter(img => img.color_name?.toLowerCase().trim() === colorName.toLowerCase().trim()).length
          return (
            <button
              key={colorName}
              type="button"
              onClick={() => setActiveTab(colorName)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === colorName
                  ? 'bg-panel text-ink'
                  : 'text-ink/60 hover:bg-panel2'
              }`}
            >
              <span 
                className="w-3 h-3 rounded-full border border-black/10 shrink-0 shadow-sm" 
                style={{ backgroundColor: colorHex }} 
              />
              <span>{colorName} ({count})</span>
            </button>
          )
        })}


      </div>

      {activeTab !== 'All' && activeTab !== 'Default' && (
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-850 text-xs rounded-xl p-3 font-medium">
          Uploading images while on the <strong className="text-indigo-900">{activeTab}</strong> tab will automatically set their color tag to <strong className="text-indigo-900">{activeTab}</strong>.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {displayedImages.map((img) => {
          const isFeatured = product.featured_image_url === img.image_url
          return (
            <div
              key={img.id}
              className={`group flex flex-col rounded-lg border-2 bg-cream-deep overflow-hidden ${
                isFeatured ? 'border-indigo-600' : 'border-cream-line'
              }`}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={img.image_url}
                  alt="Product image"
                  fill
                  className="object-cover"
                />
                
                <div className="absolute inset-0 bg-black/40 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      disabled={isPending}
                      className="p-1.5 bg-red-600 text-ink rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-center mb-2">
                    {!isFeatured && (
                      <button
                        type="button"
                        onClick={() => handleSetFeatured(img.image_url)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-medium text-ink bg-panel rounded-full shadow-sm hover:bg-panel2 transition-colors"
                      >
                        Set as Featured
                      </button>
                    )}
                    {isFeatured && (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>


            </div>
          )
        })}

        {displayedImages.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-cream-line rounded-lg bg-cream-deep">
            <p className="text-sm text-ink/60">No images uploaded for "{activeTab}" yet</p>
            <p className="text-xs text-ink/40 mt-1">Click "Upload Image" to add some under this tab</p>
          </div>
        )}
      </div>
    </div>
  )
}
