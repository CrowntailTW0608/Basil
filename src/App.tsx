/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import BasilGame from '@/src/games/BasilGame';
import LegacyGame from '@/src/games/LegacyGame';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Wind, Sprout, Scissors, ThermometerSun, ChevronRight, CheckCircle2, Heart } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

// --- Types ---
interface TipCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  color: string;
}

// --- Components ---

const TipCard = ({ icon, title, content, color }: TipCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 rounded-2xl shadow-sm border-l-4"
    style={{ borderLeftColor: color }}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4`} style={{ backgroundColor: `${color}20`, color }}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{content}</p>
  </motion.div>
);

// --- Pinching Demo Animation ---

function DemoLeaf({ x, y, angle = 0, s = 1 }: { x: number; y: number; angle?: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${angle}) scale(${s})`}>
      <path d="M0,0 C-5,-2 -8,-10 -5,-16 C-3,-20 0,-22 0,-22 C0,-22 3,-20 5,-16 C8,-10 5,-2 0,0Z"
        fill="#2d8b3e" stroke="#1a5c27" strokeWidth="0.6"/>
    </g>
  );
}

function DemoLeafPair({ x, y, spread = 30, s = 1 }: { x: number; y: number; spread?: number; s?: number }) {
  const rad = (spread * Math.PI) / 180;
  const dist = 18 * s;
  const lx = x - Math.sin(rad) * dist, ly = y - Math.cos(rad) * dist;
  const rx = x + Math.sin(rad) * dist, ry = ly;
  return (
    <>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke="#3a6b1f" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1={x} y1={y} x2={rx} y2={ry} stroke="#3a6b1f" strokeWidth="1.4" strokeLinecap="round"/>
      <DemoLeaf x={lx} y={ly} angle={-spread} s={0.85 * s}/>
      <DemoLeaf x={rx} y={ry} angle={spread}  s={0.85 * s}/>
    </>
  );
}

type DemoPhase = 0 | 1 | 2 | 3;

function PinchingDemo() {
  const [phase, setPhase] = useState<DemoPhase>(0);

  useEffect(() => {
    const durations: Record<DemoPhase, number> = { 0: 1300, 1: 1200, 2: 550, 3: 2700 };
    const id = setTimeout(() => setPhase(p => ((p + 1) % 4) as DemoPhase), durations[phase]);
    return () => clearTimeout(id);
  }, [phase]);

  const showTop      = phase <= 1;
  const showScissors = phase === 1;
  const showBranches = phase === 3;

  return (
    <svg viewBox="0 0 200 210" width="150" height="158" className="mx-auto block my-5">
      {/* Pot */}
      <path d="M70,172 L77,200 L123,200 L130,172 Z" fill="#b56b35"/>
      <rect x="63" y="164" width="74" height="10" rx="4" fill="#ca8050"/>
      <ellipse cx="100" cy="164" rx="33" ry="5.5" fill="#9a5020"/>
      <ellipse cx="100" cy="162" rx="27" ry="4"   fill="#4a2808"/>

      {/* Main stem */}
      <line x1="100" y1="158" x2="100" y2="92" stroke="#3a6b1f" strokeWidth="3" strokeLinecap="round"/>

      {/* Permanent leaf pairs */}
      <DemoLeafPair x={100} y={147} spread={38}/>
      <DemoLeafPair x={100} y={122} spread={34}/>
      <DemoLeafPair x={100} y={98}  spread={30}/>

      {/* Top node — exits when cut */}
      <AnimatePresence>
        {showTop && (
          <motion.g
            key="top"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.15 }}
            style={{ transformOrigin: '100px 92px' }}
            transition={{ duration: 0.35 }}
          >
            <line x1="100" y1="92" x2="100" y2="77" stroke="#3a6b1f" strokeWidth="2.5" strokeLinecap="round"/>
            <DemoLeafPair x={100} y={80} spread={22} s={0.75}/>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Cut dashed line */}
      <AnimatePresence>
        {showScissors && (
          <motion.line
            key="cutline"
            x1="55" y1="92" x2="145" y2="92"
            stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Scissors — slides in from right */}
      <AnimatePresence>
        {showScissors && (
          <motion.g
            key="scissors"
            initial={{ x: 65, opacity: 1 }}
            animate={{ x: 0,  opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.85, ease: 'easeOut' }}
          >
            {/* base pos: pivot at (130,88), tip at (102,88) */}
            <g transform="translate(130, 88)">
              <line x1="-28" y1="-3.5" x2="7" y2="-3.5" stroke="#888" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="-28" y1=" 3.5" x2="7" y2=" 3.5" stroke="#888" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="0" cy="0" r="3.5" fill="#ccc" stroke="#888" strokeWidth="0.8"/>
              <path d="M7,-3.5 C13,-3.5 16,-6 16,-13 C16,-19 12,-22 9,-22 C5,-22 4,-18 4,-12 C4,-6 7,-3.5 7,-3.5Z"
                fill="none" stroke="#888" strokeWidth="1.8"/>
              <path d="M7,3.5 C13,3.5 16,6 16,13 C16,19 12,22 9,22 C5,22 4,18 4,12 C4,6 7,3.5 7,3.5Z"
                fill="none" stroke="#888" strokeWidth="1.8"/>
            </g>
          </motion.g>
        )}
      </AnimatePresence>

      {/* New branches — grow after cut */}
      <AnimatePresence>
        {showBranches && (
          <motion.g key="branches">
            <motion.path
              d="M100,92 L63,64"
              stroke="#3a6b1f" strokeWidth="2.5" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
            <motion.path
              d="M100,92 L137,64"
              stroke="#3a6b1f" strokeWidth="2.5" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.09 }}
            />
            <motion.g
              style={{ transformOrigin: '63px 64px' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.66, duration: 0.45, ease: 'backOut' }}
            >
              <DemoLeafPair x={63} y={64} spread={22} s={0.72}/>
            </motion.g>
            <motion.g
              style={{ transformOrigin: '137px 64px' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.78, duration: 0.45, ease: 'backOut' }}
            >
              <DemoLeafPair x={137} y={64} spread={22} s={0.72}/>
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

const SHOW_GAME = true;         // 是否顯示遊戲區塊
const USE_LEGACY_GAME = false;  // true = 舊遊戲（種植模擬）；false = 新遊戲（除蟲＋接水＋摘心）

export default function App() {
  const [likes, setLikes] = useState<number>(0);

  // Load likes from LocalStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('basil_likes');
    if (savedLikes) setLikes(parseInt(savedLikes, 10));
  }, []);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem('basil_likes', newLikes.toString());
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <header className="relative py-8 md:py-10 flex items-center justify-center overflow-hidden herb-gradient border-b border-emerald-100">
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-10 px-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-2 tracking-tighter">
            九層塔<span className="text-emerald-600">小學堂</span>
          </h1>
          <p className="text-xs md:text-sm text-emerald-800/70 max-w-2xl mx-auto leading-relaxed">
            恭喜你帶走了一株充滿香氣的九層塔！跟著我們的簡單指南，讓它在你的陽台或窗台茁壯成長。
          </p>
        </motion.div>
        
        {/* Decorative Elements - Minimal */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-200/10 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100/10 rounded-full blur-3xl" />
      </header>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-start md:justify-center gap-6 md:gap-8 whitespace-nowrap">
          {[
            { name: "遊戲", id: "game" },
            { name: "秘訣", id: "environment" },
            { name: "栽種", id: "planting" },
            { name: "清單", id: "checklist" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm md:text-base font-bold text-emerald-800 hover:text-emerald-600 transition-colors px-1 py-1 relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 space-y-20 md:space-y-32">
        
        {/* Game Section */}
        {SHOW_GAME && (USE_LEGACY_GAME ? <LegacyGame /> : <BasilGame />)}

        {/* Environment Section */}
        <section id="environment" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">生長環境秘訣</h2>
            <p className="text-slate-600">九層塔是熱帶植物，喜歡溫暖、陽光與充足的水分。只要掌握以下三點，它就能長得非常茂盛！</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TipCard 
              icon={<Sun />}
              title="陽光要夠"
              content="九層塔是「吃太陽」的植物！每天至少要曬 6-8 小時太陽。如果陽光不足，枝條會長得很細長（徒長），葉子也會不香。南向陽台是最佳位置。"
              color="#eab308"
            />
            <TipCard 
              icon={<ThermometerSun />}
              title="怕冷不怕熱"
              content="最喜歡 20-30°C。夏天它長最快，但冬天寒流來（低於 15°C）葉子會變黑、掉落。冷氣團來時，請務必把它移到室內或避風處。"
              color="#f97316"
            />
            <TipCard 
              icon={<Wind />}
              title="空氣要流通"
              content="不要把盆栽塞在角落。通風好可以帶走多餘水分，預防發霉或長蟲。如果葉子太擠，記得修剪一下，讓中心也能「呼吸」。"
              color="#06b6d4"
            />
          </div>
        </section>

        {/* How to Plant Section */}
        <section id="planting" className="bg-emerald-900 text-white rounded-[40px] p-8 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">如何開始種植？</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xl">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">準備盆器與土壤</h4>
                    <p className="text-emerald-100/70">選一個底部有孔的盆子（排水才好）。土壤用一般的「培養土」混合一點「珍珠石」最理想，要保持鬆軟，不要讓土結成硬塊。珍珠石和培養土在花市或園藝店都買得到。</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xl">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">移植換盆</h4>
                    <p className="text-emerald-100/70">把植株從小盆移到大一點的盆子，保留根部的原土球，不要抖掉。換大盆後根系有更多空間，植株會長得更茂盛！想要更多株，可以剪一段 10 公分枝條插在水瓶裡，等長根後再種進土裡。</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xl">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">正確澆水法</h4>
                    <p className="text-emerald-100/70">「土乾了再澆」是黃金準則。用手指插進土裡 1 公分，感覺乾乾的就澆透（直到水從底部流出）。夏天大約每天一次，冬天則 2-3 天一次。</p>
                    <div className="mt-3 flex items-start gap-2 bg-red-900/40 border border-red-400/40 rounded-xl px-3 py-2">
                      <span className="text-red-300 text-base leading-none mt-0.5">⚠️</span>
                      <p className="text-red-200 text-sm leading-snug"><span className="font-bold">過度澆水比乾旱更危險！</span>土壤長期濕透會讓根部缺氧腐爛，葉子反而先變黃掉落。摸土不乾，就不要澆。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-4 text-yellow-400">
                  <Scissors size={24} />
                  <h3 className="text-2xl font-bold">進階秘訣：摘心</h3>
                </div>
                <p className="text-emerald-50 mb-4 leading-relaxed">
                  當植物長到 15 公分時，把最頂端的那對葉子連莖剪掉。這會強迫它從旁邊長出新分枝，讓你的九層塔從「一根竹竿」變成「一叢灌木」，產量增加三倍！
                </p>
                <PinchingDemo />
                <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
                  <CheckCircle2 size={16} /> 越剪長越多，不要捨不得剪！
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ/Checklist */}
        <section id="checklist" className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-center text-slate-800">日常照顧清單</h2>
          <div className="space-y-4">
            {[
              "陽光檢查：每天是否有曬足 6 小時太陽？",
              "水分檢查：手指插進土裡 1 公分，乾了才澆透（底部流出水）。摸起來還濕就不要澆，過度澆水會爛根！",
              "修剪檢查：是否有枯黃或長蟲的葉子？有的話立刻剪掉。",
              "防開花：看到頂端長出「花穗」要立刻剪掉，否則葉子會變老變苦。",
              "施肥補充：每隔 2-3 週澆一次稀釋液態肥，葉子才會又大又香。",
              "通風確認：盆栽周圍是否有空間讓空氣流通？",
              "心情檢查：聞聞葉片的香氣，這是種植最大的樂趣！"
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 glass-card rounded-2xl hover:bg-white transition-colors cursor-default"
              >
                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                  <ChevronRight size={14} />
                </div>
                <span className="text-lg text-slate-700 font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
              <Sprout className="text-emerald-400" /> 九層塔小學堂
            </h2>
            <p className="text-slate-400 text-sm md:text-base">祝你的九層塔長得又香又壯！</p>
          </div>
          
          {/* 連結到含羞草 */}
          <a
            href={`${BASE}mimosa.html`}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-pink-700 hover:bg-pink-900/40 transition-colors group"
          >
            <span className="text-2xl">🌸</span>
            <div className="text-left">
              <p className="text-xs text-slate-400">也在義賣？</p>
              <p className="font-bold text-pink-400 group-hover:text-pink-300">看看含羞草怎麼種 →</p>
            </div>
          </a>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-sm text-slate-500">2026 義賣會 302</div>
              <div className="text-emerald-400 font-bold">Happy Planting!</div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest md:hidden">給個愛心</span>
              <button 
                onClick={handleLike}
                className="group relative w-14 h-14 md:w-12 md:h-12 rounded-full bg-emerald-500 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <Heart size={28} className="md:w-6 md:h-6 text-white" fill={likes > 0 ? "currentColor" : "none"} />
                {likes > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-100 shadow-sm">
                    {likes}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-600 text-xs">
          &copy; 2026 九層塔小學堂. 
        </div>
      </footer>
    </div>
  );
}
