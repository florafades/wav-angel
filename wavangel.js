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

// character-cell marquee: like a hardware dot-matrix display, the text
// never moves — the string itself rotates one character per tick, so
// every frame is a static, pixel-crisp render
const MARQUEE_TICK_MS = 250;
let marqueeText = "";
let marqueeOffset = 0;
let marqueeCols = 1;

// how many character cells fit across the marquee viewport,
// using the average glyph width of the loaded font
function measureMarqueeCols() {
  const probe = document.createElement("span");
  probe.style.visibility = "hidden";
  probe.style.whiteSpace = "pre";
  probe.textContent = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
  marquee.parentElement.appendChild(probe);
  const avgCharWidth = probe.offsetWidth / probe.textContent.length;
  probe.remove();
  return Math.max(1, Math.floor(marquee.parentElement.clientWidth / avgCharWidth));
}

function renderMarquee() {
  // no right-hand bound: the cell's overflow:hidden crops the right edge
  // pixel-exactly, so the text truly spans the full cell width
  marquee.textContent = marqueeText.slice(marqueeOffset);
}

function updateMarquee(index) {
  marqueeCols = measureMarqueeCols();
  // lead-in spaces cover the cell, so the title enters at the right edge
  marqueeText = " ".repeat(marqueeCols + 1) + songs[index].title;
  marqueeOffset = 0;
  renderMarquee();
}

setInterval(() => {
  marqueeOffset += 1;
  // past the end = title fully exited left; restart with the next
  // pass's first char already at the right edge
  if (marqueeOffset > marqueeText.length) {
    marqueeOffset = 1;
  }
  renderMarquee();
}, MARQUEE_TICK_MS);

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

// re-measure the marquee once the pixel font has actually loaded
document.fonts.ready.then(() => updateMarquee(currentIndex));

// re-measure when the flexible player width changes, so the lead-in
// padding always matches the current cell width
new ResizeObserver(() => updateMarquee(currentIndex))
  .observe(marquee.parentElement);