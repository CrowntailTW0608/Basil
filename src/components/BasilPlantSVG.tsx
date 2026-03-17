interface Props {
  growth: number;   // 0–100
  health: number;   // 0–100
  paused?: boolean;
}

function Leaf({ fill, vein }: { fill: string; vein: string }) {
  return (
    <g>
      <path
        d="M 0,0
           C -8, 0  -14,-7  -12,-16
           C -10,-23  -2,-28   0,-30
           C   2,-28  10,-23  12,-16
           C  14,-7    8, 0    0, 0 Z"
        fill={fill} stroke={vein} strokeWidth="0.4"
      />
      <line x1="0" y1="-0.5" x2="0"   y2="-27" stroke={vein} strokeWidth="0.65"/>
      <line x1="0" y1="-9"   x2="-10" y2="-14" stroke={vein} strokeWidth="0.3"  opacity="0.6"/>
      <line x1="0" y1="-9"   x2=" 10" y2="-14" stroke={vein} strokeWidth="0.3"  opacity="0.6"/>
      <line x1="0" y1="-18"  x2="-7"  y2="-22" stroke={vein} strokeWidth="0.28" opacity="0.5"/>
      <line x1="0" y1="-18"  x2=" 7"  y2="-22" stroke={vein} strokeWidth="0.28" opacity="0.5"/>
    </g>
  );
}

/**
 * 一對葉片，各帶一小段葉柄（petiole）連接主莖
 * pet：葉柄長度（full-size），實際長度隨 sc 縮放
 * 葉片沿各自旋轉方向長在葉柄末端，不直接貼附主莖
 */
function LeafPair({ x, y, r1, r2, sc, fill, vein, pet = 6 }: {
  x: number; y: number; r1: number; r2: number; sc: number;
  fill: string; vein: string; pet?: number;
}) {
  const rad = Math.PI / 180;
  const pLen = pet * sc;  // 葉柄長度隨葉片縮放

  // 葉柄末端坐標：沿旋轉方向（-Y 軸旋轉 r 度）延伸 pLen
  const p1x = x + Math.sin(r1 * rad) * pLen;
  const p1y = y - Math.cos(r1 * rad) * pLen;
  const p2x = x + Math.sin(r2 * rad) * pLen;
  const p2y = y - Math.cos(r2 * rad) * pLen;

  return (
    <g>
      {/* 葉柄 */}
      <line x1={x} y1={y} x2={p1x} y2={p1y} stroke={vein} strokeWidth="0.7"/>
      <line x1={x} y1={y} x2={p2x} y2={p2y} stroke={vein} strokeWidth="0.7"/>
      {/* 葉片長在葉柄末端 */}
      <g transform={`translate(${p1x},${p1y}) rotate(${r1}) scale(${sc})`}><Leaf fill={fill} vein={vein}/></g>
      <g transform={`translate(${p2x},${p2y}) rotate(${r2}) scale(${sc})`}><Leaf fill={fill} vein={vein}/></g>
    </g>
  );
}

/** 葉子漸長係數（0→1）：stem 到節點那刻開始，花 span% 長到完整尺寸 */
function lg(growth: number, start: number, span = 12): number {
  return Math.max(0, Math.min(1, (growth - start) / span));
}

export default function BasilPlantSVG({ growth, health, paused = false }: Props) {
  const sick  = health < 30;
  const fill  = paused ? '#8a9e8e' : sick ? '#7a7a24' : '#2e6b38';
  const vein  = paused ? '#4a6050' : sick ? '#484818' : '#1a4024';
  const stemC = paused ? '#8a9e8e' : sick ? '#565822' : '#2a5828';
  const lp    = { fill, vein };

  // ── 主莖：0→30% ──────────────────────────────────────────
  const mainFrac = Math.min(1, growth / 30);
  const mainTipY = 161 - mainFrac * 66;   // 161 → 95

  // 主莖曲線控制點（微左彎）
  const stemCpX = 80 - 5 * mainFrac;
  const stemCpY = (161 + mainTipY) / 2;

  // ── 左右分枝：30→80% ─────────────────────────────────────
  const brFrac = Math.max(0, Math.min(1, (growth - 30) / 50));
  const BX = 80;  const BY = 95;
  const LX = 46;  const LY = 44;
  const RX = 114; const RY = 44;

  const lTipX = BX + brFrac * (LX - BX);
  const lTipY = BY + brFrac * (LY - BY);
  const rTipX = BX + brFrac * (RX - BX);
  const rTipY = BY + brFrac * (RY - BY);

  const lCX = BX - 14 * brFrac;
  const lCY = (BY + lTipY) / 2 + 10 * brFrac;
  const rCX = BX + 14 * brFrac;
  const rCY = (BY + rTipY) / 2 + 10 * brFrac;

  // ── 小枝：80→100% ────────────────────────────────────────
  const subFrac = Math.max(0, Math.min(1, (growth - 80) / 20));
  const llX = LX + subFrac * (28  - LX);  const llY = LY + subFrac * (17 - LY);
  const lrX = LX + subFrac * (64  - LX);  const lrY = LY + subFrac * (17 - LY);
  const rlX = RX + subFrac * (96  - RX);  const rlY = RY + subFrac * (17 - RY);
  const rrX = RX + subFrac * (132 - RX);  const rrY = RY + subFrac * (17 - RY);

  // ── 葉片出現時機（精確同步莖到達節點）────────────────────
  // 主莖三節：y=148 → growth≈6；y=126 → ≈16；y=104 → ≈26（等距22px，等距10%）
  // 分枝兩節：y≈76 → ≈49；y≈59 → ≈65
  const ls148 = lg(growth, 6,  12);
  const ls126 = lg(growth, 16, 12);
  const ls104 = lg(growth, 26, 10);
  const ls76  = lg(growth, 49, 10);
  const ls59  = lg(growth, 65, 10);
  const lsSub = lg(growth, 88,  8);

  return (
    <svg viewBox="0 0 160 200" width="160" height="200" xmlns="http://www.w3.org/2000/svg">

      {/* ── 花盆 ── */}
      <rect x="52" y="162" width="56" height="7" rx="3.5" fill="#92400e"/>
      <path d="M55,169 L61,190 L99,190 L105,169 Z" fill="#b45309"/>
      <path d="M61,190 L99,190 L97,193 L63,193 Z" fill="#92400e"/>
      <path d="M56,170 L61,185 L65,185 L60,170 Z" fill="#d97706" opacity="0.3"/>
      <ellipse cx="80" cy="164" rx="26" ry="5" fill="#78350f"/>

      {/* ── 主莖（彎曲貝茲 + 頂細底粗）── */}
      {mainFrac > 0 && (
        <path
          d={`M ${80 - 2.8},161
              Q ${stemCpX - 1.8},${stemCpY} ${80 - 1.0},${mainTipY}
              L ${80 + 1.0},${mainTipY}
              Q ${stemCpX + 1.8},${stemCpY} ${80 + 2.8},161 Z`}
          fill={stemC}
        />
      )}

      {/* ── 主莖三組葉對（各帶葉柄，莖到節點後漸長）── */}
      {ls148 > 0 && <LeafPair x={80} y={148} r1={-52} r2={52} sc={ls148 * 1.40} {...lp}/>}
      {ls126 > 0 && <LeafPair x={80} y={126} r1={-52} r2={52} sc={ls126 * 1.20} {...lp}/>}
      {ls104 > 0 && <LeafPair x={80} y={104} r1={-52} r2={52} sc={ls104 * 1.00} {...lp}/>}

      {/* ── 左右分枝（弧線）── */}
      {growth >= 30 && <>
        <path d={`M ${BX},${BY} Q ${lCX},${lCY} ${lTipX},${lTipY}`}
          stroke={stemC} strokeWidth="2.0" fill="none" strokeLinecap="round"/>
        <path d={`M ${BX},${BY} Q ${rCX},${rCY} ${rTipX},${rTipY}`}
          stroke={stemC} strokeWidth="2.0" fill="none" strokeLinecap="round"/>
      </>}

      {/* ── 分枝葉對（各帶葉柄，分枝尖到節點後漸長）── */}
      {ls76 > 0 && <LeafPair x={66}  y={76} r1={-50} r2={5}  sc={ls76 * 0.78} {...lp}/>}
      {ls59 > 0 && <LeafPair x={55}  y={59} r1={-50} r2={5}  sc={ls59 * 0.68} {...lp}/>}
      {ls76 > 0 && <LeafPair x={94}  y={76} r1={50}  r2={-5} sc={ls76 * 0.78} {...lp}/>}
      {ls59 > 0 && <LeafPair x={105} y={59} r1={50}  r2={-5} sc={ls59 * 0.68} {...lp}/>}

      {/* ── 枝尖頂芽（55–80%）── */}
      {growth >= 55 && growth < 80 && <>
        <path d={`M${lTipX},${lTipY} C${lTipX-3},${lTipY-5} ${lTipX-3},${lTipY-11} ${lTipX},${lTipY-13}
                  C${lTipX+3},${lTipY-11} ${lTipX+3},${lTipY-5} ${lTipX},${lTipY} Z`}
          fill={fill} stroke={vein} strokeWidth="0.4"/>
        <path d={`M${rTipX},${rTipY} C${rTipX-3},${rTipY-5} ${rTipX-3},${rTipY-11} ${rTipX},${rTipY-13}
                  C${rTipX+3},${rTipY-11} ${rTipX+3},${rTipY-5} ${rTipX},${rTipY} Z`}
          fill={fill} stroke={vein} strokeWidth="0.4"/>
      </>}

      {/* ── 小枝（弧線）── */}
      {growth >= 80 && <>
        <path d={`M ${LX},${LY} Q ${LX - 8},${(LY + llY) / 2} ${llX},${llY}`}
          stroke={stemC} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        <path d={`M ${LX},${LY} Q ${LX + 8},${(LY + lrY) / 2} ${lrX},${lrY}`}
          stroke={stemC} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        <path d={`M ${RX},${RY} Q ${RX - 8},${(RY + rlY) / 2} ${rlX},${rlY}`}
          stroke={stemC} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        <path d={`M ${RX},${RY} Q ${RX + 8},${(RY + rrY) / 2} ${rrX},${rrY}`}
          stroke={stemC} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      </>}

      {/* ── 小枝葉片（漸長）── */}
      {lsSub > 0 && <>
        <LeafPair x={37}  y={27} r1={-55} r2={15}  sc={lsSub * 0.52} {...lp}/>
        <LeafPair x={57}  y={27} r1={-15} r2={55}  sc={lsSub * 0.52} {...lp}/>
        <LeafPair x={103} y={27} r1={-55} r2={15}  sc={lsSub * 0.52} {...lp}/>
        <LeafPair x={123} y={27} r1={-15} r2={55}  sc={lsSub * 0.52} {...lp}/>
      </>}
    </svg>
  );
}
