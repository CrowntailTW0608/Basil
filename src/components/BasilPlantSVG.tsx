import React from 'react';

interface Props {
  growth: number;   // 0–100
  health: number;   // 0–100
  paused?: boolean;
}

/**
 * 單片九層塔葉
 * 坐標系：葉基在 (0,0)，葉尖朝 -Y 方向（螢幕上方）
 */
function Leaf({ fill, vein }: { fill: string; vein: string }) {
  return (
    <g>
      {/* 葉身 — 卵形，頂端尖、基部圓 */}
      <path
        d="M 0,0
           C -5,-1 -12,-5 -11,-13
           C -10,-21 -5,-24 0,-26
           C  5,-24  10,-21  11,-13
           C  12,-5   5,-1   0,0 Z"
        fill={fill}
        stroke={vein}
        strokeWidth="0.4"
      />
      {/* 主脈（中肋） */}
      <line x1="0" y1="-0.5" x2="0" y2="-25" stroke={vein} strokeWidth="0.75"/>
      {/* 側脈 */}
      <line x1="0" y1="-8"  x2="-8"  y2="-12" stroke={vein} strokeWidth="0.35" opacity="0.65"/>
      <line x1="0" y1="-8"  x2=" 8"  y2="-12" stroke={vein} strokeWidth="0.35" opacity="0.65"/>
      <line x1="0" y1="-15" x2="-6"  y2="-19" stroke={vein} strokeWidth="0.35" opacity="0.65"/>
      <line x1="0" y1="-15" x2=" 6"  y2="-19" stroke={vein} strokeWidth="0.35" opacity="0.65"/>
    </g>
  );
}

export default function BasilPlantSVG({ growth, health, paused = false }: Props) {
  const sick = health < 30;
  const fill = paused ? '#94a3b8' : sick ? '#ca8a04' : '#4ade80';
  const vein = paused ? '#475569' : sick ? '#78350f' : '#166534';
  const stem = paused ? '#94a3b8' : sick ? '#a16207' : '#166534';

  // 莖從花盆土面 (y=148) 向上最多長 96px
  const stemH = (growth / 100) * 96;
  const tipY  = 148 - stemH;

  // 只在莖尖通過節點 8px 以上時才顯示葉對
  const showAt = (nodeY: number) => tipY <= nodeY - 8;

  // 5 個節點：由下到上，葉片逐漸縮小
  const NODES = [
    { y: 130, s: 1.00 },
    { y: 114, s: 0.90 },
    { y:  99, s: 0.80 },
    { y:  84, s: 0.70 },
    { y:  70, s: 0.62 },
  ];

  // 葉片張開角度（與莖的夾角）
  const ANGLE = 68;

  return (
    <svg viewBox="0 0 100 180" width="160" height="180" xmlns="http://www.w3.org/2000/svg">

      {/* ── 花盆 ── */}
      <rect x="26" y="148" width="48" height="7" rx="3.5" fill="#92400e"/>
      <path d="M30,155 L34,174 L66,174 L70,155 Z" fill="#b45309"/>
      {/* 盆底陰影 */}
      <path d="M34,174 L66,174 L64,177 L36,177 Z" fill="#92400e"/>
      {/* 盆高光 */}
      <path d="M31,156 L35,170 L38,170 L34,156 Z" fill="#d97706" opacity="0.3"/>
      {/* 泥土 */}
      <ellipse cx="50" cy="150" rx="18" ry="4" fill="#78350f"/>

      {/* ── 莖（從土面向上生長）── */}
      {stemH > 0 && (
        <line
          x1="50" y1="148"
          x2="50" y2={tipY}
          stroke={stem}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}

      {/* ── 葉對（依節點位置逐一顯示）── */}
      {NODES.map(({ y, s }, i) =>
        showAt(y) ? (
          <g key={i}>
            {/* 左葉 */}
            <g transform={`translate(50,${y}) rotate(-${ANGLE}) scale(${s})`}>
              <Leaf fill={fill} vein={vein} />
            </g>
            {/* 右葉 */}
            <g transform={`translate(50,${y}) rotate(${ANGLE}) scale(${s})`}>
              <Leaf fill={fill} vein={vein} />
            </g>
          </g>
        ) : null
      )}

      {/* ── 頂芽（成長 ≥55% 時出現在莖尖）── */}
      {growth >= 55 && (
        <g transform={`translate(50,${tipY})`}>
          <g transform="rotate(-28) scale(0.48)">
            <Leaf fill={fill} vein={vein} />
          </g>
          <g transform="rotate(28) scale(0.48)">
            <Leaf fill={fill} vein={vein} />
          </g>
          {/* 最頂端的嫩芽 */}
          <path
            d="M0,0 C -3,-4 -3,-10 0,-13 C 3,-10 3,-4 0,0 Z"
            fill={fill} stroke={vein} strokeWidth="0.4"
          />
        </g>
      )}
    </svg>
  );
}
