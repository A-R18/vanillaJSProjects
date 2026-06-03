const time = document.getElementById("time"),
  greeting = document.getElementById("greeting"),
  name = document.getElementById("name"),
  focus = document.getElementById("focus"),
  ShowamPM = true;

// Showing the time:
function showTime() {
  let day = new Date(),
    hour = day.getHours(),
    minutes = day.getMinutes(),
    seconds = day.getSeconds();
  hour = hour + 10;
  // For setting AM or PM:
  const amOrPm = hour >= 12 ? "PM" : "AM";

  // 12hours format
  hour = hour % 12 || 12;

  // Output Time
  time.innerHTML = `${hour} <span>:</span>${addZeros(minutes)}<span>:</span>${addZeros(seconds)} ${ShowamPM ? amOrPm : ""}`;

  setTimeout(showTime, 1000);
}

// A function for adding zeros:

function addZeros(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

// Set Background and Greeting
function setBgGrt() {
  let day = new Date(),
    hour = day.getHours();
  if (hour >= 6 && hour < 12) {
    document.body.style.backgroundImage = `url(/img/morning.jpg)`;
    greeting.textContent = `Good Morning`;
  } else if (hour >= 12 && hour < 18) {
    document.body.style.backgroundImage = `url(/img/pexels-kool.jpg)`;
    greeting.textContent = `Good Afternoon`;
    document.body.style.color = `white`;
  } else if (hour >= 18 && hour < 21) {
    document.body.style.backgroundImage = `url(/img/Evening.jpg)`;
    greeting.textContent = `Good Evening`;
  } else {
    document.body.style.backgroundImage = `url(/img/Night.jpg)`;
    greeting.textContent = `Good Night`;
    document.body.style.color = `white`;
  }
}
// Getting name

function getName() {
  if (localStorage.getItem("name") === null) {
    name.textContent = "{Enter your name Please}";
  } else {
    name.textContent = localStorage.getItem("name");
  }
}

// Set Name
function setName(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("name", e.target.innerText);
      name.blur();
    }
  } else {
    localStorage.setItem("name", e.target.innerText);
  }
}

// Getting the focus

function getFocus() {
  if (localStorage.getItem("focus") === null) {
    focus.textContent = "Enter Focus";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

// Set Name
function setFocus(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("focus", e.target.innerText);
      focus.blur();
    }
  } else {
    localStorage.setItem("focus", e.target.innerText);
  }
}

name.addEventListener("blur", setName);
name.addEventListener("keypress", setName);
focus.addEventListener("blur", getFocus);
focus.addEventListener("keypress", setFocus);

// For running
showTime();
setBgGrt();
getName();
getFocus();
setFocus();
