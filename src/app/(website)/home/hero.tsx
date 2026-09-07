import Link from "next/link";
import { FiArrowRight, FiPlayCircle } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-white to-amber-50">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.15), transparent 40%), radial-gradient(circle at 80% 30%, rgba(250,204,21,0.15), transparent 40%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-0 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-3 py-1 rounded-full text-[11px] uppercase tracking-wider text-primary font-semibold shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Energy · Wellness · Healing
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-gray-900">
            Restore your energy.
            <br />
            <span className="text-primary">Reclaim your calm.</span>
          </h1>
          <p className="mt-5 text-[15px] md:text-base text-gray-600 max-w-lg leading-relaxed">
            A gentle, no-touch pranic healing practice that clears blockages,
            balances your energy centres, and supports the body's natural
            ability to heal.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              Book now <FiArrowRight />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-full font-medium text-gray-800 hover:border-primary hover:text-primary transition"
            >
              <FiPlayCircle /> Explore services
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-[12px] text-gray-500">
            <div>
              <div className="text-xl font-bold text-gray-900">10k+</div>
              Sessions delivered
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <div className="text-xl font-bold text-gray-900">20+</div>
              Years of practice
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <div className="text-xl font-bold text-gray-900">4.9★</div>
              Client rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
