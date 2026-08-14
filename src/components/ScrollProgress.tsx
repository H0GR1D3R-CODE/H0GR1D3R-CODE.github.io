import { useScrollProgress } from "@/lib/useScrollProgress";

/** Fixed hairline at the top of the viewport tracking page scroll percentage. */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[2px] bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-gold to-gold-lite"
        style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
      />
    </div>
  );
}
