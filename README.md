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

這個 App 用你的 Firebase 專案（`trip-c93b4`）當後端：

- 航班／飯店／行程資料存在 **Cloud Firestore**。
- 上傳的 PDF／照片存在 **Firebase Storage**。
- 兩支手機打開同一個網址，看到的是**同一份資料**，其中一邊新增/編輯/刪除，另一邊會在幾秒內自動更新畫面（不用手動重新整理）。

### 你需要在 Firebase Console 做的設定（一次性）

App 本身已經接好 SDK，但 Firebase 專案預設的 Firestore／Storage 規則會擋掉所有讀寫，第一次使用前要去 [Firebase Console](https://console.firebase.google.com/) → 你的專案 `trip-c93b4` 設定：

**1. 啟用 Firestore**：左側選單「Firestore Database」→ 建立資料庫（Production mode 即可，地區選近的，例如 asia-east1）。

**2. 啟用 Storage**：左側選單「Storage」→ 開始使用。

**3. 修改 Firestore 規則**（Firestore Database → 規則），貼上：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**4. 修改 Storage 規則**（Storage → 規則），貼上：

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **注意**：以上規則是「任何知道你 Firebase 設定值的人都能讀寫」，因為這個 App 沒有登入機制。對兩人使用的私人小型旅行 App 來說這樣通常可以接受（網址本身不會被搜尋引擎索引、也沒有公開入口），但如果你在意安全性，可以之後加上 Firebase Authentication（例如只允許你和女友的 Google 帳號登入），跟我說我可以幫你加。

### 如果之後想切回純本機儲存

不想用 Firebase 的話，資料存取都集中在 `js/state.js` 和 `js/db.js` 這兩個檔案，之後要換掉也只需要改這兩個檔案，其他頁面程式碼幾乎不用動。

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
js/firebase.js           Firebase 初始化（Firestore + Storage）
js/db.js                 檔案上傳／刪除封裝（Firebase Storage：PDF、照片）
js/state.js              資料存取層（Flights / Hotels / Itinerary / Config，Firestore CRUD + 即時同步）+ 測試資料
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

沒有用到任何建置工具（Vite / Webpack / npm），所有第三方套件（字體、Leaflet、Firebase SDK）都是瀏覽器執行時透過 CDN 以 ES Module 載入，維護上就是直接編輯這些檔案、重新整理頁面即可看到效果。

## 本機預覽（部署前先測試）

因為程式碼用了 `<script type="module">`，瀏覽器基於安全性限制，**不能直接雙擊 index.html 用 `file://` 打開**（畫面會整個空白）。要在本機測試，請在資料夾內啟動一個簡易伺服器，例如：

```
python3 -m http.server 8000
```

然後瀏覽器打開 `http://localhost:8000`。部署到 GitHub Pages 後（`https://...github.io/...`）則完全沒有這個限制，直接開網址即可。
