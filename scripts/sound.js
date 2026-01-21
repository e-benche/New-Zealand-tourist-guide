const SOUNDEFFECTS_BASE_URL = new URL('../soundeffects/', import.meta.url);

export function playSound(filename, { volume = 0.7 } = {}) {
    const url = filename instanceof URL ? filename : new URL(filename, SOUNDEFFECTS_BASE_URL);
    const audio = new Audio(url.href);
    audio.volume = volume;

    // Spill av lyd (ignorerer evt. autoplay-feil i console)
    audio.play().catch(() => {});
    return audio;
}

export function playClick() {
    playSound('click-sound-432501.mp3', { volume: 0.5 });
}

export function playCorrect() {
    playSound('correct-choice-43861.mp3', { volume: 0.7 });
}

export function playWrong() {
    playSound('buzzer-or-wrong-answer-20582.mp3', { volume: 0.7 });
}