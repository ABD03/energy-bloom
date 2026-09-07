import Link from "next/link";
import { FiArrowRight, FiPhone } from "react-icons/fi";

export default function CtaSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/70 text-white p-10 md:p-14">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.4), transparent 40%)",
            }}
          />
          <div className="relative grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="text-[11px] uppercase tracking-widest opacity-80">
                Begin your journey
              </div>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight">
                Ready to feel lighter, clearer, calmer?
              </h2>
              <p className="mt-3 opacity-90 max-w-xl">
                Book a one-on-one session or sign up for our next workshop.
                First consultation is complimentary.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-5 py-3 rounded-full font-medium hover:bg-gray-100 transition"
              >
                Book now <FiArrowRight />
              </Link>
              <a
                href="tel:+000000000"
                className="inline-flex items-center justify-center gap-2 border border-white/40 px-5 py-3 rounded-full font-medium hover:bg-white/10 transition"
              >
                <FiPhone /> Call us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
