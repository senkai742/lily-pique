import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  return (
    <section className="py-12 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-2xl bg-zinc-900 md:rounded-[32px]">

          <div className="grid gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-2 lg:gap-16 lg:p-16">

            {/* Left */}
            <div className="flex flex-col justify-center">

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
                Contact
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Place an Order?
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300 lg:text-lg lg:leading-8">
                Contact LilyPique today for wholesale and retail clothing.
                We're always happy to assist you with product inquiries,
                pricing and bulk orders.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  href={`tel:${siteConfig.phones[0]}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-zinc-900 transition hover:bg-zinc-200 sm:w-auto"
                >
                  <Phone size={18} />
                  Call Now
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-600 px-6 py-3.5 font-medium text-white transition hover:bg-zinc-800 sm:w-auto"
                >
                  Contact Page
                  <ArrowRight size={18} />
                </Link>

              </div>

            </div>

            {/* Right */}
            <div className="grid gap-4">

              {/* Phone */}
              <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-900">
                  <Phone size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Phone
                  </h3>

                  {siteConfig.phones.map((phone, index) => (
                    <Link
                      key={index}
                      href={`tel:${phone}`}
                      className="mt-1 block break-all text-sm leading-6 text-zinc-300 transition hover:text-white"
                    >
                      {phone}
                    </Link>
                  ))}
                </div>

              </div>

              {/* Email */}
              <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-900">
                  <Mail size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Email
                  </h3>

                  {siteConfig.emails.map((email, index) => (
                    <Link
                      key={index}
                      href={`mailto:${email}`}
                      className="mt-1 block break-all text-sm leading-6 text-zinc-300 transition hover:text-white"
                    >
                      {email}
                    </Link>
                  ))}
                </div>

              </div>

              {/* Address */}
              <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-900">
                  <MapPin size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Address
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {siteConfig.address}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}