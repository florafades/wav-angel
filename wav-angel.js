const songs = [
  { title: "Song 1", src: "public/audio/flora fades - liminal spaces.mp3" },
  { title: "Song 2", src: "public/audio/flora fades - moth girl angel heart (demo).wav" },
  { title: "Song 3", src: "public/audio/flora fades - golden peripheral (demo ii).mp3" },
];

let currentIndex = 0;
const audio = new Audio();
const marquee = document.getElementById("marquee");

function updateMarquee(index) {
  marquee.textContent = songs[index].title;
}

function loadSong(index) {
  audio.src = songs[index].src;
  updateMarquee(index);
}

function playSong() {
  audio.play();
  console.log(`Playing: ${songs[currentIndex].title}`);
}

function pauseSong() {
  audio.pause();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function shuffleSong() {
  currentIndex = Math.floor(Math.random() * songs.length);
  loadSong(currentIndex);
  playSong();
}

function toggleLoop() {
  audio.loop = !audio.loop;
}

// Button wiring
document.getElementById("play-btn").addEventListener("click", playSong);
document.getElementById("pause-btn").addEventListener("click", pauseSong);
document.getElementById("next-btn").addEventListener("click", nextSong);
document.getElementById("shuffle-btn").addEventListener("click", shuffleSong);
document.getElementById("loop-btn").addEventListener("click", toggleLoop);

// Load first song on startup
loadSong(currentIndex);