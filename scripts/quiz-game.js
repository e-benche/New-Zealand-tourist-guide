// Enkel multiple-choice quiz for "Quiz: Test dine NZ-kunnskaper"
// Funksjoner: vise spørsmål, velge svar, oppdatere poeng, vise resultat, lagre beste score

document.addEventListener('DOMContentLoaded', () => {
  const questions = [
    { question: 'Hva er hovedstaden i New Zealand?', answers: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'], correct: 1 },
    { question: 'Hva kalles New Zealands urbefolkning?', answers: ['Aboriginer', 'Māori', 'Inuit', 'Samoanere'], correct: 1 },
    { question: 'Hvilket land ligger nærmest New Zealand?', answers: ['Australia', 'Fiji', 'Chile', 'Japan'], correct: 0 },
    { question: 'Hva heter den høyeste fjelltoppen i New Zealand?', answers: ['Mount Cook (Aoraki)', 'Mount Taranaki', 'Mt Ruapehu', 'Mt Aspiring'], correct: 0 },
    { question: 'Hvilken kjent fjord ligger i Sørøya?', answers: ['Milford Sound', 'Doubtful Sound', 'Doubtless Sound', 'Queenstown Sound'], correct: 0 }
  ];

  let current = 0;
  let score = 0;

  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const scoreEl = document.getElementById('quizScore');
  const nextBtn = document.getElementById('nextQuestion');

  const HIGH_SCORE_KEY = 'nz_quiz_high_score';

  // Timer-innstillinger
  const TIME_PER_QUESTION = 15; // sekunder
  let timeLeft = TIME_PER_QUESTION;
  let timerInterval = null;

  function loadHighScore() {
    const v = localStorage.getItem(HIGH_SCORE_KEY);
    return v ? Number(v) : 0;
  }

  function saveHighScore(v) {
    localStorage.setItem(HIGH_SCORE_KEY, String(v));
  }

  function updateScoreDisplay() {
    const high = loadHighScore();
    scoreEl.textContent = `Poeng: ${score} | Beste: ${high} | Tid: ${timeLeft}s`;
  }

  function showQuestion() {
    const q = questions[current];
    questionEl.textContent = `${current + 1}. ${q.question}`;

    answersEl.innerHTML = '';

    q.answers.forEach((a, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn btn';
      btn.textContent = a;
      btn.dataset.index = i;
      btn.type = 'button';
      btn.addEventListener('click', selectAnswer);
      btn.setAttribute('aria-pressed', 'false');
      answersEl.appendChild(btn);
    });

    // Oppdater knapptekst
    nextBtn.textContent = 'Neste';
    nextBtn.disabled = true;

    // Start timer for spørsmålet
    startTimer();
  }

  function selectAnswer(e) {
    const selected = e.currentTarget;
    const selectedIndex = Number(selected.dataset.index);
    const q = questions[current];

    // Stopp timer
    clearInterval(timerInterval);
    timerInterval = null;

    // Deaktiver alle knapper
    Array.from(answersEl.querySelectorAll('button')).forEach(btn => {
      btn.disabled = true;
      btn.setAttribute('aria-pressed', 'true');
      const idx = Number(btn.dataset.index);
      if (idx === q.correct) {
        btn.classList.add('correct');
      }
      if (btn === selected && idx !== q.correct) {
        btn.classList.add('wrong');
      }
    });

    // Oppdater score
    if (selectedIndex === q.correct) {
      score += 1;
    }

    updateScoreDisplay();

    // Aktiver neste-knapp
    nextBtn.disabled = false;

    // Hvis det var siste spørsmål, gjør neste-knapp til "Fullfør"
    if (current === questions.length - 1) {
      nextBtn.textContent = 'Fullfør';
    }
  }

  function showResults() {
    // Stopp timer hvis aktiv
    clearInterval(timerInterval);
    timerInterval = null;

    questionEl.textContent = 'Resultat';
    answersEl.innerHTML = `<p>Du fikk ${score} av ${questions.length} poeng.</p>`;

    // Oppdater best-score hvis aktuelt
    const best = loadHighScore();
    if (score > best) {
      saveHighScore(score);
      answersEl.innerHTML += `<p>Ny beste score! 🎉</p>`;
    }

    nextBtn.textContent = 'Prøv igjen';
    nextBtn.disabled = false;
    updateScoreDisplay();
  }

  function restartQuiz() {
    // Stopp eventuell timer
    clearInterval(timerInterval);
    timerInterval = null;

    current = 0;
    score = 0;
    updateScoreDisplay();
    showQuestion();
  }

  nextBtn.addEventListener('click', () => {
    // Stopp timer før vi går videre
    clearInterval(timerInterval);
    timerInterval = null;

    if (current < questions.length - 1) {
      current += 1;
      showQuestion();
    } else if (nextBtn.textContent === 'Fullfør') {
      showResults();
    } else {
      // "Prøv igjen" eller etter resultat
      restartQuiz();
    }
  });

  // Timer-funksjoner
  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = TIME_PER_QUESTION;
    updateScoreDisplay();

    timerInterval = setInterval(() => {
      timeLeft -= 1;
      updateScoreDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        handleTimeOut();
      }
    }, 1000);
  }

  function handleTimeOut() {
    const q = questions[current];

    // Deaktiver knapper og marker riktig svar
    Array.from(answersEl.querySelectorAll('button')).forEach(btn => {
      btn.disabled = true;
      const idx = Number(btn.dataset.index);
      if (idx === q.correct) btn.classList.add('correct');
    });

    nextBtn.disabled = false;
    if (current === questions.length - 1) nextBtn.textContent = 'Fullfør';

    // Gå automatisk videre etter kort pause
    setTimeout(() => {
      if (current < questions.length - 1) {
        current += 1;
        showQuestion();
      } else {
        showResults();
      }
    }, 1500);
  }

  // Initialisering
  updateScoreDisplay();
  showQuestion();
});
