# 這次是什麼

這份是把你當初在 Claude 對話裡看到、確認滿意的那個「Couple trip app · JSX」
Artifact，原封不動地包裝成可以放到 GitHub Pages 的網站。介面、排版、
互動邏輯完全沒有重寫，唯一改的地方：

1. 拿掉 Claude Artifact 專用的 `window.storage`，換成你已經設定好的
   Firebase（跟之前是同一個 Firebase 專案 `trip-c93b4`，金鑰已經幫你填好）
2. 圖示套件 `lucide-react` 沒辦法在沒有打包工具的網站上直接使用，
   換成一組畫起來一樣的內建 SVG 圖示，數量、意義都對應原本每一個圖示

其他像倒數置中、JOURNEY 小巧橫向版、Itinerary 日期分頁，全部都是原本
那份程式碼本來就有的，沒有再重新刻一次。

## 部署方式（跟之前不一樣，這次檔案結構整個換了）

因為這次不再用 `app.js` / `style.css`，改用 `app.jsx`，**舊的檔案要先清乾淨**：

1. 到 https://github.com/ENZO-HSIAO/busan-fukuoka-trip
2. 把裡面所有檔案都刪掉（`index.html`、`app.js`、`style.css`、
   `firebase-config.js`、`manifest.json`、`service-worker.js`，
   icons 資料夾也刪），刪完 commit
3. 用「Add file → Upload files」把這個資料夾裡的所有東西
   （`index.html`、`app.jsx`、`firebase-config.js`、`manifest.json`、
   `service-worker.js`、`icons/` 整個資料夾）一次上傳上去，
   `firestore.rules` 跟這份 `README.md` 不用上傳
4. GitHub Pages 設定不用改，還是原本那個網址
5. 手機上先去 設定 → Safari → 進階 → 網站資料，把這個網站的資料刪掉
   （清掉舊的 Service Worker 快取），再重新用 Safari 打開網址測試

Firebase 那邊完全不用重設，直接沿用之前設定好的。

## 這個做法的取捨

網頁會透過瀏覽器即時把 JSX 轉換成畫面（用一個叫 Babel 的工具），
所以第一次打開時，會比一般網站晚个零點幾秒才顯示畫面（中間會看到
「載入中…」），屬於正常現象，不是壞掉。
