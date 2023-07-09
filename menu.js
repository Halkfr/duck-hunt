function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

import { actors } from "./engine.js"

const overlay = document.body.querySelector('#overlay')
const menu = document.body.querySelector('#menu')
const continueButton = menu.querySelector('#continue-button')
const restartButton = menu.querySelector('#restart-button')

window.onload = function startingMenu() {
    pauseActors()
    pauseTimer()
}

document.addEventListener("keypress", function (event) {
    if (actors[0].paused) {
        if (event.key === "Enter") {
            document.body.querySelector('#start-menu').classList.add("hidden")
            continueGame()
        }
    }
})

//window lost focus
window.addEventListener('blur', function () {
    pauseGame()
});

// menu open/close
document.addEventListener('keydown', debounce((e) => {
    if (e.key === 'Escape') {
        if (menu.classList.contains('hidden')) {
            pauseGame();
        } else {
            continueGame();
        }
    }
}, 200));

overlay.addEventListener('click', (e) => {
    continueGame()
})

function continueGame() {
    closeMenu()
    continueTimer()
    continueActors()
}

function pauseGame() {
    openMenu()
    pauseTimer()
    pauseActors()
}

function pauseActors() {
    actors.forEach(actor => {
        actor.pause()
    });
}

function continueActors() {
    actors.forEach(actor => {
        actor.continue()
    });
}

continueButton.addEventListener('click', () => {
    continueGame()
})

// start new game
restartButton.addEventListener('click', () => {
    closeMenu()
    resetTimer()
    // TODO: actors
})

function closeMenu() {
    overlay.classList.add('hidden')
    menu.classList.add('hidden')
}

function openMenu() {
    overlay.classList.remove('hidden')
    menu.classList.remove('hidden')
}

const timer = document.querySelector("#timer")
let elapsedTime = 0
let pauseTime = 0
let time = { secs: 0, mins: 0 }
let intervalId = setInterval(updateTime, 1000)

let startTime = Date.now() - elapsedTime

function pauseTimer() {
    pauseTime = Date.now()
    clearInterval(intervalId)
}

function continueTimer() {
    let timeDifference = Date.now() - pauseTime
    startTime += timeDifference
    intervalId = setInterval(updateTime, 100)
}

function resetTimer() {
    elapsedTime = 0
    pauseTime = 0
    time = { secs: 0, mins: 0 }
    intervalId = setInterval(updateTime, 1000)

    startTime = Date.now() - elapsedTime

    updateTime()
}

function updateTime() {
    elapsedTime = Date.now() - startTime

    time.secs = Math.floor(elapsedTime / 1000 % 60)
    time.mins = Math.floor(elapsedTime / (1000 * 60) % 60)

    time.secs = format(time.secs)
    time.mins = format(time.mins)
    timer.textContent = `${time.mins}:${time.secs}`

    function format(unit) {
        return (("0") + unit).length > 2 ? unit : "0" + unit
    }
}