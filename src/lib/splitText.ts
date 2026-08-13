/**
 * Splits an element's text content into per-character <span> wrappers,
 * each clipped by an outer overflow:hidden span so chars can lift out of
 * their own mask on scroll — a lightweight stand-in for GSAP SplitText
 * that doesn't require the paid plugin.
 */
export function splitChars(el: HTMLElement): HTMLElement[] {
  const words = el.textContent?.split(/(\s+)/) ?? [];
  el.textContent = "";
  const chars: HTMLElement[] = [];

  words.forEach((word) => {
    if (word.trim() === "") {
      el.appendChild(document.createTextNode(word));
      return;
    }
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-flex";
    wordSpan.style.whiteSpace = "pre";

    [...word].forEach((ch) => {
      const mask = document.createElement("span");
      mask.style.display = "inline-block";
      mask.style.overflow = "clip";

      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.style.willChange = "transform";
      inner.textContent = ch;

      mask.appendChild(inner);
      wordSpan.appendChild(mask);
      chars.push(inner);
    });

    el.appendChild(wordSpan);
  });

  return chars;
}
