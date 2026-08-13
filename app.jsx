const { useState, useEffect, useRef, useMemo } = React;

/* ------------------------------------------------------------
   Minimal inline-SVG icon set standing in for lucide-react
   (this environment loads React from a plain <script> tag, not
   through a bundler, so npm-only packages like lucide-react
   aren't resolvable here — every icon below matches the same
   name/props used throughout the component, so nothing else in
   this file had to change).
   ------------------------------------------------------------ */
function makeIcon(paths, viewBox = "0 0 24 24") {
  return function Icon({ size = 18, color = "currentColor", style, fill = "none", strokeWidth = 2 }) {
    return React.createElement(
      "svg",
      { width: size, height: size, viewBox, fill, stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", style },
      paths.map((d, i) => React.createElement("path", { key: i, d }))
    );
  };
}
const Plane = makeIcon(["M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.7.8c-.4.4-.3 1 .2 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.6 5.7c.3.5.9.6 1.3.2l.8-.7c.4-.3.5-.8.4-1.3Z"]);
const MapPin = makeIcon(["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", "M12 10a2 2 0 1 0 0-.001Z"]);
const Calendar = makeIcon(["M8 2v4", "M16 2v4", "M3 8h18", "M4 4h16a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"]);
const HomeIcon = makeIcon(["m3 10 9-7 9 7", "M5 9v11a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9"]);
const HotelIcon = makeIcon(["M3 21h18", "M5 21V7l7-4 7 4v14", "M9 21v-6h6v6", "M9 11h.01", "M15 11h.01"]);
const Plus = makeIcon(["M12 5v14", "M5 12h14"]);
const X = makeIcon(["M18 6 6 18", "M6 6l12 12"]);
const Pencil = makeIcon(["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"]);
const Trash2 = makeIcon(["M3 6h18", "M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2", "M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6", "M10 11v6", "M14 11v6"]);
const Upload = makeIcon(["M12 16V4", "m6 10 6-6 6 6", "M4 18v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"]);
const FileText = makeIcon(["M14 2H6a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z", "M14 2v6h6", "M9 13h6", "M9 17h6"]);
const ListIcon = makeIcon(["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]);
const MapIcon = makeIcon(["M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3Z", "M9 3v15", "M15 6v15"]);
const Settings = makeIcon(["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"]);
const ChevronRight = makeIcon(["m9 18 6-6-6-6"]);
const ExternalLink = makeIcon(["M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6", "M15 3h6v6", "M10 14 21 3"]);
const Heart = function ({ size = 18, color = "currentColor", fill = "none", style }) {
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill, stroke: color, strokeWidth: 2, style },
    React.createElement("path", { d: "M20 8.5c0 4.5-8 10.5-8 10.5S4 13 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5Z" }));
};
const ArrowLeft = makeIcon(["M19 12H5", "m12 19-7-7 7-7"]);
const ImageIcon = makeIcon(["M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z", "M9 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z", "m5 19 5-6 4 4 3-3 4 5"]);
const Clock = makeIcon(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 3"]);
const ChevronLeft = makeIcon(["m15 18-6-6 6-6"]);

/* ============================================================
   DESIGN TOKENS
   bg cream #F6F3EC · ink #21221D · navy #26314A · rose #BD8E8E
   line #E4DFD3 · card #FFFFFF
   display: Georgia/serif for numerals, PingFang TC for CJK
   ============================================================ */

const COLORS = {
  bg: "#F6F3EC",
  ink: "#21221D",
  inkSoft: "#6E6A5E",
  navy: "#26314A",
  rose: "#BD8E8E",
  line: "#E4DFD3",
  card: "#FFFFFF",
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const todayISO = () => new Date().toISOString().slice(0, 10);

function fmtDate(iso, opts = {}) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const w = weekdays[d.getDay()];
  if (opts.short) return `${m}/${day}`;
  return `${m} / ${day}　週${w}`;
}

function daysBetween(a, b) {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db - da) / 86400000);
}

/* ============================================================
   STORAGE HELPERS — Firebase Firestore (shared between both phones)
   Same loadKey/saveKey(key, value) shape as the original Claude
   Artifact storage, so nothing below this point had to change.
   ============================================================ */

firebase.initializeApp(window.FIREBASE_CONFIG);
const fsdb = firebase.firestore();
fsdb.enablePersistence({ synchronizeTabs: true }).catch(() => {});
const appDataCol = fsdb.collection("appdata");

async function loadKey(key, fallback) {
  try {
    const snap = await appDataCol.doc(key).get();
    return snap.exists ? JSON.parse(snap.data().value) : fallback;
  } catch (e) {
    return fallback;
  }
}
async function saveKey(key, value) {
  try {
    await appDataCol.doc(key).set({ value: JSON.stringify(value) });
  } catch (e) {
    console.error("storage save failed", key, e);
  }
}

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

const SEED_FLIGHTS = [
  {
    id: "seed-f1",
    seed: true,
    owner: "me",
    airline: "測試航空",
    flightNumber: "TEST101",
    depDate: "2026-11-13",
    depTime: "08:30",
    arrDate: "2026-11-13",
    arrTime: "10:10",
    depAirport: "TPE 台北",
    arrAirport: "PUS 釜山",
    bookingCode: "",
    seat: "",
    notes: "這是測試資料，可以刪除或編輯成真實航班",
    pdf: null,
  },
];

const SEED_ITINERARY = [
  {
    id: "seed-i1",
    seed: true,
    date: "2026-11-13",
    startTime: "10:10",
    endTime: "11:30",
    name: "抵達金海機場",
    city: "釜山",
    location: "Gimhae International Airport",
    address: "",
    mapsUrl: "",
    notes: "測試資料，之後可自行刪除或修改",
    photo: null,
  },
];

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */

function Card({ children, style, onClick, className }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: COLORS.card,
        borderRadius: 20,
        border: `1px solid ${COLORS.line}`,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: 999,
        fontSize: 13,
        letterSpacing: 0.3,
        border: `1px solid ${active ? COLORS.navy : COLORS.line}`,
        background: active ? COLORS.navy : "transparent",
        color: active ? "#fff" : COLORS.inkSoft,
        whiteSpace: "nowrap",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}

function IconBtn({ onClick, children, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        border: `1px solid ${COLORS.line}`,
        color: COLORS.ink,
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 20px",
        color: COLORS.inkSoft,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          margin: "0 auto 14px",
          borderRadius: "50%",
          background: "#fff",
          border: `1px dashed ${COLORS.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 15, color: COLORS.ink, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{subtitle}</div>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(33,34,29,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.bg,
          width: "100%",
          maxWidth: 460,
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: "24px 24px 0 0",
          padding: "20px 20px 28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.ink }}>{title}</div>
          <IconBtn onClick={onClose}>
            <X size={16} />
          </IconBtn>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: COLORS.inkSoft, marginBottom: 6, letterSpacing: 0.3 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: 12,
  border: `1px solid ${COLORS.line}`,
  background: "#fff",
  fontSize: 14,
  color: COLORS.ink,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

function TextInput(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}
function TextArea(props) {
  return <textarea {...props} rows={2} style={{ ...inputStyle, resize: "vertical", ...(props.style || {}) }} />;
}

function FileUploadRow({ label, fileData, fileName, onChange, onClear, accept }) {
  const ref = useRef();
  const handle = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      alert("檔案太大了（超過 3.5MB），請先壓縮檔案再上傳。");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result, file.name);
    reader.readAsDataURL(file);
  };
  return (
    <Field label={label}>
      {fileData ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 13px",
            border: `1px solid ${COLORS.line}`,
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <span style={{ fontSize: 13, color: COLORS.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            📎 {fileName || "已上傳檔案"}
          </span>
          <button onClick={onClear} style={{ color: COLORS.rose, fontSize: 12, flexShrink: 0, marginLeft: 8 }}>
            移除
          </button>
        </div>
      ) : (
        <button
          onClick={() => ref.current?.click()}
          style={{
            width: "100%",
            padding: "11px 13px",
            borderRadius: 12,
            border: `1px dashed ${COLORS.line}`,
            background: "#fff",
            color: COLORS.inkSoft,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Upload size={14} /> 上傳檔案
        </button>
      )}
      <input ref={ref} type="file" accept={accept} onChange={handle} style={{ display: "none" }} />
    </Field>
  );
}

/* ============================================================
   COUNTDOWN / HOME
   ============================================================ */

function computeTripPhase(trip) {
  const today = todayISO();
  const { meetingDate, tripStartDate, tripEndDate } = trip;
  if (!meetingDate) return { phase: "unset" };
  if (today < meetingDate) {
    return { phase: "before", days: daysBetween(today, meetingDate) };
  }
  if (today === meetingDate) {
    return { phase: "meet" };
  }
  if (tripEndDate && today <= tripEndDate) {
    const dayNum = daysBetween(tripStartDate || meetingDate, today) + 1;
    return { phase: "during", dayNum };
  }
  return { phase: "after" };
}

function CountdownHero({ trip, onOpenSettings }) {
  const info = computeTripPhase(trip);
  return (
    <Card
      style={{
        background: COLORS.navy,
        color: "#fff",
        borderRadius: 24,
        padding: "30px 24px 26px",
        position: "relative",
        overflow: "hidden",
        border: "none",
      }}
    >
      <button
        onClick={onOpenSettings}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Settings size={14} color="#fff" />
      </button>

      {/* dashed flight-path signature */}
      <svg width="100%" height="18" style={{ position: "absolute", top: 12, left: 0, opacity: 0.35 }}>
        <line x1="0" y1="9" x2="100%" y2="9" stroke="#fff" strokeWidth="1" strokeDasharray="2 6" />
      </svg>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.65, marginBottom: 10, marginTop: 6 }}>
          距離我們在{trip.meetingCityShort || "釜山"}見面
        </div>

        {info.phase === "before" && (
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10 }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 68, lineHeight: 1, fontWeight: 500 }}>
              {info.days}
            </span>
            <span style={{ fontSize: 13, letterSpacing: 2, opacity: 0.7 }}>DAYS</span>
          </div>
        )}
        {info.phase === "meet" && (
          <div style={{ fontFamily: "Georgia, serif", fontSize: 32, marginTop: 6 }}>
            Today we meet <Heart size={20} style={{ display: "inline", verticalAlign: -2 }} fill={COLORS.rose} color={COLORS.rose} />
          </div>
        )}
        {info.phase === "during" && (
          <div style={{ fontFamily: "Georgia, serif", fontSize: 30, marginTop: 6 }}>
            Day {info.dayNum} of our trip
          </div>
        )}
        {info.phase === "after" && (
          <div style={{ fontFamily: "Georgia, serif", fontSize: 26, marginTop: 6 }}>
            Our trip has ended ⋆
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.18)",
          fontSize: 12.5,
          opacity: 0.85,
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <span>{trip.meetingDate}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span style={{ letterSpacing: 1 }}>{trip.meetingCity}</span>
      </div>
    </Card>
  );
}

function nextUpcomingFlight(flights) {
  const today = todayISO();
  const future = flights
    .filter((f) => f.depDate && f.depDate >= today)
    .sort((a, b) => (a.depDate + a.depTime).localeCompare(b.depDate + b.depTime));
  return future[0] || null;
}

function FlightMiniCard({ flight, onClick }) {
  if (!flight) return null;
  return (
    <Card onClick={onClick} style={{ cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.inkSoft, letterSpacing: 1, marginBottom: 6 }}>
            NEXT FLIGHT {flight.seed ? "· 測試資料" : ""}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, color: COLORS.ink, fontFamily: "Georgia, serif" }}>
            <Plane size={16} color={COLORS.navy} />
            {shortAirport(flight.depAirport)} → {shortAirport(flight.arrAirport)}
          </div>
          <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>
            {fmtDate(flight.depDate, { short: true })} · {flight.depTime}
          </div>
        </div>
        <ChevronRight size={18} color={COLORS.inkSoft} />
      </div>
    </Card>
  );
}

function shortAirport(s) {
  if (!s) return "—";
  const code = s.trim().split(" ")[0];
  return code;
}

function JourneyTimeline({ trip, flights }) {
  const steps = [
    { icon: "🇹🇼", label: trip.originMe.split(" ")[0] },
    { icon: "🇰🇷", label: trip.meetingCityShort, mark: true },
    { icon: "🇯🇵", label: trip.secondCity, mark: true },
    { icon: "🏁", label: `${trip.originMe.split(" ")[0]} / ${trip.originPartner.split(" ")[0]}` },
  ];
  return (
    <Card style={{ padding: "16px 18px" }}>
      <div style={{ fontSize: 10.5, color: COLORS.inkSoft, letterSpacing: 2, marginBottom: 14, textAlign: "center" }}>
        JOURNEY
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: "12%",
            right: "12%",
            height: 0,
            borderTop: `1px dashed ${COLORS.line}`,
          }}
        />
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: COLORS.bg,
                border: `1px solid ${COLORS.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                zIndex: 1,
              }}
            >
              {s.icon}
            </div>
            <div style={{ fontSize: 11, color: COLORS.ink, marginTop: 7, textAlign: "center", lineHeight: 1.3 }}>{s.label}</div>
            {s.mark && (
              <Heart size={8} fill={COLORS.rose} color={COLORS.rose} style={{ marginTop: 3 }} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============================================================
   TRIP SETTINGS MODAL
   ============================================================ */

function TripSettingsModal({ open, onClose, trip, setTrip }) {
  const [f, setF] = useState(trip);
  useEffect(() => setF(trip), [trip, open]);
  const save = () => {
    setTrip(f);
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="旅行設定">
      <Field label="旅行名稱">
        <TextInput value={f.tripName} onChange={(e) => setF({ ...f, tripName: e.target.value })} />
      </Field>
      <Field label="我的出發地">
        <TextInput value={f.originMe} onChange={(e) => setF({ ...f, originMe: e.target.value })} />
      </Field>
      <Field label="女友的出發地">
        <TextInput value={f.originPartner} onChange={(e) => setF({ ...f, originPartner: e.target.value })} />
      </Field>
      <Field label="見面城市（簡稱，如：釜山）">
        <TextInput value={f.meetingCityShort} onChange={(e) => setF({ ...f, meetingCityShort: e.target.value })} />
      </Field>
      <Field label="見面城市（顯示用，如：BUSAN, KOREA）">
        <TextInput value={f.meetingCity} onChange={(e) => setF({ ...f, meetingCity: e.target.value })} />
      </Field>
      <Field label="第二段城市（如：福岡）">
        <TextInput value={f.secondCity} onChange={(e) => setF({ ...f, secondCity: e.target.value })} />
      </Field>
      <Field label="見面日期">
        <TextInput type="date" value={f.meetingDate} onChange={(e) => setF({ ...f, meetingDate: e.target.value })} />
      </Field>
      <Field label="旅行開始日期">
        <TextInput type="date" value={f.tripStartDate} onChange={(e) => setF({ ...f, tripStartDate: e.target.value })} />
      </Field>
      <Field label="旅行結束日期">
        <TextInput type="date" value={f.tripEndDate} onChange={(e) => setF({ ...f, tripEndDate: e.target.value })} />
      </Field>
      <button onClick={save} style={primaryBtnStyle}>
        儲存設定
      </button>
    </Modal>
  );
}

const primaryBtnStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: 14,
  background: COLORS.navy,
  color: "#fff",
  fontSize: 14,
  marginTop: 6,
  letterSpacing: 0.5,
};

/* ============================================================
   FLIGHTS / DOCUMENTS SCREEN
   ============================================================ */

const OWNER_LABEL = { me: "我", partner: "女友", shared: "共同" };

function emptyFlight() {
  return {
    id: uid(),
    owner: "me",
    airline: "",
    flightNumber: "",
    depDate: "",
    depTime: "",
    arrDate: "",
    arrTime: "",
    depAirport: "",
    arrAirport: "",
    bookingCode: "",
    seat: "",
    notes: "",
    pdf: null,
    pdfName: "",
  };
}

function FlightForm({ value, onChange }) {
  const f = value;
  const set = (k) => (e) => onChange({ ...f, [k]: e.target.value });
  return (
    <>
      <Field label="所屬">
        <div style={{ display: "flex", gap: 8 }}>
          {["me", "partner", "shared"].map((o) => (
            <Pill key={o} active={f.owner === o} onClick={() => onChange({ ...f, owner: o })}>
              {OWNER_LABEL[o]}
            </Pill>
          ))}
        </div>
      </Field>
      <Field label="航空公司">
        <TextInput value={f.airline} onChange={set("airline")} placeholder="例如：長榮航空" />
      </Field>
      <Field label="航班編號">
        <TextInput value={f.flightNumber} onChange={set("flightNumber")} placeholder="例如：BR127" />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="出發日期">
            <TextInput type="date" value={f.depDate} onChange={set("depDate")} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="出發時間">
            <TextInput type="time" value={f.depTime} onChange={set("depTime")} />
          </Field>
        </div>
      </div>
      <Field label="出發機場">
        <TextInput value={f.depAirport} onChange={set("depAirport")} placeholder="例如：TPE 台北桃園" />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="抵達日期">
            <TextInput type="date" value={f.arrDate} onChange={set("arrDate")} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="抵達時間">
            <TextInput type="time" value={f.arrTime} onChange={set("arrTime")} />
          </Field>
        </div>
      </div>
      <Field label="抵達機場">
        <TextInput value={f.arrAirport} onChange={set("arrAirport")} placeholder="例如：PUS 釜山金海" />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="訂位代號">
            <TextInput value={f.bookingCode} onChange={set("bookingCode")} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="座位">
            <TextInput value={f.seat} onChange={set("seat")} />
          </Field>
        </div>
      </div>
      <Field label="備註">
        <TextArea value={f.notes} onChange={set("notes")} />
      </Field>
      <FileUploadRow
        label="機票 PDF"
        fileData={f.pdf}
        fileName={f.pdfName}
        accept="application/pdf"
        onChange={(data, name) => onChange({ ...f, pdf: data, pdfName: name })}
        onClear={() => onChange({ ...f, pdf: null, pdfName: "" })}
      />
    </>
  );
}

function FlightCard({ flight, onClick }) {
  return (
    <Card onClick={onClick} style={{ cursor: "pointer", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <span style={ownerTagStyle}>{OWNER_LABEL[flight.owner]}</span>
            {flight.seed && <span style={{ ...ownerTagStyle, background: "#F1E9DC", color: "#8a6d3b" }}>測試資料</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontFamily: "Georgia, serif", color: COLORS.ink }}>
            <Plane size={15} color={COLORS.navy} />
            {shortAirport(flight.depAirport)} → {shortAirport(flight.arrAirport)}
          </div>
          <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 4 }}>
            {flight.airline} {flight.flightNumber} · {fmtDate(flight.depDate, { short: true })} {flight.depTime}
          </div>
        </div>
        {flight.pdf && <FileText size={16} color={COLORS.inkSoft} style={{ marginTop: 4 }} />}
      </div>
    </Card>
  );
}

const ownerTagStyle = {
  fontSize: 11,
  padding: "2px 9px",
  borderRadius: 999,
  background: "#EEF0F4",
  color: COLORS.navy,
};

function emptyDoc() {
  return { id: uid(), title: "", notes: "", file: null, fileName: "" };
}

function FlightsScreen({ flights, setFlights, docs, setDocs }) {
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [editing, setEditing] = useState(null); // flight object or null
  const [viewing, setViewing] = useState(null); // flight object for detail/pdf view
  const [showDocs, setShowDocs] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const filtered = flights
    .filter((f) => ownerFilter === "all" || f.owner === ownerFilter)
    .sort((a, b) => (a.depDate + (a.depTime || "")).localeCompare(b.depDate + (b.depTime || "")));

  const saveFlight = (f) => {
    setFlights((prev) => {
      const exists = prev.some((x) => x.id === f.id);
      return exists ? prev.map((x) => (x.id === f.id ? f : x)) : [...prev, f];
    });
    setEditing(null);
    setViewing(null);
  };
  const deleteFlight = (id) => {
    setFlights((prev) => prev.filter((x) => x.id !== id));
    setViewing(null);
  };

  const saveDoc = (d) => {
    setDocs((prev) => {
      const exists = prev.some((x) => x.id === d.id);
      return exists ? prev.map((x) => (x.id === d.id ? d : x)) : [...prev, d];
    });
    setEditingDoc(null);
  };
  const deleteDoc = (id) => setDocs((prev) => prev.filter((x) => x.id !== id));

  return (
    <div>
      <ScreenHeader title="Flights & Documents" subtitle="航班與旅行文件" />

      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 2 }}>
        <Pill active={ownerFilter === "all"} onClick={() => setOwnerFilter("all")}>全部</Pill>
        <Pill active={ownerFilter === "me"} onClick={() => setOwnerFilter("me")}>我的航班</Pill>
        <Pill active={ownerFilter === "partner"} onClick={() => setOwnerFilter("partner")}>女友的航班</Pill>
        <Pill active={ownerFilter === "shared"} onClick={() => setOwnerFilter("shared")}>共同航班</Pill>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Plane size={20} color={COLORS.inkSoft} />} title="還沒有航班" subtitle="點下方按鈕新增第一筆航班資料" />
      ) : (
        filtered.map((f) => <FlightCard key={f.id} flight={f} onClick={() => setViewing(f)} />)
      )}

      <button
        onClick={() => setEditing(emptyFlight())}
        style={{ ...primaryBtnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}
      >
        <Plus size={16} /> 新增航班
      </button>

      {/* Other documents section */}
      <div
        onClick={() => setShowDocs((s) => !s)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 30, marginBottom: 12, cursor: "pointer" }}
      >
        <div style={{ fontSize: 13, color: COLORS.inkSoft, letterSpacing: 1 }}>其他旅行文件 ({docs.length})</div>
        <ChevronRight size={16} color={COLORS.inkSoft} style={{ transform: showDocs ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
      </div>
      {showDocs && (
        <>
          {docs.map((d) => (
            <Card key={d.id} onClick={() => setEditingDoc(d)} style={{ cursor: "pointer", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, color: COLORS.ink }}>{d.title || "未命名文件"}</div>
                  {d.notes && <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>{d.notes}</div>}
                </div>
                {d.file && <FileText size={15} color={COLORS.inkSoft} />}
              </div>
            </Card>
          ))}
          <button
            onClick={() => setEditingDoc(emptyDoc())}
            style={{ width: "100%", padding: 12, borderRadius: 14, border: `1px dashed ${COLORS.line}`, color: COLORS.inkSoft, fontSize: 13 }}
          >
            + 新增文件（保險、簽證等）
          </button>
        </>
      )}

      {/* Flight edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={flights.some((x) => x.id === editing?.id) ? "編輯航班" : "新增航班"}>
        {editing && (
          <>
            <FlightForm value={editing} onChange={setEditing} />
            <button onClick={() => saveFlight(editing)} style={primaryBtnStyle}>儲存航班</button>
          </>
        )}
      </Modal>

      {/* Flight detail/view modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="航班詳情">
        {viewing && (
          <>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 20, marginBottom: 8 }}>
                {shortAirport(viewing.depAirport)} → {shortAirport(viewing.arrAirport)}
              </div>
              <DetailRow label="航空公司 / 航班" value={`${viewing.airline || "—"} ${viewing.flightNumber || ""}`} />
              <DetailRow label="出發" value={`${fmtDate(viewing.depDate)} ${viewing.depTime || ""}`} />
              <DetailRow label="抵達" value={`${fmtDate(viewing.arrDate)} ${viewing.arrTime || ""}`} />
              <DetailRow label="訂位代號" value={viewing.bookingCode || "—"} />
              <DetailRow label="座位" value={viewing.seat || "—"} />
              {viewing.notes && <DetailRow label="備註" value={viewing.notes} />}
            </Card>
            {viewing.pdf && (
              <div style={{ marginBottom: 16 }}>
                <iframe title="pdf" src={viewing.pdf} style={{ width: "100%", height: 320, borderRadius: 14, border: `1px solid ${COLORS.line}` }} />
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(viewing)} style={{ ...secondaryBtnStyle, flex: 1 }}>
                <Pencil size={14} style={{ marginRight: 6, verticalAlign: -2 }} />編輯
              </button>
              <button onClick={() => deleteFlight(viewing.id)} style={{ ...dangerBtnStyle, flex: 1 }}>
                <Trash2 size={14} style={{ marginRight: 6, verticalAlign: -2 }} />刪除
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Doc edit modal */}
      <Modal open={!!editingDoc} onClose={() => setEditingDoc(null)} title="旅行文件">
        {editingDoc && (
          <>
            <Field label="標題">
              <TextInput value={editingDoc.title} onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })} placeholder="例如：旅平險保單" />
            </Field>
            <Field label="備註">
              <TextArea value={editingDoc.notes} onChange={(e) => setEditingDoc({ ...editingDoc, notes: e.target.value })} />
            </Field>
            <FileUploadRow
              label="檔案"
              fileData={editingDoc.file}
              fileName={editingDoc.fileName}
              onChange={(data, name) => setEditingDoc({ ...editingDoc, file: data, fileName: name })}
              onClear={() => setEditingDoc({ ...editingDoc, file: null, fileName: "" })}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => saveDoc(editingDoc)} style={{ ...primaryBtnStyle, flex: 1 }}>儲存</button>
              {docs.some((x) => x.id === editingDoc.id) && (
                <button onClick={() => { deleteDoc(editingDoc.id); setEditingDoc(null); }} style={{ ...dangerBtnStyle, flex: 1 }}>刪除</button>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.line}`, fontSize: 13.5 }}>
      <span style={{ color: COLORS.inkSoft }}>{label}</span>
      <span style={{ color: COLORS.ink, textAlign: "right", maxWidth: "65%" }}>{value}</span>
    </div>
  );
}

const secondaryBtnStyle = {
  padding: "12px",
  borderRadius: 14,
  border: `1px solid ${COLORS.line}`,
  background: "#fff",
  color: COLORS.ink,
  fontSize: 13.5,
};
const dangerBtnStyle = {
  padding: "12px",
  borderRadius: 14,
  border: `1px solid ${COLORS.rose}`,
  background: "#fff",
  color: COLORS.rose,
  fontSize: 13.5,
};

/* ============================================================
   ITINERARY SCREEN
   ============================================================ */

function emptyItem(date) {
  return {
    id: uid(),
    date: date || todayISO(),
    startTime: "",
    endTime: "",
    name: "",
    city: "",
    location: "",
    address: "",
    mapsUrl: "",
    notes: "",
    photo: null,
  };
}

function ItineraryForm({ value, onChange }) {
  const f = value;
  const set = (k) => (e) => onChange({ ...f, [k]: e.target.value });
  return (
    <>
      <Field label="行程名稱">
        <TextInput value={f.name} onChange={set("name")} placeholder="例如：海雲台" />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="日期">
            <TextInput type="date" value={f.date} onChange={set("date")} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="城市">
            <TextInput value={f.city} onChange={set("city")} placeholder="釜山" />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="開始時間">
            <TextInput type="time" value={f.startTime} onChange={set("startTime")} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="結束時間">
            <TextInput type="time" value={f.endTime} onChange={set("endTime")} />
          </Field>
        </div>
      </div>
      <Field label="地點名稱">
        <TextInput value={f.location} onChange={set("location")} placeholder="Haeundae Beach" />
      </Field>
      <Field label="地址">
        <TextInput value={f.address} onChange={set("address")} />
      </Field>
      <Field label="Google Maps 連結（貼上分享連結即可）">
        <TextInput value={f.mapsUrl} onChange={set("mapsUrl")} placeholder="https://maps.app.goo.gl/..." />
      </Field>
      <Field label="備註">
        <TextArea value={f.notes} onChange={set("notes")} placeholder="看夕陽" />
      </Field>
      <FileUploadRow
        label="照片"
        fileData={f.photo}
        fileName={f.photo ? "已上傳照片" : ""}
        accept="image/*"
        onChange={(data) => onChange({ ...f, photo: data })}
        onClear={() => onChange({ ...f, photo: null })}
      />
    </>
  );
}

function mapsLink(item) {
  if (item.mapsUrl) return item.mapsUrl;
  const q = encodeURIComponent(item.address || item.location || item.name);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function ItineraryCard({ item, onClick }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
      <div style={{ width: 52, flexShrink: 0, textAlign: "right", paddingTop: 16 }}>
        <div style={{ fontSize: 13, color: COLORS.ink, fontFamily: "Georgia, serif" }}>{item.startTime || "—"}</div>
        {item.endTime && <div style={{ fontSize: 11, color: COLORS.inkSoft }}>{item.endTime}</div>}
      </div>
      <div style={{ width: 1, background: COLORS.line, position: "relative" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.rose, position: "absolute", top: 20, left: -3 }} />
      </div>
      <Card onClick={onClick} style={{ flex: 1, cursor: "pointer", padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 15, color: COLORS.ink }}>
              {item.name || "未命名行程"} {item.seed && <span style={{ ...ownerTagStyle, background: "#F1E9DC", color: "#8a6d3b", marginLeft: 6 }}>測試資料</span>}
            </div>
            {item.location && (
              <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={11} /> {item.location}
              </div>
            )}
          </div>
          {item.photo && <ImageIcon size={15} color={COLORS.inkSoft} />}
        </div>
      </Card>
    </div>
  );
}

function ItineraryScreen({ items, setItems }) {
  const [view, setView] = useState("list"); // list | map
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const dates = useMemo(() => {
    const s = new Set(items.map((i) => i.date).filter(Boolean));
    return Array.from(s).sort();
  }, [items]);

  const [activeDate, setActiveDate] = useState(dates[0] || todayISO());
  useEffect(() => {
    if (dates.length && !dates.includes(activeDate)) setActiveDate(dates[0]);
  }, [dates]); // eslint-disable-line

  const grouped = useMemo(() => {
    const g = {};
    items.forEach((i) => {
      const k = i.date || "未排定日期";
      g[k] = g[k] || [];
      g[k].push(i);
    });
    Object.values(g).forEach((arr) => arr.sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")));
    return g;
  }, [items]);

  const sortedDates = Object.keys(grouped).sort();
  const dateIndex = dates.indexOf(activeDate);

  const touchX = useRef(null);
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40 || dates.length < 2) return;
    const idx = dates.indexOf(activeDate);
    if (dx < 0 && idx < dates.length - 1) setActiveDate(dates[idx + 1]); // swipe left → next day
    if (dx > 0 && idx > 0) setActiveDate(dates[idx - 1]); // swipe right → previous day
  };

  const save = (it) => {
    setItems((prev) => {
      const exists = prev.some((x) => x.id === it.id);
      return exists ? prev.map((x) => (x.id === it.id ? it : x)) : [...prev, it];
    });
    setEditing(null);
    setViewing(null);
  };
  const del = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setViewing(null);
  };

  const dayList = grouped[activeDate] || [];
  const dayItems = dayList.filter((i) => i.location || i.address || i.mapsUrl);

  return (
    <div>
      <ScreenHeader title="Itinerary" subtitle="行程" />

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Pill active={view === "list"} onClick={() => setView("list")}>
          <ListIcon size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />List
        </Pill>
        <Pill active={view === "map"} onClick={() => setView("map")}>
          <MapIcon size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />Map
        </Pill>
      </div>

      {/* Shared horizontal day selector — swipe left/right on the content below to switch days */}
      {dates.length > 0 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDate(d)}
              style={{
                flexShrink: 0,
                padding: "9px 16px",
                borderRadius: 16,
                border: `1px solid ${activeDate === d ? COLORS.navy : COLORS.line}`,
                background: activeDate === d ? COLORS.navy : "#fff",
                color: activeDate === d ? "#fff" : COLORS.ink,
                textAlign: "center",
                minWidth: 58,
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: 0.5, opacity: 0.75 }}>
                {new Date(d + "T00:00:00").toLocaleDateString("zh-TW", { weekday: "short" })}
              </div>
              <div style={{ fontSize: 14, fontFamily: "Georgia, serif", marginTop: 2 }}>{fmtDate(d, { short: true })}</div>
            </button>
          ))}
        </div>
      )}

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {view === "list" && (
          <>
            {sortedDates.length === 0 ? (
              <EmptyState icon={<Calendar size={20} color={COLORS.inkSoft} />} title="還沒有行程" subtitle="點下方按鈕新增第一筆行程" />
            ) : (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 13, color: COLORS.navy, letterSpacing: 1, marginBottom: 14, fontWeight: 600 }}>
                  {fmtDate(activeDate)} {dayList[0]?.city ? `· ${dayList[0].city}` : ""}
                  {dates.length > 1 && (
                    <span style={{ float: "right", fontSize: 11, color: COLORS.inkSoft, fontWeight: 400 }}>
                      {dateIndex + 1} / {dates.length}
                    </span>
                  )}
                </div>
                {dayList.length === 0 ? (
                  <EmptyState icon={<Calendar size={20} color={COLORS.inkSoft} />} title="這天還沒有行程" subtitle="左右滑動切換日期，或新增這天的行程" />
                ) : (
                  dayList.map((it) => <ItineraryCard key={it.id} item={it} onClick={() => setViewing(it)} />)
                )}
              </div>
            )}
            <button
              onClick={() => setEditing(emptyItem(activeDate))}
              style={{ ...primaryBtnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <Plus size={16} /> Add 新增行程
            </button>
          </>
        )}

        {view === "map" && (
          <>
            <div
              style={{
                borderRadius: 20,
                border: `1px solid ${COLORS.line}`,
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 23px, #ECE7DA 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, #ECE7DA 24px)",
                backgroundColor: "#FBFAF6",
                padding: 20,
                minHeight: 220,
                display: "flex",
                flexWrap: "wrap",
                alignContent: "flex-start",
                gap: 12,
              }}
            >
              {dayItems.length === 0 ? (
                <div style={{ color: COLORS.inkSoft, fontSize: 13, margin: "auto" }}>這天還沒有可標示地點的行程</div>
              ) : (
                dayItems.map((it, idx) => (
                  <button
                    key={it.id}
                    onClick={() => setViewing(it)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "#fff",
                      border: `1px solid ${COLORS.line}`,
                      fontSize: 12.5,
                      color: COLORS.ink,
                    }}
                  >
                    <span
                      style={{
                        width: 18, height: 18, borderRadius: "50%", background: COLORS.rose, color: "#fff",
                        fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    {it.name}
                  </button>
                ))
              )}
            </div>
            <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginTop: 10, lineHeight: 1.6 }}>
              這是簡易地點預覽，尚未串接真正的 Google Maps 底圖（需要 Google Maps API Key）。點每個地點仍可以開啟 Google Maps 導航。
            </div>
          </>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="新增 / 編輯行程">
        {editing && (
          <>
            <ItineraryForm value={editing} onChange={setEditing} />
            <button onClick={() => save(editing)} style={primaryBtnStyle}>儲存行程</button>
          </>
        )}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name || "行程詳情"}>
        {viewing && (
          <>
            {viewing.photo && (
              <img src={viewing.photo} alt="" style={{ width: "100%", borderRadius: 16, marginBottom: 14, maxHeight: 200, objectFit: "cover" }} />
            )}
            <Card style={{ marginBottom: 16 }}>
              <DetailRow label="日期" value={fmtDate(viewing.date)} />
              <DetailRow label="時間" value={`${viewing.startTime || "—"} ${viewing.endTime ? "- " + viewing.endTime : ""}`} />
              {viewing.location && <DetailRow label="地點" value={viewing.location} />}
              {viewing.address && <DetailRow label="地址" value={viewing.address} />}
              {viewing.notes && <DetailRow label="備註" value={viewing.notes} />}
            </Card>
            {(viewing.location || viewing.address || viewing.mapsUrl) && (
              <a
                href={mapsLink(viewing)}
                target="_blank"
                rel="noreferrer"
                style={{ ...secondaryBtnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10, textDecoration: "none" }}
              >
                <ExternalLink size={14} /> Open in Google Maps
              </a>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(viewing)} style={{ ...secondaryBtnStyle, flex: 1 }}>
                <Pencil size={14} style={{ marginRight: 6, verticalAlign: -2 }} />編輯
              </button>
              <button onClick={() => del(viewing.id)} style={{ ...dangerBtnStyle, flex: 1 }}>
                <Trash2 size={14} style={{ marginRight: 6, verticalAlign: -2 }} />刪除
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

/* ============================================================
   HOTELS SCREEN
   ============================================================ */

function emptyHotel() {
  return {
    id: uid(),
    name: "",
    city: "",
    address: "",
    checkinDate: "",
    checkinTime: "",
    checkoutDate: "",
    checkoutTime: "",
    bookingNumber: "",
    roomType: "",
    notes: "",
    mapsUrl: "",
    pdf: null,
    pdfName: "",
    photo: null,
  };
}

function HotelForm({ value, onChange }) {
  const f = value;
  const set = (k) => (e) => onChange({ ...f, [k]: e.target.value });
  return (
    <>
      <Field label="飯店名稱">
        <TextInput value={f.name} onChange={set("name")} />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="城市">
            <TextInput value={f.city} onChange={set("city")} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="房型">
            <TextInput value={f.roomType} onChange={set("roomType")} />
          </Field>
        </div>
      </div>
      <Field label="地址">
        <TextInput value={f.address} onChange={set("address")} />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Check-in 日期">
            <TextInput type="date" value={f.checkinDate} onChange={set("checkinDate")} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Check-in 時間">
            <TextInput type="time" value={f.checkinTime} onChange={set("checkinTime")} />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Check-out 日期">
            <TextInput type="date" value={f.checkoutDate} onChange={set("checkoutDate")} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Check-out 時間">
            <TextInput type="time" value={f.checkoutTime} onChange={set("checkoutTime")} />
          </Field>
        </div>
      </div>
      <Field label="訂房編號">
        <TextInput value={f.bookingNumber} onChange={set("bookingNumber")} />
      </Field>
      <Field label="Google Maps 連結">
        <TextInput value={f.mapsUrl} onChange={set("mapsUrl")} placeholder="https://maps.app.goo.gl/..." />
      </Field>
      <Field label="備註">
        <TextArea value={f.notes} onChange={set("notes")} />
      </Field>
      <FileUploadRow
        label="飯店照片"
        fileData={f.photo}
        fileName={f.photo ? "已上傳照片" : ""}
        accept="image/*"
        onChange={(data) => onChange({ ...f, photo: data })}
        onClear={() => onChange({ ...f, photo: null })}
      />
      <FileUploadRow
        label="訂房確認 PDF"
        fileData={f.pdf}
        fileName={f.pdfName}
        accept="application/pdf"
        onChange={(data, name) => onChange({ ...f, pdf: data, pdfName: name })}
        onClear={() => onChange({ ...f, pdf: null, pdfName: "" })}
      />
    </>
  );
}

function HotelCard({ hotel, onClick }) {
  return (
    <Card onClick={onClick} style={{ cursor: "pointer", marginBottom: 12, display: "flex", gap: 12 }}>
      <div
        style={{
          width: 56, height: 56, borderRadius: 14, flexShrink: 0, overflow: "hidden",
          background: "#F1EDE2", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {hotel.photo ? (
          <img src={hotel.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <HotelIcon size={20} color={COLORS.inkSoft} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, color: COLORS.ink }}>{hotel.name || "未命名飯店"}</div>
        <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 3 }}>
          {hotel.city} {hotel.checkinDate ? `· ${fmtDate(hotel.checkinDate, { short: true })} - ${fmtDate(hotel.checkoutDate, { short: true })}` : ""}
        </div>
      </div>
    </Card>
  );
}

function HotelsScreen({ hotels, setHotels }) {
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const sorted = [...hotels].sort((a, b) => (a.checkinDate || "").localeCompare(b.checkinDate || ""));

  const save = (h) => {
    setHotels((prev) => {
      const exists = prev.some((x) => x.id === h.id);
      return exists ? prev.map((x) => (x.id === h.id ? h : x)) : [...prev, h];
    });
    setEditing(null);
    setViewing(null);
  };
  const del = (id) => {
    setHotels((prev) => prev.filter((x) => x.id !== id));
    setViewing(null);
  };

  return (
    <div>
      <ScreenHeader title="Hotels" subtitle="飯店" />
      {sorted.length === 0 ? (
        <EmptyState icon={<HotelIcon size={20} color={COLORS.inkSoft} />} title="還沒有飯店" subtitle="點下方按鈕新增第一間飯店" />
      ) : (
        sorted.map((h) => <HotelCard key={h.id} hotel={h} onClick={() => setViewing(h)} />)
      )}
      <button
        onClick={() => setEditing(emptyHotel())}
        style={{ ...primaryBtnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
      >
        <Plus size={16} /> 新增飯店
      </button>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="新增 / 編輯飯店">
        {editing && (
          <>
            <HotelForm value={editing} onChange={setEditing} />
            <button onClick={() => save(editing)} style={primaryBtnStyle}>儲存飯店</button>
          </>
        )}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name || "飯店詳情"}>
        {viewing && (
          <>
            {viewing.photo && (
              <img src={viewing.photo} alt="" style={{ width: "100%", borderRadius: 16, marginBottom: 14, maxHeight: 200, objectFit: "cover" }} />
            )}
            <Card style={{ marginBottom: 16 }}>
              <DetailRow label="城市" value={viewing.city || "—"} />
              <DetailRow label="地址" value={viewing.address || "—"} />
              <DetailRow label="Check-in" value={`${fmtDate(viewing.checkinDate)} ${viewing.checkinTime || ""}`} />
              <DetailRow label="Check-out" value={`${fmtDate(viewing.checkoutDate)} ${viewing.checkoutTime || ""}`} />
              <DetailRow label="訂房編號" value={viewing.bookingNumber || "—"} />
              <DetailRow label="房型" value={viewing.roomType || "—"} />
              {viewing.notes && <DetailRow label="備註" value={viewing.notes} />}
            </Card>
            <a
              href={mapsLink(viewing)}
              target="_blank"
              rel="noreferrer"
              style={{ ...secondaryBtnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10, textDecoration: "none" }}
            >
              <ExternalLink size={14} /> Open in Google Maps
            </a>
            {viewing.pdf && (
              <a
                href={viewing.pdf}
                download={viewing.pdfName || "booking.pdf"}
                style={{ ...secondaryBtnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10, textDecoration: "none" }}
              >
                <FileText size={14} /> View Booking Document
              </a>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(viewing)} style={{ ...secondaryBtnStyle, flex: 1 }}>
                <Pencil size={14} style={{ marginRight: 6, verticalAlign: -2 }} />編輯
              </button>
              <button onClick={() => del(viewing.id)} style={{ ...dangerBtnStyle, flex: 1 }}>
                <Trash2 size={14} style={{ marginRight: 6, verticalAlign: -2 }} />刪除
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

/* ============================================================
   SHARED SCREEN HEADER
   ============================================================ */

function ScreenHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: COLORS.ink }}>{title}</div>
      <div style={{ fontSize: 12.5, color: COLORS.inkSoft, letterSpacing: 1, marginTop: 2 }}>{subtitle}</div>
    </div>
  );
}

/* ============================================================
   BOTTOM NAV
   ============================================================ */

function BottomNav({ tab, setTab }) {
  const items = [
    { key: "home", icon: HomeIcon, label: "Home" },
    { key: "flights", icon: Plane, label: "Flights" },
    { key: "itinerary", icon: Calendar, label: "Itinerary" },
    { key: "hotels", icon: HotelIcon, label: "Hotels" },
  ];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(246,243,236,0.92)",
        backdropFilter: "blur(10px)",
        borderTop: `1px solid ${COLORS.line}`,
        display: "flex",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", width: "100%", maxWidth: 460 }}>
        {items.map((it) => {
          const Icon = it.icon;
          const active = tab === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setTab(it.key)}
              style={{
                flex: 1,
                padding: "12px 0 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                color: active ? COLORS.navy : COLORS.inkSoft,
              }}
            >
              <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontSize: 10.5, letterSpacing: 0.3 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */

function CoupleTripApp() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [trip, setTrip] = useState(DEFAULT_TRIP);
  const [flights, setFlights] = useState(SEED_FLIGHTS);
  const [docs, setDocs] = useState([]);
  const [itinerary, setItinerary] = useState(SEED_ITINERARY);
  const [hotels, setHotels] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [t, f, d, i, h] = await Promise.all([
        loadKey("trip-config", DEFAULT_TRIP),
        loadKey("flights", SEED_FLIGHTS),
        loadKey("documents", []),
        loadKey("itinerary", SEED_ITINERARY),
        loadKey("hotels", []),
      ]);
      setTrip(t);
      setFlights(f);
      setDocs(d);
      setItinerary(i);
      setHotels(h);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) saveKey("trip-config", trip); }, [trip, loaded]);
  useEffect(() => { if (loaded) saveKey("flights", flights); }, [flights, loaded]);
  useEffect(() => { if (loaded) saveKey("documents", docs); }, [docs, loaded]);
  useEffect(() => { if (loaded) saveKey("itinerary", itinerary); }, [itinerary, loaded]);
  useEffect(() => { if (loaded) saveKey("hotels", hotels); }, [hotels, loaded]);

  const nextFlight = nextUpcomingFlight(flights);

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: '"PingFang TC","Microsoft JhengHei",-apple-system,BlinkMacSystemFont,sans-serif' }}>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "20px 18px 100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: COLORS.inkSoft }}>{trip.tripName?.toUpperCase()}</div>
          <Heart size={14} color={COLORS.rose} fill={COLORS.rose} />
        </div>

        {tab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CountdownHero trip={trip} onOpenSettings={() => setSettingsOpen(true)} />
            {nextFlight && <FlightMiniCard flight={nextFlight} onClick={() => setTab("flights")} />}
            <JourneyTimeline trip={trip} flights={flights} />
          </div>
        )}

        {tab === "flights" && <FlightsScreen flights={flights} setFlights={setFlights} docs={docs} setDocs={setDocs} />}
        {tab === "itinerary" && <ItineraryScreen items={itinerary} setItems={setItinerary} />}
        {tab === "hotels" && <HotelsScreen hotels={hotels} setHotels={setHotels} />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
      <TripSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} trip={trip} setTrip={setTrip} />
    </div>
  );
}

/* ---------- mount ---------- */
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(React.createElement(CoupleTripApp));
