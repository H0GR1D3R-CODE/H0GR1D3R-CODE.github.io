import { useRef, useState } from "react";
import { useLenis } from "@/lib/useLenis";
import { useScrollTriggerRefresh } from "@/lib/useScrollTriggerRefresh";
import { useCommandPalette } from "@/lib/useCommandPalette";
import { Preloader } from "./components/Preloader";
import { Grain } from "./components/Grain";
import { CursorLight } from "./components/CursorLight";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { CommandPalette } from "./components/CommandPalette";
import { Nav } from "./components/Nav";
import { SectionRail } from "./components/SectionRail";
import { Hero } from "./components/hero/Hero";
import { StatementBreak } from "./components/ui/StatementBreak";
import { SignalSpine } from "./components/ui/SignalSpine";
import {
  About,
  Metrics,
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
  const pageRef = useRef<HTMLDivElement | null>(null);
  const palette = useCommandPalette();
  useLenis();
  useScrollTriggerRefresh(ready);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Preloader onDone={() => setReady(true)} />
      <Grain />
      <CursorLight />
      <CustomCursor />
      <ScrollProgress />
      <CommandPalette open={palette.open} onClose={() => palette.setOpen(false)} />
      <Nav onOpenPalette={() => palette.setOpen(true)} />
      <SectionRail />

      <div ref={pageRef} className="relative">
        <SignalSpine containerRef={pageRef} />

        <main id="main-content">
          <Hero ready={ready} />
          <About />
          <Metrics />
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
      </div>
    </>
  );
}
