import { useState } from "react";
import { useLenis } from "@/lib/useLenis";
import { useScrollTriggerRefresh } from "@/lib/useScrollTriggerRefresh";
import { Preloader } from "./components/Preloader";
import { Grain } from "./components/Grain";
import { CursorLight } from "./components/CursorLight";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { Nav } from "./components/Nav";
import { SectionRail } from "./components/SectionRail";
import { Hero } from "./components/hero/Hero";
import { StatementBreak } from "./components/ui/StatementBreak";
import {
  About,
  Approach,
  Experience,
  Projects,
  Skills,
  Certifications,
  OpenSource,
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
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <SectionRail />

      <main>
        <Hero ready={ready} />
        <About />
        <Approach />
        <Experience />
        <StatementBreak text="Three domains, one obsession: shipping things that actually work in the real world." />
        <Projects />
        <Skills />
        <Certifications />
        <OpenSource />
        <Leadership />
        <Awards />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
