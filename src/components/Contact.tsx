import { profile } from "@/data/resume";
import { ButtonLink } from "./Button";
import { PandaDrift } from "./Panda";
import { Download } from "./icons";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-bg-2 pt-16 sm:pt-24">
      <div className="mx-auto max-w-[76rem] px-4 sm:px-8">
        <h2 id="contact-title" className="rise title">
          Contact
        </h2>
        <p className="rise mt-3 max-w-xl text-lg text-ink-2">
          Open to internships, collaborations and technical roles in full-stack, machine learning and IoT. Email is the
          fastest way to reach me.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="link rise mt-8 inline-block break-all py-1 font-display text-[clamp(1.5rem,1rem+2.8vw,3.25rem)] font-extrabold leading-tight tracking-[-0.025em]"
        >
          {profile.email}
        </a>

        <div className="rise mt-8 flex flex-wrap gap-2.5">
          <ButtonLink href={profile.cvPath} download variant="primary" icon={<Download />}>
            Download CV
          </ButtonLink>
          <ButtonLink href={profile.linkedin} external>
            LinkedIn
          </ButtonLink>
          <ButtonLink href={profile.github} external>
            GitHub
          </ButtonLink>
        </div>

        <p className="rise mt-6 text-ink-2">
          <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="link text-ink">
            {profile.phone}
          </a>{" "}
          <span aria-hidden="true">·</span> {profile.location}
        </p>
      </div>

      <div className="mt-10">
        <PandaDrift />
      </div>
    </section>
  );
}

/** Sits on the snow drift, so its colours are fixed: the drift is pale in both themes. */
export function Footer() {
  return (
    <footer className="bg-(--drift-bottom) text-[#0b1622]">
      <div className="mx-auto flex max-w-[76rem] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 pb-8 pt-2 text-sm sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a
          href={profile.repoUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-9 items-center font-semibold underline decoration-2 underline-offset-4 hover:decoration-[#0b1622]/40"
        >
          Source for this site
        </a>
      </div>
    </footer>
  );
}
