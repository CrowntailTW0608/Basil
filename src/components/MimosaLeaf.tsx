/**
 * 含羞草植株互動元件 v6
 * - 三根主幹，各自朝一方向拋物線曲折
 * - 每株 5 片複葉，共 15 個複葉單位
 * - 點擊最近的複葉節點觸發，向根部傳遞
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── 常數 ─────────────────────────────────────────────────────
const N_STEMS  = 3;
const N_PER    = 5;                   // 每株複葉數
const N_LEAVES = N_STEMS * N_PER;    // 15
const N_PINNAE = 8;
const PETIOLE  = 14;

const PX_RATIO = [0.06, 0.19, 0.31, 0.44, 0.56, 0.69, 0.81, 0.92] as const;

const PINNA_DATA = [
  { angle: -82, len: 17 },
  { angle: -80, len: 22 },
  { angle: -78, len: 26 },
  { angle: -76, len: 28 },
  { angle: -74, len: 28 },
  { angle: -72, len: 25 },
  { angle: -70, len: 21 },
  { angle: -68, len: 16 },
] as const;

// ── 資料結構 ──────────────────────────────────────────────────
interface LeafAttach {
  li: number;           // 全域複葉 index (0-14)
  x: number;           // 附著點 x（主幹上）
  y: number;           // 附著點 y
  side: 'R' | 'L';
  angle: number;       // 複葉下垂角度（正=下垂, 負=上揚）
  rachis: number;      // 羽軸長
}

interface StemDef {
  /** 主幹折線節點（拋物線近似）含根部與頂端 */
  points: [number, number][];
  leaves: LeafAttach[];
}

/**
 * 三株主幹——每株各自向一個方向漸進彎曲（拋物線型）
 *   Stem 0: 向右彎（+x）
 *   Stem 1: 向右微彎（較挺）
 *   Stem 2: 向左彎（-x）
 */
const STEMS: StemDef[] = [
  // ── 株 1：向右曲折 ──────────────────────────────────────────
  {
    points: [
      [92, 332], [93, 270], [95, 220],
      [99, 170], [104, 122], [110, 74], [118, 26],
    ],
    leaves: [
      { li:0,  x:93,  y:270, side:'R', angle: 18, rachis:106 },
      { li:1,  x:95,  y:220, side:'L', angle: 26, rachis:114 },
      { li:2,  x:99,  y:170, side:'R', angle: 10, rachis:110 },
      { li:3,  x:104, y:122, side:'L', angle: 22, rachis:100 },
      { li:4,  x:110, y: 74, side:'R', angle: -6, rachis: 94 },
    ],
  },
  // ── 株 2：微向右曲折（最高最挺） ───────────────────────────
  {
    points: [
      [326, 338], [327, 276], [328, 224],
      [330, 172], [333, 122], [336, 72], [340, 22],
    ],
    leaves: [
      { li:5,  x:327, y:276, side:'R', angle: 20, rachis:114 },
      { li:6,  x:328, y:224, side:'L', angle: 30, rachis:122 },
      { li:7,  x:330, y:172, side:'R', angle:  8, rachis:118 },
      { li:8,  x:333, y:122, side:'L', angle: 24, rachis:108 },
      { li:9,  x:336, y: 72, side:'R', angle: -8, rachis:100 },
    ],
  },
  // ── 株 3：向左曲折 ──────────────────────────────────────────
  {
    points: [
      [556, 332], [555, 270], [553, 220],
      [550, 170], [546, 122], [541, 74], [535, 26],
    ],
    leaves: [
      { li:10, x:555, y:270, side:'L', angle: 16, rachis:110 },
      { li:11, x:553, y:220, side:'R', angle: 24, rachis:118 },
      { li:12, x:550, y:170, side:'L', angle: 10, rachis:114 },
      { li:13, x:546, y:122, side:'R', angle: 20, rachis:104 },
      { li:14, x:541, y: 74, side:'L', angle: -4, rachis: 98 },
    ],
  },
];

// ── 動畫常數 ─────────────────────────────────────────────────
const FOLD_MS     = 900;
const PROP_MS     = 180;
const HOLD_MS     = 2500;
const UNFOLD_MS   = 650;
const UNFOLD_PROP = 150;
const MOUNT_STEP  = 120;   // 15 片葉子依序，每 120ms 啟動

type Phase = 'folding' | 'waiting' | 'unfolding';
interface LeafAnim { phase: Phase; startTs: number; delays: number[]; }

const mkDelays = (n: number, step: number) =>
  Array.from({ length: n }, (_, i) => i * step);

// ── Leaflet ───────────────────────────────────────────────────
function Leaflet({ x, y, angle, foldAngle, p }: {
  x: number; y: number; angle: number; foldAngle: number; p: number;
}) {
  const a  = angle + foldAngle * p;
  const sy = 1 - 0.63 * p;
  return (
    <g transform={`translate(${x},${y}) rotate(${a})`}>
      <g transform={`scale(1,${sy})`}>
        <ellipse cx="0" cy="-7.5" rx="4.5" ry="8"
          fill="#44aa44" stroke="#1e5c1e" strokeWidth="0.4" />
      </g>
    </g>
  );
}

// ── Pinna ────────────────────────────────────────────────────
function Pinna({ x, y, angle, length, p }: {
  x: number; y: number; angle: number; length: number; p: number;
}) {
  const fa  = angle + (90 - angle) * p * 0.65;
  const rad = (fa * Math.PI) / 180;
  const ex  = x + Math.cos(rad) * length;
  const ey  = y + Math.sin(rad) * length;

  const items: React.ReactNode[] = [];
  for (let i = 0; i < 4; i++) {
    const t  = (i + 1) / 5;
    const lx = x + Math.cos(rad) * length * t;
    const ly = y + Math.sin(rad) * length * t;
    const lp = Math.min(1, Math.max(0, (p - (1 - t) * 0.25) / 0.75));
    items.push(
      <Leaflet key={`A${i}`} x={lx} y={ly} angle={fa}       foldAngle={90}  p={lp} />,
      <Leaflet key={`B${i}`} x={lx} y={ly} angle={fa + 180} foldAngle={-90} p={lp} />,
    );
  }
  return (
    <g>
      <line x1={x} y1={y} x2={ex} y2={ey}
        stroke="#3a6828" strokeWidth="1" strokeLinecap="round" />
      {items}
    </g>
  );
}

// ── LeafUnit ─────────────────────────────────────────────────
function LeafUnit({ leaf, pinnaP }: { leaf: LeafAttach; pinnaP: number[] }) {
  const { x, y, side, angle, rachis } = leaf;
  const sx = side === 'L' ? -1 : 1;
  const px = PX_RATIO.map(r => r * rachis + PETIOLE);
  return (
    <g transform={`translate(${x},${y}) scale(${sx},1) rotate(${angle})`}>
      <line x1={0} y1={0} x2={PETIOLE} y2={0}
        stroke="#8a7040" strokeWidth="2" strokeLinecap="round" />
      <line x1={PETIOLE} y1={0} x2={rachis + PETIOLE} y2={0}
        stroke="#7a8035" strokeWidth="1.6" strokeLinecap="round" />
      {PINNA_DATA.map((pd, i) => (
        <React.Fragment key={i}>
          <Pinna x={px[i]} y={0} angle={pd.angle}  length={pd.len} p={pinnaP[i]} />
          <Pinna x={px[i]} y={0} angle={-pd.angle} length={pd.len} p={pinnaP[i]} />
        </React.Fragment>
      ))}
    </g>
  );
}

// ── 主幹 SVG ─────────────────────────────────────────────────
function Stem({ stem }: { stem: StemDef }) {
  const pts = stem.points.map(([x, y]) => `${x},${y}`).join(' ');
  const base = stem.points[0];
  return (
    <g>
      <polyline points={pts}
        stroke="#8a7040" strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round"
        fill="none" />
      {/* 根部 */}
      <ellipse cx={base[0]} cy={base[1] + 3} rx={5} ry={3} fill="#6a5530" />
      {/* 節點裝飾 */}
      {stem.leaves.map(leaf => (
        <circle key={leaf.li} cx={leaf.x} cy={leaf.y} r={3}
          fill="#7a6030" stroke="#5a4820" strokeWidth="0.5" />
      ))}
    </g>
  );
}

// ── 主元件 ────────────────────────────────────────────────────
export default function MimosaLeaf() {
  const [leafProgress, setLeafProgress] = useState<number[][]>(
    () => Array.from({ length: N_LEAVES }, () => Array(N_PINNAE).fill(1))
  );

  const isFoldedRef = useRef<boolean[]>(Array(N_LEAVES).fill(true));
  const animsRef    = useRef<(LeafAnim | null)[]>(Array(N_LEAVES).fill(null));
  const timeoutsRef = useRef<(ReturnType<typeof setTimeout> | null)[]>(Array(N_LEAVES).fill(null));
  const frameRef    = useRef(0);

  const tick = useCallback((now: number) => {
    const anims  = animsRef.current;
    const folded = isFoldedRef.current;
    const newLP: number[][] = [];

    for (let li = 0; li < N_LEAVES; li++) {
      const a = anims[li];
      if (!a) {
        newLP.push(Array(N_PINNAE).fill(folded[li] ? 1 : 0));
        continue;
      }
      if (a.phase === 'waiting') { newLP.push(Array(N_PINNAE).fill(1)); continue; }

      if (a.phase === 'folding') {
        const np = Array.from({ length: N_PINNAE }, (_, i) =>
          Math.min(1, Math.max(0, (now - a.startTs - a.delays[i]) / FOLD_MS))
        );
        if (np.every(v => v >= 1)) {
          a.phase = 'waiting';
          newLP.push(Array(N_PINNAE).fill(1));
          timeoutsRef.current[li] = setTimeout(() => {
            animsRef.current[li] = {
              phase: 'unfolding', startTs: performance.now(),
              delays: mkDelays(N_PINNAE, UNFOLD_PROP),
            };
            cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(tick);
          }, HOLD_MS);
        } else {
          newLP.push(np);
        }
      } else {
        folded[li] = false;
        const np = Array.from({ length: N_PINNAE }, (_, i) =>
          Math.max(0, 1 - (now - a.startTs - a.delays[i]) / UNFOLD_MS)
        );
        if (np.every(v => v <= 0)) {
          anims[li] = null;
          newLP.push(Array(N_PINNAE).fill(0));
        } else {
          newLP.push(np);
        }
      }
    }

    setLeafProgress(newLP);
    if (anims.some(a => a && a.phase !== 'waiting')) {
      frameRef.current = requestAnimationFrame(tick);
    }
  }, []);

  // 掛載：依 li 順序逐片展開（三株依序亮相）
  useEffect(() => {
    const tos: ReturnType<typeof setTimeout>[] = [];
    for (let li = 0; li < N_LEAVES; li++) {
      const t = setTimeout(() => {
        animsRef.current[li] = {
          phase: 'unfolding', startTs: performance.now(),
          delays: mkDelays(N_PINNAE, UNFOLD_PROP),
        };
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(tick);
      }, 200 + li * MOUNT_STEP);
      tos.push(t);
    }
    return () => {
      tos.forEach(clearTimeout);
      cancelAnimationFrame(frameRef.current);
      timeoutsRef.current.forEach(t => t && clearTimeout(t));
    };
  }, [tick]);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg  = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scale = 660 / rect.width;
    const svgX = (e.clientX - rect.left) * scale;
    const svgY = (e.clientY - rect.top)  * scale;

    // 找距離最近且閒置的複葉
    let bestLeaf: LeafAttach | null = null;
    let bestDist = Infinity;
    STEMS.forEach(stem => {
      stem.leaves.forEach(leaf => {
        if (animsRef.current[leaf.li] !== null) return;
        const d = Math.hypot(svgX - leaf.x, svgY - leaf.y);
        if (d < bestDist) { bestDist = d; bestLeaf = leaf; }
      });
    });

    if (!bestLeaf) return;
    const leaf = bestLeaf;

    // 局部座標（左側鏡像後，投影到羽軸方向）
    const dx  = leaf.side === 'R' ? svgX - leaf.x : leaf.x - svgX;
    const dy  = svgY - leaf.y;
    const rad = (leaf.angle * Math.PI) / 180;
    const localX = dx * Math.cos(rad) + dy * Math.sin(rad);

    const px = PX_RATIO.map(r => r * leaf.rachis + PETIOLE);
    let ci = 0, md = Infinity;
    px.forEach((x, i) => {
      const d = Math.abs(x - localX);
      if (d < md) { md = d; ci = i; }
    });

    const delays = Array.from({ length: N_PINNAE }, (_, i) =>
      Math.max(0, ci - i) * PROP_MS
    );

    cancelAnimationFrame(frameRef.current);
    const to = timeoutsRef.current[leaf.li];
    if (to) { clearTimeout(to); timeoutsRef.current[leaf.li] = null; }
    animsRef.current[leaf.li] = { phase: 'folding', startTs: performance.now(), delays };
    frameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const anyFolding = leafProgress.some(lp => lp.some(p => p > 0));

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 660 370"
        style={{ width: '100%', maxWidth: '660px', height: 'auto',
                 touchAction: 'manipulation', overflow: 'visible' }}
        className="cursor-pointer select-none"
        onClick={handleClick}
      >
        {/* 三根主幹 */}
        {STEMS.map((stem, si) => <Stem key={si} stem={stem} />)}

        {/* 所有複葉 */}
        {STEMS.map(stem =>
          stem.leaves.map(leaf => (
            <LeafUnit key={leaf.li} leaf={leaf}
              pinnaP={leafProgress[leaf.li] ?? Array(N_PINNAE).fill(1)} />
          ))
        )}
      </svg>

      <p className="text-xs text-slate-400 text-center h-4">
        {anyFolding ? '它在害羞中…放著不動，它會慢慢展開！' : '點擊葉片，看它害羞縮起來'}
      </p>
    </div>
  );
}
