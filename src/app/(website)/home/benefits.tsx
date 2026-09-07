const BENEFITS = [
  { icon: "💫", title: "Stress relief", text: "Release tension and restore inner calm." },
  { icon: "😴", title: "Better sleep", text: "Fall asleep faster, wake up refreshed." },
  { icon: "❤️‍🩹", title: "Emotional balance", text: "Ease anxiety, grief, and mood swings." },
  { icon: "⚡", title: "More energy", text: "Feel lighter, clearer, more alive." },
  { icon: "🩺", title: "Faster recovery", text: "Support the body's natural healing." },
  { icon: "🌈", title: "Clarity & focus", text: "Sharper mind, calmer decisions." },
];

export default function Benefits() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">
            Why choose us
          </div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-900">
            Benefits you can feel from your very first session
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-white hover:border-primary/30 hover:shadow-sm transition"
            >
              <div className="text-3xl">{b.icon}</div>
              <div className="mt-3 font-semibold text-gray-900">{b.title}</div>
              <div className="text-[13px] text-gray-600 mt-1">{b.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
