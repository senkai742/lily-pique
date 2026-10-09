import { Product } from "@/app/types/product";

export const products: Product[] = [
  // ─── Men's Baggy Denim ───────────────────────────────────────
  {
    id: "m1",
    name: "Men's Stylish Baggy Jeans",
    category: "Men's Fashion",
    categorySlug: "mens-fashion",
    description: "Relaxed-fit baggy denim jeans with a convenient drawstring waistband, available in washed shades for versatile everyday styling.",
    variants: [
      { color: "Washed Blue", hex: "#5B7FA6", price: 1850, images: ["/images/categories/mens-fashion/1.jpg"] },
      { color: "Charcoal", hex: "#4A4A4A", price: 1850, images: ["/images/categories/mens-fashion/5.jpg"] },
      { color: "Gradient", hex: "#3B6EA5", price: 1990, images: ["/images/categories/mens-fashion/7.jpg"] },
      { color: "Dark Wash", hex: "#2C2C3E", price: 1990, images: ["/images/categories/mens-fashion/8.jpg"] },
    ],
  },
  {
    id: "m2",
    name: "Men's Stylish 6pkt Pant",
    category: "Men's Fashion",
    categorySlug: "mens-fashion",
    description: "Slim-fit cargo jeans crafted with premium stretch denim and structured side pockets, delivering a modern tapered silhouette.",
    variants: [
      { color: "Indigo", hex: "#354F7A", price: 2550, images: ["/images/categories/mens-fashion/3.jpg"] },
      { color: "Dark Blue", hex: "#1E2E4A", price: 2200, images: ["/images/categories/mens-fashion/2.jpg"] },
    ],
  },
  {
    id: "m3",
    name: "EKS Black Slim Cargo Jeans",
    category: "Men's Fashion",
    categorySlug: "mens-fashion",
    description: "Sleek slim-fit cargo jeans with defined paneling and multiple pockets, offering a sharp streetwear aesthetic.",
    variants: [
      { color: "Black", hex: "#1A1A1A", price: 2550, images: ["/images/categories/mens-fashion/4.jpg"] },
    ],
  },
  {
    id: "m4",
    name: "Mens Stylish Baggy 8pkt",
    category: "Men's Fashion",
    categorySlug: "mens-fashion",
    description: "Bold baggy denim with eight utility cargo pockets, designed for maximum storage and a standout street-style statement.",
    variants: [
      { color: "Indigo", hex: "#354F7A", price: 5990, images: ["/images/categories/mens-fashion/6.jpg"] },
    ],
  },

  // ─── Men's Blazers ────────────────────────────────────────────
  {
    id: "m-blazer",
    name: "Men's Premium Slim Blazer",
    category: "Men's Fashion",
    categorySlug: "mens-fashion",
    description: "Tailored premium blazer available in multiple classic colorways, perfect for formal occasions and smart-casual wear.",
    variants: [
      { color: "Navy Blue", hex: "#1B2F5E", price: 11990, images: ["/images/categories/mens-fashion/b1.png"] },
      { color: "Charcoal Grey", hex: "#4B4B4B", price: 9990, images: ["/images/categories/mens-fashion/b2.png"] },
      { color: "Burgundy", hex: "#6B2737", price: 13990, images: ["/images/categories/mens-fashion/b3.png"] },
      { color: "Jet Black", hex: "#111111", price: 10990, images: ["/images/categories/mens-fashion/b4.png"] },
      { color: "Camel Beige", hex: "#C4A882", price: 12990, images: ["/images/categories/mens-fashion/b5.png"] },
      { color: "Forest Green", hex: "#2C4A2E", price: 15990, images: ["/images/categories/mens-fashion/b6.png"] },
    ],
  },

  // ─── Men's T-Shirts ───────────────────────────────────────────
  {
    id: "m-tshirt",
    name: "Men's Crew Neck T-Shirt",
    category: "Men's Fashion",
    categorySlug: "mens-fashion",
    description: "Comfortable crew neck t-shirt made from soft cotton fabric, perfect for everyday wear.",
    variants: [
      { color: "Black", hex: "#1A1A1A", price: 100, images: ["/images/categories/mens-fashion/t1.png"] },
      { color: "Navy Blue", hex: "#1B2F5E", price: 100, images: ["/images/categories/mens-fashion/t2.png"] },
      { color: "Olive Green", hex: "#6B7C3A", price: 100, images: ["/images/categories/mens-fashion/t3.png"] },
      { color: "White", hex: "#F5F5F5", price: 100, images: ["/images/categories/mens-fashion/t4.png"] },
    ],
  },

  // ─── Men's Tank Tops ──────────────────────────────────────────
  {
    id: "m-tank",
    name: "Men's Premium Cotton Tank Top",
    category: "Men's Fashion",
    categorySlug: "mens-fashion",
    description: "Premium ribbed cotton tank top for casual wear or layering, available in classic colors.",
    variants: [
      { color: "White", hex: "#F5F5F5", price: 70, images: ["/images/categories/mens-fashion/tt1.png"] },
      { color: "Heather Grey", hex: "#9E9E9E", price: 70, images: ["/images/categories/mens-fashion/tt2.png"] },
      { color: "Black", hex: "#1A1A1A", price: 70, images: ["/images/categories/mens-fashion/tt3.png"] },
    ],
  },

  // ─── Women's Fashion ──────────────────────────────────────────
  {
    id: "w1",
    name: "Ladies Wide Leg Plazzo",
    category: "Women's Fashion",
    categorySlug: "womens-fashion",
    description: "Contemporary wide-leg palazzo pants designed with premium fabric, offering exceptional comfort and a stylish modern appearance.",
    variants: [
      { color: "Classic", hex: "#8C9BAB", price: 2100, images: ["/images/categories/womens-fashion/1.jpg"] },
    ],
  },
  {
    id: "w2",
    name: "Ladies Casual 6pkt Pant",
    category: "Women's Fashion",
    categorySlug: "womens-fashion",
    description: "Contemporary casual 6pkt pant designed with premium fabric, offering exceptional comfort and a stylish modern appearance.",
    variants: [
      { color: "Blue", hex: "#4A7BB7", price: 3850, images: ["/images/categories/womens-fashion/2.jpg"] },
      { color: "Denim", hex: "#355070", price: 3500, images: ["/images/categories/womens-fashion/9.jpg"] },
    ],
  },
  {
    id: "w3",
    name: "Ladies Baggy Tie-Detail Jeans",
    category: "Women's Fashion",
    categorySlug: "womens-fashion",
    description: "Fashion-forward wide-leg denim jeans featuring distinctive bow-tie detailing on the legs and a relaxed baggy fit.",
    variants: [
      { color: "Light Wash", hex: "#7B9EC0", price: 2200, images: ["/images/categories/womens-fashion/3.jpg"] },
    ],
  },
  {
    id: "w4",
    name: "Ladies High-Waisted Wide Cargo",
    category: "Women's Fashion",
    categorySlug: "womens-fashion",
    description: "Retro-inspired high-waisted cargo jeans featuring a wide-leg silhouette and practical side pockets with button detailing.",
    variants: [
      { color: "Medium Wash", hex: "#5B7FA6", price: 2450, images: ["/images/categories/womens-fashion/4.jpg"] },
    ],
  },
  {
    id: "w5",
    name: "Ladies Premium Wide-Leg Denim",
    category: "Women's Fashion",
    categorySlug: "womens-fashion",
    description: "Classic wide-leg denim jeans designed for an elegant and comfortable fit.",
    variants: [
      { color: "Classic Blue", hex: "#4A6FA5", price: 1990, images: ["/images/categories/womens-fashion/5.jpg"] },
      { color: "Light Wash", hex: "#A8C0D6", price: 1990, images: ["/images/categories/womens-fashion/6.jpg"] },
    ],
  },
  {
    id: "w7",
    name: "Ladies Acid Wash Strap Cargo",
    category: "Women's Fashion",
    categorySlug: "womens-fashion",
    description: "Edgy acid-washed cargo jeans detailed with statement utility straps, buckles, and multiple pockets.",
    variants: [
      { color: "Acid Wash", hex: "#6E7E8B", price: 2850, images: ["/images/categories/womens-fashion/7.jpg"] },
    ],
  },
  {
    id: "w8",
    name: "Ladies Unique 8pkt",
    category: "Women's Fashion",
    categorySlug: "womens-fashion",
    description: "Unique 8-pocket design with a relaxed fit and stylish detailing for standout streetwear looks.",
    variants: [
      { color: "Blue", hex: "#3B5998", price: 3550, images: ["/images/categories/womens-fashion/8.jpg"] },
      { color: "Dark Indigo", hex: "#2C3E6B", price: 4550, images: ["/images/categories/womens-fashion/10.jpg"] },
    ],
  },
  {
    id: "w11",
    name: "Ladies Utility Cargo Jeans",
    category: "Women's Fashion",
    categorySlug: "womens-fashion",
    description: "Cargo jeans featuring flap pockets and a relaxed straight-leg fit — combining functional streetwear with daily comfort.",
    variants: [
      { color: "Light Wash", hex: "#A8C0D6", price: 2350, images: ["/images/categories/womens-fashion/11.jpg"] },
      { color: "Dark Indigo", hex: "#2C3E6B", price: 2650, images: ["/images/categories/womens-fashion/12.jpg"] },
      { color: "Classic Blue", hex: "#4A6FA5", price: 2200, images: ["/images/categories/womens-fashion/13.jpg"] },
    ],
  },

  // ─── Boys Fashion ─────────────────────────────────────────────
  {
    id: "b1",
    name: "Boys Denim Cargo Jogger Jeans",
    category: "Boys Fashion",
    categorySlug: "boys-fashion",
    description: "Comfortable kids' denim cargo joggers with drawstring elastic waist and side utility pockets.",
    variants: [
      { color: "Blue", hex: "#4A7BB7", price: 1150, images: ["/images/categories/boys-fashion/1.jpg"] },
    ],
  },
  {
    id: "b-shirt",
    name: "Boys Cotton Casual Shirt",
    category: "Boys Fashion",
    categorySlug: "boys-fashion",
    description: "Premium short-sleeve button-down cotton shirt. Lightweight, breathable, and perfect for everyday wear.",
    variants: [
      { color: "Red", hex: "#C0392B", price: 750, images: ["/images/categories/boys-fashion/2.jpg"] },
      { color: "Pink", hex: "#E8A0B0", price: 750, images: ["/images/categories/boys-fashion/3.jpg"] },
      { color: "Sky Blue", hex: "#5DADE2", price: 750, images: ["/images/categories/boys-fashion/4.jpg"] },
    ],
  },

  // ─── Girls Fashion ────────────────────────────────────────────
  {
    id: "g1",
    name: "Girls Street Plazzo",
    category: "Girls Fashion",
    categorySlug: "girls-fashion",
    description: "Stylish palazzo pants with a comfortable wide-leg fit, perfect for everyday play and casual outings.",
    variants: [
      { color: "Multicolor", hex: "#E8A87C", price: 1500, images: ["/images/categories/girls-fashion/1.jpg"] },
    ],
  },
  {
    id: "g2",
    name: "Girls Star Pattern Wide-Leg Jeans",
    category: "Girls Fashion",
    categorySlug: "girls-fashion",
    description: "Fashionable wide-leg denim jeans featuring an all-over printed star pattern and comfortable elastic waist.",
    variants: [
      { color: "Light Blue", hex: "#7EB9D4", price: 1350, images: ["/images/categories/girls-fashion/2.jpg"] },
    ],
  },
  {
    id: "g3",
    name: "Girls Gingham Check Drawstring Pants",
    category: "Girls Fashion",
    categorySlug: "girls-fashion",
    description: "Charming blue-and-white checkered gingham pants with a relaxed straight-leg fit and adjustable drawstring waist.",
    variants: [
      { color: "Blue Check", hex: "#5B8DB8", price: 990, images: ["/images/categories/girls-fashion/3.jpg"] },
    ],
  },
  {
    id: "g4",
    name: "Girls Floral Embroidered Baggy Jeans",
    category: "Girls Fashion",
    categorySlug: "girls-fashion",
    description: "Playful light-wash baggy denim jeans featuring colorful embroidered flower details with elastic waistband.",
    variants: [
      { color: "Light Wash", hex: "#A8C0D6", price: 1450, images: ["/images/categories/girls-fashion/4.jpg"] },
    ],
  },
];