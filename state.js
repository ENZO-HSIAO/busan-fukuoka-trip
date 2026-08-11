import { DB, uid, deleteFile } from './db.js';

// ---------- Trip config ----------
const DEFAULT_CONFIG = {
  key: 'trip',
  meetingCity: 'Busan, Korea',
  meetingDate: '2026-11-15',   // edit in Settings
  tripStartDate: '2026-11-13', // edit in Settings
  tripEndDate: '2026-11-20',   // edit in Settings
  homeCityMe: 'Taipei',
  homeCityPartner: 'Sendai',
};

export async function getConfig() {
  const cfg = await DB.get('config', 'trip');
  return cfg || DEFAULT_CONFIG;
}

export async function saveConfig(partial) {
  const current = await getConfig();
  const next = { ...current, ...partial, key: 'trip' };
  await DB.put('config', next);
  return next;
}

// ---------- Generic CRUD ----------
async function listAll(store) {
  const items = await DB.getAll(store);
  return items;
}

export const Flights = {
  list: () => listAll('flights'),
  get: (id) => DB.get('flights', id),
  async save(data) {
    const id = data.id || uid();
    const record = { ...data, id };
    await DB.put('flights', record);
    return record;
  },
  async remove(id) {
    const rec = await DB.get('flights', id);
    if (rec?.pdfId) await deleteFile(rec.pdfId);
    await DB.delete('flights', id);
  },
};

export const Hotels = {
  list: () => listAll('hotels'),
  get: (id) => DB.get('hotels', id),
  async save(data) {
    const id = data.id || uid();
    const record = { ...data, id };
    await DB.put('hotels', record);
    return record;
  },
  async remove(id) {
    const rec = await DB.get('hotels', id);
    if (rec?.pdfId) await deleteFile(rec.pdfId);
    if (rec?.photoIds) for (const pid of rec.photoIds) await deleteFile(pid);
    await DB.delete('hotels', id);
  },
};

export const Itinerary = {
  list: () => listAll('itinerary'),
  get: (id) => DB.get('itinerary', id),
  async save(data) {
    const id = data.id || uid();
    const record = { ...data, id };
    await DB.put('itinerary', record);
    return record;
  },
  async remove(id) {
    const rec = await DB.get('itinerary', id);
    if (rec?.photoIds) for (const pid of rec.photoIds) await deleteFile(pid);
    await DB.delete('itinerary', id);
  },
};

// ---------- One-time seed of clearly-marked placeholder/demo data ----------
// This only runs once (guarded by config.seeded). Everything created here has
// isPlaceholder: true so it's visually flagged in the UI and can be deleted
// like any normal record.
export async function seedPlaceholderDataOnce() {
  const cfg = await getConfig();
  if (cfg.seeded) return;

  await Flights.save({
    id: uid(), isPlaceholder: true, owner: 'me',
    airline: 'Tigerair', flightNumber: 'IT234',
    depDate: '2026-11-14', depTime: '07:30', depAirport: 'TPE',
    arrDate: '2026-11-14', arrTime: '09:20', arrAirport: 'PUS',
    confirmation: 'ABCDEF', seat: '', notes: '這是測試資料，請替換成真實航班',
  });
  await Flights.save({
    id: uid(), isPlaceholder: true, owner: 'partner',
    airline: 'Peach', flightNumber: 'MM620',
    depDate: '2026-11-14', depTime: '10:10', depAirport: 'SDJ',
    arrDate: '2026-11-14', arrTime: '12:05', arrAirport: 'PUS',
    confirmation: 'GHIJKL', seat: '', notes: '這是測試資料，請替換成真實航班',
  });
  await Flights.save({
    id: uid(), isPlaceholder: true, owner: 'together',
    airline: 'Air Busan', flightNumber: 'BX122',
    depDate: '2026-11-17', depTime: '11:00', depAirport: 'PUS',
    arrDate: '2026-11-17', arrTime: '12:15', arrAirport: 'FUK',
    confirmation: 'MNOPQR', seat: '12A / 12B', notes: '這是測試資料，請替換成真實航班',
  });

  await Hotels.save({
    id: uid(), isPlaceholder: true,
    name: '釜山測試飯店', city: 'Busan', address: 'Haeundae-gu, Busan',
    checkinDate: '2026-11-14', checkinTime: '15:00',
    checkoutDate: '2026-11-17', checkoutTime: '11:00',
    bookingNumber: 'HTL-0001', roomType: 'Double', notes: '這是測試資料，請替換成真實飯店',
    mapsUrl: '', lat: '', lng: '',
  });

  await Itinerary.save({
    id: uid(), isPlaceholder: true,
    date: '2026-11-14', startTime: '15:30', endTime: '17:00',
    title: '飯店 Check-in', place: '釜山測試飯店', address: 'Haeundae-gu, Busan',
    notes: '這是測試資料，可刪除或編輯', mapsUrl: '', lat: '', lng: '', photoIds: [],
  });
  await Itinerary.save({
    id: uid(), isPlaceholder: true,
    date: '2026-11-15', startTime: '14:00', endTime: '17:00',
    title: '海雲台', place: 'Haeundae Beach', address: 'Haeundae Beach, Busan',
    notes: '看夕陽（測試資料）', mapsUrl: '', lat: 35.1587, lng: 129.1604, photoIds: [],
  });

  await saveConfig({ seeded: true });
}

export async function clearAllPlaceholderData() {
  for (const f of await Flights.list()) if (f.isPlaceholder) await Flights.remove(f.id);
  for (const h of await Hotels.list()) if (h.isPlaceholder) await Hotels.remove(h.id);
  for (const i of await Itinerary.list()) if (i.isPlaceholder) await Itinerary.remove(i.id);
}
