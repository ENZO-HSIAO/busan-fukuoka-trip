import { registerRoute, startRouter } from './router.js';
import { renderHome } from './pages/home.js';
import { renderFlights } from './pages/flights.js';
import { renderItinerary } from './pages/itinerary.js';
import { renderHotels } from './pages/hotels.js';
import { renderTimeline } from './pages/timeline.js';
import { seedPlaceholderDataOnce } from './state.js';
import { openSettingsSheet } from './components/settingsSheet.js';

registerRoute('home', renderHome);
registerRoute('flights', renderFlights);
registerRoute('itinerary', renderItinerary);
registerRoute('hotels', renderHotels);
registerRoute('timeline', renderTimeline);

document.getElementById('settingsBtn').addEventListener('click', () => {
  openSettingsSheet(() => {
    // re-render current view after settings change
    window.dispatchEvent(new Event('hashchange'));
  });
});

async function boot() {
  try {
    await seedPlaceholderDataOnce();
  } catch (e) {
    console.error('Seeding placeholder data failed', e);
  }
  startRouter();
}

boot();
