/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Wind, ThermometerSun, ChevronRight, Heart, Sprout } from 'lucide-react';
import MimosaLeaf from '@/src/components/MimosaLeaf';

const BASE = import.meta.env.BASE_URL;

// --- TipCard（複用九層塔同樣結構）---
function TipCard({ icon, title, content, color }: {
  icon: React.ReactNode; title: string; content: string; color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6 rounded-2xl shadow-sm border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{content}</p>
    </motion.div>
  );
}

export default function MimosaApp() {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('mimosa_likes');
    if (saved) setLikes(parseInt(saved, 10));
  }, []);

  const handleLike = () => {
    const next = likes + 1;
    setLikes(next);
    localStorage.setItem('mimosa_likes', next.toString());
  };

  return (
    <div className="min-h-screen font-sans">

      {/* Hero */}
      <header className="relative py-8 md:py-10 flex items-center justify-center overflow-hidden border-b border-pink-100"
        style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-10 px-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tighter"
            style={{ color: '#831843' }}>
            含羞草<span style={{ color: '#db2777' }}>小學堂</span>
          </h1>
          <p className="text-xs md:text-sm max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#9d174d' + 'b3' }}>
            恭喜你帶走了一株神奇的含羞草！輕輕碰它，它會害羞縮起來——跟著指南，讓它在你家陽台或窗台茁壯成長。
          </p>
        </motion.div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl" style={{ background: '#f9a8d420' }}/>
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl" style={{ background: '#e879f920' }}/>
      </header>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-start md:justify-center gap-6 md:gap-8 whitespace-nowrap">
          {[
            { name: '互動', id: 'touch' },
            { name: '秘訣', id: 'environment' },
            { name: '栽種', id: 'planting' },
            { name: '清單', id: 'checklist' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm md:text-base font-bold transition-colors px-1 py-1 relative group"
              style={{ color: '#9d174d' }}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                style={{ background: '#db2777' }}/>
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 space-y-20 md:space-y-32">

        {/* 互動區 */}
        <section id="touch" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">輕碰看看！</h2>
            <p className="text-slate-600">
              含羞草的葉片對觸碰非常敏感，這叫做「感震性」。碰一下，葉片會在幾秒內收合；放著不動，它又會慢慢展開。
            </p>
          </div>
          <div className="glass-card rounded-[32px] p-8 md:p-12 flex flex-col items-center gap-6 shadow-xl border-pink-100">
            <MimosaLeaf />
            <div className="max-w-sm text-center space-y-2 text-sm text-slate-500 border-t border-slate-100 pt-4 w-full">
              <p>⚠️ 雖然好玩，但<span className="font-bold text-slate-700">不要太頻繁觸碰</span>——每次收合都消耗植物能量，頻繁觸碰會讓含羞草漸漸變弱。</p>
            </div>
          </div>
        </section>

        {/* 環境秘訣 */}
        <section id="environment" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">生長環境秘訣</h2>
            <p className="text-slate-600">含羞草喜歡溫暖明亮的環境，和九層塔比起來更耐陰一點，但同樣怕冷怕積水。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TipCard
              icon={<Sun />}
              title="明亮間接光"
              content="不需要全日照！每天 4-6 小時明亮的散射光就夠了。放在窗邊但避開正午強烈直射，陽光太強反而讓葉片一直收合、消耗能量。"
              color="#eab308"
            />
            <TipCard
              icon={<ThermometerSun />}
              title="怕冷不怕熱"
              content="最適合 18-30°C。低於 10°C 葉片會停止反應、植株變弱。冬天寒流來時務必移到室內，也要遠離冷氣出風口。"
              color="#f97316"
            />
            <TipCard
              icon={<Wind />}
              title="通風不積水"
              content="保持良好通風，預防真菌和蚜蟲。澆水後確認底盤沒有積水——根部長期泡水會腐爛，這是含羞草最常見的死因。"
              color="#a855f7"
            />
          </div>
        </section>

        {/* 栽種步驟 */}
        <section id="planting" className="rounded-[40px] p-8 md:p-20 overflow-hidden relative text-white"
          style={{ background: 'linear-gradient(135deg, #831843 0%, #9d174d 60%, #7e22ce 100%)' }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full -mr-48 -mt-48 blur-3xl opacity-40"
            style={{ background: '#db2777' }}/>

          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold mb-8">如何開始種植？</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                    style={{ background: '#9d174d' }}>1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">準備排水良好的盆器</h4>
                    <p style={{ color: '#fce7f3cc' }}>選底部有孔的盆子，避免積水。培養土混一點珍珠石讓排水更好；花市或園藝店都買得到。含羞草根系不算大，中小型盆就夠。</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                    style={{ background: '#9d174d' }}>2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">輕拿輕放移植</h4>
                    <p style={{ color: '#fce7f3cc' }}>含羞草對震動敏感，移植時動作要輕。保留根部原土球，不要抖掉。移植後放在陰涼處緩苗 1-2 天，再移回明亮位置。</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                    style={{ background: '#9d174d' }}>3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">正確澆水</h4>
                    <p style={{ color: '#fce7f3cc' }}>保持土壤微濕，手指插進土 1 公分，感覺偏乾才澆，澆透讓水從底部流出。</p>
                    <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2"
                      style={{ background: '#7f1d1d60', border: '1px solid #f8717140' }}>
                      <span className="text-base leading-none mt-0.5" style={{ color: '#fca5a5' }}>⚠️</span>
                      <p className="text-sm leading-snug" style={{ color: '#fecaca' }}>
                        <span className="font-bold">積水比乾旱更危險！</span>根部泡水會腐爛，是含羞草最常見的死因。底盤有積水要立刻倒掉。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 rounded-3xl border" style={{ background: '#ffffff18', borderColor: '#ffffff18' }}>
                <div className="flex items-center gap-3 mb-4" style={{ color: '#f9a8d4' }}>
                  <span className="text-2xl">🌸</span>
                  <h3 className="text-2xl font-bold">趣味知識：為什麼會害羞？</h3>
                </div>
                <p className="mb-4 leading-relaxed" style={{ color: '#fce7f3ee' }}>
                  含羞草的葉柄基部有一個「葉枕」，裡面充滿水分。受到觸碰時，葉枕快速將水分排出，葉片就因為失去支撐而下垂閉合。這是它演化出來嚇跑昆蟲的自我保護機制！
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#fce7f3aa' }}>
                  幾分鐘後，水分會再回流到葉枕，葉片就自然展開——就像充氣一樣。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 日常清單 */}
        <section id="checklist" className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-center text-slate-800">日常照顧清單</h2>
          <div className="space-y-4">
            {[
              '光線檢查：今天有接受到明亮的間接光嗎？避免正午強烈直射。',
              '水分檢查：手指插進土 1 公分，偏乾才澆透。底盤有積水要立刻倒掉！',
              '觸碰限制：今天碰它幾次了？好玩歸好玩，一天最多 2-3 次就好。',
              '溫度確認：是否遠離冷氣出風口和寒流？低於 10°C 要移到室內。',
              '通風確認：盆栽周圍是否有空間讓空氣流通？',
              '觀察葉片：葉片是否有變黃或自動下垂（不是被碰的情況）？可能需要調整光線或水分。',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 glass-card rounded-2xl hover:bg-white transition-colors cursor-default"
              >
                <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: '#db2777', color: '#db2777' }}>
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
              <Sprout style={{ color: '#f472b6' }} /> 含羞草小學堂
            </h2>
            <p className="text-slate-400 text-sm md:text-base">祝你的含羞草越來越茂盛，越來越不害羞！</p>
          </div>

          {/* 連結到九層塔 */}
          <a
            href={`${BASE}index.html`}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-emerald-700 hover:bg-emerald-900/40 transition-colors group"
          >
            <Sprout size={22} className="text-emerald-400" />
            <div className="text-left">
              <p className="text-xs text-slate-400">也在義賣？</p>
              <p className="font-bold text-emerald-400 group-hover:text-emerald-300">看看九層塔怎麼種 →</p>
            </div>
          </a>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-sm text-slate-500">2026 義賣會 302</div>
              <div className="font-bold" style={{ color: '#f472b6' }}>Happy Planting!</div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest md:hidden">給個愛心</span>
              <button
                onClick={handleLike}
                className="group relative w-14 h-14 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
                style={{ background: '#db2777', boxShadow: '0 8px 24px #db277730' }}
              >
                <Heart size={28} className="md:w-6 md:h-6 text-white" fill={likes > 0 ? 'currentColor' : 'none'} />
                {likes > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-pink-100 shadow-sm">
                    {likes}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-600 text-xs">
          &copy; 2026 含羞草小學堂.
        </div>
      </footer>
    </div>
  );
}
