/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, AlertTriangle, RefreshCw } from 'lucide-react';
import BasilPlantSVG from '@/src/components/BasilPlantSVG';
import { getRandomDish, getAllDishes } from '@/src/components/BasilDishes';
import type { DishData } from '@/src/components/BasilDishes';

// --- Types ---
interface Pest { id: string; x: number; y: number; bornAt: number }
// svgX/svgY 為 BasilPlantSVG viewBox 座標（160×200），精確對應植株像素位置
interface Bud  { id: string; svgX: number; svgY: number; rot: number; bornAt: number }
interface Drop { id: string; x: number; y: number }
interface ScorePopup { id: string; x: number; y: number; label: string; color: string }
type Phase = 'idle' | 'playing' | 'won' | 'lost';

// --- Constants ---
const DURATION = 60;

// 開發用：網址加 ?god=1 可無敵觀察植株生長（不掉血、不掉水、不暫停成長）
const GOD_MODE = typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('god');
// 桌機模式：細精度指標（滑鼠/觸控板）自動降低難度
const IS_DESKTOP = typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches;

const GAME_H   = 480;
const PEST_TTL = IS_DESKTOP ? 4000 : 2500;   // 桌機給更多時間點蟲
const BUD_TTL  = IS_DESKTOP ? 5500 : 3500;   // 桌機給更多時間摘花穗
const DROP_SPD = IS_DESKTOP ? 1.5 : 3;       // 桌機水滴下落慢一倍
const HIT_PAD  = IS_DESKTOP ? 10  : 0;       // 桌機擴大點擊判定區 (px)
const LS_KEY        = 'basil_game_highscore';
const LS_UNLOCK_KEY = 'basil_unlocked_dishes';

const PLANTING_TIPS = [
  '提示：花穗未摘，葉子會變老變苦！看到花穗立刻剪掉。',
  '提示：水分不足傷根！土乾了就澆透，直到水從底部流出。',
  '提示：害蟲會偷吃葉子，傷口還容易感染！發現就要立刻處理。',
  '提示：九層塔怕冷，低於 15°C 葉子會變黑，寒流來要移到室內！',
  '提示：每隔 2-3 週施一次液態肥，葉子才會又大又香。',
];

// 桌機生成間隔延長 40%
function spawnCfg(t: number): { pest: number; drop: number; bud: number } {
  const f = IS_DESKTOP ? 1.4 : 1.0;
  if (t > 45) return { pest: 2600*f, drop: 0,       bud: 0      };
  if (t > 30) return { pest: 2000*f, drop: 2000*f,  bud: 0      };
  if (t > 15) return { pest: 1500*f, drop: 1500*f,  bud: 4000*f };
              return { pest: 1000*f, drop: 1100*f,  bud: 2800*f };
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}


// --- Water Drop SVG ---
function WaterDrop({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 28 36" width={size} height={size * 36 / 28} xmlns="http://www.w3.org/2000/svg">
      {/* 主水滴 */}
      <path d="M14,2 C14,2 4,14 4,22 C4,28.6 8.5,34 14,34 C19.5,34 24,28.6 24,22 C24,14 14,2 14,2Z"
        fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.8"/>
      {/* 高光 */}
      <path d="M10,16 C9,19 8.5,22 9,25" stroke="#bfdbfe" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8"/>
      <ellipse cx="17" cy="14" rx="2" ry="3.5" fill="#bfdbfe" opacity="0.5" transform="rotate(20,17,14)"/>
    </svg>
  );
}

// --- Pest (caterpillar) SVG ---
function Pest({ width = 44 }: { width?: number }) {
  return (
    <svg viewBox="0 0 52 30" width={width} height={width * 30 / 52} xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <style>{`
        @keyframes pestWiggle {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-2.5px); }
        }
        .ps { animation: pestWiggle 0.55s ease-in-out infinite; }
        .ps1 { animation-delay: 0.00s; }
        .ps2 { animation-delay: 0.09s; }
        .ps3 { animation-delay: 0.18s; }
        .ps4 { animation-delay: 0.27s; }
        .ps5 { animation-delay: 0.36s; }
      `}</style>

      {/* 尾段 */}
      <g className="ps ps1">
        <circle cx="8"  cy="16" r="7"   fill="#6abf3a" stroke="#3d7a1a" strokeWidth="0.7"/>
        <line x1="10" y1="21" x2="8"  y2="26" stroke="#3d7a1a" strokeWidth="1" strokeLinecap="round"/>
        <line x1="14" y1="22" x2="14" y2="27" stroke="#3d7a1a" strokeWidth="1" strokeLinecap="round"/>
      </g>

      {/* 第2節 */}
      <g className="ps ps2">
        <circle cx="19" cy="14" r="7.5" fill="#72cc3e" stroke="#3d7a1a" strokeWidth="0.7"/>
        <line x1="21" y1="21" x2="19" y2="26" stroke="#3d7a1a" strokeWidth="1" strokeLinecap="round"/>
        <line x1="25" y1="21" x2="25" y2="26" stroke="#3d7a1a" strokeWidth="1" strokeLinecap="round"/>
      </g>

      {/* 第3節 */}
      <g className="ps ps3">
        <circle cx="30" cy="13" r="7.5" fill="#6abf3a" stroke="#3d7a1a" strokeWidth="0.7"/>
        <line x1="32" y1="20" x2="30" y2="25" stroke="#3d7a1a" strokeWidth="1" strokeLinecap="round"/>
        <line x1="36" y1="20" x2="36" y2="25" stroke="#3d7a1a" strokeWidth="1" strokeLinecap="round"/>
      </g>

      {/* 第4節 */}
      <g className="ps ps4">
        <circle cx="41" cy="13" r="7.5" fill="#72cc3e" stroke="#3d7a1a" strokeWidth="0.7"/>
      </g>

      {/* 頭 */}
      <g className="ps ps5">
        <circle cx="46" cy="11" r="5.5" fill="#4a9e20" stroke="#2a6010" strokeWidth="0.8"/>
        <circle cx="47.5" cy="9"  r="1.4" fill="white"/>
        <circle cx="47.8" cy="9"  r="0.7" fill="#1a1a1a"/>
        <line x1="46" y1="6" x2="43" y2="2" stroke="#2a6010" strokeWidth="0.9" strokeLinecap="round"/>
        <line x1="48" y1="6" x2="50" y2="2" stroke="#2a6010" strokeWidth="0.9" strokeLinecap="round"/>
        <circle cx="43" cy="2" r="1.2" fill="#2a6010"/>
        <circle cx="50" cy="2" r="1.2" fill="#2a6010"/>
      </g>
    </svg>
  );
}

// --- Basil Flower Spike SVG ---
// 五層輪生花穗：深紫苞片 + 淡紫小花，由下（開）至上（苞）漸縮
function FlowerSpike({ height = 46 }: { height?: number }) {
  return (
    <svg viewBox="0 0 24 50" width={height * 22 / 46} height={height} xmlns="http://www.w3.org/2000/svg">
      {/* 花莖 */}
      <line x1="12" y1="48" x2="12" y2="4" stroke="#4a5020" strokeWidth="1.4" strokeLinecap="round"/>

      {/* 第1層（底部，最開，y≈43） */}
      <path d="M12,44 C8,43 5,45 7,47 Z"  fill="#5a3872" opacity="0.9"/>
      <path d="M12,44 C16,43 19,45 17,47 Z" fill="#5a3872" opacity="0.9"/>
      <ellipse cx="6"  cy="41.5" rx="3.2" ry="2"  fill="#c080d0" stroke="#6820a0" strokeWidth="0.45" transform="rotate(-40,6,41.5)"/>
      <ellipse cx="8"  cy="40"   rx="2.6" ry="1.6" fill="#d8a0e8" stroke="#6820a0" strokeWidth="0.35" transform="rotate(-22,8,40)"/>
      <ellipse cx="18" cy="41.5" rx="3.2" ry="2"  fill="#c080d0" stroke="#6820a0" strokeWidth="0.45" transform="rotate(40,18,41.5)"/>
      <ellipse cx="16" cy="40"   rx="2.6" ry="1.6" fill="#d8a0e8" stroke="#6820a0" strokeWidth="0.35" transform="rotate(22,16,40)"/>
      <ellipse cx="12" cy="40.5" rx="2.2" ry="3"  fill="#b068c4" stroke="#6820a0" strokeWidth="0.4"/>

      {/* 第2層（y≈34） */}
      <path d="M12,35 C8.5,34 6,36 8,38 Z"  fill="#5a3872" opacity="0.9"/>
      <path d="M12,35 C15.5,34 18,36 16,38 Z" fill="#5a3872" opacity="0.9"/>
      <ellipse cx="7"  cy="32.5" rx="2.8" ry="1.8" fill="#c280d2" stroke="#6820a0" strokeWidth="0.4"  transform="rotate(-36,7,32.5)"/>
      <ellipse cx="9"  cy="31"   rx="2.2" ry="1.4" fill="#d8a2e8" stroke="#6820a0" strokeWidth="0.3"  transform="rotate(-20,9,31)"/>
      <ellipse cx="17" cy="32.5" rx="2.8" ry="1.8" fill="#c280d2" stroke="#6820a0" strokeWidth="0.4"  transform="rotate(36,17,32.5)"/>
      <ellipse cx="15" cy="31"   rx="2.2" ry="1.4" fill="#d8a2e8" stroke="#6820a0" strokeWidth="0.3"  transform="rotate(20,15,31)"/>
      <ellipse cx="12" cy="31.5" rx="2"   ry="2.6" fill="#ae68c2" stroke="#6820a0" strokeWidth="0.35"/>

      {/* 第3層（y≈26） */}
      <path d="M12,27 C9,26 7,27.5 9,29.5 Z"  fill="#5a3872" opacity="0.9"/>
      <path d="M12,27 C15,26 17,27.5 15,29.5 Z" fill="#5a3872" opacity="0.9"/>
      <ellipse cx="7.5"  cy="24.5" rx="2.4" ry="1.5" fill="#c684d6" stroke="#6820a0" strokeWidth="0.4"  transform="rotate(-32,7.5,24.5)"/>
      <ellipse cx="9.5"  cy="23"   rx="1.9" ry="1.2" fill="#dca8ea" stroke="#6820a0" strokeWidth="0.3"  transform="rotate(-16,9.5,23)"/>
      <ellipse cx="16.5" cy="24.5" rx="2.4" ry="1.5" fill="#c684d6" stroke="#6820a0" strokeWidth="0.4"  transform="rotate(32,16.5,24.5)"/>
      <ellipse cx="14.5" cy="23"   rx="1.9" ry="1.2" fill="#dca8ea" stroke="#6820a0" strokeWidth="0.3"  transform="rotate(16,14.5,23)"/>
      <ellipse cx="12"   cy="23.5" rx="1.8" ry="2.2" fill="#aa64be" stroke="#6820a0" strokeWidth="0.35"/>

      {/* 第4層（y≈18，漸閉合） */}
      <path d="M12,19 C9.5,18 8,19.5 10,21 Z"  fill="#5a3872" opacity="0.9"/>
      <path d="M12,19 C14.5,18 16,19.5 14,21 Z" fill="#5a3872" opacity="0.9"/>
      <ellipse cx="8.5"  cy="16.5" rx="2"   ry="1.3" fill="#c888d8" stroke="#6820a0" strokeWidth="0.4"  transform="rotate(-28,8.5,16.5)"/>
      <ellipse cx="15.5" cy="16.5" rx="2"   ry="1.3" fill="#c888d8" stroke="#6820a0" strokeWidth="0.4"  transform="rotate(28,15.5,16.5)"/>
      <ellipse cx="12"   cy="16"   rx="1.5" ry="2"   fill="#a660ba" stroke="#6820a0" strokeWidth="0.35"/>

      {/* 第5層（y≈11，小花苞） */}
      <path d="M12,12 C10,11 8.5,12.5 10.5,13.5 Z"  fill="#5a3872" opacity="0.9"/>
      <path d="M12,12 C14,11 15.5,12.5 13.5,13.5 Z" fill="#5a3872" opacity="0.9"/>
      <ellipse cx="9.5"  cy="10"  rx="1.4" ry="1.0" fill="#c07cce" stroke="#6820a0" strokeWidth="0.35" transform="rotate(-22,9.5,10)"/>
      <ellipse cx="14.5" cy="10"  rx="1.4" ry="1.0" fill="#c07cce" stroke="#6820a0" strokeWidth="0.35" transform="rotate(22,14.5,10)"/>
      <ellipse cx="12"   cy="9.5" rx="1.3" ry="1.8" fill="#a058b6" stroke="#6010a0" strokeWidth="0.4"/>

      {/* 頂端花苞 */}
      <ellipse cx="12" cy="6"   rx="2.4" ry="3.5" fill="#9850b0" stroke="#6010a0" strokeWidth="0.45"/>
      <ellipse cx="12" cy="4.8" rx="1.4" ry="2"   fill="#b070c4" opacity="0.6"/>
    </svg>
  );
}

// --- Component ---
export default function BasilGame() {
  const [phase, setPhase]         = useState<Phase>('idle');
  const [hp,    setHp]            = useState(100);
  const [water, setWater]         = useState(70);
  const [score, setScore]         = useState(0);
  const [time,  setTime]          = useState(DURATION);
  const [pests, setPests]         = useState<Pest[]>([]);
  const [buds,  setBuds]          = useState<Bud[]>([]);
  const [drops, setDrops]         = useState<Drop[]>([]);
  const [pausedUntil, setPausedUntil] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [wonDish,        setWonDish]        = useState<DishData | null>(null);
  const [unlockedDishes, setUnlockedDishes] = useState<Set<string>>(new Set());
  const [modalDish,      setModalDish]      = useState<DishData | null>(null);
  const [scorePopups,    setScorePopups]    = useState<ScorePopup[]>([]);
  const [lossTip,        setLossTip]        = useState('');

  // Refs for stale-closure-safe reads
  const timeRef  = useRef(DURATION);
  const scoreRef = useRef(0);
  const gameRef  = useRef<HTMLDivElement>(null);
  useEffect(() => { timeRef.current  = time;  }, [time]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  // Load persisted data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setHighScore(parseInt(saved, 10));
    const savedUnlocked = localStorage.getItem(LS_UNLOCK_KEY);
    if (savedUnlocked) {
      try { setUnlockedDishes(new Set(JSON.parse(savedUnlocked))); } catch {}
    }
  }, []);

  // Save high score when game ends
  useEffect(() => {
    if (phase !== 'won' && phase !== 'lost') return;
    const final = scoreRef.current;
    setHighScore(prev => {
      if (final > prev) {
        localStorage.setItem(LS_KEY, String(final));
        return final;
      }
      return prev;
    });
  }, [phase]);

  // 勝利時隨機抽一道料理，並解鎖該料理
  useEffect(() => {
    if (phase === 'won') {
      const dish = getRandomDish();
      setWonDish(dish);
      setUnlockedDishes(prev => {
        const next = new Set(prev);
        next.add(dish.name);
        localStorage.setItem(LS_UNLOCK_KEY, JSON.stringify([...next]));
        return next;
      });
    }
  }, [phase]);

  // HP zero → lost
  useEffect(() => {
    if (phase === 'playing' && hp <= 0) setPhase('lost');
  }, [hp, phase]);

  // 失敗時隨機抽一條種植提示
  useEffect(() => {
    if (phase === 'lost') {
      setLossTip(PLANTING_TIPS[Math.floor(Math.random() * PLANTING_TIPS.length)]);
    }
  }, [phase]);

  const spawnAcc = useRef({ pest: 0, drop: 0, bud: 0 });

  const startGame = () => {
    setPhase('playing');
    setHp(100); setWater(70); setScore(0); setTime(DURATION);
    setPests([]); setBuds([]); setDrops([]); setPausedUntil(0);
    spawnAcc.current = { pest: 0, drop: 0, bud: 0 };
    timeRef.current  = DURATION;
    scoreRef.current = 0;
  };

  // 1-second: countdown + water drain
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      setTime(prev => {
        const next = prev - 1;
        if (next <= 0) setPhase('won');
        return Math.max(0, next);
      });
      if (!GOD_MODE) setWater(prev => {
        const next = Math.max(0, prev - 2);
        if (next === 0) setHp(h => Math.max(0, h - 2));
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // 50ms physics: drops, expiry, spawning
  useEffect(() => {
    if (phase !== 'playing') return;
    const TICK = 50;
    const t = setInterval(() => {
      const now = Date.now();
      const c   = spawnCfg(timeRef.current);

      setDrops(prev => {
        let loss = 0;
        const next = prev
          .map(d => ({ ...d, y: d.y + DROP_SPD }))
          .filter(d => { if (d.y >= GAME_H) { loss += 8; return false; } return true; });
        if (!GOD_MODE && loss > 0) setWater(w => Math.max(0, w - loss));
        return next;
      });

      setPests(prev => {
        let loss = 0;
        const next = prev.filter(p => {
          if (now - p.bornAt > PEST_TTL) { loss += 5; return false; }
          return true;
        });
        if (!GOD_MODE && loss > 0) setHp(h => Math.max(0, h - loss));
        return next;
      });

      setBuds(prev => {
        let anyExpired = false;
        const next = prev.filter(b => {
          if (now - b.bornAt > BUD_TTL) { anyExpired = true; return false; }
          return true;
        });
        if (!GOD_MODE && anyExpired) setPausedUntil(Date.now() + 8000);
        return next;
      });

      spawnAcc.current.pest += TICK;
      spawnAcc.current.drop += TICK;
      spawnAcc.current.bud  += TICK;

      if (spawnAcc.current.pest >= c.pest) {
        spawnAcc.current.pest = 0;
        setPests(p => [...p, { id: uid(), x: (IS_DESKTOP ? 25 : 15) + Math.random() * (IS_DESKTOP ? 50 : 70), y: 230 + Math.random() * 130, bornAt: now }]);
      }
      if (c.drop > 0 && spawnAcc.current.drop >= c.drop) {
        spawnAcc.current.drop = 0;
        setDrops(d => [...d, { id: uid(), x: (IS_DESKTOP ? 20 : 8) + Math.random() * (IS_DESKTOP ? 60 : 84), y: -24 }]);
      }
      if (c.bud > 0 && spawnAcc.current.bud >= c.bud) {
        spawnAcc.current.bud = 0;
        // 鏡像 BasilPlantSVG 分枝尖端數學，花穗永遠從可見的枝尖長出
        const growth  = Math.round((DURATION - timeRef.current) / DURATION * 100);
        const mainFrac = Math.min(1, growth / 30);
        const mainTipY = 161 - mainFrac * 66;
        const brFrac   = Math.max(0, Math.min(1, (growth - 30) / 50));
        const BX = 80, BY = 95, LX = 46, LY = 44, RX = 114, RY = 44;
        const lTipX = BX + brFrac * (LX - BX), lTipY = BY + brFrac * (LY - BY);
        const rTipX = BX + brFrac * (RX - BX), rTipY = BY + brFrac * (RY - BY);
        const subFrac  = Math.max(0, Math.min(1, (growth - 80) / 20));

        const tips: { x: number; y: number }[] = [];
        if (growth >= 10 && growth < 30) {
          tips.push({ x: 80, y: mainTipY });                            // 主莖尖端
        } else if (growth >= 30 && growth < 80) {
          tips.push({ x: lTipX, y: lTipY }, { x: rTipX, y: rTipY });  // 左右分枝尖端
        } else if (growth >= 80) {
          const llX = LX + subFrac*(28 -LX), llY = LY + subFrac*(17-LY);
          const lrX = LX + subFrac*(64 -LX), lrY = LY + subFrac*(17-LY);
          const rlX = RX + subFrac*(96 -RX), rlY = RY + subFrac*(17-RY);
          const rrX = RX + subFrac*(132-RX), rrY = RY + subFrac*(17-RY);
          tips.push({x:llX,y:llY},{x:lrX,y:lrY},{x:rlX,y:rlY},{x:rrX,y:rrY});
        }
        if (tips.length > 0) {
          const tip = tips[Math.floor(Math.random() * tips.length)];
          setBuds(b => [...b, { id: uid(), svgX: Math.round(tip.x), svgY: Math.round(tip.y), rot: (Math.random() - 0.5) * 20, bornAt: now }]);
        }
      }
    }, TICK);
    return () => clearInterval(t);
  }, [phase]);

  const addPopup = (e: React.MouseEvent, label: string, color: string) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = uid();
    setScorePopups(prev => [...prev, { id, x, y, label, color }]);
    setTimeout(() => setScorePopups(prev => prev.filter(p => p.id !== id)), 1000);
  };

  const clickPest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addPopup(e, '+2', '#16a34a');
    setPests(p => p.filter(x => x.id !== id));
    setScore(s => s + 2);
  };
  const clickBud = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addPopup(e, '+3', '#9333ea');
    setBuds(b => b.filter(x => x.id !== id));
    setPausedUntil(0);
    setScore(s => s + 3);
  };
  const clickDrop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addPopup(e, '+1', '#3b82f6');
    setDrops(d => d.filter(x => x.id !== id));
    setWater(w => Math.min(100, w + 12));
    setScore(s => s + 1);
  };

  const isPlaying      = phase === 'playing';
  const isGrowthPaused = pausedUntil > Date.now();
  const isNewHighScore = (phase === 'won' || phase === 'lost') && score > 0 && score >= highScore;

  return (
    <section id="game" className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">九層塔大師挑戰</h2>
        <p className="text-slate-600">同時對抗害蟲、補充水分、摘除花穗！撐完 60 秒就贏！</p>
      </div>

      <div className="glass-card rounded-[32px] md:rounded-[40px] shadow-xl border-emerald-100 overflow-hidden">

        {/* Status bar */}
        {isPlaying && (
          <div className="px-6 pt-5 pb-4 grid grid-cols-4 gap-4 border-b border-slate-100">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>生命</span><span>{hp}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${hp}%` }} className={`h-full ${hp < 30 ? 'bg-red-500' : 'bg-red-400'}`} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>水分</span><span>{Math.round(water)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${water}%` }} className="h-full bg-blue-400" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">分數</div>
              <div className="text-2xl font-bold text-emerald-600 leading-none">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">時間</div>
              <div className={`text-2xl font-bold leading-none ${time <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                {time}s
              </div>
            </div>
          </div>
        )}

        {/* Game area */}
        <div
          ref={gameRef}
          className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-blue-50/30 to-emerald-50"
          style={{ height: GAME_H }}
        >
          {/* Idle screen */}
          {phase === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-1 gap-2 p-8">
              <div className="pointer-events-none">
                <BasilPlantSVG growth={10} health={100}/>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-bold text-slate-800">準備好了嗎？</h3>
                {highScore > 0 && (
                  <div className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-bold px-3 py-1 rounded-full">
                    <Trophy size={14} /> 本機最高分：{highScore}
                  </div>
                )}
                <div className="flex gap-6 justify-center text-sm text-slate-600 flex-wrap items-center">
                  <span className="flex items-center gap-1"><Pest width={30} /> 點擊除蟲 <b>+2</b></span>
                  <span className="flex items-center gap-1"><span style={{ display: 'inline-block', transform: 'rotate(45deg)' }}><FlowerSpike height={32} /></span> 點擊摘除花穗 <b>+3</b></span>
                  <span className="flex items-center gap-1"><WaterDrop size={20} /> 點擊接水 <b>+1</b></span>
                </div>
                <p className="text-slate-400 text-xs">害蟲未除 → 損血｜花穗未摘 → 成長暫停｜水滴未接 → 水分下降</p>
              </div>
              <button
                onClick={startGame}
                className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 active:scale-95 transition-all"
              >
                開始挑戰
              </button>
            </div>
          )}

          {/* End overlay */}
          <AnimatePresence>
            {(phase === 'won' || phase === 'lost') && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-start pt-16 gap-5 z-20"
              >
                {phase === 'won' && wonDish ? (
                  /* ── 勝利：隨機料理卡 ── */
                  <>
                    <div className="flex items-center gap-2">
                      <Trophy size={28} className="text-yellow-500 flex-shrink-0"/>
                      <h3 className="text-xl font-bold text-slate-800">挑戰成功！今天學到的食譜：</h3>
                    </div>
                    <wonDish.SVG/>
                    <div className="text-center px-2">
                      <p className="text-2xl font-bold text-emerald-700">{wonDish.name}</p>
                      <p className="text-xs text-slate-400 italic mt-1">{wonDish.description}</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-sm text-slate-600 text-center max-w-xs">
                      <span className="font-bold text-emerald-700">食材：</span>
                      {wonDish.ingredients.join('・')}
                    </div>
                    <div className="text-center space-y-0.5">
                      <p className="text-slate-500 text-sm">最終分數：<span className="text-2xl font-bold text-emerald-600 ml-1">{score}</span></p>
                      {isNewHighScore && <p className="text-xs font-bold text-yellow-600">🏆 新的本機最高分！</p>}
                      {!isNewHighScore && highScore > 0 && <p className="text-xs text-slate-400">本機最高：{highScore}</p>}
                    </div>
                  </>
                ) : (
                  /* ── 失敗畫面 ── */
                  <>
                    <AlertTriangle size={80} className="text-red-500"/>
                    <h3 className="text-3xl font-bold text-slate-800">植物枯萎了...</h3>
                    <div className="text-center space-y-1">
                      <p className="text-slate-500">最終分數：<span className="text-3xl font-bold text-emerald-600 ml-1">{score}</span></p>
                      {isNewHighScore && <p className="text-sm font-bold text-yellow-600">🏆 新的本機最高分！</p>}
                      {!isNewHighScore && highScore > 0 && <p className="text-xs text-slate-400">本機最高：{highScore}</p>}
                    </div>
                    {lossTip && (
                      <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 max-w-xs text-center">{lossTip}</p>
                    )}
                  </>
                )}
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                >
                  <RefreshCw size={18} /> 再玩一次
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plant + Pot (center, fixed at top=120) */}
          {/* Badges 獨立定位，避免擠壓 SVG 位置導致花穗座標偏移 */}
          {isPlaying && isGrowthPaused && (
            <div className="absolute left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded-full border border-slate-200" style={{ top: 94 }}>
              成長暫停
            </div>
          )}
          {isPlaying && hp < 30 && !isGrowthPaused && (
            <div className="absolute left-1/2 -translate-x-1/2 text-xs font-bold text-red-500 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded-full border border-red-200 animate-pulse" style={{ top: 94 }}>
              ⚠️ 危險
            </div>
          )}
          {isPlaying && (
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{ top: 120 }}>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <BasilPlantSVG
                  growth={Math.round((DURATION - time) / DURATION * 100)}
                  health={hp}
                  paused={isGrowthPaused}
                />
              </motion.div>
            </div>
          )}

          {/* Raindrops */}
          {drops.map(d => (
            <button
              key={d.id}
              onClick={e => clickDrop(d.id, e)}
              className="absolute active:scale-75 transition-transform select-none touch-manipulation"
              style={{ left: `${d.x}%`, top: d.y - HIT_PAD, transform: 'translateX(-50%)', padding: HIT_PAD }}
              aria-label="接水"
            >
              <WaterDrop />
            </button>
          ))}

          {/* Pests */}
          {pests.map(p => (
            <button
              key={p.id}
              onClick={e => clickPest(p.id, e)}
              className="absolute active:scale-75 transition-transform select-none touch-manipulation"
              style={{ left: `${p.x}%`, top: p.y - HIT_PAD, transform: 'translateX(-50%)', padding: HIT_PAD }}
              aria-label="除蟲"
            >
              <Pest />
            </button>
          ))}

          {/* Score popups */}
          {scorePopups.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -48 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute pointer-events-none font-black text-xl z-30 drop-shadow"
              style={{ left: p.x, top: p.y, transform: 'translateX(-50%)', color: p.color }}
            >
              {p.label}
            </motion.div>
          ))}

          {/* Flower buds */}
          {buds.map(b => (
            <button
              key={b.id}
              onClick={e => clickBud(b.id, e)}
              className="absolute active:scale-75 transition-transform select-none touch-manipulation"
              style={{ left: `calc(50% + ${b.svgX - 80}px)`, top: 120 + b.svgY - 44 - HIT_PAD, transform: 'translateX(-50%)', padding: HIT_PAD }}
              aria-label="摘除花穗"
            >
              <div style={{ transform: `rotate(${b.rot}deg)`, transformOrigin: 'center bottom' }}>
                <FlowerSpike />
              </div>
            </button>
          ))}
        </div>

        {/* Legend strip */}
        <div className="px-6 py-3 flex justify-center gap-8 text-sm text-slate-400 border-t border-slate-100 items-center">
          <span className="flex items-center gap-1"><Pest width={30} /> 除蟲 <b className="text-slate-600">+2</b></span>
          <span className="flex items-center gap-1"><span style={{ display: 'inline-block', transform: 'rotate(45deg)' }}><FlowerSpike height={32} /></span> 摘除花穗 <b className="text-slate-600">+3</b></span>
          <span className="flex items-center gap-1"><WaterDrop size={20} /> 接水 <b className="text-slate-600">+1</b></span>
        </div>
      </div>

      {/* 料理食譜面板 */}
      {(() => {
        const allDishes = getAllDishes();
        return (
          <div className="glass-card rounded-2xl shadow border-emerald-100 px-6 py-5">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">料理食譜</p>
            <p className="text-center text-xs text-slate-400 mb-4">把九層塔帶回家，自己種、自己做！</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {allDishes.map(dish => {
                const unlocked = unlockedDishes.has(dish.name);
                return (
                  <div
                    key={dish.name}
                    className={`flex flex-col items-center gap-1.5 ${unlocked ? 'cursor-pointer' : 'cursor-default'}`}
                    onClick={() => unlocked && setModalDish(dish)}
                  >
                    <div className={`w-[70px] h-[70px] overflow-hidden flex-shrink-0 rounded-xl transition-all ${unlocked ? 'hover:scale-110 hover:shadow-md' : ''}`}>
                      <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', filter: unlocked ? 'none' : 'brightness(0)' }}>
                        <dish.SVG />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 text-center w-[70px]">
                      {unlocked ? dish.name : '???'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* 料理 Modal */}
      <AnimatePresence>
        {modalDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalDish(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-xs w-full flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <modalDish.SVG />
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-700">{modalDish.name}</p>
                <p className="text-sm text-slate-400 italic mt-1">{modalDish.description}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-sm text-slate-600 text-center w-full">
                <span className="font-bold text-emerald-700">食材：</span>
                {modalDish.ingredients.join('・')}
              </div>
              <p className="text-xs text-slate-400 text-center -mt-1">把九層塔帶回家種，自己動手做做看！</p>
              <button
                onClick={() => setModalDish(null)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium text-sm transition-all"
              >
                關閉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
