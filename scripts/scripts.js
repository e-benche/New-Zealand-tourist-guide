// scripts.js - ekstern JavaScript for nettstedet

document.addEventListener('DOMContentLoaded', () => {
  console.log('scripts.js loaded');

  const btn = document.getElementById('demoBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.textContent = 'Takk for at du klikket!';
      }
      alert('Knappen ble klikket!');
    });
  }
});
