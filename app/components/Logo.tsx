import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface LogoProps {
  showText?: boolean; // Kept for backwards compatibility but ignored
  size?: number;
  dark?: boolean;
}

export default function Logo({
  size = 50,
  dark = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className="group flex items-center transition-all duration-300 hover:opacity-80"
    >
      <div className="relative flex items-center justify-start -ml-2 sm:ml-0">
        <Image
          src="/images/navlogo.png"
          alt={siteConfig.name}
          width={size * 4}
          height={size * 1.2}
          priority
          className={`object-contain w-42 ml-2 md:w-40 h-auto transition-transform duration-300 group-hover:scale-105 ${
            dark ? "brightness-0 invert opacity-90" : "drop-shadow-sm"
          }`}
        />
      </div>
    </Link>
  );
}