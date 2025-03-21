const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем Web App

const tracks = [
    { name: "Трек 1", src: "track1.mp3", cover: "cover1.jpg" },
    { name: "Трек 2", src: "track2.mp3", cover: "cover2.jpg" },
    { name: "Трек 3", src: "track3.mp3", cover: "cover3.jpg" }
];

let currentTrack = 0;

const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progressBar = document.getElementById("progress-bar");
const trackName = document.getElementById("track-name");
const coverImage = document.getElementById("cover-image");

// Функция загрузки трека
function loadTrack(index) {
    let track = tracks[index];
    audio.src = track.src;
    trackName.textContent = track.name;
    coverImage.src = track.cover;
}

playButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playButton.textContent = "⏸";
    } else {
        audio.pause();
        playButton.textContent = "▶️";
    }
});

// Переключение треков
prevButton.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playButton.textContent = "⏸";
});

nextButton.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playButton.textContent = "⏸";
});

// Обновление прогресс-бара
audio.addEventListener("timeupdate", () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
});

// Автоматическая смена темы
function applyTheme() {
    const theme = tg.colorScheme; // Получаем тему Telegram
    if (theme === "dark") {
        document.body.style.background = "#121212";
        document.body.style.color = "white";
    } else {
        document.body.style.background = "white";
        document.body.style.color = "black";
    }
}

tg.onEvent("themeChanged", applyTheme);
applyTheme();

const API_KEY = "AIzaSyAfPUTsUK8qfz-ROO6PIXih7eN2K0MqREk"; // Вставь сюда API-ключ
const searchQuery = "Imagine Dragons Believer"; // Здесь можно вставлять динамический запрос

async function fetchYouTubeVideo() {
    const url = https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}&type=video;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        const videoUrl = https://www.youtube.com/watch?v=${videoId};
        console.log("Найдено видео:", videoUrl);

        loadYouTubeAudio(videoId);
    } else {
        console.error("Видео не найдено");
    }
}

function loadYouTubeAudio(videoId) {
    const audioPlayer = document.getElementById("audio");
    audioPlayer.src = https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId};
}

// Вызываем поиск при загрузке страницы
fetchYouTubeVideo();

// Загружаем первый трек
loadTrack(currentTrack);
