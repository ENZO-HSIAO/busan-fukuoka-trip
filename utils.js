export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Parses 'YYYY-MM-DD' as a local date (avoids UTC off-by-one issues)
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysBetween(fromDate, toDate) {
  const MS = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(toDate) - startOfDay(fromDate)) / MS);
}

export function formatDateLong(dateStr) {
  const d = parseLocalDate(dateStr);
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y} / ${m} / ${day}`;
}

export function formatDateShort(dateStr) {
  const d = parseLocalDate(dateStr);
  if (!d) return '';
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m} / ${String(day).padStart(2, '0')}`;
}

export function formatDateHeading(dateStr) {
  const d = parseLocalDate(dateStr);
  if (!d) return '';
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = ['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getDay()];
  return { md: `${m} / ${String(day).padStart(2, '0')}`, weekday };
}

export function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function sortByDateTime(a, b, dateKey, timeKey) {
  const da = a[dateKey] || '';
  const db_ = b[dateKey] || '';
  if (da !== db_) return da < db_ ? -1 : 1;
  const ta = a[timeKey] || '';
  const tb = b[timeKey] || '';
  return ta < tb ? -1 : ta > tb ? 1 : 0;
}

export function googleMapsSearchUrl({ lat, lng, address, name }) {
  if (lat != null && lng != null && lat !== '' && lng !== '') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat + ',' + lng)}`;
  }
  const q = address || name || '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export const OWNER_LABELS = {
  me: '我',
  partner: '女友',
  together: '一起',
};

export const CITY_FLAGS = {
  'Taipei': '🇹🇼', '台北': '🇹🇼',
  'Sendai': '🇯🇵', '仙台': '🇯🇵',
  'Busan': '🇰🇷', '釜山': '🇰🇷',
  'Fukuoka': '🇯🇵', '福岡': '🇯🇵',
};
