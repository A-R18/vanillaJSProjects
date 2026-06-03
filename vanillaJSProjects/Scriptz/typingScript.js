// File made for writing a script for typing webpage.

window.addEventListener("load", init);

// avaiable levels:
const levels = {
  easy: 4,
  medium: 2,
  hard: 1,
};

let currentLevel = levels.medium;

// declaring and initializing the globals:
let time = currentLevel;
let score = 0;
let isPlaying;

// DOM Elements:

const wordInput = document.getElementById("typing-text");
const currentWord = document.getElementById("current-word");
const scoreDisplay = document.getElementById("total-score");
const timeDisplay = document.getElementById("time-left");
const message = document.getElementById("game-status");
const seconds = document.getElementById("seconds-time");

// Array of random numbers:

const words = [
  "absquatulate",
  "acquiesce",
  "affix",
  "aphorize",
  "axolotl",
  "azure",
  "brouhaha",
  "buffalo",
  "chiaroscurist",
  "chthonic",
  "claque",
  "coquettish",
  "cyclops",
  "czar",
  "dactylography",
  "daiquiri",
  "dizzying",
  "eczema",
  "effervescent",
  "exorcize",
  "flummox",
  "gazebo",
  "gizmo",
  "gnocchi",
  "grizzled",
  "haphazard",
  "hyperbolic",
  "hypoxia",
  "icebox",
  "ivory",
  "jackrabbit",
  "jiujitsu",
  "juxtapose",
  "kaleidoscope",
  "klutz",
  "knapsack",
  "larynx",
  "lightbox",
  "lymph",
  "mnemonic",
  "myrrh",
  "narthex",
  "nixed",
  "obsequious",
  "oxbow",
  "oxygenize",
  "pax",
  "phyllo",
  "pizzazz",
  "quasar",
  "quixotic",
  "quokka",
  "quorum",
  "razzmatazz",
  "rendezvous",
  "rhythmic",
  "rickshaw",
  "sasquatch",
  "schizophrenic",
  "sphinx",
  "squelch",
  "squirrel",
  "swivel",
  "syzygy",
  "toxicology",
  "unbending",
  "unguent",
  "unix",
  "unzip",
  "vexatious",
  "vuvuzela",
  "whizzing",
  "whomever",
  "wizard",
  "wristwatch",
  "xenophobic",
  "xylophone",
  "yachtsman",
  "yippee",
  "yogurt",
  "zephyr",
  "zeppelin",
  "zigzag",
  "zodiac",
  "zombie",
  "zymurgy",
  "quizzical",
  "banjax",
  "jackknife",
  "buzzkill",
  "fizzing",
  "jaywalker",
  "jujube",
  "kickbox",
  "maximizing",
  "quacking",
  "kibbutz",
  "razorback",
  "shylock",
  "oxidizing",
];

// Initialize the game

function init() {
  // Show number of seconds in UI:
seconds.innerHTML = currentLevel;
  // Match the words in input field and current word:
  wordInput.addEventListener("input", startMatch);
  // Load word from array
  showWord(words);

  //Call countdown every second
  setInterval(countdown, 1000);

  // Check the status of the game whether it's over or not

  setInterval(checkStatus, 70);
}

// matches typed word with current word from array

function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    time = currentLevel + 1;
    showWord(words);
    wordInput.value = "";
    score++;
  }

  // If score is -1 display score as 0

  if (score === -1) {
    score.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
  scoreDisplay.innerHTML = score;
}

// The actual function written for matching the words from both sides:

function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = "Correct";
    return true;
  } else {
    message.innerHTML = "";
    return false;
  }
}

// Pick and show random word:
function showWord(words) {
  // generate a random array index for showing a random word to be typed
  let randIndex = Math.floor(Math.random() * words.length);

  console.log(randIndex);

  currentWord.innerHTML = words[randIndex];
}

function countdown() {
  if (time > 0) {
    // Time should be decreased / decrement should be applied
    time--;
  } else if (time === 0) {
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = ` ${time}`;
}

function checkStatus() {
  if (!isPlaying && time === 0) {
    message.innerHTML = "Game Over!";
    score = -1;
  }
}
