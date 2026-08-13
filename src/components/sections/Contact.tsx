import { useState, type FormEvent } from "react";
import { useReveal } from "@/lib/useReveal";
import { RevealText } from "../ui/RevealText";
import { SectionHeading } from "../ui/SectionHeading";
import { MagneticLink } from "../ui/MagneticLink";
import { profile } from "@/data/resume";

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined;

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const ref = useReveal<HTMLDivElement>();
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const hasFormspree = Boolean(FORMSPREE_ID);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!hasFormspree) {
      const subject = encodeURIComponent(`Portfolio contact from ${values.name || "a visitor"}`);
      const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36 bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <SectionHeading index="09" eyebrow="Contact" title="Let's build something worth shipping." />

        <div ref={ref} className="mt-16 grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <RevealText as="div" className="flex flex-col gap-8">
            <p className="text-lg text-muted leading-relaxed max-w-md">
              Open to internships, collaborations, and technical roles across full-stack, IoT, and
              applied AI. Reach out directly, or use the form.
            </p>

            <div className="flex flex-col gap-4">
              <a href={`mailto:${profile.email}`} className="group flex items-center gap-3 text-bone hover:text-gold transition-colors w-fit">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted w-20 shrink-0">Email</span>
                <span className="font-display text-lg">{profile.email}</span>
              </a>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="group flex items-center gap-3 text-bone hover:text-gold transition-colors w-fit">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted w-20 shrink-0">Phone</span>
                <span className="font-display text-lg">{profile.phone}</span>
              </a>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted w-20 shrink-0">Location</span>
                <span className="font-display text-lg text-bone">{profile.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <MagneticLink href={profile.linkedin} target="_blank" rel="noreferrer noopener" variant="outline">
                LinkedIn
              </MagneticLink>
              <MagneticLink href={profile.github} target="_blank" rel="noreferrer noopener" variant="outline">
                GitHub
              </MagneticLink>
              <MagneticLink href={profile.cvPath} variant="ghost" download>
                Download CV
              </MagneticLink>
            </div>
          </RevealText>

          <RevealText as="div" className="flex flex-col gap-5" delay={100}>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Name</span>
                  <input
                    required
                    type="text"
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    className="rounded-lg border border-gold-dim bg-transparent px-4 py-3 text-bone outline-none focus:border-gold transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Email</span>
                  <input
                    required
                    type="email"
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    className="rounded-lg border border-gold-dim bg-transparent px-4 py-3 text-bone outline-none focus:border-gold transition-colors"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Message</span>
                <textarea
                  required
                  rows={5}
                  value={values.message}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                  className="resize-none rounded-lg border border-gold-dim bg-transparent px-4 py-3 text-bone outline-none focus:border-gold transition-colors"
                />
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="self-start rounded-full bg-gold px-8 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-lite disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : hasFormspree ? "Send message" : "Open in mail app"}
              </button>

              {status === "success" && (
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold">
                  Message sent — thank you, I'll reply soon.
                </p>
              )}
              {status === "error" && (
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-red-400">
                  Something went wrong — email me directly at {profile.email}.
                </p>
              )}
            </form>
          </RevealText>
        </div>
      </div>
    </section>
  );
}
