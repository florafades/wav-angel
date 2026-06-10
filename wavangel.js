const songs = [
  { title: "Song 1", src: "public/audio/flora fades - liminal spaces.mp3" },
  { title: "Song 2", src: "public/audio/flora fades - moth girl angel heart (demo).wav" },
  { title: "Song 3", src: "public/audio/flora fades - golden peripheral (demo ii).mp3" },
];

let currentIndex = 0;
const audio = new Audio();
const playPauseBtn = document.getElementById("play-pause-btn");
const playPauseIcon = playPauseBtn.querySelector(".btn-icon");
const marquee = document.getElementById("marquee");
const timeDisplay = document.getElementById("time-display");
const progressBar = document.getElementById("progress-bar");

function updateMarquee(index) {
  marquee.textContent = songs[index].title;
}

function updateTimeDisplay() {
  const currentTime = Math.floor(audio.currentTime);

  const currentMin = Math.floor(currentTime / 60);
  const currentSec = currentTime % 60;

  timeDisplay.textContent = `${currentMin.toString().padStart(2, '0')}:${currentSec.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.setProperty("--progress", `${pct}%`);
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
      playPauseIcon.src = "pause.png";
      console.log(`Playing: ${songs[currentIndex].title}`);
    }).catch((error) => {
      console.error("Playback error:", error);
    });
  } else {
    audio.pause();
    playPauseIcon.src = "play.png";
  }
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);

  // always start playback, even from a paused state
  audio.play().then(() => {
    playPauseIcon.src = "pause.png";
  }).catch((error) => {
    console.error("Playback error:", error);
  });
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);

  // always start playback, even from a paused state
  audio.play().then(() => {
    playPauseIcon.src = "pause.png";
  }).catch((error) => {
    console.error("Playback error:", error);
  });
}

// Button wiring
playPauseBtn.addEventListener("click", togglePlayPause);
document.getElementById("next-btn").addEventListener("click", nextSong);
document.getElementById("prev-btn").addEventListener("click", prevSong);

// Progress bar seek: click or drag anywhere on the track
function seekFromPointer(e) {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  audio.currentTime = ratio * audio.duration;
  updateProgressBar();
}

progressBar.addEventListener("pointerdown", (e) => {
  progressBar.setPointerCapture(e.pointerId);
  seekFromPointer(e);
});

progressBar.addEventListener("pointermove", (e) => {
  if (progressBar.hasPointerCapture(e.pointerId)) {
    seekFromPointer(e);
  }
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