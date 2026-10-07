import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="border-b border-zinc-100 bg-zinc-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Contact Us
          </span>
          <h1 className="mt-3 text-3xl font-normal uppercase tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            We'd Love to Hear From You
          </h1>
          <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-zinc-500 sm:text-base">
            Have questions about our products or want to place an order? 
            Reach out directly through phone, email, or WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Content Info Block */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[400px_1fr] lg:px-8">
          
          {/* Left Column: Direct Action Info */}
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              
              {/* Phone Entry */}
              <div className="border-t border-zinc-200 pt-4">
                <div className="flex items-center gap-2 text-zinc-900">
                  <Phone size={14} strokeWidth={2} />
                  <h2 className="text-xs font-bold uppercase tracking-widest">Phone</h2>
                </div>
                <div className="mt-2.5 space-y-1 text-sm font-medium text-zinc-900">
                  {siteConfig.phones.map((phone) => (
                    <Link key={phone} href={`tel:${phone}`} className="block hover:text-zinc-500 transition-colors">
                      {phone}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Email Entry */}
              <div className="border-t border-zinc-200 pt-4">
                <div className="flex items-center gap-2 text-zinc-900">
                  <Mail size={14} strokeWidth={2} />
                  <h2 className="text-xs font-bold uppercase tracking-widest">Email</h2>
                </div>
                <div className="mt-2.5 space-y-1 text-sm font-medium text-zinc-900 break-all">
                  {siteConfig.emails.map((email) => (
                    <Link key={email} href={`mailto:${email}`} className="block hover:text-zinc-500 transition-colors">
                      {email}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Address Entry */}
              <div className="border-t border-zinc-200 pt-4">
                <div className="flex items-center gap-2 text-zinc-900">
                  <MapPin size={14} strokeWidth={2} />
                  <h2 className="text-xs font-bold uppercase tracking-widest">Address</h2>
                </div>
                <p className="mt-2.5 text-sm font-medium text-zinc-900 leading-relaxed">
                  {siteConfig.address}
                </p>
              </div>

              {/* Hours Entry */}
              <div className="border-t border-zinc-200 pt-4">
                <div className="flex items-center gap-2 text-zinc-900">
                  <Clock size={14} strokeWidth={2} />
                  <h2 className="text-xs font-bold uppercase tracking-widest">Business Hours</h2>
                </div>
                <div className="mt-2.5 text-sm font-medium text-zinc-900 space-y-0.5">
                  <p>Saturday - Thursday</p>
                  <p className="text-xs font-light text-zinc-500">9:00 AM - 9:00 PM</p>
                </div>
              </div>

            </div>

            {/* Social Media Link Buttons */}
            <div className="flex gap-3 pt-4 border-t border-zinc-200">
              {siteConfig.socials.facebook && (
                <Link
                  href={siteConfig.socials.facebook}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 border border-zinc-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-900 transition hover:bg-zinc-50 rounded-none"
                >
                  <FaFacebook size={14} />
                  Facebook
                </Link>
              )}

              <Link
                href={`https://wa.me/${siteConfig.socials.whatsapp.replace("+", "")}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 bg-zinc-900 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 rounded-none"
              >
                <MessageCircle size={14} />
                WhatsApp
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Frame Map Showcase */}
          <div className="relative border border-zinc-200 bg-zinc-50 rounded-none overflow-hidden aspect-square lg:aspect-auto lg:h-[580px]">
            <iframe
              src="https://www.google.com/maps?q=Dhaka,Bangladesh&output=embed"
              className="absolute inset-0 h-full w-full grayscale contrast-125 opacity-90 transition-all hover:grayscale-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

        </div>
      </section>
    </main>
  );
}