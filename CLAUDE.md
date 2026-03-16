# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

**九層塔種植小學堂** — 一個專為校園園遊會設計的互動教育網站，教導使用者如何種植和照顧九層塔（羅勒）植物。使用 React + TypeScript + Vite 建構，整合 Google Gemini AI API。

## 常用指令

```bash
npm install          # 安裝依賴
npm run dev          # 啟動開發服務器 (http://localhost:3000)
npm run build        # 生產構建
npm run preview      # 預覽構建結果
npm run lint         # TypeScript 型別檢查（tsc --noEmit）
npm run clean        # 清理 dist 目錄
```

**環境設定：** 在 `.env.local` 中設置 `GEMINI_API_KEY=your_api_key`（Vite 透過 `import.meta.env.VITE_GEMINI_API_KEY` 曝露）。

## 架構

這是一個**單頁應用（SPA）**，所有核心邏輯集中在 [src/App.tsx](src/App.tsx)（~472 行）。

### 植物生長遊戲系統

遊戲使用 `useEffect` 配合 1 秒 interval 的狀態機：

- **狀態變數**：`health`（HP）、`growth`（成長%）、`water`（水分%）、`sunlight`（陽光%）
- **遊戲狀態**：`playing | won | lost`
- **損傷規則**：水分 <20% 或 >90% 時 -2 HP/秒；陽光 <30% 或 >95% 時 -1 HP/秒
- **成長條件**：水分 40-80% AND 陽光 50-90% 時 +1% 成長/秒
- **消耗**：水分和陽光持續自然消耗，玩家透過按鈕補充

### UI 區塊結構

頁面由導覽列控制捲動至對應錨點區塊：
1. **Game Section** — 互動遊戲（植物視覺化 + 控制面板）
2. **Environment Section** — 環境提示卡片（陽光、溫度、通風）
3. **Planting Section** — 5 步驟種植指南
4. **Checklist Section** — 6 項日常照顧清單

### 技術棧

| 用途 | 套件 |
|------|------|
| UI 框架 | React 19 |
| 動畫 | motion/react |
| 圖標 | lucide-react |
| 樣式 | TailwindCSS 4（@tailwindcss/vite 整合） |
| AI | @google/genai（Gemini） |
| 構建 | Vite 6 |

### 路徑別名

`@/*` 映射至專案根目錄（tsconfig.json 和 vite.config.ts 中均有配置）。

### 自定義樣式

[src/index.css](src/index.css) 定義：
- `.herb-gradient` — 綠色漸變背景
- `.glass-card` — 毛玻璃效果卡片
- 字體：Noto Sans TC（界面）、Zhi Mang Xing（裝飾）

### 持久化

`localStorage` 用於保存使用者點贊次數（`likeCount` key）。
