function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

class Timer {
    constructor() {
        this.timer = document.querySelector("#timer")
        this.elapsedTime = 0
        this.pauseTime = 0
        this.time = { secs: 0, mins: 0 }
        this.intervalId = setInterval(this.#updateTime, 1000);

        this.startTime = Date.now() - this.elapsedTime
    }

    pauseTimer = () => {
        this.pauseTime = Date.now()
        clearInterval(this.intervalId)
    }


    continueTimer = () => {
        let timeDifference = Date.now() - this.pauseTime
        this.startTime += timeDifference
        this.intervalId = setInterval(this.#updateTime, 100)
    }

    resetTimer = () => {
        this.elapsedTime = 0
        this.pauseTime = 0
        this.time = { secs: 0, mins: 0 }
        clearInterval(this.intervalId)
        this.intervalId = setInterval(this.#updateTime, 1000);

        this.startTime = Date.now() - this.elapsedTime

        this.#updateTime()
    }

    #updateTime = () => {
        this.elapsedTime = Date.now() - this.startTime

        this.time.secs = Math.floor(this.elapsedTime / 1000 % 60)
        this.time.mins = Math.floor(this.elapsedTime / (1000 * 60) % 60)

        this.time.secs = format(this.time.secs)
        this.time.mins = format(this.time.mins)
        this.timer.textContent = `${this.time.mins}:${this.time.secs}`

        function format(unit) {
            return (("0") + unit).length > 2 ? unit : "0" + unit
        }
    }
}

import { actors } from "./engine.js"

const overlay = document.body.querySelector('#overlay')
const menu = document.body.querySelector('#menu')
const continueButton = menu.querySelector('#continue-button')
const restartButton = menu.querySelector('#restart-button')

export const timer = new Timer()

window.onload = function startingMenu() {
    pauseActors()
    timer.pauseTimer()
}

let gameMode = "Classic"

document.onkeydown = (event) => {
    let startMenu = document.body.querySelector('#start-menu')
    if (!startMenu.classList.contains("hidden")) {
        let a = document.getElementById("arrow-container").children[0]
        let b = document.getElementById("arrow-container").children[1]

        if (event.key === "ArrowUp") {
            a.classList = "arrow"
            b.classList = "arrow-hidden"
            gameMode = "Classic"
        }
        //to to remove after adding angry birds game mode
        // if (event.key === "ArrowDown") {
        //     b.classList = "arrow"
        //     a.classList = "arrow-hidden"
        //     gameMode = "Angry Birds"
        // }
        if (event.key === "Enter") {
            startMenu.classList.add("hidden")
            console.log(gameMode)
            continueGame()
        }
    }
}

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
    timer.continueTimer()
    continueActors()
}

function pauseGame() {
    openMenu()
    timer.pauseTimer()
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

import { manageGame } from '/engine.js'

restartButton.addEventListener('click', () => {
    closeMenu()
    timer.resetTimer()
    manageGame()
})

function closeMenu() {
    overlay.classList.add('hidden')
    menu.classList.add('hidden')
}

function openMenu() {
    overlay.classList.remove('hidden')
    menu.classList.remove('hidden')
}

