import { useEffect, useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { useSmoothScroll } from "@/lib/useSmoothScroll";
import { Loader } from "./components/Loader";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { About } from "./components/About";
import { Timeline } from "./components/Timeline";
import { Contact, Footer } from "./components/Contact";
import { SledGame } from "./components/SledGame";

export default function App() {
  const { theme, toggle } = useTheme();
  /** True from the moment the loading screen starts to lift: the hero plays its arrival and scrolling wakes up. */
  const [arrived, setArrived] = useState(false);
  useSmoothScroll(arrived);

  // A link opened straight to a section (…/#work) is followed once the page is up.
  useEffect(() => {
    if (!arrived || location.hash.length < 2) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [arrived]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Loader onLift={() => setArrived(true)} />
      <Header theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero arrived={arrived} />
        <Work />
        <SledGame />
        <About />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
