import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import OversizedPromo from "@/components/OversizedPromo";
import NewDrops from "@/components/NewDrops";
import BestSellersLookbook from "@/components/BestSellersLookbook";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

const PRODUCT_SELECT = `
  id, name, slug, category_id, is_featured, is_active, badge, rating, color_name,
  product_images ( image_url ),
  product_variants ( price, original_price )
`;

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: categoriesData },
    { data: allProducts },
    { data: heroSlidesData },
  ] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true),
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  // Product counts per category
  const productCounts = (allProducts || []).reduce((acc: any, p: any) => {
    acc[p.category_id] = (acc[p.category_id] || 0) + 1;
    return acc;
  }, {});

  const categories = (categoriesData || []).map((c: any) => ({
    ...c,
    count: `${productCounts[c.id] || 0} styles`,
  }));

  const categoryName = (id: string) =>
    (categoriesData || []).find((c: any) => c.id === id)?.name || id;

  const formatProducts = (rows: any[]) =>
    (rows || []).map((p: any) => {
      const variant = p.product_variants?.[0];
      const price = variant?.price || p.price || 0;
      const original = variant?.original_price || p.oldPrice || null;
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        price,
        sale_price: original && original > price ? original : null,
        image_url: p.product_images?.[0]?.image_url || p.featured_image_url || "/image.png",
        badge: p.badge || "New",
        rating: p.rating || 4.9,
        review_count: p.review_count || 24,
        is_featured: p.is_featured || false,
        category_name: categoryName(p.category_id),
      };
    });

  const products = formatProducts(allProducts || []);

  // New drops: newest products
  const newDrops = products.filter((p) => p.category_name === "New Drops");
  const newDropItems = (newDrops.length >= 4 ? newDrops : products).slice(0, 4);

  // Best sellers: featured products (fallback newest)
  const featuredProducts = products.filter((p) => p.is_featured);
  const bestSellers = (featuredProducts.length >= 4 ? featuredProducts : products).slice(0, 6);

  const heroSlides = (heroSlidesData || []).map((s: any) => ({
    id: s.id,
    image_url: s.image_url,
    title: s.title,
    subtitle: s.subtitle,
    button_text: s.button_text,
    button_link: s.button_link,
  }));

  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero slides={heroSlides} />
      <Categories categories={categories || []} />
      <NewDrops products={newDropItems} />
      <OversizedPromo />
      <BestSellersLookbook products={bestSellers} />
      <Footer />
    </main>
  );
}