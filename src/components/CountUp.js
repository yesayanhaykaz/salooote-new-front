"use client";
import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

export default function CountUp({ end, suffix = "", prefix = "", duration = 1800, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView || started) return;
    setStarted(true);

    const numericEnd = parseFloat(String(end).replace(/[^0-9.]/g, ""));
    const startTime = performance.now();

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      setCount(Math.floor(eased * numericEnd));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(numericEnd);
    };

    requestAnimationFrame(step);
  }, [isInView, started, end, duration]);

  const displayEnd = String(end);
  const hasK = displayEnd.includes("K");
  const hasStar = displayEnd.includes("★");
  const displayCount = hasStar ? count : hasK ? `${count}K` : count;

  return (
    <span ref={ref} className={className}>
      {prefix}{displayCount}{hasStar ? "★" : ""}{!hasStar && suffix}
    </span>
  );
}
