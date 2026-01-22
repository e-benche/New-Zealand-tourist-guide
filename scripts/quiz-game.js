
import { playClick, playCorrect, playWrong, playSound } from './sound.js';

document.addEventListener('DOMContentLoaded', () => {
  const questions = [
    { question: 'Hva er hovedstaden i New Zealand?', answers: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'], correct: 1 },
    { question: 'Hva kalles New Zealands urbefolkning?', answers: ['Aboriginer', 'Māori', 'Inuit', 'Samoanere'], correct: 1 },
    { question: 'Hvilket land ligger nærmest New Zealand?', answers: ['Australia', 'Fiji', 'Chile', 'Japan'], correct: 0 },
    { question: 'Hva heter den høyeste fjelltoppen i New Zealand?', answers: ['Mount Cook (Aoraki)', 'Mount Taranaki', 'Mt Ruapehu', 'Mt Aspiring'], correct: 0 },
    { question: 'Hvilken kjent fjord ligger i Sørøya?', answers: ['Milford Sound', 'Doubtful Sound', 'Kingstown Sound', 'Queenstown Sound'], correct: 0 }
  ];

  let current = 0;
  let score = 0;
  let started = false;

  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const scoreEl = document.getElementById('quizScore');
  const nextBtn = document.getElementById('nextQuestion');
  const startBtn = document.getElementById('startQuiz');
  const progressBar = document.querySelector('.progress-bar');
  const timerEl = document.getElementById('quizTimer');
  const resultEl = document.getElementById('quizResult');

  // Fullskjerms video-overgang (lav score)
  const lowScoreOverlay = document.getElementById('lowScoreVideoOverlay');
  const lowScoreVideo = document.getElementById('lowScoreVideo');
  const lowScoreIframe = document.getElementById('lowScoreVideoIframe');
  const lowScoreSound = document.getElementById('lowScoreVideoSound');
  const lowScoreSkip = document.getElementById('lowScoreVideoSkip');
  const lowScoreMessage = document.getElementById('lowScoreVideoMessage');
  let previousBodyOverflow = '';
  let activeOverlaySrc = '';
  let activeOverlayIsYouTube = false;

  // AI GENERERT FOR GØY
  function getLowScoreVideoSrc() {
    const fromOverlay = lowScoreOverlay?.dataset?.videoSrc;
    if (fromOverlay) return fromOverlay;

    const videoSourceEl = document.querySelector('#video video source');
    const fromSection = videoSourceEl?.getAttribute('src');
    return fromSection || '';
  }

  function getPerfectScoreVideoSrc() {
    return lowScoreOverlay?.dataset?.perfectVideoSrc || '';
  }

  function toAutoplaySrc(src, { muted = true } = {}) {
    if (!src) return '';

    // YouTube
    try {
      const u = new URL(src, document.baseURI);
      const host = u.hostname.replace(/^www\./, '');

      let youtubeId = '';
      if (host === 'youtube.com' || host === 'm.youtube.com') {
        // https://www.youtube.com/watch?v=...
        if (u.pathname === '/watch') youtubeId = u.searchParams.get('v') || '';
        // https://www.youtube.com/embed/ID
        if (u.pathname.startsWith('/embed/')) youtubeId = u.pathname.split('/embed/')[1] || '';
      }
      if (host === 'youtu.be') {
        // https://youtu.be/ID
        youtubeId = u.pathname.replace(/^\//, '');
      }

      if (youtubeId) {
        const embed = new URL(`https://www.youtube-nocookie.com/embed/${youtubeId}`);
        embed.searchParams.set('autoplay', '1');
        embed.searchParams.set('mute', muted ? '1' : '0');
        embed.searchParams.set('controls', '1');
        embed.searchParams.set('rel', '0');
        embed.searchParams.set('playsinline', '1');
        return embed.href;
      }

      // Lokal/vanlig URL (mp4 osv)
      return u.href;
    } catch {
      return src;
    }
  }

  function hideLowScoreVideoTransition() {
    if (!lowScoreOverlay) return;
    if (lowScoreVideo) {
      lowScoreVideo.pause();
      lowScoreVideo.removeAttribute('src');
      lowScoreVideo.load();
      lowScoreVideo.hidden = true;
    }
    if (lowScoreIframe) {
      lowScoreIframe.src = '';
      lowScoreIframe.hidden = true;
    }
    lowScoreOverlay.classList.remove('is-active');
    lowScoreOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;
    if (lowScoreMessage) lowScoreMessage.hidden = true;
  }

  function showLowScoreVideoTransition(srcOverride = '') {
    if (!lowScoreOverlay) return;

    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    lowScoreOverlay.classList.add('is-active');
    lowScoreOverlay.setAttribute('aria-hidden', 'false');

    const src = srcOverride || getLowScoreVideoSrc();
    if (!src) {
      if (lowScoreMessage) lowScoreMessage.hidden = false;
      return;
    }

    const autoplaySrc = toAutoplaySrc(src, { muted: true });
    const isYouTube = /youtube\.com|youtu\.be|youtube-nocookie\.com/.test(autoplaySrc);
    activeOverlaySrc = src;
    activeOverlayIsYouTube = isYouTube;

    // Bytt mellom iframe (YouTube) og video (lokal fil)
    if (isYouTube && lowScoreIframe) {
      if (lowScoreVideo) lowScoreVideo.hidden = true;
      lowScoreIframe.hidden = false;
      lowScoreIframe.src = autoplaySrc;
      return;
    }

    if (!lowScoreVideo) {
      if (lowScoreMessage) lowScoreMessage.hidden = false;
      return;
    }

    if (lowScoreIframe) {
      lowScoreIframe.src = '';
      lowScoreIframe.hidden = true;
    }

    lowScoreVideo.hidden = false;
    const resolvedSrc = new URL(autoplaySrc, document.baseURI).href;
    if (lowScoreVideo.src !== resolvedSrc) lowScoreVideo.src = resolvedSrc;

    lowScoreVideo.currentTime = 0;
    lowScoreVideo.muted = true;

    lowScoreVideo.play().catch(() => {
      // Autoplay kan bli blokkert på noen enheter/nettlesere
      lowScoreVideo.controls = true;
      if (lowScoreMessage) lowScoreMessage.hidden = false;
    });
  }

  if (lowScoreSkip) {
    lowScoreSkip.addEventListener('click', hideLowScoreVideoTransition);
  }
  if (lowScoreSound) {
    lowScoreSound.addEventListener('click', () => {
      if (!lowScoreOverlay?.classList.contains('is-active')) return;

      // YouTube: restart med lyd (uten mute) etter brukerklikk
      if (activeOverlayIsYouTube && lowScoreIframe && activeOverlaySrc) {
        lowScoreIframe.src = toAutoplaySrc(activeOverlaySrc, { muted: false });
        return;
      }

      // Lokal video: unmute og spill videre
      if (lowScoreVideo) {
        lowScoreVideo.muted = false;
        lowScoreVideo.volume = 1;
        lowScoreVideo.controls = true;
        lowScoreVideo.play().catch(() => {});
      }
    });
  }
  if (lowScoreOverlay) {
    lowScoreOverlay.addEventListener('click', (e) => {
      // Klikk utenfor selve videoen lukker
      if (e.target === lowScoreOverlay) hideLowScoreVideoTransition();
    });
  }
  if (lowScoreVideo) {
    lowScoreVideo.addEventListener('ended', hideLowScoreVideoTransition);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideLowScoreVideoTransition();
  });
// AI GENERERT FOR GØY

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
    if (scoreEl) scoreEl.textContent = `Poeng: ${score} | Beste: ${high}`;
    if (timerEl) timerEl.textContent = `Tid: ${timeLeft}s`;
    if (progressBar) progressBar.style.width = `${Math.round((current / questions.length) * 100)}%`;
  }

  function showQuestion() {
    const q = questions[current];
    questionEl.textContent = `${current + 1}. ${q.question}`;

    answersEl.innerHTML = '';

    const shuffled = [...q.answers].sort(() => Math.random() - 0.5);
    shuffled.forEach((a, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn btn';
      btn.textContent = a;
      btn.dataset.index = q.answers.indexOf(a);
      btn.type = 'button';
      btn.addEventListener('click', selectAnswer);
      btn.setAttribute('aria-pressed', 'false');
      answersEl.appendChild(btn);
    });

    // Oppdater knapptekst
    nextBtn.textContent = 'Neste';
    nextBtn.disabled = true;

    // Start timer for spørsmålet (bare hvis quizen er startet)
    if (started) startTimer();
  }

  // LYDER M. MODULES
  function selectAnswer(e) {
    playClick();

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

    // Oppdater score + lyd
    if (selectedIndex === q.correct) {
      score += 1;
      playCorrect();
    } else {
      playWrong();
    }
// LYDER M. MODULES

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

    // Vis resultat i result-element
    if (resultEl) {
      resultEl.hidden = false;
      resultEl.innerHTML = `<p>Du fikk ${score} av ${questions.length} poeng.</p>`;
    } else {
      questionEl.textContent = 'Resultat';
      answersEl.innerHTML = `<p>Du fikk ${score} av ${questions.length} poeng.</p>`;
    }

    // Oppdater best-score hvis aktuelt
    const best = loadHighScore();
    if (score > best) {
      saveHighScore(score);
      if (resultEl) resultEl.innerHTML += `<p>Ny beste score! 🎉</p>`;
      else answersEl.innerHTML += `<p>Ny beste score! 🎉</p>`;
    }

    // Spill av en egen lyd hvis scoren er under 2
    if (score < 2) {
      // Filen må ligge i mappa "soundeffects/" (sound.js legger på riktig base-URL)
      playSound('five-nights-at-freddys-full-scream-sound_2.mp3', { volume: 0.8 });

      // Video-overgang ved lav score
      showLowScoreVideoTransition();
    }

    if (score === 5) {
      playSound('', { volume: 0.8 });

      // Video-overgang ved perfect score
      showLowScoreVideoTransition(getPerfectScoreVideoSrc());
    }

    nextBtn.textContent = 'Prøv igjen';
    nextBtn.disabled = false;
    updateScoreDisplay();
  }

  function restartQuiz() {
    // Stopp eventuell timer
    clearInterval(timerInterval);
    timerInterval = null;

    hideLowScoreVideoTransition();

    current = 0;
    score = 0;
    if (resultEl) resultEl.hidden = true;
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

  // Start-knapp: initierer quizen og starter tiden
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      started = true;
      startBtn.hidden = true;
      restartQuiz();
    });
  }

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
    playWrong();
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

  // Initialisering — vis intro og vent på Start
  updateScoreDisplay();
  questionEl.textContent = 'Trykk "Start quiz" for å begynne.';
  answersEl.innerHTML = '';
  nextBtn.disabled = true;
  if (startBtn) startBtn.hidden = false;
  if (resultEl) resultEl.hidden = true;
  if (progressBar) progressBar.style.width = '0%';
});