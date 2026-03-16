import { useEffect, useMemo, useState } from 'react';

const COLORS = ['#f43f5e', '#fb7185', '#fbbf24', '#22c55e', '#38bdf8', '#a855f7'];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export function ConfettiBurst({ active, duration = 2500 }) {
  const [show, setShow] = useState(active);

  useEffect(() => {
    if (!active) return;
    setShow(true);
    const t = window.setTimeout(() => setShow(false), duration);
    return () => window.clearTimeout(t);
  }, [active, duration]);

  const pieces = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 60 }, (_, i) => ({
      key: i,
      left: random(10, 90),
      rotate: random(0, 360),
      delay: random(0, 0.4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: random(6, 12)
    }));
  }, [active]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.key}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
}
