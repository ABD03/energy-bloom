"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";

const SERVICES = [
  {
    tag: "Basic Pranic Healing",
    title: "Cleanse. Energise. Restore.",
    desc: "Clear stagnated energy from your aura and chakras so the body can heal at its natural pace.",
    icon: "✨",
  },
  {
    tag: "Advanced Pranic Healing",
    title: "Deeper healing with colour prana.",
    desc: "Advanced colour techniques for faster results on complex, chronic conditions.",
    icon: "🌸",
  },
  {
    tag: "Pranic Psychotherapy",
    title: "Release the weight you carry.",
    desc: "Dissolve emotional trauma, phobias, and negative thought patterns at the source.",
    icon: "🧠",
  },
  {
    tag: "Crystal Healing",
    title: "Amplify your energy field.",
    desc: "Programmed crystals aligned with your chakras to hold and multiply healing energy.",
    icon: "🌿",
  },
  {
    tag: "Meditation Sessions",
    title: "Twin Hearts, one calm mind.",
    desc: "Guided meditation for peace, clarity, and inner illumination — daily practice you'll love.",
    icon: "🕯️",
  },
  {
    tag: "Wellness Workshops",
    title: "Learn to heal yourself.",
    desc: "Certified courses so you can bring pranic healing home to family and friends.",
    icon: "🏥",
  },
];

export default function Services() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth || 320) + 20;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="pl-4 sm:pl-8 lg:pl-16">
        <div className="flex items-end justify-between pr-4 sm:pr-8 lg:pr-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 leading-tight">
              Why our practice is the best
              <br className="hidden sm:block" />
              place to begin your healing.
            </h2>
          </div>
          <Link
            href="/book"
            className="hidden md:inline-flex items-center gap-1 text-primary font-medium hover:opacity-80"
          >
            Book a session <FiArrowRight />
          </Link>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 pr-4 sm:pr-8 lg:pr-16 scrollbar-hide"
        >
          {SERVICES.map((s) => (
            <div
              key={s.tag}
              data-card
              className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px] bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="text-[13px] font-semibold text-gray-500">
                {s.tag}
              </div>
              <div className="mt-3 text-2xl md:text-[26px] font-semibold text-gray-900 leading-snug min-h-[100px]">
                {s.title}
              </div>
              <p className="mt-2 text-[14px] text-gray-600 leading-relaxed min-h-[80px]">
                {s.desc}
              </p>
              <div className="mt-auto pt-8 relative">
                <div className="h-40 rounded-2xl bg-gradient-to-br from-primary/15 to-amber-100 flex items-center justify-center text-5xl">
                  {s.icon}
                </div>
                <Link
                  href="/book"
                  className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary transition"
                  aria-label={`Learn more about ${s.tag}`}
                >
                  <FiPlus size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pr-4 sm:pr-8 lg:pr-16">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="h-10 w-10 rounded-full bg-gray-200/60 hover:bg-gray-300 text-gray-700 flex items-center justify-center"
            aria-label="Previous"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="h-10 w-10 rounded-full bg-gray-200/60 hover:bg-gray-300 text-gray-700 flex items-center justify-center"
            aria-label="Next"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
