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

  // Fetch active categories
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  // Fetch all active products (mock: category filters return empty, so we
  // select broadly and derive the homepage sections with fallbacks)
  const { data: allProducts } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

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
        name: p.name,
        price,
        sale_price: original && original > price ? original : null,
        image_url: p.product_images?.[0]?.image_url || p.featured_image_url || "/image.png",
        badge: p.badge || "New",
        rating: p.rating || 4.9,
        review_count: p.review_count || 24,
        category_name: categoryName(p.category_id),
      };
    });

  const products = formatProducts(allProducts || []);

  // Derive section products with fallbacks
  const heroFeatured = products.slice(0, 2);

  const newDrops = products.filter((p) => p.category_name === "New Drops");

  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero featuredProducts={heroFeatured} />
      <Categories categories={categories || []} />
      <NewDrops products={(newDrops.length >= 4 ? newDrops : products).slice(0, 4)} />
      <OversizedPromo />
      <BestSellersLookbook />
      <Footer />
    </main>
  );
}
