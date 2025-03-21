const tg = window.Telegram.WebApp;
tg.BackButton.show();
tg.BackButton.onClick(() => {
    tg.close();
});
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
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}&type=video`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log("Найдено видео:", videoUrl);

        loadYouTubeAudio(videoId);
    } else {
        console.error("Видео не найдено");
    }
}

function loadYouTubeAudio(videoId) {
    const audioPlayer = document.getElementById("audio");
    audioPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId}`;
}

// Вызываем поиск при загрузке страницы
fetchYouTubeVideo();

document.getElementById("searchBtn").addEventListener("click", () => {
    const userQuery = document.getElementById("search").value;
    if (userQuery) {
        fetchYouTubeVideo(userQuery);
    }
});

function showLoading() {
    document.getElementById("searchBtn").textContent = "⏳ Поиск...";
}

function hideLoading() {
    document.getElementById("searchBtn").textContent = "🔍 Найти";
}

document.getElementById("searchBtn").addEventListener("click", () => {
    const userQuery = document.getElementById("search").value;
    if (userQuery) {
        showLoading();
        fetchYouTubeVideo(userQuery).then(hideLoading);
    }
});

async function fetchYouTubeVideo(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log("Найдено видео:", videoUrl);

        const thumbnail = data.items[0].snippet.thumbnails.high.url;
        document.getElementById("cover-image").src = thumbnail;

        loadYouTubeAudio(videoId);
    } else {
        console.error("Видео не найдено");
    }
}

let playlist = [];
let currentTrackIndex = 0;

async function fetchPlaylist(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=5`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.items.length > 0) {
        playlist = data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url
        }));

        currentTrackIndex = 0;
        loadTrack(currentTrackIndex);
    }
}

function loadTrack(index) {
    const track = playlist[index];
    document.getElementById("cover-image").src = track.thumbnail;
    document.getElementById("track-name").textContent = track.title;
    loadYouTubeAudio(track.videoId);
}

document.getElementById("next").addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
});

document.getElementById("prev").addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
});

const audioPlayer = document.getElementById("audio");

audioPlayer.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
});

async function loadYouTubeAudio(videoId) {
    const mp3Url = `https://api.ytmp3.cc/v1/convert?url=https://www.youtube.com/watch?v=${videoId}`;

    try {
        const response = await fetch(mp3Url);
        const data = await response.json();

        if (data.status === "ok") {
            audioPlayer.src = data.link;
            audioPlayer.play();
        } else {
            console.error("Ошибка при конвертации", data);
        }
    } catch (error) {
        console.error("Ошибка загрузки MP3:", error);
    }
}

let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: "",
        playerVars: {
            autoplay: 0, // Отключаем автозапуск
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
        },
        events: {
            onReady: () => {
                isPlayerReady = true;
            onStateChange: onPlayerStateChange,
        },
    });
}
document.getElementById("play-button").addEventListener("click", () => {
    if (isPlayerReady) {
        player.playVideo();
        document.getElementById("play-button").style.display = "none"; // Скрываем кнопку после запуска
    }
});

function loadYouTubeAudio(videoId) {
    if (event.data === YT.PlayerState.ENDED) {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
    }
};
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
    }
}

// Загружаем первый трек
loadTrack(currentTrack);
