const songs = [
  { title: "Song 1", src: "public/audio/flora fades - liminal spaces.mp3" },
  { title: "Song 2", src: "public/audio/flora fades - moth girl angel heart (demo).wav" },
  { title: "Song 3", src: "public/audio/flora fades - golden peripheral (demo ii).mp3" },
];

let currentIndex = 0;
const audio = new Audio();
const marquee = document.getElementById("marquee");
const playPauseBtn = document.getElementById("play-pause-btn");
const playPauseIcon = playPauseBtn.querySelector(".button-icon");
const progressBar = document.getElementById("progress-bar");
const timeDisplay = document.getElementById("time-display");

function updateMarquee(index) {
  marquee.textContent = songs[index].title;
}

function updateTimeDisplay() {
  const currentTime = Math.floor(audio.currentTime);
  const duration = Math.floor(audio.duration) || 0;
  
  const currentMin = Math.floor(currentTime / 60);
  const currentSec = currentTime % 60;
  const durationMin = Math.floor(duration / 60);
  const durationSec = duration % 60;
  
  timeDisplay.textContent = `${currentMin}:${currentSec.toString().padStart(2, '0')} / ${durationMin}:${durationSec.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
}

function loadSong(index) {
  audio.src = songs[index].src;
  updateMarquee(index);
  audio.load();
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play().then(() => {
      playPauseIcon.textContent = "⏸";
      console.log(`Playing: ${songs[currentIndex].title}`);
    }).catch((error) => {
      console.error("Playback error:", error);
    });
  } else {
    audio.pause();
    playPauseIcon.textContent = "▶";
  }
}

function nextSong() {
  const wasPlaying = !audio.paused;
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  
  if (wasPlaying) {
    audio.play().then(() => {
      playPauseIcon.textContent = "⏸";
    }).catch((error) => {
      console.error("Playback error:", error);
    });
  }
}

function prevSong() {
  const wasPlaying = !audio.paused;
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  
  if (wasPlaying) {
    audio.play().then(() => {
      playPauseIcon.textContent = "⏸";
    }).catch((error) => {
      console.error("Playback error:", error);
    });
  }
}

// Button wiring
playPauseBtn.addEventListener("click", togglePlayPause);
document.getElementById("next-btn").addEventListener("click", nextSong);
document.getElementById("prev-btn").addEventListener("click", prevSong);

// Progress bar seek
progressBar.addEventListener("input", (e) => {
  const seekTime = (e.target.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Audio event listeners
audio.addEventListener("timeupdate", () => {
  updateProgressBar();
  updateTimeDisplay();
});

audio.addEventListener("loadedmetadata", () => {
  updateTimeDisplay();
});

audio.addEventListener("ended", () => {
  nextSong();
});

// Load first song on startup (but don't play)
loadSong(currentIndex);