import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Droplets, RefreshCw, Trophy, AlertTriangle, Info, Heart } from 'lucide-react';
import BasilPlantSVG from '@/src/components/BasilPlantSVG';

export default function LegacyGame() {
  const [gameActive, setGameActive] = useState(false);
  const [health, setHealth]         = useState(100);
  const [growth, setGrowth]         = useState(0);
  const [water,  setWater]          = useState(60);
  const [sun,    setSun]            = useState(70);
  const [gameState,   setGameState]   = useState<'playing' | 'won' | 'lost'>('playing');
  const [gameMessage, setGameMessage] = useState("點擊按鈕開始照顧你的九層塔！");

  // Game Loop
  useEffect(() => {
    if (!gameActive || gameState !== 'playing') return;

    const timer = setInterval(() => {
      setWater(prev => Math.max(0, prev - 2));
      setSun(prev => Math.max(0, prev - 1.5));

      setHealth(prev => {
        let damage = 0;
        if (water < 20 || water > 90) damage += 2;
        if (sun < 30 || sun > 95) damage += 1;
        const newHealth = Math.max(0, prev - damage);
        if (newHealth === 0) setGameState('lost');
        return newHealth;
      });

      setGrowth(prev => {
        let gain = 0;
        if (water >= 40 && water <= 80 && sun >= 50 && sun <= 90) gain = 1;
        const newGrowth = Math.min(100, prev + gain);
        if (newGrowth === 100) setGameState('won');
        return newGrowth;
      });

      if (water < 20)       setGameMessage("太乾了！快澆水！");
      else if (water > 90)  setGameMessage("水太多了，根部快爛掉了！");
      else if (sun < 30)    setGameMessage("陽光不足，葉子變黃了...");
      else if (sun > 95)    setGameMessage("太陽太毒了，快搬到陰涼處！");
      else                  setGameMessage("生長環境完美！繼續保持！");
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, gameState, water, sun]);

  const resetGame = () => {
    setHealth(100); setGrowth(0); setWater(60); setSun(70);
    setGameState('playing'); setGameActive(true);
    setGameMessage("挑戰開始！");
  };

  return (
    <section id="game" className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">九層塔大師挑戰</h2>
        <p className="text-slate-600">你能成功將九層塔養到滿分嗎？注意水分與陽光的平衡！</p>
      </div>

      <div className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-xl border-emerald-100 relative overflow-hidden">
        {!gameActive && gameState === 'playing' ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 space-y-8">
            <div className="pointer-events-none">
              <BasilPlantSVG growth={10} health={100} />
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
            {/* 植株視覺 */}
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
                    {health < 30 && (
                      <div className="absolute top-0 right-0 text-red-500 animate-pulse">⚠️ 危險</div>
                    )}
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

            {/* 控制面板 */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Heart className={health < 30 ? "text-red-500 animate-bounce" : "text-red-400"} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>生命值</span><span>{health}%</span>
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
                      <Droplets size={20} /> 澆水
                    </button>
                    <button
                      onClick={() => setSun(prev => Math.min(100, prev + 15))}
                      className="flex-1 h-16 md:h-14 bg-yellow-500 text-white rounded-2xl font-bold shadow-lg shadow-yellow-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Sun size={20} /> 曬太陽
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
    </section>
  );
}
