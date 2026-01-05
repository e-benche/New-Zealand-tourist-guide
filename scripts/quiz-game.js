// quiz-game.js
// Quiz-spill med spørsmål, poeng og highscore-lagring
// Demonstrerer: arrays, løkker, variabler, funksjoner, DOM-manipulasjon, localStorage

document.addEventListener('DOMContentLoaded', () => {
  // HTML-elementer
  const quizContainer = document.getElementById('quizContainer');
  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const nextBtn = document.getElementById('nextQuestion');
  const scoreEl = document.getElementById('quizScore');
  const progressFill = document.getElementById('progressFill');
  const storageKey = 'nzQuizHighscore';

  // Quiz-spørsmål array
  const questions = [
    {
      q: 'Hva heter hovedstaden i New Zealand?',
      a: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'],
      correct: 1
    },
    {
      q: 'Hva kalles New Zealand på maori?',
      a: ['Aotearoa', 'Te Ika-a-Maui', 'Whanganui', 'Arahura'],
      correct: 0
    },
    {
      q: 'Hvilket dyr er et symbol for New Zealand?',
      a: ['Kenguru', 'Kea', 'Pingvin', 'Koala'],
      correct: 1
    },
    {
      q: 'Hvilken øy er størst i New Zealand?',
      a: ['South Island', 'Stewart Island', 'North Island', 'Chatham Island'],
      correct: 2
    },
    {
      q: 'Hva er Milford Sound kjent for?',
      a: ['Elver', 'Fjorder og fossefall', 'Ørkener', 'Vulkaner'],
      correct: 1
    },
    {
      q: 'Hvor ligger Mount Cook?',
      a: ['North Island', 'South Island', 'Stewart Island', 'Chatham Island'],
      correct: 1
    },
    {
      q: 'Hva kalles det maori-ordet for underjordisk kokeri?',
      a: ['Hangi', 'Hongi', 'Marae', 'Pakeha'],
      correct: 0
    },
    {
      q: 'Hvilken aktivitet er populær i Rotorua?',
      a: ['Ski', 'Geotermiske opplevelser', 'Surfing', 'Safari'],
      correct: 1
    }
  ];

  // Variabler for quiz-tilstand
  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  // Laster highscore fra localStorage
  function loadHighscore() {
    const raw = localStorage.getItem(storageKey);
    return raw ? parseInt(raw, 10) : 0;
  }

  // Lagrer highscore hvis det er høyere enn tidligere
  function saveHighscore(value) {
    const currentHigh = loadHighscore();
    if (value > currentHigh) {
      localStorage.setItem(storageKey, String(value));
    }
  }

  // Renderer gjeldende spørsmål og svaralternativer
  function renderQuestion() {
    answered = false;
    const item = questions[currentQuestion];

    // Oppdater poeng-display
    scoreEl.textContent = `Poeng: ${score}/${questions.length}`;

    // Oppdater progress-bar
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    if (progressFill) progressFill.style.width = progress + '%';

    // Vis spørsmål
    questionEl.textContent = item.q;

    // Rendr svaralternativer
    answersEl.innerHTML = '';
    item.a.forEach((ans, idx) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = ans;
      btn.setAttribute('data-index', idx);
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', () => handleAnswer(idx));
      answersEl.appendChild(btn);
    });

    // Oppdater knapp-tekst
    if (currentQuestion === questions.length - 1) {
      nextBtn.textContent = 'Se resultater';
    } else {
      nextBtn.textContent = 'Neste spørsmål';
    }
  }

  // Håndterer svar når bruker klikker
  function handleAnswer(selectedIdx) {
    if (answered) return; // Forhindrer dobbelt svar
    answered = true;

    const correct = questions[currentQuestion].correct;
    const buttons = answersEl.querySelectorAll('button');

    // Disable alle knapper
    buttons.forEach((b) => {
      b.disabled = true;
    });

    // Vis riktig/feil feedback
    if (selectedIdx === correct) {
      score += 1;
      buttons[selectedIdx].classList.add('correct');
    } else {
      buttons[selectedIdx].classList.add('wrong');
      buttons[correct].classList.add('correct');
    }

    // Oppdater display
    scoreEl.textContent = `Poeng: ${score}/${questions.length}`;
    saveHighscore(score);
  }

  // Håndterer neste-knapp
  nextBtn.addEventListener('click', () => {
    if (!answered) {
      alert('Vennligst velg et svar først.');
      return;
    }

    currentQuestion += 1;

    if (currentQuestion >= questions.length) {
      // Quiz ferdig - vis resultat
      const highscore = loadHighscore();
      const message = score === questions.length
        ? `🎉 Perfekt! Du fikk ${score}/${questions.length} poeng!`
        : `Du fikk ${score}/${questions.length} poeng. Highscore: ${highscore}`;
      
      alert(message);

      // Reset quiz
      currentQuestion = 0;
      score = 0;
    }

    renderQuestion();
  });

  // Start quiz ved lasting av side
  if (quizContainer) {
    renderQuestion();
  }
});
