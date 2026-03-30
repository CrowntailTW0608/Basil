/**
 * 含羞草 Simon Says 遊戲
 * 電腦依序點亮複葉（收折），玩家按相同順序重現。
 * 每輪增加一片，看能記到幾輪。
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  STEMS, LeafAttach, Stem, LeafUnit,
  N_LEAVES, N_PINNAE, PETIOLE,
} from '@/src/components/MimosaLeaf';

// ── 動畫常數 ─────────────────────────────────────────────────
const FOLD_MS     = 420;
const UNFOLD_MS   = 380;
const SHOW_MS     = 380;   // 完全折合後停頓
const GAP_MS      = 280;   // 每片之間間距
const FEEDBACK_MS = 350;   // 玩家點擊後折合確認時間
const WRONG_MS    = 700;   // 答錯後停頓再 game over

const HS_KEY = 'mimosa_simon_highscore';

type Phase = 'start' | 'simon' | 'player' | 'gameover';

function randomLi(): number {
  return Math.floor(Math.random() * N_LEAVES);
}

function getLeafPos(li: number): { x: number; y: number } | null {
  for (const stem of STEMS) {
    for (const leaf of stem.leaves) {
      if (leaf.li === li) return { x: leaf.x, y: leaf.y };
    }
  }
  return null;
}

// ── 主元件 ────────────────────────────────────────────────────
export default function MimosaGame() {
  const [phase, setPhase]       = useState<Phase>('start');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [round, setRound]       = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const s = localStorage.getItem(HS_KEY);
    return s ? parseInt(s, 10) : 0;
  });

  // 葉片折合進度：15 × 8
  const [leafProgress, setLeafProgress] = useState<number[][]>(
    () => Array.from({ length: N_LEAVES }, () => Array(N_PINNAE).fill(0))
  );
  // Simon 正在展示的複葉 li
  const [simonLi, setSimonLi] = useState<number | null>(null);
  // 玩家點擊回饋
  const [flash, setFlash] = useState<{ li: number; ok: boolean } | null>(null);

  const frameRef = useRef(0);
  const animRef  = useRef<{ li: number; dir: 'fold' | 'unfold'; startTs: number } | null>(null);

  // ── 單葉動畫 tick ─────────────────────────────────────────
  const tick = useCallback((now: number) => {
    const a = animRef.current;
    if (!a) return;
    const dur = a.dir === 'fold' ? FOLD_MS : UNFOLD_MS;
    const t   = Math.min(1, (now - a.startTs) / dur);
    const p   = a.dir === 'fold' ? t : 1 - t;

    setLeafProgress(prev =>
      prev.map((row, li) => li === a.li ? Array(N_PINNAE).fill(p) : row)
    );
    if (t < 1) {
      frameRef.current = requestAnimationFrame(tick);
    }
  }, []);

  function startAnim(li: number, dir: 'fold' | 'unfold') {
    cancelAnimationFrame(frameRef.current);
    animRef.current = { li, dir, startTs: performance.now() };
    frameRef.current = requestAnimationFrame(tick);
  }

  // ── 開始 / 重試 ───────────────────────────────────────────
  function startGame() {
    const seq = [randomLi()];
    setSequence(seq);
    setPlayerIdx(0);
    setRound(1);
    setLeafProgress(Array.from({ length: N_LEAVES }, () => Array(N_PINNAE).fill(0)));
    setSimonLi(null);
    setFlash(null);
    setPhase('simon');
  }

  // ── Simon 播放（phase === 'simon' 時觸發） ─────────────────
  useEffect(() => {
    if (phase !== 'simon') return;
    let cancelled = false;
    const tos: ReturnType<typeof setTimeout>[] = [];

    setLeafProgress(Array.from({ length: N_LEAVES }, () => Array(N_PINNAE).fill(0)));

    let cursor = 0;
    function playNext() {
      if (cancelled) return;
      if (cursor >= sequence.length) {
        setSimonLi(null);
        setPhase('player');
        setPlayerIdx(0);
        return;
      }
      const li = sequence[cursor++];
      setSimonLi(li);
      startAnim(li, 'fold');

      const t1 = setTimeout(() => {
        if (cancelled) return;
        const t2 = setTimeout(() => {
          if (cancelled) return;
          setSimonLi(null);
          startAnim(li, 'unfold');
          const t3 = setTimeout(() => {
            if (cancelled) return;
            const t4 = setTimeout(playNext, GAP_MS);
            tos.push(t4);
          }, UNFOLD_MS);
          tos.push(t3);
        }, SHOW_MS);
        tos.push(t2);
      }, FOLD_MS);
      tos.push(t1);
    }

    const t0 = setTimeout(playNext, 500);
    tos.push(t0);

    return () => {
      cancelled = true;
      tos.forEach(clearTimeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [phase, sequence]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 玩家點擊 ─────────────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (phase !== 'player') return;

    const svg = e.currentTarget;
    const pt  = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const { x: svgX, y: svgY } = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    let bestLi = 0, bestDist = Infinity;
    STEMS.forEach(stem => stem.leaves.forEach(leaf => {
      const sx  = leaf.side === 'L' ? -1 : 1;
      const rad = (leaf.angle * Math.PI) / 180;
      const mid = PETIOLE + leaf.rachis / 2;
      const mx  = leaf.x + sx * mid * Math.cos(rad);
      const my  = leaf.y +      mid * Math.sin(rad);
      const d   = Math.hypot(svgX - mx, svgY - my);
      if (d < bestDist) { bestDist = d; bestLi = leaf.li; }
    }));

    const expected = sequence[playerIdx];

    if (bestLi === expected) {
      setFlash({ li: bestLi, ok: true });
      startAnim(bestLi, 'fold');

      setTimeout(() => {
        setFlash(null);
        startAnim(bestLi, 'unfold');

        const nextIdx = playerIdx + 1;
        if (nextIdx >= sequence.length) {
          // 這輪全對，更新最高分，進下一輪
          const completedLen = sequence.length;
          setHighScore(prev => {
            const next = Math.max(prev, completedLen);
            localStorage.setItem(HS_KEY, next.toString());
            return next;
          });
          const nextSeq = [...sequence, randomLi()];
          setRound(r => r + 1);
          setSequence(nextSeq);
          setTimeout(() => setPhase('simon'), 500);
        } else {
          setPlayerIdx(nextIdx);
        }
      }, FEEDBACK_MS);
    } else {
      setFlash({ li: bestLi, ok: false });
      startAnim(bestLi, 'fold');
      setTimeout(() => {
        setFlash(null);
        setPhase('gameover');
      }, WRONG_MS);
    }
  }, [phase, playerIdx, sequence, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 光圈元件 ─────────────────────────────────────────────
  function GlowRing({ li, color }: { li: number; color: string }) {
    const pos = getLeafPos(li);
    if (!pos) return null;
    return (
      <circle cx={pos.x} cy={pos.y} r={24}
        fill="none" stroke={color} strokeWidth="3.5" opacity="0.8"
        style={{ filter: `drop-shadow(0 0 7px ${color})` }} />
    );
  }

  // ── 狀態提示文字 ─────────────────────────────────────────
  const statusText = {
    start:    '',
    simon:    '👀 看清楚，記住順序！',
    player:   `🌿 換你了（${playerIdx + 1} / ${sequence.length}）`,
    gameover: `😅 答錯了！完成了 ${round - 1} 輪`,
  }[phase];

  return (
    <div className="flex flex-col items-center gap-5 w-full">

      {/* 分數列 */}
      <div className="flex gap-10 text-center">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">目前輪數</p>
          <p className="text-3xl font-bold" style={{ color: '#db2777' }}>{round}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">最高紀錄</p>
          <p className="text-3xl font-bold" style={{ color: '#a855f7' }}>{highScore}</p>
        </div>
      </div>

      {/* 狀態提示 */}
      <p className="text-sm font-medium text-slate-500 h-5 text-center">{statusText}</p>

      {/* SVG */}
      <svg
        viewBox="0 0 660 370"
        style={{
          width: '100%', maxWidth: '660px', height: 'auto',
          touchAction: 'manipulation', overflow: 'visible',
          cursor: phase === 'player' ? 'pointer' : 'default',
        }}
        className="select-none"
        onClick={handleClick}
      >
        <defs>
          <radialGradient id="leafGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#6fcf6f" />
            <stop offset="100%" stopColor="#2d7a2d" />
          </radialGradient>
        </defs>

        {STEMS.map((stem, si) => <Stem key={si} stem={stem} />)}
        {STEMS.map(stem => stem.leaves.map((leaf: LeafAttach) => (
          <LeafUnit key={leaf.li} leaf={leaf}
            pinnaP={leafProgress[leaf.li] ?? Array(N_PINNAE).fill(0)} />
        )))}

        {simonLi !== null && <GlowRing li={simonLi} color="#fbbf24" />}
        {flash && <GlowRing li={flash.li} color={flash.ok ? '#4ade80' : '#f87171'} />}
      </svg>

      {/* 按鈕 */}
      {phase === 'start' && (
        <button
          onClick={startGame}
          className="px-10 py-3 rounded-full font-bold text-white text-lg shadow-lg transition hover:scale-105 active:scale-95"
          style={{ background: '#db2777', boxShadow: '0 8px 24px #db277740' }}
        >
          開始遊戲
        </button>
      )}
      {phase === 'gameover' && (
        <div className="text-center space-y-3">
          <p className="text-slate-500 text-sm">
            序列長度：<span className="font-bold text-pink-500">{sequence.length}</span>，
            完成了 <span className="font-bold text-pink-500">{round - 1}</span> 輪
          </p>
          <button
            onClick={startGame}
            className="px-10 py-3 rounded-full font-bold text-white text-lg shadow-lg transition hover:scale-105 active:scale-95"
            style={{ background: '#db2777', boxShadow: '0 8px 24px #db277740' }}
          >
            再試一次
          </button>
        </div>
      )}
    </div>
  );
}
