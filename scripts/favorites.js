// favorites.js
// Holder styr på favoritter i galleriet ved bruk av en array og localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'nzFavorites';

  function loadFavs() {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  function saveFavs(arr) {
    localStorage.setItem(storageKey, JSON.stringify(arr));
  }

  function toggleFavorite(id) {
    const favs = loadFavs();
    const idx = favs.indexOf(id);
    if (idx === -1) {
      favs.push(id);
    } else {
      favs.splice(idx, 1);
    }
    saveFavs(favs);
    renderFavs();
    updateButtons();
  }

  function renderFavs() {
    const list = document.getElementById('favoritesList');
    if (!list) return;
    const favs = loadFavs();
    list.innerHTML = '';
    if (favs.length === 0) {
      list.innerHTML = '<p>Ingen favoritter lagret.</p>';
      return;
    }
    favs.forEach(id => {
      const li = document.createElement('li');
      li.textContent = id; // her bruker vi id som beskrivelse, eller kunne vært et tittel-attributt
      list.appendChild(li);
    });
  }

  function updateButtons() {
    const favs = loadFavs();
    document.querySelectorAll('.fav-btn').forEach(btn => {
      const id = btn.getAttribute('data-id');
      btn.setAttribute('aria-pressed', favs.indexOf(id) !== -1);
      btn.textContent = favs.indexOf(id) !== -1 ? '♥' : '♡';
    });
  }

  // Delegert event for galleri-knapper
  document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains('fav-btn')) {
      const id = target.getAttribute('data-id');
      toggleFavorite(id);
    }
  });

  renderFavs();
  updateButtons();
});
