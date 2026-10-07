import ProductActions from "./ProductActions";

interface Props {
  name: string;
  category: string;
  price: number;
  description: string;
}

export default function ProductInfo({
  name,
  category,
  price,
  description,
}: Props) {
  return (
    <div className="flex flex-col">

      {/* Category */}
      <span className="mb-4 w-fit rounded-full border border-zinc-300 bg-zinc-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-800">
        {category}
      </span>

      {/* Product Name */}
      <h1 className="text-3xl font-bold leading-tight text-black md:text-5xl">
        {name}
      </h1>

      {/* Price */}
      <div className="mt-6 border-b border-zinc-200 pb-6">
        <p className="text-4xl font-bold tracking-tight text-black">
          ৳ {price.toLocaleString("en-BD")}
        </p>

        <p className="mt-2 text-sm text-zinc-600">
          Premium quality clothing. Contact us to place your order.
        </p>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">
          Product Details
        </h2>

        <p className="leading-8 text-zinc-700">
          {description}
        </p>
      </div>

      {/* Actions */}
      <ProductActions />

    </div>
  );
}