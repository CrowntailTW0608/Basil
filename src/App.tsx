/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import BasilGame from '@/src/games/BasilGame';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Wind, 
  Sprout, 
  Scissors, 
  ThermometerSun, 
  ChevronRight,
  CheckCircle2,
  Heart,
  Droplets,
  RefreshCw,
  Trophy,
  AlertTriangle,
  Info
} from 'lucide-react';

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

// --- Basil Plant SVG ---
const BasilPlantSVG = ({ growth, health }: { growth: number; health: number }) => {
  const sick = health < 30;
  const leafFill  = sick ? '#ca8a04' : '#22c55e';
  const leafDark  = sick ? '#92400e' : '#15803d';
  const stemColor = sick ? '#a16207' : '#166534';
  const show = (min: number) => growth >= min;

  return (
    <svg viewBox="0 0 100 180" width="160" height="180" xmlns="http://www.w3.org/2000/svg">
      {/* 花盆 */}
      <rect x="26" y="148" width="48" height="7" rx="3.5" fill="#92400e"/>
      <path d="M30,155 L34,174 L66,174 L70,155 Z" fill="#b45309"/>
      <path d="M34,174 L66,174 L64,177 L36,177 Z" fill="#92400e"/>
      {/* 泥土 */}
      <ellipse cx="50" cy="150" rx="18" ry="4" fill="#78350f"/>

      {/* 主莖 */}
      <line x1="50" y1="148" x2="50" y2="52" stroke={stemColor} strokeWidth="2.5" strokeLinecap="round"/>

      {/* 第1對葉 — growth >= 8 */}
      {show(8) && <>
        <ellipse cx="34" cy="132" rx="14" ry="6.5" fill={leafFill} transform="rotate(-22,34,132)"/>
        <ellipse cx="66" cy="132" rx="14" ry="6.5" fill={leafFill} transform="rotate(22,66,132)"/>
        <line x1="50" y1="132" x2="35" y2="132" stroke={leafDark} strokeWidth="0.8"/>
        <line x1="50" y1="132" x2="65" y2="132" stroke={leafDark} strokeWidth="0.8"/>
      </>}

      {/* 第2對葉 — growth >= 25 */}
      {show(25) && <>
        <ellipse cx="32" cy="116" rx="14" ry="6.5" fill={leafFill} transform="rotate(-28,32,116)"/>
        <ellipse cx="68" cy="116" rx="14" ry="6.5" fill={leafFill} transform="rotate(28,68,116)"/>
        <line x1="50" y1="116" x2="33" y2="116" stroke={leafDark} strokeWidth="0.8"/>
        <line x1="50" y1="116" x2="67" y2="116" stroke={leafDark} strokeWidth="0.8"/>
      </>}

      {/* 第3對葉 — growth >= 45 */}
      {show(45) && <>
        <ellipse cx="31" cy="101" rx="13" ry="6" fill={leafFill} transform="rotate(-33,31,101)"/>
        <ellipse cx="69" cy="101" rx="13" ry="6" fill={leafFill} transform="rotate(33,69,101)"/>
        <line x1="50" y1="101" x2="32" y2="101" stroke={leafDark} strokeWidth="0.8"/>
        <line x1="50" y1="101" x2="68" y2="101" stroke={leafDark} strokeWidth="0.8"/>
      </>}

      {/* 第4對葉 — growth >= 65 */}
      {show(65) && <>
        <ellipse cx="32" cy="86" rx="12" ry="5.5" fill={leafFill} transform="rotate(-38,32,86)"/>
        <ellipse cx="68" cy="86" rx="12" ry="5.5" fill={leafFill} transform="rotate(38,68,86)"/>
        <line x1="50" y1="86" x2="33" y2="86" stroke={leafDark} strokeWidth="0.8"/>
        <line x1="50" y1="86" x2="67" y2="86" stroke={leafDark} strokeWidth="0.8"/>
      </>}

      {/* 第5對葉 — growth >= 82 */}
      {show(82) && <>
        <ellipse cx="35" cy="72" rx="11" ry="5" fill={leafFill} transform="rotate(-42,35,72)"/>
        <ellipse cx="65" cy="72" rx="11" ry="5" fill={leafFill} transform="rotate(42,65,72)"/>
        <line x1="50" y1="72" x2="36" y2="72" stroke={leafDark} strokeWidth="0.8"/>
        <line x1="50" y1="72" x2="64" y2="72" stroke={leafDark} strokeWidth="0.8"/>
      </>}

      {/* 頂芽 — growth >= 55 */}
      {show(55) && <>
        <ellipse cx="43" cy="63" rx="9" ry="5" fill={leafFill} transform="rotate(-15,43,63)"/>
        <ellipse cx="57" cy="63" rx="9" ry="5" fill={leafFill} transform="rotate(15,57,63)"/>
        <ellipse cx="50" cy="55" rx="5" ry="7" fill={leafFill}/>
      </>}
    </svg>
  );
};

const SHOW_GAME = true;         // 是否顯示遊戲區塊
const USE_LEGACY_GAME = false;  // true = 舊遊戲（種植模擬）；false = 新遊戲（除蟲＋接水＋摘心）

export default function App() {
  // Game State
  const [gameActive, setGameActive] = useState(false);
  const [health, setHealth] = useState(100);
  const [growth, setGrowth] = useState(0);
  const [water, setWater] = useState(60);
  const [sun, setSun] = useState(70);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [gameMessage, setGameMessage] = useState("點擊按鈕開始照顧你的九層塔！");
  const [likes, setLikes] = useState<number>(0);

  // Load likes from LocalStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('basil_likes');
    if (savedLikes) {
      setLikes(parseInt(savedLikes, 10));
    }
  }, []);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem('basil_likes', newLikes.toString());
  };

  // Game Loop
  useEffect(() => {
    if (!gameActive || gameState !== 'playing') return;

    const timer = setInterval(() => {
      setWater(prev => Math.max(0, prev - 2));
      setSun(prev => Math.max(0, prev - 1.5));

      // Health logic
      setHealth(prev => {
        let damage = 0;
        if (water < 20 || water > 90) damage += 2;
        if (sun < 30 || sun > 95) damage += 1;
        
        const newHealth = Math.max(0, prev - damage);
        if (newHealth === 0) setGameState('lost');
        return newHealth;
      });

      // Growth logic
      setGrowth(prev => {
        let gain = 0;
        if (water >= 40 && water <= 80 && sun >= 50 && sun <= 90) {
          gain = 1;
        }
        const newGrowth = Math.min(100, prev + gain);
        if (newGrowth === 100) setGameState('won');
        return newGrowth;
      });

      // Messages
      if (water < 20) setGameMessage("太乾了！快澆水！");
      else if (water > 90) setGameMessage("水太多了，根部快爛掉了！");
      else if (sun < 30) setGameMessage("陽光不足，葉子變黃了...");
      else if (sun > 95) setGameMessage("太陽太毒了，快搬到陰涼處！");
      else setGameMessage("生長環境完美！繼續保持！");

    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, gameState, water, sun]);

  const resetGame = () => {
    setHealth(100);
    setGrowth(0);
    setWater(60);
    setSun(70);
    setGameState('playing');
    setGameActive(true);
    setGameMessage("挑戰開始！");
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
            恭喜你帶走了一株充滿香氣的九層塔！跟著我們的簡單指南，讓它在你的陽台茁壯成長。
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
        {SHOW_GAME && (USE_LEGACY_GAME ? <section id="game" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">九層塔大師挑戰</h2>
            <p className="text-slate-600">你能成功將九層塔養到滿分嗎？注意水分與陽光的平衡！</p>
          </div>

          <div className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-xl border-emerald-100 relative overflow-hidden">
            {!gameActive && gameState === 'playing' ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 space-y-8">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Sprout size={48} className="md:hidden" />
                  <Sprout size={64} className="hidden md:block" />
                </div>
                <div className="text-center px-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">準備好接受挑戰了嗎？</h3>
                  <p className="text-sm md:text-base text-slate-500">維持水分 40-80%，陽光 50-90% 是最佳生長條件。</p>
                </div>
                <button 
                  onClick={() => setGameActive(true)}
                  className="w-full md:w-auto px-12 py-5 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                  開始挑戰
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Game Visuals */}
                <div className="relative aspect-square md:aspect-auto md:h-[400px] bg-emerald-50/50 rounded-3xl flex flex-col items-center justify-center p-6 md:p-8 border border-emerald-100">
                  <AnimatePresence mode="wait">
                    {gameState === 'won' ? (
                      <motion.div 
                        key="won"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="text-center space-y-4"
                      >
                        <Trophy size={100} className="text-yellow-500 mx-auto" />
                        <h3 className="text-3xl font-bold text-emerald-800">挑戰成功！</h3>
                        <p className="text-emerald-600">你是一位真正的九層塔大師！</p>
                        <button onClick={resetGame} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold">再玩一次</button>
                      </motion.div>
                    ) : gameState === 'lost' ? (
                      <motion.div 
                        key="lost"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="text-center space-y-4"
                      >
                        <AlertTriangle size={100} className="text-red-500 mx-auto" />
                        <h3 className="text-3xl font-bold text-slate-800">植物枯萎了...</h3>
                        <p className="text-slate-500">別灰心，再試一次吧！</p>
                        <button onClick={resetGame} className="px-6 py-2 bg-slate-700 text-white rounded-xl font-bold">重新開始</button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="playing"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 3 } }}
                        className="relative"
                      >
                        <BasilPlantSVG growth={growth} health={health} />
                        {health < 30 && <div className="absolute top-0 right-0 text-red-500 animate-pulse">⚠️ 危險</div>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {gameState === 'playing' && (
                    <div className="mt-8 w-full space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>成長進度</span>
                        <span>{growth}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${growth}%` }} className="h-full bg-emerald-500" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Controls */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <Heart className={health < 30 ? "text-red-500 animate-bounce" : "text-red-400"} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm font-bold mb-1">
                          <span>生命值</span>
                          <span>{health}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${health}%` }} className={`h-full ${health < 30 ? 'bg-red-500' : 'bg-red-400'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="flex justify-between items-center mb-2">
                          <Droplets size={18} className="text-blue-500" />
                          <span className="text-xs font-bold text-blue-600">{Math.round(water)}%</span>
                        </div>
                        <div className="h-1.5 bg-blue-200 rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${water}%` }} className="h-full bg-blue-500" />
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                        <div className="flex justify-between items-center mb-2">
                          <Sun size={18} className="text-yellow-600" />
                          <span className="text-xs font-bold text-yellow-600">{Math.round(sun)}%</span>
                        </div>
                        <div className="h-1.5 bg-yellow-200 rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${sun}%` }} className="h-full bg-yellow-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {gameState === 'playing' ? (
                    <div className="space-y-6">
                      <div className="flex flex-row gap-4">
                        <button 
                          onClick={() => setWater(prev => Math.min(100, prev + 15))}
                          className="flex-1 h-16 md:h-14 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <Droplets size={20} />
                          澆水
                        </button>
                        <button 
                          onClick={() => setSun(prev => Math.min(100, prev + 15))}
                          className="flex-1 h-16 md:h-14 bg-yellow-500 text-white rounded-2xl font-bold shadow-lg shadow-yellow-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <Sun size={20} />
                          曬太陽
                        </button>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3 text-emerald-700">
                        <Info size={18} className="mt-0.5 flex-shrink-0" />
                        <span className="font-medium text-sm leading-tight">{gameMessage}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                      <p className="text-slate-500 mb-4">遊戲結束</p>
                      <button onClick={resetGame} className="flex items-center gap-2 mx-auto px-8 py-3 bg-slate-800 text-white rounded-xl font-bold">
                        <RefreshCw size={18} /> 重新挑戰
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section> : <BasilGame />)}

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
                    <p className="text-emerald-100/70">選一個底部有孔的盆子（排水才好）。土壤用一般的「培養土」混合一點「珍珠石」最理想，要保持鬆軟，不要讓土結成硬塊。</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xl">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">播種或扦插</h4>
                    <p className="text-emerald-100/70">種子播下後覆蓋薄土即可。更簡單的方法是：剪一段 10 公分的枝條，插在水瓶裡等長根後再種進土裡，成功率極高！</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xl">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">正確澆水法</h4>
                    <p className="text-emerald-100/70">「土乾了再澆」是黃金準則。用手指插進土裡 1 公分，感覺乾乾的就澆透（直到水從底部流出）。夏天早晚各一次，冬天則 2-3 天一次。</p>
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
                <p className="text-emerald-50 mb-6 leading-relaxed">
                  當植物長到 15 公分時，把最頂端的那對葉子連莖剪掉。這會強迫它從旁邊長出新分枝，讓你的九層塔從「一根竹竿」變成「一叢灌木」，產量增加三倍！
                </p>
                <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
                  <CheckCircle2 size={16} /> 越剪長越多，不要捨不得剪！
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ/Checklist */}
        <section id="checklist" className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-center text-slate-800">每日照顧清單</h2>
          <div className="space-y-4">
            {[
              "陽光檢查：每天是否有曬足 6 小時太陽？",
              "水分檢查：手指插進土裡，乾了就澆透（底部流出水）。",
              "修剪檢查：是否有枯黃或長蟲的葉子？有的話立刻剪掉。",
              "防開花：看到頂端長出「花穗」要立刻剪掉，否則葉子會變老變苦。",
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
