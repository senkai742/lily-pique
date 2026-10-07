import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ProductActions() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">

      <Link
        href={`https://wa.me/${siteConfig.socials.whatsapp.replace("+", "")}`}
        target="_blank"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-[0.98]"
      >
        <MessageCircle size={20} />
        Order on WhatsApp
      </Link>

      <Link
        href={`tel:${siteConfig.phones[0]}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-white px-6 py-4 font-semibold text-zinc-900 shadow-sm transition-all duration-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 hover:shadow-md active:scale-[0.98]"
      >
        <Phone size={20} />
        Call Now
      </Link>

    </div>
  );
}