import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Flower2,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden bg-background min-h-[calc(100vh-80px)] flex flex-col">
      
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute top-0 left-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/30 blur-[120px] opacity-60" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-primary/10 blur-[100px] opacity-50" />
      
      {/* Subtle floral watermark */}
      <div className="pointer-events-none absolute left-[10%] top-1/4 select-none overflow-hidden opacity-[0.03]">
        <Flower2 size={400} strokeWidth={0.5} className="text-primary rotate-12" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center py-8 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            
            {/* Left: Content Info */}
            <div className="order-1 space-y-10">
              
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/30 backdrop-blur-sm px-4 py-1.5 shadow-sm">
                  <Flower2 size={14} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Get in Touch
                  </span>
                </div>
                
                <h1 className="mt-2 text-4xl font-light tracking-tight text-text sm:text-5xl lg:text-6xl leading-[1.1]">
                  <span className="block">We'd Love to</span>
                  <span className="block font-serif italic text-primary mt-1">Hear From You</span>
                </h1>
                
                <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-text/70 sm:text-lg">
                  Whether you have questions about our floral arrangements, wholesale orders, or want to request a custom bouquet, our artisan team is here to assist you.
                </p>
              </div>

              {/* Info Rows */}
              <div className="space-y-8 border-t border-gold/20 pt-8 max-w-md">
                
                {/* Phone */}
                <div className="flex items-start gap-5 group">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">Phone</h2>
                    <div className="space-y-1 text-base font-medium text-text">
                      {siteConfig.phones.map((phone) => (
                        <Link key={phone} href={`tel:${phone}`} className="block hover:text-primary transition-colors">
                          {phone}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5 group">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">Email</h2>
                    <div className="space-y-1 text-base font-medium text-text break-all">
                      {siteConfig.emails.map((email) => (
                        <Link key={email} href={`mailto:${email}`} className="block hover:text-primary transition-colors">
                          {email}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-5 group">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">Studio Address</h2>
                    <p className="text-base font-medium text-text leading-relaxed">
                      {siteConfig.address}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-text/60">
                      <Clock size={14} />
                      <span className="text-xs font-semibold">Sat - Thu: 9:00 AM - 9:00 PM</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Social Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {siteConfig.socials.facebook && (
                  <Link
                    href={siteConfig.socials.facebook}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary shadow-sm transition-all hover:bg-secondary hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <FaFacebook size={16} />
                    Facebook
                  </Link>
                )}

                <Link
                  href={`https://wa.me/${siteConfig.socials.whatsapp.replace("+", "")}`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/25 transition-all hover:bg-text hover:-translate-y-0.5 hover:shadow-text/20"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </Link>
              </div>

            </div>

            {/* Right: Elegant Image (Hidden on mobile for clean layout, visible on desktop) */}
            <div className="hidden lg:block relative w-full max-w-md mx-auto lg:max-w-none">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[12rem] rounded-b-[2rem] bg-secondary shadow-2xl ring-1 ring-gold/20">
                <Image
                  src="/images/flowerabout.png"
                  alt="Contact LilyPique"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-t-[12rem] rounded-b-[2rem] ring-1 ring-inset ring-white/30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay pointer-events-none" />
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </main>
  );
}