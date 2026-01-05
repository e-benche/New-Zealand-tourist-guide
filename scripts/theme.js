// theme.js
// Enkel tema-veksler som lagrer valg i localStorage og bytter klasse på body.

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  const storageKey = 'siteTheme';

  function applyTheme(theme) {
    document.body.classList.remove('theme-light','theme-dark');
    document.body.classList.add(`theme-${theme}`);
    if (toggle) toggle.textContent = theme === 'dark' ? 'Lys modus' : 'Mørk modus';
  }

  function loadTheme() {
    return localStorage.getItem(storageKey) || 'light';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = loadTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });
  }

  // Bruk lagret tema ved last
  applyTheme(loadTheme());
});
