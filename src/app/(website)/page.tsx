import Hero from "./home/hero";
import About from "./home/about";
import Services from "./home/services";
import Benefits from "./home/benefits";
import CtaSection from "./home/ctaSection";

export default async function Website() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Benefits />
      <CtaSection />
    </>
  );
}
