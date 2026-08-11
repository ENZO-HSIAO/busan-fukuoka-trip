const routes = {};
let currentCleanup = null;

export function registerRoute(name, renderFn) {
  routes[name] = renderFn;
}

function parseHash() {
  const hash = window.location.hash || '#/home';
  const path = hash.replace(/^#\//, '').split('?')[0];
  return path.split('/')[0] || 'home';
}

async function render() {
  const routeName = parseHash();
  const view = document.getElementById('view');
  const fn = routes[routeName] || routes['home'];

  document.querySelectorAll('.bottomnav__item').forEach((el) => {
    el.classList.toggle('active', el.dataset.route === routeName);
  });

  if (typeof currentCleanup === 'function') {
    try { currentCleanup(); } catch (e) { /* noop */ }
    currentCleanup = null;
  }

  view.innerHTML = '<div class="empty">Loading…</div>';
  window.scrollTo(0, 0);
  const cleanup = await fn(view);
  if (typeof cleanup === 'function') currentCleanup = cleanup;
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  render();
}

export function navigate(path) {
  window.location.hash = path;
}
