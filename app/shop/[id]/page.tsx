import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductViewSection from './_components/ProductViewSection'
import ProductReviews from './_components/ProductReviews'
import Products from '@/components/Products'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from "@/lib/supabase/server"
import { getSampleImages } from '@/lib/samples'
import { getProductSizeChartPublic } from '@/actions/size-charts'
import { selectDisplayVariant } from '@/lib/productVariants'

const SAMPLE_CATEGORIES: Record<string, { name: string; description: string; price: number; originalPrice?: number }> = {
  'new-drops': {
    name: 'New Drop Tee',
    description: 'Fresh from the studio. Limited run, heavyweight cotton, bold graphics. Each piece tells a story.',
    price: 1299,
    originalPrice: 1599
  },
  'best-sellers': {
    name: 'Bestseller Tee',
    description: "The one everyone's talking about. Proven fit, premium fabric, restocked by demand.",
    price: 1199,
    originalPrice: 1399
  },
  'streetwear-collection': {
    name: 'Streetwear Essential',
    description: 'Core collection piece. Oversized fit, heavyweight fabric, built for the streets.',
    price: 1499,
    originalPrice: 1799
  },
  'acid-wash': {
    name: 'Acid Wash Tee',
    description: 'One-of-one acid wash. No two pieces are identical. Distressed finish, premium cotton.',
    price: 1599,
    originalPrice: 1899
  },
  'gym-collection': {
    name: 'Gym Performance Tee',
    description: 'Moisture-wicking, anti-odor, built for the grind. Technical fabric meets street style.',
    price: 999,
    originalPrice: 1299
  },
  'limited-edition': {
    name: 'Limited Edition Drop',
    description: "Numbered release. Once it's gone, it's gone forever. Collector's grade quality.",
    price: 2499,
    originalPrice: 2999
  }
}

function isSampleId(id: string): boolean {
  return id.startsWith('sample-')
}

function parseSampleId(id: string): { categoryId: string; index: number } | null {
  const match = id.match(/^sample-(.+)-\d+$/)
  if (!match) return null
  const parts = id.split('-')
  const index = parseInt(parts[parts.length - 1], 10)
  const categoryId = parts.slice(1, -1).join('-')
  return { categoryId, index }
}

function getSampleProductData(id: string) {
  const parsed = parseSampleId(id)
  if (!parsed) return null

  const { categoryId, index } = parsed
  const images = getSampleImages(categoryId)
  const categoryInfo = SAMPLE_CATEGORIES[categoryId]

  if (!categoryInfo || index >= images.length) return null

  return {
    id,
    name: `${categoryInfo.name} ${index + 1}`,
    slug: id,
    category_id: categoryId,
    is_active: true,
    badge: index === 0 ? 'New' : undefined,
    rating: 4.5 + (index % 5) * 0.1,
    short_description: categoryInfo.description,
    description: `${categoryInfo.description} This is a sample product showcasing the ${categoryInfo.name.toLowerCase()} collection. Heavyweight fabric, premium construction, and RAWFLEX signature styling.`,
    fabric: '240 GSM Heavyweight Cotton',
    stitching: 'Double-needle stitching for durability',
    featured_image_url: images[index],
    color_group_id: null,
    color_name: 'Black',
    color_hex: '#000000',
    product_images: images.slice(0, 4).map((img, i) => ({ image_url: img, color_name: i === 0 ? 'Black' : `Color ${i + 1}` })),
    product_variants: [
      { id: `${id}-m`, variant_name: 'M', price: categoryInfo.price, original_price: categoryInfo.originalPrice, stock_quantity: 10 },
      { id: `${id}-l`, variant_name: 'L', price: categoryInfo.price, original_price: categoryInfo.originalPrice, stock_quantity: 15 },
      { id: `${id}-xl`, variant_name: 'XL', price: categoryInfo.price, original_price: categoryInfo.originalPrice, stock_quantity: 8 },
      { id: `${id}-xxl`, variant_name: 'XXL', price: categoryInfo.price, original_price: categoryInfo.originalPrice, stock_quantity: 5 }
    ],
    product_information: [
      { label: 'Fabric', value: '240 GSM 100% Cotton', display_order: 1 },
      { label: 'Fit', value: 'Oversized / Boxy', display_order: 2 },
      { label: 'Care', value: 'Machine wash cold, tumble dry low', display_order: 3 },
      { label: 'Origin', value: 'Made in India', display_order: 4 }
    ],
    product_faqs: [
      { question: 'How does the sizing run?', answer: 'Our oversized tees run true to size for an oversized fit. Size down for a more fitted look.', display_order: 1 },
      { question: 'Is the print durable?', answer: 'Yes, we use high-quality screen printing that withstands 50+ washes without cracking.', display_order: 2 },
      { question: 'What is your return policy?', answer: '7-day return policy for unworn items with original tags.', display_order: 3 }
    ]
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  let { data: product } = await supabase
    .from("products")
    .select("name, seo_title, seo_description, seo_keywords, featured_image_url")
    .eq("id", id)
    .single()

  if (!product) {
    const { data: slugProduct } = await supabase
      .from("products")
      .select("name, seo_title, seo_description, seo_keywords, featured_image_url")
      .eq("slug", id)
      .single()
    product = slugProduct
  }

  if (!product) return {}

  const title = product.seo_title || `${product.name} | RAWFLEX`
  const description = product.seo_description || `Shop ${product.name} online at RAWFLEX.`
  const keywords = product.seo_keywords ? product.seo_keywords.split(',').map((k: string) => k.trim()) : []

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: product.featured_image_url ? [{ url: product.featured_image_url }] : [],
    }
  }
}

function renderProductPage(
  productData: any,
  categoryName: string,
  similarProducts: any[],
  reviews: any[],
  sizeChart: { imageUrl: string; title: string } | null
) {
  // Compile image array
  let images: { image_url: string; color_name?: string | null }[] = []
  if (productData.product_images && productData.product_images.length > 0) {
    images = productData.product_images
  } else if (productData.featured_image_url) {
    images = [{ image_url: productData.featured_image_url }]
  }

  // Compile information
  let information = productData.product_information || []
  if (productData.fabric) {
    information.push({ label: 'Fabric Details', value: productData.fabric, display_order: -2 })
  }
  if (productData.stitching) {
    information.push({ label: 'Stitching Details', value: productData.stitching, display_order: -1 })
  }
  information.sort((a: any, b: any) => a.display_order - b.display_order)

  let faqs = productData.product_faqs || []
  if (faqs.length === 0) {
    faqs.push({
      question: "How long does shipping take?",
      answer: "We typically process and ship orders within 2-3 business days. Delivery times vary based on your location.",
      display_order: 1
    })
    faqs.push({
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for unused items in their original packaging.",
      display_order: 2
    })
  }
  faqs.sort((a: any, b: any) => a.display_order - b.display_order)

  const variants = productData.product_variants || []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-wrap mx-auto px-5 md:px-8">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-ink/50 font-medium mb-8">
            <Link href="/" className="hover:text-emerald transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-emerald transition-colors">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?category=${productData.category_id}`} className="hover:text-emerald transition-colors capitalize">
              {categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold truncate max-w-[200px]">{productData.name}</span>
          </div>

          {(() => {
            const parseProductColors = (colorNameField: string | null) => {
              if (!colorNameField) return []
              try {
                if (colorNameField.startsWith('[')) {
                  const parsed = JSON.parse(colorNameField) as { name: string; hex: string }[]
                  return parsed.map(c => ({ name: c.name.trim(), hex: c.hex || '#E6DAC4' })).filter(c => c.name)
                }
              } catch (e) {}
              return colorNameField.split(',').map(c => ({ name: c.trim(), hex: '#E6DAC4' })).filter(c => c.name)
            }

            const colors = parseProductColors(productData.color_name)

            return (
              <ProductViewSection
                product={{
                  id: productData.id,
                  name: productData.name,
                  badge: productData.badge,
                  rating: productData.rating,
                  short_description: productData.short_description,
                  colors: colors,
                }}
                images={images}
                variants={variants}
                information={information}
                categoryName={categoryName}
                sizeChart={sizeChart}
              />
            )
          })()}

          <div className="space-y-6 pt-6 border-t border-cream-line/50">
                {productData.description && (
                  <div>
                    <h3 className="font-display font-semibold text-xl text-ink mb-4">Product Details</h3>
                    <div className="font-body text-ink/75 text-base leading-relaxed whitespace-pre-wrap">
                      {productData.description}
                    </div>
                  </div>
                )}

                {faqs.length > 0 && (
                  <div className="pt-4">
                    <h3 className="font-display font-semibold text-xl text-ink mb-4">Common Questions</h3>
                    <div className="space-y-3">
                      {faqs.map((faq: any, idx: number) => (
                        <details key={idx} className="group bg-panel rounded-2xl border border-cream-line shadow-sm overflow-hidden open:bg-cream-deep/30 transition-colors">
                          <summary className="font-display font-semibold text-ink text-[15px] px-5 py-4 cursor-pointer flex justify-between items-center outline-none list-none hover:text-emerald transition-colors">
                            {faq.question}
                            <span className="text-ink/50 transition-transform group-open:rotate-180 group-open:text-emerald">
                              <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18"><polyline points="6 9 12 15 18 9"/></svg>
                            </span>
                          </summary>
                          <div className="px-5 pb-5 text-ink/70 text-sm leading-relaxed border-t border-cream-line/50 mx-5 pt-3">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-cream-line">
            <Products
              products={similarProducts}
              categories={[{ id: productData.category_id, name: categoryName }]}
              title="You might also like"
              subtitle="Explore similar styles from this collection."
            />
          </div>
        )}

        </div>

        {/* Product Reviews */}
        <section className="mt-20 pt-10 border-t border-cream-line bg-cream">
          <div className="max-w-wrap mx-auto px-5 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="eyebrow justify-center inline-flex items-center gap-2">
                <span className="h-px w-6 bg-gold" />
                Customer Voices
                <span className="h-px w-6 bg-gold" />
              </div>
              <h2 className="section-heading mt-4">Ratings & Reviews</h2>
            </div>
            <ProductReviews productId={productData.id} initialReviews={reviews} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // Handle sample products (dummy data for categories without real DB entries)
  if (isSampleId(id)) {
    const sampleProduct = getSampleProductData(id)
    if (!sampleProduct) notFound()
    return renderProductPage(sampleProduct, sampleProduct.category_id, [], [], null)
  }

  // Try fetching by ID first, then fallback to slug if the URL uses a slug
  let productData = null;
  let productError = null;

  // First try with size chart columns (new schema)
  const { data: dataWithSizeChart, error: errWithSizeChart } = await supabase
    .from("products")
    .select(`
      id, name, slug, category_id, is_active, badge, rating, short_description, description, fabric, stitching, featured_image_url, color_group_id, color_name, color_hex,
      use_global_size_chart, size_chart_image_url, size_chart_cloudinary_public_id,
      product_images ( image_url, color_name ),
      product_variants ( id, variant_name, price, original_price, stock_quantity, is_active ),
      product_information ( label, value, display_order ),
      product_faqs ( question, answer, display_order )
    `)
    .eq("id", id)
    .single();

  if (!errWithSizeChart) {
    productData = dataWithSizeChart;
  } else {
    // Fallback: try without size chart columns (old schema)
    const { data: dataWithoutSizeChart, error: errWithoutSizeChart } = await supabase
      .from("products")
      .select(`
        id, name, slug, category_id, is_active, badge, rating, short_description, description, fabric, stitching, featured_image_url, color_group_id, color_name, color_hex,
        product_images ( image_url, color_name ),
        product_variants ( id, variant_name, price, original_price, stock_quantity, is_active ),
        product_information ( label, value, display_order ),
        product_faqs ( question, answer, display_order )
      `)
      .eq("id", id)
      .single();
    
    if (!errWithoutSizeChart) {
      productData = dataWithoutSizeChart;
      // Add default size chart fields for backward compatibility
      productData.use_global_size_chart = true;
      productData.size_chart_image_url = null;
      productData.size_chart_cloudinary_public_id = null;
    } else {
      productError = errWithoutSizeChart;
    }
  }

  if (!productData) {
    // Try slug fallback with size chart columns
    const { data: slugDataWithSizeChart, error: slugErrWithSizeChart } = await supabase
      .from("products")
      .select(`
        id, name, slug, category_id, is_active, badge, rating, short_description, description, fabric, stitching, featured_image_url, color_group_id, color_name, color_hex,
        use_global_size_chart, size_chart_image_url, size_chart_cloudinary_public_id,
        product_images ( image_url, color_name ),
        product_variants ( id, variant_name, price, original_price, stock_quantity, is_active ),
        product_information ( label, value, display_order ),
        product_faqs ( question, answer, display_order )
      `)
      .eq("slug", id)
      .single();

    if (!slugErrWithSizeChart) {
      productData = slugDataWithSizeChart;
    } else {
      // Fallback: try slug without size chart columns
      const { data: slugDataWithoutSizeChart, error: slugErrWithoutSizeChart } = await supabase
        .from("products")
        .select(`
          id, name, slug, category_id, is_active, badge, rating, short_description, description, fabric, stitching, featured_image_url, color_group_id, color_name, color_hex,
          product_images ( image_url, color_name ),
          product_variants ( id, variant_name, price, original_price, stock_quantity, is_active ),
          product_information ( label, value, display_order ),
          product_faqs ( question, answer, display_order )
        `)
        .eq("slug", id)
        .single();
      
      if (!slugErrWithoutSizeChart) {
        productData = slugDataWithoutSizeChart;
        productData.use_global_size_chart = true;
        productData.size_chart_image_url = null;
        productData.size_chart_cloudinary_public_id = null;
      } else {
        productError = slugErrWithoutSizeChart;
      }
    }
  }

  if (!productData || !productData.is_active) {
    console.error('Product not found or inactive:', id, productError);
    notFound();
  }

  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("id", productData.category_id)
    .single();

  const categoryName = category?.name || productData.category_id;

  // Fetch size chart
  const sizeChartResult = await getProductSizeChartPublic(productData.id)
  let sizeChart = null
  if (sizeChartResult.success && sizeChartResult.data) {
    sizeChart = {
      imageUrl: sizeChartResult.data.image_url,
      title: sizeChartResult.data.name || 'Size Chart'
    }
  }

  // Fetch similar products
  const { data: similarProductsData } = await supabase
    .from("products")
    .select(`
      id, name, slug, category_id, is_active, badge, rating, featured_image_url,
      product_images ( image_url ),
      product_variants ( id, price, original_price, stock_quantity, is_active )
    `)
    .eq("is_active", true)
    .eq("category_id", productData.category_id)
    .neq("id", productData.id)
    .limit(4);

  const similarProducts = similarProductsData?.map((p: any) => {
    const variant = selectDisplayVariant(p.product_variants)

    return {
      id: p.id,
      name: p.name,
      category_id: p.category_id,
      image_url: p.featured_image_url || (p.product_images?.[0]?.image_url) || "/image.png",
      badge: p.badge,
      price: variant?.price || 0,
      oldPrice: variant?.original_price || undefined
    }
  }) || [];

  // Fetch Reviews
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select(`
      id, rating, review_text, created_at,
      profiles:user_id ( full_name, email )
    `)
    .eq('product_id', productData.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  const reviews = (reviewsData || []).map((review: any) => ({
    ...review,
    comment: review.review_text,
  }));

  return renderProductPage(productData, categoryName, similarProducts, reviews, sizeChart)
}
