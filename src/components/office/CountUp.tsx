import { useEffect, useRef, useState } from "react";
export function CountUp({ value }: { value: number }) {
  const node = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (
      !node.current ||
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start: number | undefined;
      const animate = (time: number) => {
        start ??= time;
        const t = Math.min((time - start) / 900, 1);
        setDisplay(Math.round(value * (1 - (1 - t) ** 3)));
        if (t < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    });
    observer.observe(node.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return (
    <strong className="count-number" aria-label={String(value)}>
      <span ref={node} aria-hidden="true">
        {display}
      </span>
    </strong>
  );
}
