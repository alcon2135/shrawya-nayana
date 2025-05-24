// Audio Element
const audio = document.getElementById("audio-player");

// Controls
const playBtn = document.querySelector(".play-button");
const forwardBtn = document.querySelector(".forward-button");
const backwardBtn = document.querySelector(".backward-button");
const volumeLow = document.querySelector(".volume-low");
const volumeHigh = document.querySelector(".volume-high");

// Timeline Elements
const seeker = document.getElementById("seeker");
const timeline = document.getElementById("timeline");

// Volume Elements
const volumeBar = document.getElementById("volume-bar");
const volumeDot = document.getElementById("volume-dot");


// Load book details from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const bookData = JSON.parse(localStorage.getItem('selectedBook'));

  if (bookData) {
    // Update book info dynamically
    document.querySelector(".book-cover").src = bookData.cover;
    document.querySelector(".text-wrapper").innerHTML = bookData.title + "<br><br>";
    document.querySelector(".span").textContent = "By: " + bookData.author;
    audio.src = bookData.audio;

    // Autoplay if needed
    audio.play();
    isPlaying = true;
    playBtn.src = "assets/player/pause 1.png";
  }

  // Set default volume position
  currentVolumeStep = VOLUME_STEPS;
  updateVolume();
});


const VOLUME_STEPS = 10; // Number of volume steps (10 spots)
let currentVolumeStep = 5; // Start in the middle (volume = 0.5)

let isPlaying = false;

// ------------------------
// PLAY / PAUSE FUNCTION
// ------------------------
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playBtn.src = "assets/player/play 1.png"; // Change to play icon
  } else {
    audio.play();
    isPlaying = true;
    playBtn.src = "assets/player/pause 1.png"; // Change to pause icon
  }
});

// ------------------------
// FORWARD / BACKWARD SEEK
// ------------------------
forwardBtn.addEventListener("click", () => {
  audio.currentTime += 10;
});

backwardBtn.addEventListener("click", () => {
  audio.currentTime -= 10;
});

// ------------------------
// VOLUME BUTTONS (Increase/Decrease)
// ------------------------
volumeLow.addEventListener("click", () => {
  if (currentVolumeStep > 0) {
    currentVolumeStep--;
    updateVolume();
  }
});

volumeHigh.addEventListener("click", () => {
  if (currentVolumeStep < VOLUME_STEPS) {
    currentVolumeStep++;
    updateVolume();
  }
});

// ------------------------
// UPDATE VOLUME BASED ON THE CURRENT STEP
// ------------------------
function updateVolume() {
  // Calculate the volume as a decimal between 0 and 1 based on the current step
  const volume = currentVolumeStep / VOLUME_STEPS;
  audio.volume = volume;

  // Move the volume dot to the correct position
  moveVolumeDot(volume);
}

// ------------------------
// DOT POSITIONING FOR VOLUME (Responsive)
// ------------------------
function moveVolumeDot(volumePercent) {
  const barWidth = volumeBar.offsetWidth;
  const dotWidth = volumeDot.offsetWidth;

  const dotX = volumePercent * barWidth - (dotWidth / 2);

  const barLeft = volumeBar.getBoundingClientRect().left;
  const parentLeft = volumeDot.parentElement.getBoundingClientRect().left;
  const offsetLeft = barLeft - parentLeft;

  volumeDot.style.left = `${dotX + offsetLeft}px`;
}

// ------------------------
// VOLUME BAR - CLICK TO SET
// ------------------------
volumeBar.addEventListener("click", (e) => {
  const barRect = volumeBar.getBoundingClientRect();
  const clickX = e.clientX - barRect.left; // Get the click position relative to the bar
  const percent = clickX / barRect.width; // Calculate the percentage of the volume bar clicked

  // Set the volume based on the clicked position
  audio.volume = percent;

  // Update the current volume step based on the percentage
  currentVolumeStep = Math.round(percent * VOLUME_STEPS);

  // Update the volume dot position
  moveVolumeDot(percent);
});

// ------------------------
// TIMELINE - UPDATE SEEKER
// ------------------------
function updateSeekerPosition() {
  if (!audio.duration) return;

  const timelineWidth = timeline.offsetWidth;
  const progress = audio.currentTime / audio.duration;
  const seekerX = progress * timelineWidth - (seeker.offsetWidth / 2);

  seeker.style.position = "absolute";
  seeker.style.left = `${seekerX + timeline.offsetLeft}px`;
}

audio.addEventListener("timeupdate", updateSeekerPosition);

// ------------------------
// TIMELINE - CLICK TO SEEK
// ------------------------
timeline.addEventListener("click", (e) => {
  const rect = timeline.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = clickX / rect.width;
  audio.currentTime = percent * audio.duration;
});

// ------------------------
// INITIALIZE DOT POSITION
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  currentVolumeStep = VOLUME_STEPS;
  updateVolume(); // Set the volume and update the volume dot
});

// ------------------------
// RESIZE HANDLING (for mobile and responsive design)
// ------------------------
window.addEventListener('resize', () => {
  updateVolume(); // Recalculate and update the volume dot position on window resize
});
