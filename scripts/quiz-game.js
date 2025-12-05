// quiz-game.js
// Et enkelt flervalgsspill/quiz som bruker arrays, løkker og funksjoner.
// Spørsmål lagres i en array, score holdes som variabel, og highscore i localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const quizContainer = document.getElementById('quizContainer');
  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const nextBtn = document.getElementById('nextQuestion');
  const scoreEl = document.getElementById('quizScore');
  const storageKey = 'nzQuizHighscore';

  const questions = [
    { q: 'Hva heter hovedstaden i New Zealand?', a: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'], correct: 1 },
    { q: 'Hva kalles New Zealand på maori?', a: ['Aotearoa', 'Te Ika-a-Maui', 'Whanganui', 'Arahura'], correct: 0 },
    { q: 'Hvilket dyr er et symbol i New Zealand?', a: ['Kenguru', 'Kea', 'Pingvin', 'Koala'], correct: 1 },
    { q: 'Hvilken øy er størst i New Zealand?', a: ['South Island', 'Stewart Island', 'North Island', 'Chatham Island'], correct: 0 },
    { q: 'Hva er en populær aktivitet i Rotorua?', a: ['Ski', 'Geotermiske opplevelser', 'Surfing i stor skala', 'Safari'], correct: 1 }
  ];

  let current = 0;
  let score = 0;
  let answered = false;

  function loadHighscore() {
    const raw = localStorage.getItem(storageKey);
    return raw ? parseInt(raw, 10) : 0;
  }

  function saveHighscore(value) {
    const currentHigh = loadHighscore();
    if (value > currentHigh) {
      localStorage.setItem(storageKey, String(value));
    }
  }

  function renderQuestion() {
    answered = false;
    scoreEl.textContent = `Poeng: ${score}`;
    const item = questions[current];
    questionEl.textContent = item.q;
    answersEl.innerHTML = '';

    item.a.forEach((ans, idx) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = ans;
      btn.setAttribute('data-index', idx);
      btn.addEventListener('click', () => handleAnswer(idx));
      answersEl.appendChild(btn);
    });
  }

  function handleAnswer(idx) {
    if (answered) return;
    answered = true;
    const correct = questions[current].correct;
    const buttons = answersEl.querySelectorAll('button');
    buttons.forEach((b) => b.disabled = true);
    if (idx === correct) {
      score += 1;
      buttons[idx].classList.add('correct');
    } else {
      buttons[idx].classList.add('wrong');
      buttons[correct].classList.add('correct');
    }
    scoreEl.textContent = `Poeng: ${score}`;
    saveHighscore(score);
  }

  nextBtn.addEventListener('click', () => {
    if (!answered) {
      alert('Velg et svar først.');
      return;
    }
    current += 1;
    if (current >= questions.length) {
      // ferdig
      alert(`Quiz ferdig! Du fikk ${score} av ${questions.length}. Highscore: ${loadHighscore()}`);
      current = 0;
      score = 0;
    }
    renderQuestion();
  });

  if (quizContainer) renderQuestion();
});
