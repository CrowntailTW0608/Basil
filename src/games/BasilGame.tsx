/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Trophy, AlertTriangle, RefreshCw } from 'lucide-react';

// --- Types ---
interface Pest { id: string; x: number; y: number; bornAt: number }
interface Bud  { id: string; x: number; bornAt: number }
interface Drop { id: string; x: number; y: number }
type Phase = 'idle' | 'playing' | 'won' | 'lost';

// --- Constants ---
const DURATION = 60;    // seconds
const GAME_H   = 480;   // px, game area height
const PEST_TTL = 2500;  // ms before pest expires → -HP
const BUD_TTL  = 3500;  // ms before bud expires  → growth paused
const DROP_SPD = 3;     // px per 50ms tick ≈ 60px/s

// Spawn intervals (ms) by time remaining
function spawnCfg(t: number): { pest: number; drop: number; bud: number } {
  if (t > 45) return { pest: 2600, drop: 0,    bud: 0    };
  if (t > 30) return { pest: 2000, drop: 2000,  bud: 0    };
  if (t > 15) return { pest: 1500, drop: 1500,  bud: 4000 };
              return { pest: 1000, drop: 1100,  bud: 2800 };
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
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

  // Refs for stale-closure-safe reads inside intervals
  const timeRef = useRef(DURATION);
  useEffect(() => { timeRef.current = time; }, [time]);

  // HP zero → lost
  useEffect(() => {
    if (phase === 'playing' && hp <= 0) setPhase('lost');
  }, [hp, phase]);

  // Spawn accumulators (ms elapsed since last spawn per type)
  const spawnAcc = useRef({ pest: 0, drop: 0, bud: 0 });

  const startGame = () => {
    setPhase('playing');
    setHp(100); setWater(70); setScore(0); setTime(DURATION);
    setPests([]); setBuds([]); setDrops([]); setPausedUntil(0);
    spawnAcc.current = { pest: 0, drop: 0, bud: 0 };
    timeRef.current  = DURATION;
  };

  // 1-second: countdown + natural water drain
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      setTime(prev => {
        const next = prev - 1;
        if (next <= 0) setPhase('won');
        return Math.max(0, next);
      });
      setWater(prev => {
        const next = Math.max(0, prev - 2);
        if (next === 0) setHp(h => Math.max(0, h - 2));
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // 50ms physics: drop movement, entity expiry, spawning
  useEffect(() => {
    if (phase !== 'playing') return;
    const TICK = 50;
    const t = setInterval(() => {
      const now = Date.now();
      const c   = spawnCfg(timeRef.current);

      // Move drops; water loss when drop hits ground
      setDrops(prev => {
        let loss = 0;
        const next = prev
          .map(d => ({ ...d, y: d.y + DROP_SPD }))
          .filter(d => { if (d.y >= GAME_H) { loss += 8; return false; } return true; });
        if (loss > 0) setWater(w => Math.max(0, w - loss));
        return next;
      });

      // Expire pests → HP loss
      setPests(prev => {
        let loss = 0;
        const next = prev.filter(p => {
          if (now - p.bornAt > PEST_TTL) { loss += 5; return false; }
          return true;
        });
        if (loss > 0) setHp(h => Math.max(0, h - loss));
        return next;
      });

      // Expire buds → growth paused
      setBuds(prev => {
        let anyExpired = false;
        const next = prev.filter(b => {
          if (now - b.bornAt > BUD_TTL) { anyExpired = true; return false; }
          return true;
        });
        if (anyExpired) setPausedUntil(Date.now() + 8000);
        return next;
      });

      // Spawn entities
      spawnAcc.current.pest += TICK;
      spawnAcc.current.drop += TICK;
      spawnAcc.current.bud  += TICK;

      if (spawnAcc.current.pest >= c.pest) {
        spawnAcc.current.pest = 0;
        setPests(p => [...p, {
          id: uid(),
          x: 15 + Math.random() * 70,
          y: 230 + Math.random() * 140,
          bornAt: now,
        }]);
      }
      if (c.drop > 0 && spawnAcc.current.drop >= c.drop) {
        spawnAcc.current.drop = 0;
        setDrops(d => [...d, { id: uid(), x: 8 + Math.random() * 84, y: -24 }]);
      }
      if (c.bud > 0 && spawnAcc.current.bud >= c.bud) {
        spawnAcc.current.bud = 0;
        setBuds(b => [...b, { id: uid(), x: 30 + Math.random() * 40, bornAt: now }]);
      }
    }, TICK);
    return () => clearInterval(t);
  }, [phase]);

  // Click handlers
  const clickPest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPests(p => p.filter(x => x.id !== id));
    setScore(s => s + 2);
  };
  const clickBud = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBuds(b => b.filter(x => x.id !== id));
    setPausedUntil(0);
    setScore(s => s + 3);
  };
  const clickDrop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDrops(d => d.filter(x => x.id !== id));
    setWater(w => Math.min(100, w + 12));
    setScore(s => s + 1);
  };

  const isPlaying     = phase === 'playing';
  const isGrowthPaused = pausedUntil > Date.now();

  return (
    <section id="game" className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">九層塔大師挑戰</h2>
        <p className="text-slate-600">同時對抗害蟲、補充水分、摘除花穗！撐完 60 秒就贏！</p>
      </div>

      <div className="glass-card rounded-[32px] md:rounded-[40px] shadow-xl border-emerald-100 overflow-hidden">

        {/* Status bar (visible during play) */}
        {isPlaying && (
          <div className="px-6 pt-5 pb-4 grid grid-cols-4 gap-4 border-b border-slate-100">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>生命</span><span>{hp}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${hp}%` }}
                  className={`h-full ${hp < 30 ? 'bg-red-500' : 'bg-red-400'}`}
                />
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
          className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-blue-50/30 to-emerald-50"
          style={{ height: GAME_H }}
        >
          {/* Idle screen */}
          {phase === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8">
              <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center">
                <Sprout size={64} className="text-emerald-600" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-slate-800">準備好了嗎？</h3>
                <div className="flex gap-6 justify-center text-sm text-slate-600 flex-wrap">
                  <span>🐛 點擊除蟲 <b>+2</b></span>
                  <span>🌸 點擊摘心 <b>+3</b></span>
                  <span>💧 點擊接水 <b>+1</b></span>
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
                className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-20"
              >
                {phase === 'won'
                  ? <Trophy size={80} className="text-yellow-500" />
                  : <AlertTriangle size={80} className="text-red-500" />
                }
                <h3 className="text-3xl font-bold text-slate-800">
                  {phase === 'won' ? '挑戰成功！🎉' : '植物枯萎了...'}
                </h3>
                <p className="text-slate-500">
                  最終分數：<span className="text-3xl font-bold text-emerald-600 ml-1">{score}</span>
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                >
                  <RefreshCw size={18} /> 再玩一次
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plant (center, fixed) */}
          {isPlaying && (
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{ top: 150 }}>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <Sprout
                  size={140}
                  className={hp < 30 ? 'text-yellow-600' : isGrowthPaused ? 'text-slate-400' : 'text-emerald-500'}
                />
              </motion.div>
              {isGrowthPaused && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded-full border border-slate-200">
                  成長暫停
                </div>
              )}
              {hp < 30 && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                  ⚠️ 危險
                </div>
              )}
            </div>
          )}

          {/* Raindrops — click to catch */}
          {drops.map(d => (
            <button
              key={d.id}
              onClick={e => clickDrop(d.id, e)}
              className="absolute text-2xl leading-none active:scale-75 transition-transform select-none touch-manipulation"
              style={{ left: `${d.x}%`, top: d.y, transform: 'translateX(-50%)' }}
              aria-label="接水"
            >
              💧
            </button>
          ))}

          {/* Pests — click to remove */}
          {pests.map(p => (
            <button
              key={p.id}
              onClick={e => clickPest(p.id, e)}
              className="absolute text-2xl leading-none active:scale-75 transition-transform select-none touch-manipulation"
              style={{ left: `${p.x}%`, top: p.y, transform: 'translateX(-50%)' }}
              aria-label="除蟲"
            >
              🐛
            </button>
          ))}

          {/* Flower buds — click to pinch */}
          {buds.map(b => (
            <button
              key={b.id}
              onClick={e => clickBud(b.id, e)}
              className="absolute text-2xl leading-none active:scale-75 transition-transform select-none touch-manipulation animate-bounce"
              style={{ left: `${b.x}%`, top: 100, transform: 'translateX(-50%)' }}
              aria-label="摘心"
            >
              🌸
            </button>
          ))}
        </div>

        {/* Legend strip */}
        <div className="px-6 py-3 flex justify-center gap-8 text-sm text-slate-400 border-t border-slate-100">
          <span>🐛 除蟲 <b className="text-slate-600">+2</b></span>
          <span>🌸 摘心 <b className="text-slate-600">+3</b></span>
          <span>💧 接水 <b className="text-slate-600">+1</b></span>
        </div>
      </div>
    </section>
  );
}
