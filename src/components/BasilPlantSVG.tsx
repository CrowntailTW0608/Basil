import React from 'react';

interface Props {
  growth: number;   // 0–100
  health: number;   // 0–100
  paused?: boolean;
}

export default function BasilPlantSVG({ growth, health, paused = false }: Props) {
  const sick   = health < 30;
  const leaf   = paused ? '#94a3b8' : sick ? '#ca8a04' : '#22c55e';
  const vein   = paused ? '#64748b' : sick ? '#92400e' : '#15803d';
  const stem   = paused ? '#94a3b8' : sick ? '#a16207' : '#166534';
  const s = (min: number) => growth >= min;

  return (
    <svg viewBox="0 0 100 180" width="160" height="180" xmlns="http://www.w3.org/2000/svg">
      {/* 花盆 */}
      <rect x="26" y="148" width="48" height="7" rx="3.5" fill="#92400e"/>
      <path d="M30,155 L34,174 L66,174 L70,155 Z" fill="#b45309"/>
      <path d="M34,174 L66,174 L64,177 L36,177 Z" fill="#92400e"/>
      {/* 泥土 */}
      <ellipse cx="50" cy="150" rx="18" ry="4" fill="#78350f"/>

      {/* 主莖 */}
      <line x1="50" y1="148" x2="50" y2="52" stroke={stem} strokeWidth="2.5" strokeLinecap="round"/>

      {/* 第1對葉 — ≥8% */}
      {s(8) && <>
        <ellipse cx="34" cy="132" rx="14" ry="6.5" fill={leaf} transform="rotate(-22,34,132)"/>
        <ellipse cx="66" cy="132" rx="14" ry="6.5" fill={leaf} transform="rotate(22,66,132)"/>
        <line x1="50" y1="132" x2="35" y2="132" stroke={vein} strokeWidth="0.8"/>
        <line x1="50" y1="132" x2="65" y2="132" stroke={vein} strokeWidth="0.8"/>
      </>}

      {/* 第2對葉 — ≥25% */}
      {s(25) && <>
        <ellipse cx="32" cy="116" rx="14" ry="6.5" fill={leaf} transform="rotate(-28,32,116)"/>
        <ellipse cx="68" cy="116" rx="14" ry="6.5" fill={leaf} transform="rotate(28,68,116)"/>
        <line x1="50" y1="116" x2="33" y2="116" stroke={vein} strokeWidth="0.8"/>
        <line x1="50" y1="116" x2="67" y2="116" stroke={vein} strokeWidth="0.8"/>
      </>}

      {/* 第3對葉 — ≥45% */}
      {s(45) && <>
        <ellipse cx="31" cy="101" rx="13" ry="6" fill={leaf} transform="rotate(-33,31,101)"/>
        <ellipse cx="69" cy="101" rx="13" ry="6" fill={leaf} transform="rotate(33,69,101)"/>
        <line x1="50" y1="101" x2="32" y2="101" stroke={vein} strokeWidth="0.8"/>
        <line x1="50" y1="101" x2="68" y2="101" stroke={vein} strokeWidth="0.8"/>
      </>}

      {/* 第4對葉 — ≥65% */}
      {s(65) && <>
        <ellipse cx="32" cy="86" rx="12" ry="5.5" fill={leaf} transform="rotate(-38,32,86)"/>
        <ellipse cx="68" cy="86" rx="12" ry="5.5" fill={leaf} transform="rotate(38,68,86)"/>
        <line x1="50" y1="86" x2="33" y2="86" stroke={vein} strokeWidth="0.8"/>
        <line x1="50" y1="86" x2="67" y2="86" stroke={vein} strokeWidth="0.8"/>
      </>}

      {/* 第5對葉 — ≥82% */}
      {s(82) && <>
        <ellipse cx="35" cy="72" rx="11" ry="5" fill={leaf} transform="rotate(-42,35,72)"/>
        <ellipse cx="65" cy="72" rx="11" ry="5" fill={leaf} transform="rotate(42,65,72)"/>
        <line x1="50" y1="72" x2="36" y2="72" stroke={vein} strokeWidth="0.8"/>
        <line x1="50" y1="72" x2="64" y2="72" stroke={vein} strokeWidth="0.8"/>
      </>}

      {/* 頂芽 — ≥55% */}
      {s(55) && <>
        <ellipse cx="43" cy="63" rx="9" ry="5" fill={leaf} transform="rotate(-15,43,63)"/>
        <ellipse cx="57" cy="63" rx="9" ry="5" fill={leaf} transform="rotate(15,57,63)"/>
        <ellipse cx="50" cy="55" rx="5" ry="7" fill={leaf}/>
      </>}
    </svg>
  );
}
