# 釜山 × 福岡 情侶旅行 App — 部署說明

這個資料夾就是完整的網站原始碼，跟你的 asset-tracker 是一樣的做法：
放到 GitHub Pages，變成一個真正的網址，兩支手機都能打開、資料即時同步。

一共分兩部分：**Part A 建立雲端資料庫（Firebase）**、**Part B 上架網站（GitHub Pages）**。
兩邊都只要做一次，之後就是直接用了。

---

## Part A — 建立 Firebase 專案（大約 5 分鐘）

1. 開 https://console.firebase.google.com ，用 Google 帳號登入
2. 點「新增專案 / Add project」，取個名字（例如 `busan-fukuoka-trip`），一路下一步到建立完成
3. 左側選單找「Firestore Database」→ 點「建立資料庫 / Create database」
   - 位置選 `asia-east1`（離台灣近）
   - 模式選「以正式版模式啟動 / Start in production mode」
4. 進去 Firestore 之後點上方「Rules」分頁，把裡面的內容整個換成這個資料夾裡
   `firestore.rules` 檔案的內容，貼上後按「發布 / Publish」
5. 回到專案首頁，點左上角齒輪圖示 →「專案設定」，往下滑到「你的應用程式」，
   點 `</>`（Web）圖示，取個暱稱、不用勾 Hosting，建立後畫面會顯示一段
   `firebaseConfig = {...}` 的程式碼
6. 打開這個資料夾裡的 **`firebase-config.js`**，把裡面 `YOUR_API_KEY` 等等
   六個值，換成你剛剛看到的那組真實數值，存檔

## Part B — 上架到 GitHub Pages（跟 asset-tracker 一樣的流程）

1. 到 GitHub 建一個新的 repository（例如 `busan-fukuoka-trip`）
2. 把這個資料夾裡的**所有檔案**（`index.html`、`style.css`、`app.js`、
   `firebase-config.js`（已經填好真實金鑰的版本）、`manifest.json`、
   `service-worker.js`、`icons/` 整個資料夾）上傳到這個 repo 的最上層，
   不要放在子資料夾裡
   - `firestore.rules` 跟 `README.md` 不用上傳，那兩個只是給你看說明用的
3. 進 repo 的 Settings → Pages，Source 選 `main` branch、資料夾選 `/ (root)`，儲存
4. 等 1-2 分鐘，會出現一個網址，長得像
   `https://你的帳號.github.io/busan-fukuoka-trip/`
5. 用手機 Safari 打開這個網址，測試一下能不能新增航班、行程
6. 沒問題的話，照之前教你的「加入主畫面」步驟，把這個網址加到你跟女友
   各自的手機主畫面，兩支手機打開的圖示都會指向同一份資料

---

## 之後怎麼確認同步有作用

打開網站後，頂端會有一個小圓點：
- 綠色 + 「已同步」：代表已經連上雲端資料庫
- 紅色 + 「連線中…」：代表還沒連上，先檢查 `firebase-config.js` 有沒有填對，
  或是網路是否正常

兩支手機都打開後，其中一支新增一筆航班，另一支通常幾秒內就會自動顯示
出來（不用重新整理）。

## 安全性提醒

`firestore.rules` 這組規則是完全開放讀寫的，等於「知道網址（或看到你的
Firebase 金鑰）的人都能看、能改」，沒有帳號密碼保護。這對你們兩人私下
使用是最簡單的做法，但要注意：
- 不要把 GitHub repo 設成含有金鑰卻公開分享程式碼連結給不相干的人
- 如果之後想要更嚴謹（例如加登入驗證），可以再回來問我，我可以幫你加
  一層簡單的密碼保護

## 之後想改功能怎麼辦

之後想加功能、改樣式，把這幾個檔案（主要是 `app.js` 和 `style.css`）
貼給 Claude，說你想改什麼，我可以直接幫你改好對應的部分。
