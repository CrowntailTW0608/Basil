# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

**九層塔種植小學堂** — 專為校園園遊會設計的互動教育網站，教導使用者如何種植和照顧九層塔（羅勒）。使用 React + TypeScript + Vite 建構。

## 常用指令

```bash
npm install          # 安裝依賴
npm run dev          # 啟動開發服務器 (http://localhost:3000)
npm run build        # 生產構建
npm run preview      # 預覽構建結果
npm run lint         # TypeScript 型別檢查（tsc --noEmit）
npm run clean        # 清理 dist 目錄
```

**環境設定：** 無需額外環境變數。

**Production 部署：** `vite.config.ts` 在 production 模式下 `base` 為 `/Basil/`（對應 GitHub Pages repo 名稱）。

**God Mode：** 網址加 `?god=1` 可停用 HP 扣減、水分消耗、成長暫停，方便本地測試通關。

## 架構

### 檔案結構

```
src/
  App.tsx                      # 頁面主體：導覽列 + 各內容區塊
  games/
    BasilGame.tsx              # 主遊戲元件（所有遊戲邏輯）
  components/
    BasilPlantSVG.tsx          # 植株 SVG 動畫元件
    BasilDishes.tsx            # 5 道料理的 SVG 圖示 + 資料
```

### App.tsx 頁面結構

頁面由導覽列錨點控制捲動，共四區塊：
1. **Game Section** — 嵌入 `<BasilGame />`（由 `SHOW_GAME` flag 控制顯示）
2. **Environment Section** — 陽光、溫度、通風提示卡
3. **Planting Section** — 5 步驟種植指南
4. **Checklist Section** — 6 項日常照顧清單

`USE_LEGACY_GAME = false` 控制使用新版遊戲；舊版邏輯仍保留在 App.tsx 但已隱藏。

### BasilGame.tsx 遊戲系統

60 秒計時生存遊戲，使用兩個 interval：

- **1 秒 interval**：倒數計時、水分消耗（-2/s）
- **50ms interval**：物件移動（水滴下落 DROP_SPD=3px/tick）、過期判定、生成排程（`spawnAcc` 累積器）

**生成難度（依剩餘時間分四段）：**

| 剩餘時間 | 蟲間隔 | 水滴間隔 | 花穗間隔 |
|---------|-------|---------|---------|
| >45s    | 2600ms | 無      | 無      |
| >30s    | 2000ms | 2000ms  | 無      |
| >15s    | 1500ms | 1500ms  | 4000ms  |
| ≤15s    | 1000ms | 1100ms  | 2800ms  |

**懲罰機制：**
- 蟲未點（2500ms 過期）→ -5 HP
- 花穗未點（3500ms 過期）→ 成長暫停 8 秒
- 水滴落到底部 → -8 水分

**localStorage 持久化：**
- `basil_game_highscore` — 最高分
- `basil_unlocked_dishes` — 已解鎖料理名稱陣列（JSON）

### BasilPlantSVG.tsx 植株生長系統

接收 `growth`（0–100）和 `health`（0–100）props，純 SVG 描繪。生長分三階段：

- **0–30%**：主莖從花盆延伸（`mainFrac`），同步長出三組葉對（y=148/126/104）
- **30–80%**：左右分枝伸展（`brFrac`），分枝上長葉對
- **80–100%**：小枝展開（`subFrac`），小枝上長小葉

葉片使用 `lg(growth, start, span)` 函式計算縮放係數（0→1），確保莖到達節點後葉子才開始生長。`LeafPair` 元件使用三角函數計算葉柄末端座標。

**花穗座標同步：** `BasilGame.tsx` 中的花穗生成位置鏡像了 `BasilPlantSVG` 的分枝尖端數學，確保花穗長在植株上。渲染時以 `left: calc(50% + (svgX-80)px)` 和 `top: 120 + svgY - 44` 轉換 SVG 座標到遊戲區域像素位置。

### BasilDishes.tsx

5 道九層塔料理（三杯雞、塔香炒蛋、塔香茄子、青醬義大利麵、打拋豬肉飯），各含 `name`、`ingredients`、`description`、`SVG` 元件（viewBox `0 0 160 160`）。`getRandomDish()` 於勝利時抽取，結果同步解鎖料理圖鑑。

### 技術棧

| 用途 | 套件 |
|------|------|
| UI 框架 | React 19 |
| 動畫 | motion/react |
| 圖標 | lucide-react |
| 樣式 | TailwindCSS 4（@tailwindcss/vite 整合） |
| 構建 | Vite 6 |

### 路徑別名

`@/*` 映射至專案根目錄（tsconfig.json 和 vite.config.ts 均已配置）。

### 自定義樣式

[src/index.css](src/index.css) 定義：
- `.herb-gradient` — 綠色漸變背景
- `.glass-card` — 毛玻璃效果卡片
- 字體：Noto Sans TC（界面）、Zhi Mang Xing（裝飾）
