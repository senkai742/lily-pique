import {
  Flower2,
  Palette,
  Heart,
  Truck,
} from "lucide-react";

const features = [
  {
    title: "Premium Blooms",
    description:
      "Carefully selected, fresh flowers with vibrant colors and lasting fragrance.",
    icon: Flower2,
  },
  {
    title: "Artisan Design",
    description:
      "Handcrafted arrangements tailored to bring your floral vision to life.",
    icon: Palette,
  },
  {
    title: "Made with Love",
    description:
      "Dedicated to providing a reliable, personal, and satisfying experience.",
    icon: Heart,
  },
  {
    title: "Fresh Delivery",
    description:
      "Careful and timely delivery to ensure your flowers arrive in perfect condition.",
    icon: Truck,
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-secondary/10 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Why Choose Us
          </p>
          <h2 className="mt-4 text-4xl font-light text-text">
            <span className="block">More Than Just</span>
            <span className="block font-serif italic text-primary mt-1">A Flower Shop</span>
          </h2>
          <p className="mt-5 text-base font-light leading-relaxed text-text/70 sm:text-lg">
            We focus on the freshest blooms, artisan craftsmanship, and ensuring that every arrangement tells a beautiful story.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-[2.5rem] border border-gold/15 bg-white/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:bg-white backdrop-blur-sm"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-inner">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif text-text group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-text/70">
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