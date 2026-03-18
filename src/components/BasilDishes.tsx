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

// ── 6. 塔香蛤蜊 ────────────────────────────────────────────
function TaXiangGeLiSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 湯汁底 */}
      <ellipse cx="80" cy="133" rx="46" ry="12" fill="#d09028" opacity="0.55"/>

      {/* 蛤蜊 1（左） */}
      {/* 底殼 */}
      <ellipse cx="52" cy="128" rx="20" ry="11" fill="#c8a858"/>
      <ellipse cx="52" cy="126" rx="14" ry="7.5" fill="#d8bc68"/>
      <ellipse cx="51" cy="124" rx="8"  ry="5"   fill="#e8a050"/>
      <ellipse cx="49" cy="122" rx="3.5" ry="2.5" fill="#f0b860" opacity="0.65"/>
      {/* 上殼（開蓋） */}
      <path d="M33,124 C32,110 41,103 52,103 C63,103 72,110 71,124 Z" fill="#e0cc80" opacity="0.88"/>
      <line x1="52" y1="103" x2="34" y2="124" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="52" y1="103" x2="43" y2="126" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="52" y1="103" x2="52" y2="127" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="52" y1="103" x2="61" y2="126" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="52" y1="103" x2="71" y2="124" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <path d="M37,116 C41,109 47,105 54,104" stroke="#f0e4a0" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.7"/>

      {/* 蛤蜊 2（中） */}
      <ellipse cx="84" cy="120" rx="19" ry="10" fill="#cdb060"/>
      <ellipse cx="84" cy="118" rx="13" ry="7"   fill="#dcc070"/>
      <ellipse cx="83" cy="116" rx="7.5" ry="4.5" fill="#eca055"/>
      <ellipse cx="81" cy="114" rx="3"   ry="2.2" fill="#f8b858" opacity="0.65"/>
      {/* 上殼 */}
      <path d="M66,117 C65,104 73,97 84,97 C95,97 103,104 102,117 Z" fill="#ddd082" opacity="0.88"/>
      <line x1="84" y1="97" x2="67" y2="117" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="84" y1="97" x2="75" y2="119" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="84" y1="97" x2="84" y2="120" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="84" y1="97" x2="93" y2="119" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="84" y1="97" x2="102" y2="117" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <path d="M70,109 C74,102 80,98 87,98" stroke="#f0e4a0" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.7"/>

      {/* 蛤蜊 3（右） */}
      <ellipse cx="113" cy="127" rx="18" ry="10" fill="#c8a858"/>
      <ellipse cx="113" cy="125" rx="12" ry="6.5" fill="#d8bc68"/>
      <ellipse cx="112" cy="123" rx="7"  ry="4.5" fill="#e8a050"/>
      <ellipse cx="110" cy="121" rx="3"  ry="2"   fill="#f0b860" opacity="0.65"/>
      {/* 上殼 */}
      <path d="M96,124 C95,111 103,104 113,104 C123,104 131,111 130,124 Z" fill="#e0cc80" opacity="0.88"/>
      <line x1="113" y1="104" x2="97"  y2="124" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="113" y1="104" x2="105" y2="126" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="113" y1="104" x2="113" y2="127" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="113" y1="104" x2="121" y2="126" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <line x1="113" y1="104" x2="130" y2="124" stroke="#b89850" strokeWidth="0.8" opacity="0.5"/>
      <path d="M99,116 C103,109 109,105 116,104" stroke="#f0e4a0" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.7"/>

      {/* 九層塔 */}
      <BasilLeaf x={63}  y={101} r={-18} s={0.88}/>
      <BasilLeaf x={84}  y={95}  r={6}   s={0.84}/>
      <BasilLeaf x={104} y={102} r={-10} s={0.80}/>
    </svg>
  );
}

// ── 7. 卡布里沙拉 ──────────────────────────────────────────
function CapreseSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 橄欖油細線 */}
      <path d="M33,134 C60,129 100,129 127,134" stroke="#c8a010" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.55"/>
      {/* 番茄片 1 */}
      <ellipse cx="42" cy="122" rx="19" ry="13" fill="#c02020" transform="rotate(-8,42,122)"/>
      <ellipse cx="42" cy="122" rx="15" ry="10" fill="#d83030" transform="rotate(-8,42,122)"/>
      <line x1="33" y1="118" x2="51" y2="126" stroke="#a01010" strokeWidth="0.9" opacity="0.35"/>
      <line x1="32" y1="124" x2="52" y2="120" stroke="#a01010" strokeWidth="0.9" opacity="0.35"/>
      <ellipse cx="42" cy="122" rx="4" ry="2.8" fill="#b03030" opacity="0.45"/>
      {/* 莫札瑞拉 1 */}
      <ellipse cx="72" cy="118" rx="17" ry="11" fill="#f4eee4" transform="rotate(5,72,118)"/>
      <ellipse cx="72" cy="118" rx="13" ry="8.5" fill="#fdf8f0" transform="rotate(5,72,118)"/>
      <ellipse cx="70" cy="116" rx="5" ry="3.5" fill="#fff" opacity="0.65" transform="rotate(5,70,116)"/>
      {/* 番茄片 2 */}
      <ellipse cx="100" cy="120" rx="18" ry="12" fill="#c82020" transform="rotate(6,100,120)"/>
      <ellipse cx="100" cy="120" rx="14" ry="9"  fill="#da3030" transform="rotate(6,100,120)"/>
      <line x1="91" y1="116" x2="109" y2="124" stroke="#a01010" strokeWidth="0.9" opacity="0.35"/>
      <line x1="90" y1="122" x2="110" y2="118" stroke="#a01010" strokeWidth="0.9" opacity="0.35"/>
      <ellipse cx="100" cy="120" rx="3.5" ry="2.5" fill="#b03030" opacity="0.45"/>
      {/* 莫札瑞拉 2 */}
      <ellipse cx="126" cy="124" rx="15" ry="10" fill="#f4eee4" transform="rotate(-5,126,124)"/>
      <ellipse cx="126" cy="124" rx="11" ry="7.5" fill="#fdf8f0" transform="rotate(-5,126,124)"/>
      <ellipse cx="124" cy="122" rx="4.5" ry="3" fill="#fff" opacity="0.6"/>
      {/* 九層塔 */}
      <BasilLeaf x={58}  y={107} r={-15} s={1.0}/>
      <BasilLeaf x={87}  y={103} r={8}   s={0.95}/>
      <BasilLeaf x={114} y={110} r={-5}  s={0.9}/>
      {/* 橄欖油珠 */}
      <circle cx="50"  cy="130" r="2"   fill="#d4a810" opacity="0.5"/>
      <circle cx="82"  cy="133" r="1.6" fill="#d4a810" opacity="0.4"/>
      <circle cx="112" cy="131" r="2"   fill="#d4a810" opacity="0.45"/>
    </svg>
  );
}

// ── 8. 瑪格麗特披薩 ────────────────────────────────────────
function MargheritaPizzaSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      {/* 餅皮外緣（烤色） */}
      <ellipse cx="80" cy="108" rx="48" ry="40" fill="#b86820"/>
      <ellipse cx="80" cy="108" rx="46" ry="38" fill="#d08838"/>
      {/* 番茄醬底 */}
      <ellipse cx="80" cy="108" rx="40" ry="32" fill="#c02818"/>
      <ellipse cx="80" cy="108" rx="38" ry="30" fill="#d03020"/>
      {/* 融化起司 */}
      <path d="M52,90 C60,78 74,74 84,79 C94,74 108,82 111,94 C117,108 108,124 98,129 C85,135 60,131 50,120 C43,110 45,99 52,90Z" fill="#f0e098"/>
      <path d="M56,94 C64,84 76,81 85,85 C95,81 106,89 107,100 C108,113 99,124 89,128 C77,132 58,127 51,117 C46,109 49,101 56,94Z" fill="#fdf4c0"/>
      {/* 起司氣泡焦點 */}
      <ellipse cx="74"  cy="92"  rx="5"   ry="3.5" fill="#e0b828" opacity="0.7" transform="rotate(-15,74,92)"/>
      <ellipse cx="92"  cy="120" rx="4.5" ry="3"   fill="#d8a820" opacity="0.6" transform="rotate(10,92,120)"/>
      <ellipse cx="68"  cy="112" rx="3.5" ry="2.5" fill="#e0b828" opacity="0.55"/>
      {/* 餅皮焦紋 */}
      <ellipse cx="46"  cy="102" rx="5" ry="3"   fill="#8a4010" opacity="0.3" transform="rotate(-30,46,102)"/>
      <ellipse cx="114" cy="98"  rx="4" ry="2.5" fill="#8a4010" opacity="0.28" transform="rotate(20,114,98)"/>
      <ellipse cx="88"  cy="144" rx="4" ry="2.5" fill="#8a4010" opacity="0.28"/>
      {/* 九層塔 */}
      <BasilLeaf x={66}  y={86}  r={-18} s={1.05}/>
      <BasilLeaf x={84}  y={79}  r={5}   s={1.0}/>
      <BasilLeaf x={102} y={90}  r={16}  s={0.95}/>
    </svg>
  );
}

// ── 9. 鹽酥雞 ──────────────────────────────────────────────
function YanSuJiSVG() {
  // 炸過的九層塔：深橄欖色
  const FriedLeaf = ({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) => (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
      <path d="M0,0 C-5,-2 -8,-10 -5,-16 C-3,-20 0,-22 0,-22 C0,-22 3,-20 5,-16 C8,-10 5,-2 0,0Z"
        fill="#2e5010" stroke="#1a3008" strokeWidth="0.5"/>
      <line x1="0" y1="0" x2="0" y2="-20" stroke="#1a3008" strokeWidth="0.5"/>
    </g>
  );
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 雞塊 1 左 */}
      <path d="M36,133 C33,120 41,109 53,112 C62,108 70,117 68,132Z" fill="#b86818"/>
      <path d="M38,131 C36,120 43,112 53,115 C61,112 67,120 65,130Z" fill="#d08830"/>
      <ellipse cx="52" cy="121" rx="8" ry="4.5" fill="#e8a038" opacity="0.5"/>
      <path d="M41,122 C46,117 53,116 60,119" stroke="#c07828" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round"/>
      {/* 雞塊 2 中 */}
      <path d="M62,127 C59,113 68,103 79,106 C89,102 97,113 94,127Z" fill="#c07020"/>
      <path d="M64,125 C62,114 69,106 79,109 C88,106 94,114 91,124Z" fill="#d89030"/>
      <ellipse cx="78" cy="115" rx="9" ry="5" fill="#ecaa40" opacity="0.45"/>
      <path d="M66,117 C71,112 77,110 85,114" stroke="#c07828" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round"/>
      {/* 雞塊 3 右 */}
      <path d="M91,131 C88,118 97,108 108,111 C118,107 125,118 122,131Z" fill="#b86818"/>
      <path d="M93,129 C90,119 98,111 108,114 C117,111 123,119 120,128Z" fill="#d08830"/>
      <ellipse cx="107" cy="120" rx="8" ry="4.5" fill="#e8a038" opacity="0.5"/>
      <path d="M95,121 C100,116 106,115 114,118" stroke="#c07828" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round"/>
      {/* 炸九層塔 */}
      <FriedLeaf x={55}  y={103} r={-20} s={0.92}/>
      <FriedLeaf x={79}  y={98}  r={8}   s={0.88}/>
      <FriedLeaf x={103} y={102} r={-10} s={0.85}/>
      {/* 蒜酥粒 */}
      <circle cx="44"  cy="133" r="2"   fill="#e8d090" opacity="0.8"/>
      <circle cx="72"  cy="136" r="1.8" fill="#e8d090" opacity="0.7"/>
      <circle cx="98"  cy="134" r="2"   fill="#e8d090" opacity="0.75"/>
      <circle cx="118" cy="133" r="1.6" fill="#e8d090" opacity="0.7"/>
    </svg>
  );
}

// ── 10. 三杯中卷 ───────────────────────────────────────────
function SanBeiZhongJuanSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 醬汁底 */}
      <ellipse cx="80" cy="128" rx="47" ry="13" fill="#6b1200"/>
      <ellipse cx="80" cy="125" rx="41" ry="11" fill="#8b2000"/>
      {/* 中卷身體段（斜切管狀） */}
      <ellipse cx="55" cy="121" rx="13" ry="8.5" fill="#f0ece2" transform="rotate(-18,55,121)"/>
      <ellipse cx="55" cy="121" rx="9.5" ry="6"  fill="#e4dfd5" transform="rotate(-18,55,121)"/>
      <ellipse cx="55" cy="121" rx="5"   ry="3"  fill="#8b2000"  transform="rotate(-18,55,121)"/>
      {/* 中卷圈（環形） */}
      <ellipse cx="83" cy="116" rx="15" ry="10.5" fill="#f0ece2"/>
      <ellipse cx="83" cy="116" rx="10" ry="7"    fill="#8b2000"/>
      <ellipse cx="83" cy="116" rx="15" ry="10.5" fill="none" stroke="#d8d0c0" strokeWidth="1.2"/>
      {/* 觸鬚 */}
      <path d="M93,110 C89,104 86,102 87,106" stroke="#d8d0c0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M95,112 C92,106 91,104 93,108" stroke="#d8d0c0" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* 另一段身體 */}
      <ellipse cx="107" cy="121" rx="12" ry="8"  fill="#eee8de" transform="rotate(14,107,121)"/>
      <ellipse cx="107" cy="121" rx="8.5" ry="5.5" fill="#e0dbd1" transform="rotate(14,107,121)"/>
      <ellipse cx="107" cy="121" rx="4.5" ry="3"  fill="#7b1a00"  transform="rotate(14,107,121)"/>
      {/* 大蒜、薑 */}
      <ellipse cx="46"  cy="124" rx="5" ry="3.5" fill="#e8d5a0" transform="rotate(-20,46,124)"/>
      <ellipse cx="117" cy="127" rx="5" ry="3"   fill="#dfc880"  transform="rotate(15,117,127)"/>
      {/* 九層塔 */}
      <BasilLeaf x={67}  y={106} r={-18} s={0.9}/>
      <BasilLeaf x={84}  y={101} r={10}  s={0.85}/>
      <BasilLeaf x={100} y={109} r={-6}  s={0.82}/>
      {/* 蒸氣 */}
      <path d="M55,80 C52,73 58,67 55,60"   stroke="#ccc" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M80,75 C77,68 83,62 80,55"   stroke="#ccc" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M105,80 C102,73 108,67 105,60" stroke="#ccc" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── 11. 塔香炒飯 ───────────────────────────────────────────
function TaXiangChaofanSVG() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140">
      <FlatPlate/>
      {/* 炒飯底色 */}
      <ellipse cx="80" cy="129" rx="46" ry="13" fill="#8a6028"/>
      <ellipse cx="80" cy="125" rx="40" ry="11" fill="#a07038"/>
      {/* 飯粒 第一層 */}
      <ellipse cx="50"  cy="131" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(-10,50,131)"/>
      <ellipse cx="59"  cy="133" rx="3"   ry="2"   fill="#e8dfc8" transform="rotate(14,59,133)"/>
      <ellipse cx="68"  cy="131" rx="3.5" ry="2.5" fill="#f0e8d0"/>
      <ellipse cx="77"  cy="134" rx="3"   ry="2"   fill="#e8dfc8" transform="rotate(-8,77,134)"/>
      <ellipse cx="86"  cy="132" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(12,86,132)"/>
      <ellipse cx="95"  cy="133" rx="3"   ry="2"   fill="#e8dfc8"/>
      <ellipse cx="104" cy="131" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(-15,104,131)"/>
      <ellipse cx="113" cy="133" rx="3"   ry="2"   fill="#e8dfc8" transform="rotate(8,113,133)"/>
      {/* 飯粒 第二層 */}
      <ellipse cx="46"  cy="124" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(10,46,124)"/>
      <ellipse cx="56"  cy="122" rx="3"   ry="2"   fill="#e8dfc8" transform="rotate(-12,56,122)"/>
      <ellipse cx="65"  cy="124" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(8,65,124)"/>
      <ellipse cx="74"  cy="121" rx="3"   ry="2"   fill="#e8dfc8"/>
      <ellipse cx="83"  cy="123" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(-10,83,123)"/>
      <ellipse cx="92"  cy="121" rx="3"   ry="2"   fill="#e8dfc8" transform="rotate(14,92,121)"/>
      <ellipse cx="101" cy="123" rx="3.5" ry="2.5" fill="#f0e8d0"/>
      <ellipse cx="110" cy="121" rx="3"   ry="2"   fill="#e8dfc8" transform="rotate(-8,110,121)"/>
      <ellipse cx="119" cy="124" rx="3"   ry="2"   fill="#f0e8d0" transform="rotate(10,119,124)"/>
      {/* 飯粒 第三層 */}
      <ellipse cx="52"  cy="116" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(-15,52,116)"/>
      <ellipse cx="62"  cy="114" rx="3"   ry="2"   fill="#e8dfc8" transform="rotate(8,62,114)"/>
      <ellipse cx="71"  cy="116" rx="3.5" ry="2.5" fill="#f0e8d0"/>
      <ellipse cx="80"  cy="113" rx="3"   ry="2"   fill="#e8dfc8" transform="rotate(-10,80,113)"/>
      <ellipse cx="90"  cy="115" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(12,90,115)"/>
      <ellipse cx="99"  cy="113" rx="3"   ry="2"   fill="#e8dfc8"/>
      <ellipse cx="109" cy="115" rx="3.5" ry="2.5" fill="#f0e8d0" transform="rotate(-8,109,115)"/>
      {/* 蛋花 */}
      <ellipse cx="63"  cy="120" rx="6.5" ry="4.5" fill="#f5c030" transform="rotate(-15,63,120)" opacity="0.92"/>
      <ellipse cx="95"  cy="118" rx="5.5" ry="3.5" fill="#f0b828" transform="rotate(10,95,118)"  opacity="0.92"/>
      <ellipse cx="77"  cy="127" rx="5"   ry="3"   fill="#f5c030" transform="rotate(5,77,127)"   opacity="0.85"/>
      {/* 九層塔 */}
      <BasilLeaf x={57}  y={108} r={-20} s={0.88}/>
      <BasilLeaf x={80}  y={103} r={5}   s={0.85}/>
      <BasilLeaf x={103} y={109} r={-12} s={0.82}/>
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
  {
    name: '塔香蛤蜊',
    ingredients: ['蛤蜊', '九層塔', '大蒜', '辣椒', '米酒', '醬油少許'],
    description: '蛤蜊開殼的瞬間香氣四溢！鮮甜湯汁配九層塔，是台式快炒的靈魂。',
    SVG: TaXiangGeLiSVG,
  },
  {
    name: '卡布里沙拉',
    ingredients: ['牛番茄', '莫札瑞拉起司', '新鮮九層塔', '橄欖油', '海鹽・黑胡椒'],
    description: '義大利最美的前菜！番茄紅、起司白、九層塔綠，三色排列就是最棒的擺盤。',
    SVG: CapreseSVG,
  },
  {
    name: '瑪格麗特披薩',
    ingredients: ['披薩麵團', '番茄醬', '莫札瑞拉起司', '新鮮九層塔', '橄欖油'],
    description: '出爐後才放上新鮮九層塔，遇熱立刻飄香——這就是瑪格麗特的靈魂！',
    SVG: MargheritaPizzaSVG,
  },
  {
    name: '鹽酥雞',
    ingredients: ['雞腿肉', '九層塔', '大蒜', '地瓜粉', '鹽・胡椒・五香粉'],
    description: '台灣夜市人氣第一！九層塔炸到酥脆才是靈魂，沒有它就不是正宗鹽酥雞。',
    SVG: YanSuJiSVG,
  },
  {
    name: '三杯中卷',
    ingredients: ['中卷（透抽）', '九層塔', '大蒜', '老薑', '麻油・醬油・米酒各一杯'],
    description: '和三杯雞同樣做法，換成Q彈中卷，海鮮甜味讓三杯醬更加鮮美！',
    SVG: SanBeiZhongJuanSVG,
  },
  {
    name: '塔香炒飯',
    ingredients: ['白飯', '雞蛋', '九層塔', '蒜末', '醬油・鹽'],
    description: '最快速的九層塔料理！剩飯加幾片九層塔大火快炒，香氣瞬間滿廚房。',
    SVG: TaXiangChaofanSVG,
  },
];

export function getRandomDish(): DishData {
  return DISHES[Math.floor(Math.random() * DISHES.length)];
}

export function getAllDishes(): DishData[] {
  return DISHES;
}
