import ProductCard from "@/app/components/home/ProductCard";
import { products } from "@/app/data/products";

interface Props {
  products: typeof products;
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </div>
  );
}