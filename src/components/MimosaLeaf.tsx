/**
 * 含羞草葉片收合互動元件
 * 點擊後小葉依序收合，3 秒後自動展開
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

// 單一小葉（leaflet）：以葉柄基部為旋轉軸，收合時向中線旋轉
function Leaflet({
  x, y, angle, foldAngle, progress, delay,
}: {
  x: number; y: number; angle: number; foldAngle: number;
  progress: number; delay: number;
}) {
  const easedP = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
  const currentAngle = angle + foldAngle * easedP;
  const scaleY = 1 - 0.55 * easedP;

  return (
    <g transform={`translate(${x},${y}) rotate(${currentAngle})`}>
      <ellipse cx="0" cy="-7" rx="4.5" ry="7"
        fill="#3a8c3a" stroke="#1f5c1f" strokeWidth="0.4"
        style={{ transformOrigin: '0 0', transform: `scaleY(${scaleY})` }}
      />
    </g>
  );
}

// 一根羽狀複葉（pinna）：含左右各 N 對小葉
function Pinna({
  x, y, angle, length, leafletCount, progress, delayOffset,
}: {
  x: number; y: number; angle: number; length: number;
  leafletCount: number; progress: number; delayOffset: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const tipX = x + Math.cos(rad) * length;
  const tipY = y + Math.sin(rad) * length;

  // 羽軸收合：向下旋轉
  const pinnaFold = Math.max(0, Math.min(1, (progress - delayOffset) / (1 - delayOffset)));
  const foldedAngle = angle + (angle < 0 ? -25 : 25) * pinnaFold;
  const foldedRad = (foldedAngle * Math.PI) / 180;

  const leaflets: React.ReactNode[] = [];
  for (let i = 0; i < leafletCount; i++) {
    const t = (i + 1) / (leafletCount + 1);
    const lx = x + Math.cos(foldedRad) * length * t;
    const ly = y + Math.sin(foldedRad) * length * t;
    const leafDelay = delayOffset + t * 0.25;

    // 上方小葉
    leaflets.push(
      <Leaflet key={`u${i}`} x={lx} y={ly}
        angle={foldedAngle - 90} foldAngle={80}
        progress={progress} delay={leafDelay}/>
    );
    // 下方小葉
    leaflets.push(
      <Leaflet key={`d${i}`} x={lx} y={ly}
        angle={foldedAngle + 90} foldAngle={-80}
        progress={progress} delay={leafDelay}/>
    );
  }

  return (
    <g>
      <line
        x1={x} y1={y}
        x2={x + Math.cos(foldedRad) * length}
        y2={y + Math.sin(foldedRad) * length}
        stroke="#2a6020" strokeWidth="1.5" strokeLinecap="round"
      />
      {leaflets}
    </g>
  );
}

export default function MimosaLeaf() {
  const [progress, setProgress] = useState(0); // 0=展開, 1=完全收合
  const [folding, setFolding] = useState(false);

  useEffect(() => {
    if (!folding) return;
    let frame: number;
    let start: number | null = null;
    const FOLD_MS = 1200;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / FOLD_MS, 1);
      setProgress(p);
      if (p < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        // 停頓 2.5 秒後展開
        setTimeout(() => {
          let start2: number | null = null;
          const unfold = (ts2: number) => {
            if (!start2) start2 = ts2;
            const p2 = Math.max(0, 1 - (ts2 - start2) / 1000);
            setProgress(p2);
            if (p2 > 0) requestAnimationFrame(unfold);
            else setFolding(false);
          };
          requestAnimationFrame(unfold);
        }, 2500);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [folding]);

  const handleClick = () => {
    if (!folding) { setFolding(true); setProgress(0); }
  };

  // 主莖水平，左右各 4 根羽狀複葉
  const stemY = 110;
  const pinnae = [
    { x: 70,  y: stemY, angle: -55, len: 38, delay: 0.0  },
    { x: 90,  y: stemY, angle: -48, len: 42, delay: 0.06 },
    { x: 110, y: stemY, angle: -50, len: 40, delay: 0.12 },
    { x: 130, y: stemY, angle: -53, len: 36, delay: 0.18 },
    { x: 70,  y: stemY, angle:  55, len: 38, delay: 0.0  },
    { x: 90,  y: stemY, angle:  48, len: 42, delay: 0.06 },
    { x: 110, y: stemY, angle:  50, len: 40, delay: 0.12 },
    { x: 130, y: stemY, angle:  53, len: 36, delay: 0.18 },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 200 170" width="260" height="221"
        className="cursor-pointer select-none"
        onClick={handleClick}
        style={{ touchAction: 'manipulation' }}
      >
        {/* 主莖 */}
        <line x1="50" y1={stemY} x2="155" y2={stemY}
          stroke="#2a6020" strokeWidth="2.5" strokeLinecap="round"/>
        {/* 葉柄 */}
        <line x1="50" y1={stemY} x2="30" y2={stemY + 18}
          stroke="#2a6020" strokeWidth="2" strokeLinecap="round"/>

        {pinnae.map((p, i) => (
          <Pinna key={i}
            x={p.x} y={p.y} angle={p.angle} length={p.len}
            leafletCount={4} progress={progress} delayOffset={p.delay}
          />
        ))}
      </svg>

      <motion.button
        onClick={handleClick}
        disabled={folding}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow
          bg-pink-100 text-pink-700 border border-pink-200
          hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {folding ? '它在害羞中…' : '輕輕碰它 👆'}
      </motion.button>

      <p className="text-xs text-slate-400 text-center">
        {folding ? '等一下，它會慢慢展開！' : '點擊葉片，看它害羞縮起來'}
      </p>
    </div>
  );
}
