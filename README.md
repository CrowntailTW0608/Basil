# 義賣小學堂

> 校園園遊會互動教育網站，兩個主題：**九層塔種植**與**含羞草種植**，各含互動遊戲與種植教學。

## 頁面

### 九層塔小學堂 (`index.html`)

學習如何種植與照顧九層塔（羅勒），並挑戰 60 秒生存遊戲。

**功能：**
- 🎮 **60 秒生存遊戲** — 除蟲、接水滴、摘花穗，維持植株健康
- 🍽️ **料理圖鑑** — 5 道九層塔料理，破關後解鎖
- 🌱 **種植指南** — 3 步驟圖文教學 + 摘心秘訣
- ☀️ **環境提示** — 陽光、溫度、通風照顧卡
- ✅ **日常照顧清單** — 7 項養護要點

### 含羞草小學堂 (`mimosa.html`)

學習如何種植與照顧含羞草，並挑戰葉片記憶遊戲。

**功能：**
- 🧠 **Simon Says 記憶遊戲** — 記住電腦展示的複葉收折順序，逐輪增加難度
- 🌸 **互動 SVG 植株** — 3 根拋物線主幹 × 15 個複葉，點擊觸發向根部傳遞的收折動畫
- 🌱 **種植指南** — 移植、澆水、緩苗步驟
- ☀️ **環境提示** — 光線、溫度、通風照顧卡
- ✅ **日常照顧清單**

## 技術棧

| 用途 | 套件 |
|------|------|
| UI 框架 | React 19 |
| 語言 | TypeScript |
| 動畫 | motion/react |
| 圖標 | lucide-react |
| 樣式 | TailwindCSS 4 |
| 建構工具 | Vite 6 |

## 快速開始

```bash
npm install
npm run dev    # http://localhost:3000
```

## 常用指令

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 生產環境建構
npm run preview  # 預覽建構結果
npm run lint     # TypeScript 型別檢查
npm run clean    # 清理 dist 目錄
```

## 部署

部署於 **GitHub Pages**，production base 路徑為 `/Basil/`。

```bash
npm run build
# 將 dist/ 目錄部署至 GitHub Pages
```

## 測試用 God Mode

網址加 `?god=1` 可停用九層塔遊戲的 HP 扣減與水分消耗，方便測試通關。
