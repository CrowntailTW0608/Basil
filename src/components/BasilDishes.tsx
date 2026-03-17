import React from 'react';

export interface DishData {
  name: string;
  ingredients: string[];
  description: string;
  SVG: React.FC;
}

// ── 通用：透視盤底 ─────────────────────────────────────────
function FlatPlate() {
  return (
    <>
      <ellipse cx="80" cy="148" rx="64" ry="11" fill="#c5bfb8"/>
      <ellipse cx="80" cy="143" rx="63" ry="10" fill="#ece7e1"/>
      <ellipse cx="80" cy="139" rx="53" ry="8.5" fill="#f9f7f4"/>
    </>
  );
}

// ── 通用：九層塔小葉 ───────────────────────────────────────
function BasilLeaf({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
      <path d="M0,0 C-5,-2 -9,-8 -7,-14 C-5,-20 0,-22 0,-22 C0,-22 5,-20 7,-14 C9,-8 5,-2 0,0Z"
        fill="#1e7a1e" stroke="#0f4f0f" strokeWidth="0.4"/>
      <line x1="0" y1="0" x2="0" y2="-21" stroke="#0f4f0f" strokeWidth="0.5"/>
    </g>
  );
}

// ── 1. 三杯雞 ──────────────────────────────────────────────
function SanBeiJiSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 醬汁底 */}
      <ellipse cx="80" cy="128" rx="47" ry="13" fill="#6b1200"/>
      <ellipse cx="80" cy="125" rx="41" ry="11" fill="#8b2000"/>
      {/* 雞塊 */}
      <ellipse cx="60" cy="121" rx="14" ry="9"  fill="#c47230" transform="rotate(-18,60,121)"/>
      <ellipse cx="87" cy="119" rx="12" ry="8"  fill="#b05e1e"/>
      <ellipse cx="73" cy="112" rx="10" ry="7"  fill="#c47230" transform="rotate(12,73,112)"/>
      <ellipse cx="99" cy="117" rx="10" ry="7"  fill="#a85820" transform="rotate(-8,99,117)"/>
      <ellipse cx="63" cy="131" rx="9"  ry="6"  fill="#c47230" transform="rotate(22,63,131)"/>
      {/* 大蒜、薑 */}
      <ellipse cx="48"  cy="124" rx="5" ry="3.5" fill="#e8d5a0" transform="rotate(-20,48,124)"/>
      <ellipse cx="109" cy="127" rx="5" ry="3"   fill="#dfc880" transform="rotate(15,109,127)"/>
      {/* 九層塔 */}
      <BasilLeaf x={69}  y={107} r={-20} s={0.9}/>
      <BasilLeaf x={84}  y={102} r={15}  s={0.85}/>
      <BasilLeaf x={97}  y={110} r={-8}  s={0.8}/>
      {/* 蒸氣 */}
      <path d="M55,80 C52,73 58,67 55,60" stroke="#ccc" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M80,75 C77,68 83,62 80,55" stroke="#ccc" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M105,80 C102,73 108,67 105,60" stroke="#ccc" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── 2. 塔香炒蛋 ────────────────────────────────────────────
function TaXiangChaoDanSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 炒蛋 blob */}
      <path d="M42,132 C40,120 50,107 62,112 C72,107 80,117 77,130 C74,136 55,138 42,132Z" fill="#f5c218"/>
      <path d="M68,128 C65,114 77,105 88,110 C98,105 106,116 103,130 C100,137 75,138 68,128Z" fill="#fad84a"/>
      <path d="M96,130 C93,119 102,111 111,115 C118,119 115,133 108,137 C100,140 97,137 96,130Z" fill="#f5c218"/>
      {/* 亮面 */}
      <ellipse cx="63"  cy="116" rx="8"  ry="5" fill="#fff3a0" opacity="0.55" transform="rotate(-20,63,116)"/>
      <ellipse cx="86"  cy="111" rx="7"  ry="4" fill="#fff3a0" opacity="0.45" transform="rotate(10,86,111)"/>
      <ellipse cx="105" cy="118" rx="5"  ry="3" fill="#fff3a0" opacity="0.4"/>
      {/* 九層塔 */}
      <BasilLeaf x={54}  y={107} r={-25} s={0.9}/>
      <BasilLeaf x={75}  y={102} r={10}  s={0.85}/>
      <BasilLeaf x={93}  y={106} r={-10} s={0.82}/>
      <BasilLeaf x={110} y={117} r={20}  s={0.75}/>
    </svg>
  );
}

// ── 3. 塔香茄子 ────────────────────────────────────────────
function TaXiangQieZiSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 醬汁底 */}
      <ellipse cx="80" cy="130" rx="46" ry="13" fill="#3e2000" opacity="0.8"/>
      {/* 茄子（斜切段，帶截面） */}
      <ellipse cx="53"  cy="127" rx="17" ry="10" fill="#6b2fa0" transform="rotate(-28,53,127)"/>
      <ellipse cx="53"  cy="127" rx="13" ry="7"  fill="#8b4cc0" transform="rotate(-28,53,127)"/>
      <ellipse cx="53"  cy="127" rx="6"  ry="3"  fill="#5a2090" opacity="0.5" transform="rotate(-28,53,127)"/>

      <ellipse cx="79"  cy="119" rx="16" ry="9"  fill="#7b3ab0" transform="rotate(-18,79,119)"/>
      <ellipse cx="79"  cy="119" rx="12" ry="6.5" fill="#9b5ad0" transform="rotate(-18,79,119)"/>
      <ellipse cx="79"  cy="119" rx="5.5" ry="3" fill="#6b2fa0" opacity="0.45" transform="rotate(-18,79,119)"/>

      <ellipse cx="103" cy="126" rx="15" ry="9"  fill="#6b2fa0" transform="rotate(-24,103,126)"/>
      <ellipse cx="103" cy="126" rx="11" ry="6.5" fill="#8b4cc0" transform="rotate(-24,103,126)"/>
      <ellipse cx="103" cy="126" rx="5"  ry="2.8" fill="#5a2090" opacity="0.45" transform="rotate(-24,103,126)"/>
      {/* 醬汁光澤 */}
      <path d="M48,118 C65,112 97,112 110,120" stroke="#7a4010" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
      {/* 九層塔 */}
      <BasilLeaf x={62}  y={109} r={-15} s={0.85}/>
      <BasilLeaf x={85}  y={104} r={12}  s={0.82}/>
      <BasilLeaf x={100} y={113} r={-5}  s={0.78}/>
    </svg>
  );
}

// ── 4. 青醬義大利麵 ────────────────────────────────────────
function PestoPastaSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      {/* 碗（深色，比盤深） */}
      <ellipse cx="80" cy="149" rx="64" ry="13" fill="#b0a498"/>
      <ellipse cx="80" cy="144" rx="63" ry="12" fill="#d4c8ba"/>
      <ellipse cx="80" cy="140" rx="56" ry="10" fill="#e8ddd0"/>
      <ellipse cx="80" cy="137" rx="49" ry="8"  fill="#f0e8dc"/>
      {/* 青醬底 */}
      <ellipse cx="80" cy="130" rx="45" ry="12" fill="#2a5018"/>
      <ellipse cx="80" cy="127" rx="39" ry="10" fill="#3a6e20"/>
      {/* 麵條 */}
      <path d="M46,118 C52,107 57,120 63,109 C69,98 74,114 80,104"  stroke="#f0e8c8" strokeWidth="3"   fill="none" strokeLinecap="round"/>
      <path d="M58,125 C64,114 70,126 76,115 C82,104 87,120 93,110" stroke="#e8d8a8" strokeWidth="3"   fill="none" strokeLinecap="round"/>
      <path d="M72,128 C78,117 84,129 90,118 C96,107 101,123 106,114" stroke="#f0e8c8" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M88,125 C93,114 98,126 103,116 C108,108 111,121 114,114" stroke="#e8d8a8" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 起司碎末 */}
      <ellipse cx="67"  cy="111" rx="3"   ry="2"   fill="#fffef0" transform="rotate(-20,67,111)"/>
      <ellipse cx="82"  cy="106" rx="2.5" ry="1.5" fill="#fffef0" transform="rotate(10,82,106)"/>
      <ellipse cx="97"  cy="113" rx="2.5" ry="1.5" fill="#fffef0"/>
      <ellipse cx="76"  cy="118" rx="2"   ry="1.5" fill="#fffef0" transform="rotate(25,76,118)"/>
      {/* 頂部大九層塔葉 */}
      <path d="M72,97 C68,86 80,82 84,93 C82,101 72,97 72,97Z" fill="#1a5a1a" stroke="#0f3f0f" strokeWidth="0.4"/>
      <line x1="78" y1="97" x2="78" y2="84" stroke="#0f3f0f" strokeWidth="0.8"/>
      <line x1="78" y1="91" x2="72" y2="94" stroke="#0f3f0f" strokeWidth="0.4"/>
      <line x1="78" y1="91" x2="83" y2="94" stroke="#0f3f0f" strokeWidth="0.4"/>
    </svg>
  );
}

// ── 5. 打拋豬肉飯 ──────────────────────────────────────────
function PadKrapowSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 白飯（左半） */}
      <path d="M32,139 C32,121 52,111 66,118 C79,111 80,126 80,139Z" fill="#f5f0e8"/>
      <ellipse cx="47" cy="128" rx="3"   ry="1.5" fill="#ebe6de" transform="rotate(-10,47,128)"/>
      <ellipse cx="58" cy="122" rx="2.5" ry="1.5" fill="#ebe6de" transform="rotate(15,58,122)"/>
      <ellipse cx="51" cy="135" rx="3"   ry="1.5" fill="#ebe6de" transform="rotate(-5,51,135)"/>
      <ellipse cx="63" cy="131" rx="2.5" ry="1.5" fill="#ebe6de" transform="rotate(20,63,131)"/>
      <ellipse cx="41" cy="133" rx="2.5" ry="1.5" fill="#ebe6de"/>
      {/* 打拋豬肉末（右半） */}
      <path d="M80,139 C80,124 96,111 112,118 C127,111 128,126 128,139Z" fill="#5a2e10"/>
      <ellipse cx="92"  cy="128" rx="5.5" ry="4"   fill="#7a4020" transform="rotate(-10,92,128)"/>
      <ellipse cx="104" cy="121" rx="5"   ry="3.5" fill="#6a3018" transform="rotate(15,104,121)"/>
      <ellipse cx="116" cy="128" rx="5"   ry="3.5" fill="#7a4020"/>
      <ellipse cx="98"  cy="133" rx="4.5" ry="3"   fill="#6a3018" transform="rotate(10,98,133)"/>
      <ellipse cx="112" cy="135" rx="4"   ry="3"   fill="#7a4020" transform="rotate(-8,112,135)"/>
      <ellipse cx="88"  cy="134" rx="3.5" ry="2.5" fill="#8a5030" transform="rotate(5,88,134)"/>
      {/* 荷包蛋 */}
      <ellipse cx="80" cy="117" rx="19" ry="12" fill="#fefefe"/>
      <ellipse cx="80" cy="115" rx="9"  ry="7"  fill="#f5b800"/>
      <ellipse cx="77" cy="113" rx="3"  ry="2"  fill="#ffd040" opacity="0.7"/>
      {/* 九層塔 */}
      <BasilLeaf x={62}  y={110} r={-20} s={0.85}/>
      <BasilLeaf x={97}  y={109} r={18}  s={0.82}/>
      <BasilLeaf x={80}  y={100} r={0}   s={0.78}/>
    </svg>
  );
}

// ── 料理資料 ───────────────────────────────────────────────
const DISHES: DishData[] = [
  {
    name: '三杯雞',
    ingredients: ['雞腿肉', '九層塔', '大蒜', '老薑', '麻油・醬油・米酒各一杯'],
    description: '台灣家常第一名！九層塔讓鑊氣瞬間飄香整條街。',
    SVG: SanBeiJiSVG,
  },
  {
    name: '塔香炒蛋',
    ingredients: ['雞蛋', '九層塔', '蒜末', '鹽・醬油少許'],
    description: '最簡單的九層塔料理，五分鐘就能上桌的家常好味道。',
    SVG: TaXiangChaoDanSVG,
  },
  {
    name: '塔香茄子',
    ingredients: ['茄子', '九層塔', '大蒜', '辣椒', '醬油・烏醋・糖'],
    description: '紫色茄子配深色醬汁，最後加九層塔提香，下飯神器！',
    SVG: TaXiangQieZiSVG,
  },
  {
    name: '青醬義大利麵',
    ingredients: ['義大利麵', '新鮮九層塔', '松子', '帕馬森起司', '橄欖油・大蒜'],
    description: '用台灣九層塔做義式青醬，清香比普通羅勒更有個性！',
    SVG: PestoPastaSVG,
  },
  {
    name: '打拋豬肉飯',
    ingredients: ['豬絞肉', '九層塔', '大蒜', '辣椒', '魚露・蠔油', '荷包蛋'],
    description: '泰式風味在家輕鬆做，荷包蛋一蓋就是一碗完美的打拋飯！',
    SVG: PadKrapowSVG,
  },
];

export function getRandomDish(): DishData {
  return DISHES[Math.floor(Math.random() * DISHES.length)];
}

export function getAllDishes(): DishData[] {
  return DISHES;
}
