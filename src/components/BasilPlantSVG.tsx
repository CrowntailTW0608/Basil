import React from 'react';

interface Props {
  growth: number;   // 0–100
  health: number;   // 0–100
  paused?: boolean;
}

/** 單片九層塔葉：葉基 (0,0)，葉尖朝 -Y */
function Leaf({ fill, vein }: { fill: string; vein: string }) {
  return (
    <g>
      <path
        d="M 0,0 C -6,-1 -12,-6 -11,-14 C -10,-20 -5,-23 0,-25
           C  5,-23  10,-20  11,-14 C  12,-6   6,-1   0,0 Z"
        fill={fill} stroke={vein} strokeWidth="0.4"
      />
      <line x1="0" y1="-0.5" x2="0"  y2="-24" stroke={vein} strokeWidth="0.7"/>
      <line x1="0" y1="-9"   x2="-8" y2="-13" stroke={vein} strokeWidth="0.35" opacity="0.65"/>
      <line x1="0" y1="-9"   x2=" 8" y2="-13" stroke={vein} strokeWidth="0.35" opacity="0.65"/>
      <line x1="0" y1="-16"  x2="-6" y2="-19" stroke={vein} strokeWidth="0.35" opacity="0.65"/>
      <line x1="0" y1="-16"  x2=" 6" y2="-19" stroke={vein} strokeWidth="0.35" opacity="0.65"/>
    </g>
  );
}

/** 一對葉片，各自旋轉 r1 / r2 度後縮放 sc 倍 */
function LeafPair({ x, y, r1, r2, sc, fill, vein }: {
  x: number; y: number; r1: number; r2: number; sc: number;
  fill: string; vein: string;
}) {
  return (
    <g>
      <g transform={`translate(${x},${y}) rotate(${r1}) scale(${sc})`}><Leaf fill={fill} vein={vein}/></g>
      <g transform={`translate(${x},${y}) rotate(${r2}) scale(${sc})`}><Leaf fill={fill} vein={vein}/></g>
    </g>
  );
}

export default function BasilPlantSVG({ growth, health, paused = false }: Props) {
  const sick  = health < 30;
  const fill  = paused ? '#94a3b8' : sick ? '#ca8a04' : '#4ade80';
  const vein  = paused ? '#475569' : sick ? '#78350f' : '#166534';
  const stemC = paused ? '#94a3b8' : sick ? '#a16207' : '#166534';
  const lp    = { fill, vein };  // 傳給 LeafPair 的顏色 shorthand

  // ── 主莖：0→30% 生長完畢，終點為分枝節 (80, 95) ──────────
  const mainFrac = Math.min(1, growth / 30);
  const mainTipY = 161 - mainFrac * 66;   // 161 → 95

  // ── 左右分枝：30→80% 生長 ────────────────────────────────
  const brFrac = Math.max(0, Math.min(1, (growth - 30) / 50));
  const BX = 80;  const BY = 95;
  const LX = 46;  const LY = 44;   // 左枝終點
  const RX = 114; const RY = 44;   // 右枝終點（對稱）

  const lTipX = BX + brFrac * (LX - BX);
  const lTipY = BY + brFrac * (LY - BY);
  const rTipX = BX + brFrac * (RX - BX);
  const rTipY = BY + brFrac * (RY - BY);

  // ── 小枝：80→100% 從各枝尖再分叉 ────────────────────────
  const subFrac = Math.max(0, Math.min(1, (growth - 80) / 20));
  const llX = LX + subFrac * (28  - LX);  const llY = LY + subFrac * (17 - LY); // 左枝→左小枝
  const lrX = LX + subFrac * (64  - LX);  const lrY = LY + subFrac * (17 - LY); // 左枝→右小枝
  const rlX = RX + subFrac * (96  - RX);  const rlY = RY + subFrac * (17 - RY); // 右枝→左小枝
  const rrX = RX + subFrac * (132 - RX);  const rrY = RY + subFrac * (17 - RY); // 右枝→右小枝

  const s = (min: number) => growth >= min;

  return (
    <svg viewBox="0 0 160 200" width="160" height="200" xmlns="http://www.w3.org/2000/svg">

      {/* ── 花盆 ── */}
      <rect x="52" y="162" width="56" height="7" rx="3.5" fill="#92400e"/>
      <path d="M55,169 L61,190 L99,190 L105,169 Z" fill="#b45309"/>
      <path d="M61,190 L99,190 L97,193 L63,193 Z" fill="#92400e"/>
      <path d="M56,170 L61,185 L65,185 L60,170 Z" fill="#d97706" opacity="0.3"/>
      <ellipse cx="80" cy="164" rx="26" ry="5" fill="#78350f"/>

      {/* ── 主莖 ── */}
      {mainFrac > 0 && (
        <line x1="80" y1="161" x2="80" y2={mainTipY}
          stroke={stemC} strokeWidth="2.5" strokeLinecap="round"/>
      )}

      {/* ── 主莖葉對 ── */}
      {s(7)  && <LeafPair x={80} y={148} r1={-70} r2={70}  sc={1.00} {...lp}/>}
      {s(20) && <LeafPair x={80} y={126} r1={-70} r2={70}  sc={0.88} {...lp}/>}

      {/* ── 左右分枝 ── */}
      {growth >= 30 && <>
        <line x1={BX} y1={BY} x2={lTipX} y2={lTipY} stroke={stemC} strokeWidth="2.0" strokeLinecap="round"/>
        <line x1={BX} y1={BY} x2={rTipX} y2={rTipY} stroke={stemC} strokeWidth="2.0" strokeLinecap="round"/>
      </>}

      {/* ── 左枝葉對 ── */}
      {s(44) && <LeafPair x={66} y={76}  r1={-65} r2={0}  sc={0.78} {...lp}/>}
      {s(62) && <LeafPair x={55} y={59}  r1={-65} r2={0}  sc={0.68} {...lp}/>}

      {/* ── 右枝葉對 ── */}
      {s(44) && <LeafPair x={94} y={76}  r1={65}  r2={0}  sc={0.78} {...lp}/>}
      {s(62) && <LeafPair x={105} y={59} r1={65}  r2={0}  sc={0.68} {...lp}/>}

      {/* ── 枝尖頂芽（55–80%，跟著枝尖移動）── */}
      {s(55) && !s(80) && <>
        <path d={`M${lTipX},${lTipY} C${lTipX-3},${lTipY-5} ${lTipX-3},${lTipY-11} ${lTipX},${lTipY-13}
                  C${lTipX+3},${lTipY-11} ${lTipX+3},${lTipY-5} ${lTipX},${lTipY} Z`}
          fill={fill} stroke={vein} strokeWidth="0.4"/>
        <path d={`M${rTipX},${rTipY} C${rTipX-3},${rTipY-5} ${rTipX-3},${rTipY-11} ${rTipX},${rTipY-13}
                  C${rTipX+3},${rTipY-11} ${rTipX+3},${rTipY-5} ${rTipX},${rTipY} Z`}
          fill={fill} stroke={vein} strokeWidth="0.4"/>
      </>}

      {/* ── 小枝（80%+）── */}
      {s(80) && <>
        <line x1={LX} y1={LY} x2={llX} y2={llY} stroke={stemC} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={LX} y1={LY} x2={lrX} y2={lrY} stroke={stemC} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={RX} y1={RY} x2={rlX} y2={rlY} stroke={stemC} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={RX} y1={RY} x2={rrX} y2={rrY} stroke={stemC} strokeWidth="1.5" strokeLinecap="round"/>
      </>}

      {/* ── 小枝葉片（88%+）── */}
      {s(88) && <>
        <LeafPair x={37}  y={27} r1={-60} r2={10}  sc={0.52} {...lp}/>
        <LeafPair x={57}  y={27} r1={-20} r2={55}  sc={0.52} {...lp}/>
        <LeafPair x={103} y={27} r1={-55} r2={20}  sc={0.52} {...lp}/>
        <LeafPair x={123} y={27} r1={-10} r2={60}  sc={0.52} {...lp}/>
      </>}
    </svg>
  );
}
