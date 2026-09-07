import { FiCheckCircle } from "react-icons/fi";

const POINTS = [
  "Non-touch energy healing rooted in ancient traditions",
  "Complements medical treatment, does not replace it",
  "Practised worldwide by certified healers",
  "Safe for children, adults, and seniors",
];

export default function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="aspect-4/3 ">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTVX3UAuZqnfEfeiF20EAzzCdlxEy2tlGJW6S0pbDbGA&s=10"
              alt="Pranic healing session"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white shadow-lg rounded-2xl p-4 border border-gray-100 max-w-xs">
            <div className="text-primary text-2xl font-bold">98%</div>
            <div className="text-[12px] text-gray-500">
              Report feeling lighter after their first session
            </div>
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">
            About us
          </div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-900">
            A gentle path to wellness rooted in ancient wisdom
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Pranic healing works with the body's own life energy (prana) to
            clear stagnated energy, dissolve blockages, and restore natural
            balance. Our practitioners are trained in a systematic,
            evidence-based approach — no touch required.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[14px] text-gray-700">
                <FiCheckCircle className="text-primary mt-0.5 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
