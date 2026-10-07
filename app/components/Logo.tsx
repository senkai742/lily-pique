import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface LogoProps {
  showText?: boolean;
  size?: number;
  dark?: boolean;
}

export default function Logo({
  showText = false,
  size = 50,
  dark = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 transition-opacity hover:opacity-90"
    >
      <Image
        src="/images/logo.png"
        alt={siteConfig.name}
        width={size}
        height={size}
        priority
        className="object-contain"
      />

      {showText && (
        <div className="leading-tight">
          <h1
            className={`text-xl font-bold tracking-tight ${
              dark ? "text-white" : "text-zinc-900"
            }`}
          >
            LilyPique
          </h1>

          <p
            className={`mt-1 text-xs uppercase tracking-[0.25em] ${
              dark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Premium Fashion
          </p>
        </div>
      )}
    </Link>
  );
}