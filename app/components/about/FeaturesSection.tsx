import {
  Shirt,
  Sparkles,
  Handshake,
  Truck,
} from "lucide-react";

const features = [
  {
    title: "Premium Quality",
    description:
      "Carefully selected clothing with comfort, durability and modern style.",
    icon: Shirt,
  },
  {
    title: "Latest Collection",
    description:
      "Discover new fashion trends for men, women, boys and girls.",
    icon: Sparkles,
  },
  {
    title: "Trusted Service",
    description:
      "Dedicated to providing a reliable and satisfying shopping experience.",
    icon: Handshake,
  },
  {
    title: "Wholesale & Retail",
    description:
      "Serving both individual customers and wholesale buyers.",
    icon: Truck,
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-stone-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-4xl font-bold text-zinc-900">
            More Than Just Clothing
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-600">
            We focus on quality products, customer satisfaction and a wide
            variety of fashion choices for every member of the family.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white transition-transform duration-300 group-hover:scale-110">

                  <Icon size={30} />

                </div>

                <h3 className="text-xl font-semibold text-zinc-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-600">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}