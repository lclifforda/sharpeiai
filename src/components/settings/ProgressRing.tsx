import React from "react";

function ProgressRing({ value, size = 36, stroke = 3 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
        stroke="url(#ring-gradient)" strokeDasharray={circ} strokeDashoffset={offset}
        className="transition-all duration-500"
      />
      <defs>
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(185, 85%, 50%)" />
          <stop offset="100%" stopColor="hsl(260, 85%, 60%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default React.memo(ProgressRing);
