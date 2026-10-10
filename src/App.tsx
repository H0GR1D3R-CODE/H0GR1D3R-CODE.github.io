import { useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { useSmoothScroll } from "@/lib/useSmoothScroll";
import { Loader } from "./components/Loader";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { About } from "./components/About";
import { Timeline } from "./components/Timeline";
import { Contact, Footer } from "./components/Contact";
import { SledRun } from "./components/Scenery";

export default function App() {
  const { theme, toggle } = useTheme();
  /** True from the moment the loading screen starts to lift: the hero plays its arrival and scrolling wakes up. */
  const [arrived, setArrived] = useState(false);
  useSmoothScroll(arrived);

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
        <SledRun phrase="Past the tutorial stage" />
        <About />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
