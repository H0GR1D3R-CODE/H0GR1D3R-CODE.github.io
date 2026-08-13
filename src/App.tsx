import { useState } from "react";
import { useLenis } from "@/lib/useLenis";
import { useScrollTriggerRefresh } from "@/lib/useScrollTriggerRefresh";
import { Preloader } from "./components/Preloader";
import { Grain } from "./components/Grain";
import { CursorLight } from "./components/CursorLight";
import { Nav } from "./components/Nav";
import { SectionRail } from "./components/SectionRail";
import { Hero } from "./components/hero/Hero";
import {
  About,
  Experience,
  Projects,
  Skills,
  Certifications,
  Leadership,
  Awards,
  Education,
  Contact,
  Footer,
} from "./components/sections";

export default function App() {
  const [ready, setReady] = useState(false);
  useLenis();
  useScrollTriggerRefresh(ready);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Grain />
      <CursorLight />
      <Nav />
      <SectionRail />

      <main>
        <Hero ready={ready} />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Leadership />
        <Awards />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
