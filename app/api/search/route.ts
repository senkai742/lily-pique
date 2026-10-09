import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
      return NextResponse.json({ products: [] });
    }

    // Search active products by name or description
    const [
      { data: dbProducts, error: prodErr },
      { data: dbCategories },
      { data: dbVariants },
    ] = await Promise.all([
      supabase
        .from("products")
        .select("id, name, description, category_id, status")
        .ilike("status", "active")
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(8),
      supabase.from("categories").select("id, name, slug"),
      supabase.from("product_variants").select("product_id, price, images"),
    ]);

    if (prodErr) {
      console.error("Products search error:", prodErr);
      return NextResponse.json({ products: [] });
    }

    const categoryMap = Object.fromEntries(
      (dbCategories || []).map((c) => [c.id, c.name])
    );

    // Aggregate lowest price & thumbnail for preview
    const products = (dbProducts || []).map((p) => {
      const variants = (dbVariants || []).filter((v) => v.product_id === p.id);
      const firstImage = variants.find((v) => v.images && v.images.length > 0)?.images?.[0] || "";
      const minPrice = variants.length > 0 
        ? Math.min(...variants.map((v) => Number(v.price) || 0)) 
        : 0;

      return {
        id: p.id,
        name: p.name,
        category: categoryMap[p.category_id] || "Flower",
        price: minPrice,
        image: firstImage,
      };
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Search API unexpected error:", err);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
