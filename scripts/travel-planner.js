// travel-planner.js
// En enkel reiseplanlegger som tar input fra bruker, bruker variabler, løkker, funksjoner og arrays.
// Lagrer planer i localStorage under nøkkelen 'travelPlans'.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('plannerForm');
  const plansList = document.getElementById('plansList');
  const storageKey = 'travelPlans';

  function loadPlans() {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  function savePlans(plans) {
    localStorage.setItem(storageKey, JSON.stringify(plans));
  }

  function renderPlans() {
    const plans = loadPlans();
    plansList.innerHTML = '';
    if (plans.length === 0) {
      plansList.innerHTML = '<p>Ingen lagrede planer enda.</p>';
      return;
    }
    plans.forEach((p, idx) => {
      const li = document.createElement('li');
      li.className = 'plan-item';
      li.innerHTML = `<strong>${escapeHtml(p.destination)}</strong> — ${p.days} dager, budsjett: ${p.budget} NOK<br> Forslag: ${escapeHtml(p.suggestions.join(', '))}`;
      const del = document.createElement('button');
      del.textContent = 'Slett';
      del.addEventListener('click', () => {
        const updated = loadPlans();
        updated.splice(idx, 1);
        savePlans(updated);
        renderPlans();
      });
      li.appendChild(document.createTextNode(' '));
      li.appendChild(del);
      plansList.appendChild(li);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function suggestActivities(days, budget) {
    // Enkelt sett: en liste med mulige aktiviteter, vi velger noen avhengig av input
    const activities = ['Vandring', 'Båt-tur', 'Geotermisk park', 'Stranddag', 'Vinsmaking', 'Kultur- og museumsbesøk', 'Fjellklatring', 'Stjernekikking'];
    const suggestions = [];

    // Bruk enkle regler for å anbefale
    if (days <= 2) {
      suggestions.push('Kort tur / byvandring');
    }

    for (let i = 0; i < activities.length && suggestions.length < Math.min(3, activities.length); i++) {
      // Velg aktiviteter basert på budsjett og days
      if (budget < 1000 && (activities[i] === 'Vinsmaking' || activities[i] === 'Båt-tur')) continue;
      if (days >= 3 && activities[i] === 'Fjellklatring') suggestions.push(activities[i]);
      if (activities[i] === 'Stranddag' && budget >= 300) suggestions.push(activities[i]);
      if (suggestions.length < 3 && !suggestions.includes(activities[i])) suggestions.push(activities[i]);
    }

    return suggestions;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const destination = form.querySelector('#destination').value.trim();
      const days = parseInt(form.querySelector('#days').value, 10) || 1;
      const budget = parseInt(form.querySelector('#budget').value, 10) || 0;

      if (!destination) {
        alert('Vennligst fyll inn destinasjon.');
        return;
      }

      const suggestions = suggestActivities(days, budget);
      const plans = loadPlans();
      const plan = { destination, days, budget, suggestions, created: Date.now() };
      plans.push(plan);
      savePlans(plans);
      renderPlans();

      form.reset();
    });
  }

  renderPlans();
});
