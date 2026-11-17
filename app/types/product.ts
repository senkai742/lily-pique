export type ColorVariant = {
  color: string;   // display name e.g. "Camel Beige"
  hex: string;     // e.g. "#C4A882"
  price: number;
  images: string[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  vipEarlyAccess?: boolean;
  description: string;
  variants: ColorVariant[];
};
