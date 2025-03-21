const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем Web App на весь экран

const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const progressBar = document.getElementById("progress-bar");

playButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playButton.textContent = "⏸";
    } else {
        audio.pause();
        playButton.textContent = "▶️";
    }
});

// Обновляем прогресс-бар
audio.addEventListener("timeupdate", () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
});
