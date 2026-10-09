import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking categories table...");
  const { data: cat, error: catErr } = await supabase.from('categories').select('id').limit(1);
  console.log(catErr ? "Categories error: " + catErr.message : "Categories OK");

  console.log("Checking products table...");
  const { data: prod, error: prodErr } = await supabase.from('products').select('id').limit(1);
  console.log(prodErr ? "Products error: " + prodErr.message : "Products OK");

  console.log("Checking product_variants table...");
  const { data: varData, error: varErr } = await supabase.from('product_variants').select('id').limit(1);
  console.log(varErr ? "Variants error: " + varErr.message : "Variants OK");
  
  console.log("Checking relationship...");
  const { data: rel, error: relErr } = await supabase.from('products').select('categories(id)').limit(1);
  console.log(relErr ? "Relationship error: " + relErr.message : "Relationship OK");
}
check();
