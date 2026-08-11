/* ============================================================
   COUPLE TRIP APP — vanilla JS + Firebase Firestore (shared sync)
   ============================================================ */

/* ---------- Firebase init ---------- */
firebase.initializeApp(window.FIREBASE_CONFIG);
const db = firebase.firestore();
db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

const col = {
  config: db.collection("config"),
  flights: db.collection("flights"),
  hotels: db.collection("hotels"),
  itinerary: db.collection("itinerary"),
  documents: db.collection("documents"),
};

/* ---------- helpers ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const todayISO = () => new Date().toISOString().slice(0, 10);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => (s == null ? "" : String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));

function fmtDate(iso, opts = {}) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  const m = d.getMonth() + 1, day = d.getDate();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  if (opts.short) return `${m}/${day}`;
  return `${m} / ${day}　週${weekdays[d.getDay()]}`;
}
function shortWeekday(iso) {
  const d = new Date(iso + "T00:00:00");
  return ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
}
function daysBetween(a, b) {
  return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
}
function shortAirport(s) {
  if (!s) return "—";
  return s.trim().split(" ")[0];
}
function mapsLink(item) {
  if (item.mapsUrl) return item.mapsUrl;
  const q = encodeURIComponent(item.address || item.location || item.name || "");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
function ownerLabel(o) { return { me: "ENZO", partner: "榛果", shared: "共同" }[o] || o; }

/* ---------- itinerary preset day range ---------- */
const ITIN_DATES = ["2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23"];
const ITIN_CITY_BY_DATE = {
  "2026-11-16": "釜山",
  "2026-11-17": "釜山",
  "2026-11-18": "釜山 → 福岡",
  "2026-11-19": "福岡",
  "2026-11-20": "福岡",
  "2026-11-21": "福岡",
  "2026-11-22": "福岡",
  "2026-11-23": "福岡",
};

/* ---------- default / seed data ---------- */
const DEFAULT_TRIP = {
  tripName: "釜山 × 福岡",
  originMe: "台北 TPE",
  originPartner: "仙台 SDJ",
  meetingCity: "BUSAN, KOREA",
  meetingCityShort: "釜山",
  secondCity: "福岡",
  meetingDate: "2026-11-15",
  tripStartDate: "2026-11-13",
  tripEndDate: "2026-11-20",
};

/* ---------- global state ---------- */
const state = {
  tab: "home",
  trip: DEFAULT_TRIP,
  flights: [],
  hotels: [],
  itinerary: [],
  documents: [],
  online: false,
  itinView: "list",
  itinActiveDate: null,
  showDocs: false,
};
let draft = null;      // currently-edited object bound to open modal form
let draftKind = null;  // 'flight' | 'hotel' | 'itinerary' | 'document' | 'trip'
let viewing = null;    // currently-viewed detail object
let viewingKind = null;

/* ---------- Firestore sync ---------- */
function seedIfEmpty() {
  col.config.doc("trip").get().then((doc) => {
    if (!doc.exists) col.config.doc("trip").set(DEFAULT_TRIP);
  });
}
seedIfEmpty();

col.config.doc("trip").onSnapshot((doc) => {
  state.online = true;
  updateSyncDot();
  if (doc.exists) { state.trip = doc.data(); render(); }
}, () => { state.online = false; updateSyncDot(); });

function watchCollection(name, target) {
  col[name].onSnapshot((snap) => {
    state.online = true;
    updateSyncDot();
    state[target] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  }, () => { state.online = false; updateSyncDot(); });
}
watchCollection("flights", "flights");
watchCollection("hotels", "hotels");
watchCollection("itinerary", "itinerary");
watchCollection("documents", "documents");

function updateSyncDot() {
  const dot = $("#sync-dot"), label = $("#sync-label");
  if (!dot) return;
  dot.classList.toggle("off", !state.online);
  label.textContent = state.online ? "已同步" : "連線中…";
}

/* ---------- trip phase ---------- */
function computeTripPhase(trip) {
  const today = todayISO();
  const { meetingDate, tripStartDate, tripEndDate } = trip;
  if (!meetingDate) return { phase: "unset" };
  if (today < meetingDate) return { phase: "before", days: daysBetween(today, meetingDate) };
  if (today === meetingDate) return { phase: "meet" };
  if (tripEndDate && today <= tripEndDate) return { phase: "during", dayNum: daysBetween(tripStartDate || meetingDate, today) + 1 };
  return { phase: "after" };
}

/* ---------- MAIN RENDER ---------- */
function render() {
  $("#trip-name").textContent = (state.trip.tripName || "").toUpperCase();
  $$(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === state.tab));
  const screen = $("#screen");
  if (state.tab === "home") screen.innerHTML = renderHome();
  if (state.tab === "flights") screen.innerHTML = renderFlights();
  if (state.tab === "itinerary") screen.innerHTML = renderItinerary();
  if (state.tab === "hotels") screen.innerHTML = renderHotels();
}

/* ============================================================
   HOME
   ============================================================ */
function renderHome() {
  const trip = state.trip;
  const info = computeTripPhase(trip);
  let daysHTML = "";
  if (info.phase === "before") {
    daysHTML = `<div class="days"><span class="num">${info.days}</span><span class="unit">DAYS</span></div>`;
  } else if (info.phase === "meet") {
    daysHTML = `<div class="phase-text">Today we meet ♥</div>`;
  } else if (info.phase === "during") {
    daysHTML = `<div class="phase-text">Day ${info.dayNum} of our trip</div>`;
  } else if (info.phase === "after") {
    daysHTML = `<div class="phase-text">Our trip has ended ⋆</div>`;
  }

  const today = todayISO();
  const nextFlight = state.flights
    .filter((f) => f.depDate && f.depDate >= today)
    .sort((a, b) => (a.depDate + (a.depTime || "")).localeCompare(b.depDate + (b.depTime || "")))[0];

  const nextFlightHTML = nextFlight ? `
    <div class="card flight-card" data-action="go-tab" data-tab="flights" style="margin-top:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:11px;color:var(--ink-soft);letter-spacing:1px;margin-bottom:6px">
            NEXT FLIGHT ${nextFlight.seed ? "· 測試資料" : ""}
          </div>
          <div class="route">✈️ ${esc(shortAirport(nextFlight.depAirport))} → ${esc(shortAirport(nextFlight.arrAirport))}</div>
          <div class="sub">${fmtDate(nextFlight.depDate, { short: true })} · ${esc(nextFlight.depTime || "")}</div>
        </div>
        <span style="color:var(--ink-soft)">›</span>
      </div>
    </div>` : "";

  const steps = [
    { icon: "🇹🇼", label: (trip.originMe || "").split(" ")[0] },
    { icon: "🇰🇷", label: trip.meetingCityShort, mark: true },
    { icon: "🇯🇵", label: trip.secondCity, mark: true },
    { icon: "🏁", label: `${(trip.originMe || "").split(" ")[0]} / ${(trip.originPartner || "").split(" ")[0]}` },
  ];

  return `
    <div class="hero">
      <button class="settings-btn" data-action="open-trip-settings">⚙</button>
      <svg class="dashed" width="100%" height="18"><line x1="0" y1="9" x2="100%" y2="9" stroke="#fff" stroke-width="1" stroke-dasharray="2 6" /></svg>
      <div class="label">距離我們在${esc(trip.meetingCityShort || "釜山")}見面</div>
      ${daysHTML}
      <div class="meta"><span>${esc(trip.meetingDate || "")}</span><span style="opacity:.5">·</span><span style="letter-spacing:1px">${esc(trip.meetingCity || "")}</span></div>
    </div>
    ${nextFlightHTML}
    <div class="card journey">
      <div class="eyebrow">JOURNEY</div>
      <div class="journey-row">
        <div class="line"></div>
        ${steps.map((s) => `
          <div class="journey-step">
            <div class="icon">${s.icon}</div>
            <div class="label">${esc(s.label)}</div>
            ${s.mark ? `<div style="color:var(--rose);font-size:8px;margin-top:3px">♥</div>` : ""}
          </div>`).join("")}
      </div>
    </div>
  `;
}

/* ============================================================
   FLIGHTS & DOCUMENTS
   ============================================================ */
let flightFilter = "all";

function renderFlights() {
  const filtered = state.flights
    .filter((f) => {
      if (flightFilter === "all") return true;
      if (flightFilter === "shared") return f.owner === "shared";
      // A shared flight belongs to both people, so it should also show
      // up under the "ENZO" and "榛果" individual filters.
      return f.owner === flightFilter || f.owner === "shared";
    })
    .sort((a, b) => (a.depDate + (a.depTime || "")).localeCompare(b.depDate + (b.depTime || "")));

  const listHTML = filtered.length === 0
    ? emptyState("✈️", "還沒有航班", "點下方按鈕新增第一筆航班資料")
    : filtered.map((f) => `
      <div class="card flight-card" data-action="view-flight" data-id="${f.id}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="display:flex;gap:6px;margin-bottom:8px">
              <span class="tag">${ownerLabel(f.owner)}</span>
              ${f.seed ? `<span class="tag seed">測試資料</span>` : ""}
            </div>
            <div class="route">✈️ ${esc(shortAirport(f.depAirport))} → ${esc(shortAirport(f.arrAirport))}</div>
            <div class="sub">${esc(f.airline || "")} ${esc(f.flightNumber || "")} · ${fmtDate(f.depDate, { short: true })} ${esc(f.depTime || "")}</div>
          </div>
          ${f.pdf ? `<span>📄</span>` : ""}
        </div>
      </div>`).join("");

  const docsHTML = state.documents.map((d) => `
    <div class="card" data-action="edit-document" data-id="${d.id}" style="cursor:pointer;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:14px">${esc(d.title || "未命名文件")}</div>
          ${d.notes ? `<div style="font-size:12px;color:var(--ink-soft);margin-top:2px">${esc(d.notes)}</div>` : ""}
        </div>
        ${d.file ? `<span>📄</span>` : ""}
      </div>
    </div>`).join("");

  return `
    <div class="screen-header"><div class="title">Flights & Documents</div><div class="subtitle">航班與旅行文件</div></div>
    <div class="pill-row">
      ${["all", "me", "partner", "shared"].map((o) => `
        <button class="pill ${flightFilter === o ? "active" : ""}" data-action="set-flight-filter" data-val="${o}">
          ${o === "all" ? "全部" : o === "me" ? "ENZO的航班" : o === "partner" ? "榛果的航班" : "共同航班"}
        </button>`).join("")}
    </div>
    ${listHTML}
    <button class="btn-primary" data-action="new-flight">＋ 新增航班</button>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:30px;margin-bottom:12px;cursor:pointer" data-action="toggle-docs">
      <div style="font-size:13px;color:var(--ink-soft);letter-spacing:1px">其他旅行文件 (${state.documents.length})</div>
      <span style="color:var(--ink-soft)">${state.showDocs ? "▾" : "›"}</span>
    </div>
    ${state.showDocs ? `
      ${docsHTML}
      <button class="upload-empty" data-action="new-document">＋ 新增文件（保險、簽證等）</button>
    ` : ""}
  `;
}

function emptyState(icon, title, subtitle) {
  return `<div class="empty"><div class="circle">${icon}</div><div class="t">${esc(title)}</div><div class="s">${esc(subtitle)}</div></div>`;
}

/* ============================================================
   ITINERARY
   ============================================================ */
function groupedItinerary() {
  const g = {};
  state.itinerary.forEach((i) => {
    const k = i.date || "未排定日期";
    (g[k] = g[k] || []).push(i);
  });
  Object.values(g).forEach((arr) => arr.sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")));
  return g;
}

function renderItinerary() {
  const grouped = groupedItinerary();
  const extraDates = Object.keys(grouped).filter((d) => !ITIN_DATES.includes(d));
  const dates = ITIN_DATES.concat(extraDates).sort();
  if (!state.itinActiveDate || !dates.includes(state.itinActiveDate)) state.itinActiveDate = ITIN_DATES[0];
  const activeDate = state.itinActiveDate;
  const dayList = grouped[activeDate] || [];
  const dayItems = dayList.filter((i) => i.location || i.address || i.mapsUrl);
  const dateIndex = dates.indexOf(activeDate);
  const headerCity = ITIN_CITY_BY_DATE[activeDate] || (dayList[0] && dayList[0].city) || "";

  const dayTabsHTML = dates.length ? `
    <div class="day-tabs" id="day-tabs">
      ${dates.map((d) => `
        <button class="day-tab ${d === activeDate ? "active" : ""}" data-action="set-itin-date" data-date="${d}">
          <div class="wd">週${shortWeekday(d)}</div>
          <div class="d">${fmtDate(d, { short: true })}</div>
        </button>`).join("")}
    </div>` : "";

  const listHTML = state.itinView === "list" ? `
    ${dates.length === 0
      ? emptyState("📅", "還沒有行程", "點下方按鈕新增第一筆行程")
      : `<div style="margin-bottom:22px">
          <div style="font-size:13px;color:var(--navy);letter-spacing:1px;margin-bottom:14px;font-weight:600">
            ${fmtDate(activeDate)} ${headerCity ? `· ${esc(headerCity)}` : ""}
            ${dates.length > 1 ? `<span style="float:right;font-size:11px;color:var(--ink-soft);font-weight:400">${dateIndex + 1} / ${dates.length}</span>` : ""}
          </div>
          ${dayList.length === 0
            ? emptyState("📅", "這天還沒有行程", "左右滑動切換日期，或新增這天的行程")
            : dayList.map((it) => `
              <div class="itin-row">
                <div class="itin-time">${esc(it.startTime || "—")}${it.endTime ? `<div class="end">${esc(it.endTime)}</div>` : ""}</div>
                <div class="itin-rail"><div class="dot"></div></div>
                <div class="card itin-card" data-action="view-itin" data-id="${it.id}">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start">
                    <div>
                      <div class="name">${esc(it.name || "未命名行程")} ${it.seed ? `<span class="tag seed">測試資料</span>` : ""}</div>
                      ${it.location ? `<div class="loc">📍 ${esc(it.location)}</div>` : ""}
                    </div>
                    ${it.photo ? `<span>🖼</span>` : ""}
                  </div>
                </div>
              </div>`).join("")}
        </div>`}
    <button class="btn-primary" data-action="new-itin">＋ Add 新增行程</button>
  ` : `
    <div class="map-box">
      ${dayItems.length === 0
        ? `<div style="color:var(--ink-soft);font-size:13px;margin:auto">這天還沒有可標示地點的行程</div>`
        : dayItems.map((it, idx) => `
            <button class="map-pin" data-action="view-itin" data-id="${it.id}">
              <span class="num">${idx + 1}</span>${esc(it.name)}
            </button>`).join("")}
    </div>
    <div class="footnote">這是簡易地點預覽，尚未串接真正的 Google Maps 底圖（需要 Google Maps API Key）。點每個地點仍可以開啟 Google Maps 導航。</div>
  `;

  return `
    <div class="screen-header"><div class="title">Itinerary</div><div class="subtitle">行程</div></div>
    <div class="pill-row">
      <button class="pill ${state.itinView === "list" ? "active" : ""}" data-action="set-itin-view" data-val="list">☰ List</button>
      <button class="pill ${state.itinView === "map" ? "active" : ""}" data-action="set-itin-view" data-val="map">🗺 Map</button>
    </div>
    ${dayTabsHTML}
    <div id="itin-swipe-area">${listHTML}</div>
  `;
}

/* swipe support for itinerary day switching */
let touchX = null;
document.addEventListener("touchstart", (e) => {
  if (e.target.closest("#itin-swipe-area")) touchX = e.touches[0].clientX;
});
document.addEventListener("touchend", (e) => {
  if (touchX == null || !e.target.closest("#itin-swipe-area")) { touchX = null; return; }
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  const grouped = groupedItinerary();
  const extraDates = Object.keys(grouped).filter((d) => !ITIN_DATES.includes(d));
  const dates = ITIN_DATES.concat(extraDates).sort();
  if (Math.abs(dx) < 40 || dates.length < 2) return;
  const idx = dates.indexOf(state.itinActiveDate);
  if (dx < 0 && idx < dates.length - 1) { state.itinActiveDate = dates[idx + 1]; render(); }
  if (dx > 0 && idx > 0) { state.itinActiveDate = dates[idx - 1]; render(); }
});

/* ============================================================
   HOTELS
   ============================================================ */
function renderHotels() {
  const sorted = [...state.hotels].sort((a, b) => (a.checkinDate || "").localeCompare(b.checkinDate || ""));
  const listHTML = sorted.length === 0
    ? emptyState("🏨", "還沒有飯店", "點下方按鈕新增第一間飯店")
    : sorted.map((h) => `
      <div class="card hotel-card" data-action="view-hotel" data-id="${h.id}">
        <div class="hotel-thumb">${h.photo ? `<img src="${h.photo}" alt="">` : "🏨"}</div>
        <div style="flex:1">
          <div style="font-size:15px">${esc(h.name || "未命名飯店")}</div>
          <div class="sub">${esc(h.city || "")} ${h.checkinDate ? `· ${fmtDate(h.checkinDate, { short: true })} - ${fmtDate(h.checkoutDate, { short: true })}` : ""}</div>
        </div>
      </div>`).join("");

  return `
    <div class="screen-header"><div class="title">Hotels</div><div class="subtitle">飯店</div></div>
    ${listHTML}
    <button class="btn-primary" data-action="new-hotel">＋ 新增飯店</button>
  `;
}

/* ============================================================
   MODAL / FORM FRAMEWORK
   ============================================================ */
function openModal(title, bodyHTML) {
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = bodyHTML;
  $("#modal-root").classList.remove("hidden");
}
function closeModal() {
  $("#modal-root").classList.add("hidden");
  draft = null; draftKind = null; viewing = null; viewingKind = null;
}

function field(label, inputHTML) {
  return `<div class="field"><label>${esc(label)}</label>${inputHTML}</div>`;
}
function detailRow(label, value) {
  return `<div class="detail-row"><span class="k">${esc(label)}</span><span class="v">${esc(value ?? "—")}</span></div>`;
}

function fileUploadRow(label, dataField, nameField, currentData, currentName, accept) {
  if (currentData) {
    return field(label, `
      <div class="upload-row">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">📎 ${esc(currentName || "已上傳檔案")}</span>
        <button type="button" style="color:var(--rose);font-size:12px;flex-shrink:0;margin-left:8px" data-action="clear-file" data-field="${dataField}" data-namefield="${nameField || ""}">移除</button>
      </div>`);
  }
  return field(label, `
    <button type="button" class="upload-empty" data-action="pick-file" data-field="${dataField}" data-namefield="${nameField || ""}" data-accept="${accept}">⬆ 上傳檔案</button>
  `);
}

function handleFilePick(fieldName, nameField, accept) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept || "*/*";
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 700 * 1024) {
      alert("檔案太大了（建議 700KB 以內），因為資料要同步到雲端資料庫，請先壓縮檔案再上傳。");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      draft[fieldName] = reader.result;
      if (nameField) draft[nameField] = file.name;
      renderModalForm();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

/* ---- form builders ---- */
function flightFormHTML(f) {
  return `
    ${field("所屬", `
      <div class="pill-row" style="margin-bottom:0">
        ${["me", "partner", "shared"].map((o) => `<button type="button" class="pill ${f.owner === o ? "active" : ""}" data-action="set-draft-owner" data-val="${o}">${ownerLabel(o)}</button>`).join("")}
      </div>`)}
    ${field("航空公司", `<input data-field="airline" value="${esc(f.airline || "")}" placeholder="例如：長榮航空">`)}
    ${field("航班編號", `<input data-field="flightNumber" value="${esc(f.flightNumber || "")}" placeholder="例如：BR127">`)}
    <div class="field-row">
      ${field("出發日期", `<input type="date" data-field="depDate" value="${f.depDate || ""}">`)}
      ${field("出發時間", `<input type="time" data-field="depTime" value="${f.depTime || ""}">`)}
    </div>
    ${field("出發機場", `<input data-field="depAirport" value="${esc(f.depAirport || "")}" placeholder="例如：TPE 台北桃園">`)}
    <div class="field-row">
      ${field("抵達日期", `<input type="date" data-field="arrDate" value="${f.arrDate || ""}">`)}
      ${field("抵達時間", `<input type="time" data-field="arrTime" value="${f.arrTime || ""}">`)}
    </div>
    ${field("抵達機場", `<input data-field="arrAirport" value="${esc(f.arrAirport || "")}" placeholder="例如：PUS 釜山金海">`)}
    <div class="field-row">
      ${field("訂位代號", `<input data-field="bookingCode" value="${esc(f.bookingCode || "")}">`)}
      ${field("座位", `<input data-field="seat" value="${esc(f.seat || "")}">`)}
    </div>
    ${field("備註", `<textarea rows="2" data-field="notes">${esc(f.notes || "")}</textarea>`)}
    ${fileUploadRow("機票 PDF", "pdf", "pdfName", f.pdf, f.pdfName, "application/pdf")}
    <button class="btn-primary" data-action="save-flight">儲存航班</button>
  `;
}

function hotelFormHTML(f) {
  return `
    ${field("飯店名稱", `<input data-field="name" value="${esc(f.name || "")}">`)}
    <div class="field-row">
      ${field("城市", `<input data-field="city" value="${esc(f.city || "")}">`)}
      ${field("房型", `<input data-field="roomType" value="${esc(f.roomType || "")}">`)}
    </div>
    ${field("地址", `<input data-field="address" value="${esc(f.address || "")}">`)}
    <div class="field-row">
      ${field("Check-in 日期", `<input type="date" data-field="checkinDate" value="${f.checkinDate || ""}">`)}
      ${field("Check-in 時間", `<input type="time" data-field="checkinTime" value="${f.checkinTime || ""}">`)}
    </div>
    <div class="field-row">
      ${field("Check-out 日期", `<input type="date" data-field="checkoutDate" value="${f.checkoutDate || ""}">`)}
      ${field("Check-out 時間", `<input type="time" data-field="checkoutTime" value="${f.checkoutTime || ""}">`)}
    </div>
    ${field("訂房編號", `<input data-field="bookingNumber" value="${esc(f.bookingNumber || "")}">`)}
    ${field("Google Maps 連結", `<input data-field="mapsUrl" value="${esc(f.mapsUrl || "")}" placeholder="https://maps.app.goo.gl/...">`)}
    ${field("備註", `<textarea rows="2" data-field="notes">${esc(f.notes || "")}</textarea>`)}
    ${fileUploadRow("飯店照片", "photo", null, f.photo, null, "image/*")}
    ${fileUploadRow("訂房確認 PDF", "pdf", "pdfName", f.pdf, f.pdfName, "application/pdf")}
    <button class="btn-primary" data-action="save-hotel">儲存飯店</button>
  `;
}

function itinFormHTML(f) {
  const cityLabel = ITIN_CITY_BY_DATE[f.date] || f.city || "";
  return `
    <div style="font-size:12.5px;color:var(--ink-soft);margin:-4px 0 14px">
      ${fmtDate(f.date)}${cityLabel ? ` · ${esc(cityLabel)}` : ""}（日期由上方選擇的分頁決定）
    </div>
    ${field("行程名稱", `<input data-field="name" value="${esc(f.name || "")}" placeholder="例如：海雲台">`)}
    <div class="field-row">
      ${field("開始時間", `<input type="time" data-field="startTime" value="${f.startTime || ""}">`)}
      ${field("結束時間", `<input type="time" data-field="endTime" value="${f.endTime || ""}">`)}
    </div>
    ${field("地點名稱", `<input data-field="location" value="${esc(f.location || "")}" placeholder="Haeundae Beach">`)}
    ${field("地址", `<input data-field="address" value="${esc(f.address || "")}">`)}
    ${field("Google Maps 連結（貼上分享連結即可）", `<input data-field="mapsUrl" value="${esc(f.mapsUrl || "")}" placeholder="https://maps.app.goo.gl/...">`)}
    ${field("備註", `<textarea rows="2" data-field="notes">${esc(f.notes || "")}</textarea>`)}
    ${fileUploadRow("照片", "photo", null, f.photo, null, "image/*")}
    <button class="btn-primary" data-action="save-itin">儲存行程</button>
  `;
}

function documentFormHTML(f) {
  return `
    ${field("標題", `<input data-field="title" value="${esc(f.title || "")}" placeholder="例如：旅平險保單">`)}
    ${field("備註", `<textarea rows="2" data-field="notes">${esc(f.notes || "")}</textarea>`)}
    ${fileUploadRow("檔案", "file", "fileName", f.file, f.fileName, "*/*")}
    <div class="btn-row">
      <button class="btn-primary" data-action="save-document">儲存</button>
      ${state.documents.some((x) => x.id === f.id) ? `<button class="btn-danger" data-action="delete-document" data-id="${f.id}">刪除</button>` : ""}
    </div>
  `;
}

function tripFormHTML(t) {
  return `
    ${field("旅行名稱", `<input data-field="tripName" value="${esc(t.tripName || "")}">`)}
    ${field("我的出發地", `<input data-field="originMe" value="${esc(t.originMe || "")}">`)}
    ${field("女友的出發地", `<input data-field="originPartner" value="${esc(t.originPartner || "")}">`)}
    ${field("見面城市（簡稱，如：釜山）", `<input data-field="meetingCityShort" value="${esc(t.meetingCityShort || "")}">`)}
    ${field("見面城市（顯示用，如：BUSAN, KOREA）", `<input data-field="meetingCity" value="${esc(t.meetingCity || "")}">`)}
    ${field("第二段城市（如：福岡）", `<input data-field="secondCity" value="${esc(t.secondCity || "")}">`)}
    ${field("見面日期", `<input type="date" data-field="meetingDate" value="${t.meetingDate || ""}">`)}
    ${field("旅行開始日期", `<input type="date" data-field="tripStartDate" value="${t.tripStartDate || ""}">`)}
    ${field("旅行結束日期", `<input type="date" data-field="tripEndDate" value="${t.tripEndDate || ""}">`)}
    <button class="btn-primary" data-action="save-trip">儲存設定</button>
  `;
}

function renderModalForm() {
  if (draftKind === "flight") $("#modal-body").innerHTML = flightFormHTML(draft);
  if (draftKind === "hotel") $("#modal-body").innerHTML = hotelFormHTML(draft);
  if (draftKind === "itinerary") $("#modal-body").innerHTML = itinFormHTML(draft);
  if (draftKind === "document") $("#modal-body").innerHTML = documentFormHTML(draft);
  if (draftKind === "trip") $("#modal-body").innerHTML = tripFormHTML(draft);
}

/* ---- detail viewers ---- */
function viewFlightHTML(f) {
  return `
    <div class="card" style="margin-bottom:16px">
      <div class="serif" style="font-size:20px;margin-bottom:8px">${esc(shortAirport(f.depAirport))} → ${esc(shortAirport(f.arrAirport))}</div>
      ${detailRow("航空公司 / 航班", `${f.airline || "—"} ${f.flightNumber || ""}`)}
      ${detailRow("出發", `${fmtDate(f.depDate)} ${f.depTime || ""}`)}
      ${detailRow("抵達", `${fmtDate(f.arrDate)} ${f.arrTime || ""}`)}
      ${detailRow("訂位代號", f.bookingCode)}
      ${detailRow("座位", f.seat)}
      ${f.notes ? detailRow("備註", f.notes) : ""}
    </div>
    ${f.pdf ? `<a class="btn-secondary" style="margin-bottom:16px" href="${f.pdf}" download="${f.pdfName || "flight-ticket.pdf"}">📄 查看機票 PDF</a>` : ""}
    <div class="btn-row">
      <button class="btn-secondary" data-action="edit-flight" data-id="${f.id}">✏ 編輯</button>
      <button class="btn-danger" data-action="delete-flight" data-id="${f.id}">🗑 刪除</button>
    </div>
  `;
}

function viewHotelHTML(h) {
  return `
    ${h.photo ? `<img src="${h.photo}" style="width:100%;border-radius:16px;margin-bottom:14px;max-height:200px;object-fit:cover">` : ""}
    <div class="card" style="margin-bottom:16px">
      ${detailRow("城市", h.city)}
      ${detailRow("地址", h.address)}
      ${detailRow("Check-in", `${fmtDate(h.checkinDate)} ${h.checkinTime || ""}`)}
      ${detailRow("Check-out", `${fmtDate(h.checkoutDate)} ${h.checkoutTime || ""}`)}
      ${detailRow("訂房編號", h.bookingNumber)}
      ${detailRow("房型", h.roomType)}
      ${h.notes ? detailRow("備註", h.notes) : ""}
    </div>
    <a class="btn-secondary" style="margin-bottom:10px" href="${mapsLink(h)}" target="_blank" rel="noreferrer">↗ Open in Google Maps</a>
    ${h.pdf ? `<a class="btn-secondary" style="margin-bottom:10px" href="${h.pdf}" download="${h.pdfName || "booking.pdf"}">📄 View Booking Document</a>` : ""}
    <div class="btn-row">
      <button class="btn-secondary" data-action="edit-hotel" data-id="${h.id}">✏ 編輯</button>
      <button class="btn-danger" data-action="delete-hotel" data-id="${h.id}">🗑 刪除</button>
    </div>
  `;
}

function viewItinHTML(it) {
  return `
    ${it.photo ? `<img src="${it.photo}" style="width:100%;border-radius:16px;margin-bottom:14px;max-height:200px;object-fit:cover">` : ""}
    <div class="card" style="margin-bottom:16px">
      ${detailRow("日期", fmtDate(it.date))}
      ${detailRow("時間", `${it.startTime || "—"} ${it.endTime ? "- " + it.endTime : ""}`)}
      ${it.location ? detailRow("地點", it.location) : ""}
      ${it.address ? detailRow("地址", it.address) : ""}
      ${it.notes ? detailRow("備註", it.notes) : ""}
    </div>
    ${(it.location || it.address || it.mapsUrl) ? `<a class="btn-secondary" style="margin-bottom:10px" href="${mapsLink(it)}" target="_blank" rel="noreferrer">↗ Open in Google Maps</a>` : ""}
    <div class="btn-row">
      <button class="btn-secondary" data-action="edit-itin" data-id="${it.id}">✏ 編輯</button>
      <button class="btn-danger" data-action="delete-itin" data-id="${it.id}">🗑 刪除</button>
    </div>
  `;
}

/* ============================================================
   EMPTY OBJECT FACTORIES
   ============================================================ */
function emptyFlight() { return { id: uid(), owner: "me", airline: "", flightNumber: "", depDate: "", depTime: "", arrDate: "", arrTime: "", depAirport: "", arrAirport: "", bookingCode: "", seat: "", notes: "", pdf: null, pdfName: "" }; }
function emptyHotel() { return { id: uid(), name: "", city: "", address: "", checkinDate: "", checkinTime: "", checkoutDate: "", checkoutTime: "", bookingNumber: "", roomType: "", notes: "", mapsUrl: "", pdf: null, pdfName: "", photo: null }; }
function emptyItin(date) { return { id: uid(), date: date || todayISO(), startTime: "", endTime: "", name: "", city: "", location: "", address: "", mapsUrl: "", notes: "", photo: null }; }
function emptyDocument() { return { id: uid(), title: "", notes: "", file: null, fileName: "" }; }

/* ============================================================
   ACTION DISPATCH (event delegation)
   ============================================================ */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const a = el.dataset.action, id = el.dataset.id;

  switch (a) {
    case "go-tab": state.tab = el.dataset.tab; render(); break;

    /* ---- trip settings ---- */
    case "open-trip-settings":
      draft = { ...state.trip }; draftKind = "trip";
      openModal("旅行設定", tripFormHTML(draft));
      break;
    case "save-trip":
      col.config.doc("trip").set(draft); closeModal();
      break;

    /* ---- flights ---- */
    case "set-flight-filter": flightFilter = el.dataset.val; render(); break;
    case "new-flight":
      draft = emptyFlight(); draftKind = "flight";
      openModal("新增航班", flightFormHTML(draft));
      break;
    case "edit-flight":
      draft = { ...state.flights.find((f) => f.id === id) }; draftKind = "flight";
      openModal("編輯航班", flightFormHTML(draft));
      break;
    case "view-flight":
      viewing = state.flights.find((f) => f.id === id); viewingKind = "flight";
      openModal("航班詳情", viewFlightHTML(viewing));
      break;
    case "save-flight": {
      const { id: fid, ...data } = draft;
      col.flights.doc(fid).set(data); closeModal();
      break;
    }
    case "delete-flight": col.flights.doc(id).delete(); closeModal(); break;

    /* ---- documents ---- */
    case "toggle-docs": state.showDocs = !state.showDocs; render(); break;
    case "new-document":
      draft = emptyDocument(); draftKind = "document";
      openModal("旅行文件", documentFormHTML(draft));
      break;
    case "edit-document":
      draft = { ...state.documents.find((d) => d.id === id) }; draftKind = "document";
      openModal("旅行文件", documentFormHTML(draft));
      break;
    case "save-document": {
      const { id: did, ...data } = draft;
      col.documents.doc(did).set(data); closeModal();
      break;
    }
    case "delete-document": col.documents.doc(id).delete(); closeModal(); break;

    /* ---- itinerary ---- */
    case "set-itin-view": state.itinView = el.dataset.val; render(); break;
    case "set-itin-date": state.itinActiveDate = el.dataset.date; render(); break;
    case "new-itin":
      draft = emptyItin(state.itinActiveDate); draftKind = "itinerary";
      openModal("新增行程", itinFormHTML(draft));
      break;
    case "edit-itin":
      draft = { ...state.itinerary.find((i) => i.id === id) }; draftKind = "itinerary";
      openModal("編輯行程", itinFormHTML(draft));
      break;
    case "view-itin":
      viewing = state.itinerary.find((i) => i.id === id); viewingKind = "itinerary";
      openModal(viewing.name || "行程詳情", viewItinHTML(viewing));
      break;
    case "save-itin": {
      const { id: iid, ...data } = draft;
      col.itinerary.doc(iid).set(data); closeModal();
      break;
    }
    case "delete-itin": col.itinerary.doc(id).delete(); closeModal(); break;

    /* ---- hotels ---- */
    case "new-hotel":
      draft = emptyHotel(); draftKind = "hotel";
      openModal("新增飯店", hotelFormHTML(draft));
      break;
    case "edit-hotel":
      draft = { ...state.hotels.find((h) => h.id === id) }; draftKind = "hotel";
      openModal("編輯飯店", hotelFormHTML(draft));
      break;
    case "view-hotel":
      viewing = state.hotels.find((h) => h.id === id); viewingKind = "hotel";
      openModal(viewing.name || "飯店詳情", viewHotelHTML(viewing));
      break;
    case "save-hotel": {
      const { id: hid, ...data } = draft;
      col.hotels.doc(hid).set(data); closeModal();
      break;
    }
    case "delete-hotel": col.hotels.doc(id).delete(); closeModal(); break;

    /* ---- shared form widgets ---- */
    case "set-draft-owner": draft.owner = el.dataset.val; renderModalForm(); break;
    case "pick-file": handleFilePick(el.dataset.field, el.dataset.namefield || null, el.dataset.accept); break;
    case "clear-file":
      draft[el.dataset.field] = null;
      if (el.dataset.namefield) draft[el.dataset.namefield] = "";
      renderModalForm();
      break;

    case "close-modal": closeModal(); break;
  }
});

/* bind form input changes into draft object */
document.addEventListener("input", (e) => {
  const f = e.target.dataset.field;
  if (f && draft) draft[f] = e.target.value;
});

/* bottom nav */
$$(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => { state.tab = btn.dataset.tab; render(); });
});

/* modal backdrop close */
$("#modal-root").addEventListener("click", (e) => {
  if (e.target.id === "modal-root") closeModal();
});

/* ---------- initial render ---------- */
render();

/* ---------- register service worker ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
