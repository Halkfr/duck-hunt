import { actors } from "./engine.js"

const overlay = document.body.querySelector('#overlay')
const menu = document.body.querySelector('#menu')
const continueButton = menu.querySelector('#continue-button')
const restartButton = menu.querySelector('#restart-button')

const timer = document.querySelector("#timer")
let elapsedTime = 0
let currentTime = 0
let pauseTime = 0
let time = { secs: 0, mins: 0 }
let intervalId = setInterval(updateTime, 1000)

let startTime = Date.now() - elapsedTime

// menu open/close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (menu.classList.contains('hidden')) {
            pauseGame()
        }
        else {
            continueGame()
        }
    }
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

function pauseTimer() {
    pauseTime = Date.now()
    clearInterval(intervalId)
}

function continueTimer() {
    pauseTime = Date.now() - pauseTime
    startTime += pauseTime
    intervalId = setInterval(updateTime, 100)
}

function resetTimer() {
    elapsedTime = 0
    currentTime = 0
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