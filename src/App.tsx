import { useTheme } from "@/lib/useTheme";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { About } from "./components/About";
import { Timeline } from "./components/Timeline";
import { Contact, Footer } from "./components/Contact";
import { SledRun } from "./components/Scenery";

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero />
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
