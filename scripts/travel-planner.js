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

  // Foreslår aktiviteter basert på dager og budsjett
  function suggestActivities(days, budget) {
    const activities = [
      { name: 'Fjellvandring', minDays: 1, minBudget: 200 },
      { name: 'Kayaking/Båt-tur', minDays: 1, minBudget: 500 },
      { name: 'Geotermiske kilder', minDays: 1, minBudget: 300 },
      { name: 'Stranddag', minDays: 1, minBudget: 0 },
      { name: 'Vinsmaking', minDays: 1, minBudget: 1000 },
      { name: 'Kultur & museum', minDays: 1, minBudget: 200 },
      { name: 'Fjellklatring', minDays: 3, minBudget: 1500 },
      { name: 'Stjernekikking', minDays: 1, minBudget: 50 },
      { name: 'Campingtur', minDays: 2, minBudget: 500 }
    ];

    const suggestions = [];

    // Anbefal aktiviteter som passer budget og dager
    for (let i = 0; i < activities.length && suggestions.length < 4; i++) {
      if (days >= activities[i].minDays && budget >= activities[i].minBudget) {
        suggestions.push(activities[i].name);
      }
    }

    // Hvis ingen aktiviteter passet, legg til en standard
    if (suggestions.length === 0) {
      suggestions.push('Naturopplevelse', 'Fotografi', 'Avslapping');
    }

    return suggestions.slice(0, 4); // Maks 4 forslag
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
