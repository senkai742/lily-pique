import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EditProductForm from "./EditProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch product, variants, and categories in parallel with separate queries
  // to avoid relational join cache issues
  const [
    { data: product, error: productError },
    { data: variants },
    { data: categories },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("categories").select("id, name, slug").order("name"),
  ]);

  if (productError || !product) notFound();

  return (
    <EditProductForm
      product={{ ...product, product_variants: variants ?? [] }}
      categories={categories ?? []}
    />
  );
}
