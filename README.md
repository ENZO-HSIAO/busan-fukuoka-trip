# 釜山 · 福岡 — Our Trip

給你和女友的 2026 年 11 月釜山＋福岡旅行專屬 App。純前端、無需伺服器，可直接部署到 GitHub Pages。

## 部署方式

這是純靜態網站（沒有建置流程 build step），直接把整個資料夾內容放進你的 repo 根目錄即可：

```
enzo-hsiao.github.io/busan-fukuoka-trip/
├── index.html
├── .nojekyll
├── css/style.css
└── js/...
```

推上 GitHub 後，開啟 `https://enzo-hsiao.github.io/busan-fukuoka-trip/` 就能使用。因為路由是用 `#/xxx`（hash-based），不需要額外設定 404.html 或伺服器端 rewrite。

## 資料儲存在哪裡？（很重要）

這個 App **沒有後端伺服器**，所有航班／飯店／行程／PDF／照片資料都是存在**你目前這台裝置的瀏覽器**裡（用的是 IndexedDB）。這代表：

- 你在手機上新增的資料，**不會自動出現在女友的手機上**。
- 換瀏覽器、清除瀏覽器資料、或用無痕視窗，都會讓資料消失。
- 目前設計適合「你負責維護行程，兩人一起看你手機上的畫面」，或是「兩人各自在自己手機建立一份」。

如果之後想要「兩人共用同一份、即時同步」的資料，需要加上雲端資料庫（例如 Firebase Firestore、Supabase 等）。目前的架構（`js/state.js`、`js/db.js`）已經把資料存取集中在同一層，之後要換成雲端同步時，只需要替換這兩個檔案內部的實作，其他頁面程式碼幾乎不用動。

## Google Maps API Key

目前地圖檢視（Itinerary → Map）用的是 **Leaflet + OpenStreetMap**，完全免費、不需要 API Key，開箱即用。「Open in Google Maps」按鈕則是純連結（`https://www.google.com/maps/search/?api=1&query=...`），也不需要 Key。

如果之後想換成 Google 自己的地圖底圖或地點自動搜尋（Places Autocomplete），才需要 Google Maps JavaScript API Key。到時候：

1. 在 Google Cloud Console 申請 Maps JavaScript API + Places API 的 Key。
2. 把 Key 放進 `js/maps.js`（目前是 Leaflet 的載入邏輯，屆時可以替換成 Google Maps 的載入方式）。
3. 記得幫 Key 加上 HTTP referrer 限制（限定 `enzo-hsiao.github.io/*`），避免被盜用。

## 功能總覽（第一版）

- **Home**：見面倒數（自動依日期計算 / 見面當天 / 旅行中 Day X / 旅行結束），下一班航班卡片。
- **Flights**：機票 + 文件管理，依「我的／女友的／共同」分組，可上傳 PDF、新增/編輯/刪除。
- **Itinerary**：List / Map 兩種檢視。可自行新增、編輯、刪除行程；已輸入的航班會自動出現在對應日期裡，不用重複輸入。
- **Hotels**：飯店資訊、Google Maps 連結、訂房 PDF、照片。
- **Timeline**：整趟旅程的視覺化時間軸，會依 Flights 資料自動更新。
- **Settings**（右上角齒輪）：修改見面日期／城市、旅程起訖日、雙方出發城市；也可以一鍵刪除所有「測試資料」。

## 測試資料

App 第一次開啟時會自動建立幾筆標示「測試資料」的航班／飯店／行程，方便你看 UI 長怎樣。這些資料在畫面上都會有明顯的「測試資料」標籤，你可以：

- 直接點進去刪除，或
- 到 Settings 按「刪除所有測試資料」一次清掉。

## 之後你可以自己新增的資料

- 機票 PDF＋航班資訊（Flights 頁面 ＋）
- 飯店資料＋訂房 PDF＋照片（Hotels 頁面 ＋）
- 逐日行程、景點、餐廳，含地點座標／Google Maps 連結／照片（Itinerary 頁面 ＋）
- 到 Settings 把見面日期、旅程起訖日、雙方出發城市改成真實資料

## 檔案結構

```
index.html              App 外殼（頂部列／底部導覽／view 容器）
css/style.css           全站設計系統與樣式
js/app.js               進入點：註冊路由、綁定 Settings 按鈕
js/router.js            極簡 hash router
js/db.js                IndexedDB 封裝（含 PDF/照片 blob 儲存）
js/state.js             資料存取層（Flights / Hotels / Itinerary / Config）+ 測試資料
js/utils.js             日期格式化、Google Maps 連結產生器等共用工具
js/maps.js              Leaflet 載入 + 從貼上的 Google Maps 網址解析經緯度
js/components/sheet.js          共用的底部彈出視窗（新增/編輯/詳情表單都用這個）
js/components/settingsSheet.js  Trip Settings 面板
js/pages/home.js        首頁
js/pages/flights.js     Flights / Documents 頁
js/pages/itinerary.js   Itinerary 頁（List + Map）
js/pages/hotels.js      Hotels 頁
js/pages/timeline.js    Timeline 頁
```

沒有用到任何建置工具（Vite / Webpack / npm），所有第三方套件（字體、Leaflet）都是瀏覽器執行時透過 CDN 載入，維護上就是直接編輯這些檔案、重新整理頁面即可看到效果。
