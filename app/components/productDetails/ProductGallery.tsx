"use client";

import Image from "next/image";

interface Props {
  image: string;
  name: string;
}

export default function ProductGallery({
  image,
  name,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-300 bg-white shadow-sm">

      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          priority
          quality={95}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

    </div>
  );
}