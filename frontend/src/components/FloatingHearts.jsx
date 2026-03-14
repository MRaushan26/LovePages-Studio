import { useMemo } from 'react';

const HEARTS = Array.from({ length: 12 }, (_, i) => i);

export function FloatingHearts() {
  const hearts = useMemo(
    () =>
      HEARTS.map((idx) => {
        const left = Math.random() * 90 + 5;
        const delay = Math.random() * 3;
        const size = Math.random() * 18 + 18;
        return { idx, left, delay, size };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map(({ idx, left, delay, size }) => (
        <div
          key={idx}
          className="floating-heart absolute text-love-pink/70"
          style={{
            left: `${left}%`,
            bottom: '-20px',
            fontSize: `${size}px`,
            animationDelay: `${delay}s`,
            animationDuration: `${4 + Math.random() * 3}s`
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}
