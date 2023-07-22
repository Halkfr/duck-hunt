async function preloadImages() {
    const preloadImage = (src) => {
        var img = new Image()
        img.src = src
    }

    preloadImage('./sprites/background-duck-escape.png')

    preloadImage('./sprites/duck/duck-down.gif')
    preloadImage('./sprites/duck/duck-fly-away.gif')
    preloadImage('./sprites/duck/duck-hit.png')
    preloadImage('./sprites/duck/duck-left-up.gif')
    preloadImage('./sprites/duck/duck-left.gif')
    preloadImage('./sprites/duck/duck-right-up.gif')
    preloadImage('./sprites/duck/duck-right.gif')

    preloadImage('./sprites/duck-brown/duck-down.gif')
    preloadImage('./sprites/duck-brown/duck-fly-away.gif')
    preloadImage('./sprites/duck-brown/duck-hit.png')
    preloadImage('./sprites/duck-brown/duck-left-up.gif')
    preloadImage('./sprites/duck-brown/duck-left.gif')
    preloadImage('./sprites/duck-brown/duck-right-up.gif')
    preloadImage('./sprites/duck-brown/duck-right.gif')
}

preloadImages()

const startMenu = document.body.querySelector('#start-menu')
const modalMenu = document.body.querySelector('#menu')

export let bulletsCount = 3

function fillInterfaceElements() {
    createBullets(bulletsCount)
    const hitElement = document.body.querySelector('#hit')
    hitElement.innerHTML = ''
    for (let i = 0; i < 10; i++) {
        const element = createElement('./sprites/interface/hit-duck-inactive.png', 'hit-duck-' + i, 'hit-duck')
        hitElement.appendChild(element)
    }
}

function createBullets(n) {
    const shotElement = document.body.querySelector('#shot')
    shotElement.innerHTML = ''
    for (let i = 1; i <= n; i++) {
        const element = createElement('./sprites/interface/bullet.png', 'bullet-' + i, 'bullet')
        shotElement.appendChild(element)
    }
}

function createElement(src, id, classes) {
    const img = document.createElement('img')
    img.src = src
    img.setAttribute('id', id)
    classes.split(' ').forEach(c => {
        img.classList.add(c)
    });

    return img
}

export function isGameOver() {
    let bool = false, hit = document.getElementById("hit")
    const duckDownElements = hit.querySelectorAll('#duck-killed')
    if (duckDownElements.length >= 3) {
        bool = true
    }
    return bool
}

function gameOver() {
    let gameOverElement = document.createElement("div")
    gameOverElement.id = "game-over"
    gameOverElement.classList.add("game-center-text")
    gameOverElement.innerText = "game over"
    document.body.appendChild(gameOverElement)

    document.getElementById("round-text").classList.add("hidden")

}

import { clearScore } from './menu.js'

export function loadDefaultGame() {
    bulletsCount = 3
    clearScore()

    document.getElementById("game-over").remove()
    document.getElementById("round-text").classList.remove("hidden")
    document.getElementById("round-text").innerText = 1
    document.getElementById('start-menu').classList.remove("hidden")

    manageGame()
    timer.pauseTimer()
}

const countProps = () => {
    // background.png size 1265x769
    const kWidth = window.innerWidth / 1265, kHeight = window.innerHeight / 769, k = kHeight < kWidth ? kHeight : kWidth
    const duckLeft = Math.round(parseInt(window.innerWidth) * 0.48) + 'px'
    const duckTop = Math.round(window.innerHeight / 2 + (769 * k) * 0.25) + 'px'
    const duckWidth = Math.round(k * 70) + 'px'
    const duckMoveArea = { height: Math.round(window.innerHeight * 0.5), width: Math.round(window.innerWidth * 0.95) }
    const hunterLeft = Math.round(parseInt(window.innerWidth) / 3) + 'px'
    const hunterTop = Math.round(window.innerHeight / 2 + (769 * k) * 0.1) + 'px'
    const hunterWidth = Math.round(k * 150) + 'px'
    const hunterMoveArea = { leftX: Math.round(window.innerWidth * 0.0005), rightX: Math.round(window.innerWidth * 0.84) }
    return { duck: { top: duckTop, left: duckLeft, width: duckWidth, moveArea: duckMoveArea }, hunter: { top: hunterTop, left: hunterLeft, width: hunterWidth, moveArea: hunterMoveArea } }
}

import { Duck, Hunter } from '/actors.js'

export let actors = []

export async function manageGame() {
    let ducksReleased = 0, ducksBatchSize = 0
    fillInterfaceElements()
    deleteActors()
    timer.resetTimer()

    while (ducksReleased <= 10 && !isGameOver()) {

        if (startMenu.classList.contains("hidden") && modalMenu.classList.contains("hidden")) {

            if (document.querySelectorAll('#duck').length == 0) {
                ducksBatchSize = getRandomInt(3) + 1

                bulletsCount = 3
                createBullets(bulletsCount)

                if (ducksReleased === 10) {
                    fillInterfaceElements()
                    ducksReleased = 0
                    setRoundText()
                }
                if (ducksBatchSize <= 10 - ducksReleased) {
                    createDucksBanch(ducksBatchSize)
                }
                else {
                    createDucksBanch(10 - ducksReleased)
                }
            }
        }

        const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        await sleep(1000)

        if (isGameOver()) {
            gameOver()
            // if button menu not open
            setTimeout(() => {
                loadDefaultGame()
            }, 5 * 60 * 10)
        }
    }

    return new Promise((resolve, reject) => {
        resolve('Level finished');
    });

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function createDucksBanch(n) {
        setDefaultBackground()
        deleteActors()
        const props = countProps()

        const createGreenDuck = () => {
            return new Duck('duck/', 'duck-left-up.gif', 7, props.duck.left, props.duck.top, props.duck.width, props.duck.moveArea)
        }

        const createBrownDuck = () => {
            return new Duck('duck-brown/', 'duck-left-up.gif', 7, props.duck.left, props.duck.top, props.duck.width, props.duck.moveArea)
        }

        const createHunter = () => {
            return new Hunter('hunter-right.png', 15, props.hunter.left, props.hunter.top, props.hunter.width, props.hunter.moveArea)
        }

        let isBrownDuck = getRandomInt(2)

        if (isBrownDuck == 1) {
            actors.push(createBrownDuck())
        }

        for (let i = 0; i < n - isBrownDuck; i++) {
            actors.push(createGreenDuck())
        }

        ducksReleased += n
    }

    function setRoundText() {
        const round = document.querySelector('#round-text')
        round.innerHTML = Number(round.innerHTML) + 1
        console.log('inner html', round.innerHTML)
    }
}

manageGame()

import { timer } from './menu.js'

function setDefaultBackground() {
    document.getElementById("background-default").classList.remove("hidden")
    document.getElementById("background-duck-escape").classList.add("hidden")
    document.getElementById("bg-top").style.backgroundColor = "#33ccff"

    document.getElementById("round-text").style.color = 'rgb(133, 222, 252)'
}

function setReleaseBackground() {
    document.getElementById("background-default").classList.add("hidden")
    document.getElementById("background-duck-escape").classList.remove("hidden")
    document.getElementById("bg-top").style.backgroundColor = "#ffcccc"

    document.getElementById("round-text").style.color = 'rgb(255, 222, 222)'
}

document.querySelector("#grass").addEventListener("mousedown", bulletsLeft);

const targetNode = document.body;

const config = {
    childList: true,
    subtree: true,
};

const observer = new MutationObserver(function (mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeName === 'SPAN') {
                    node.addEventListener("mousedown", bulletsLeft)
                }
            });
        }
    }
});

observer.observe(targetNode, config);

setInterval(areDucksEscaping, 100)

function areDucksEscaping() {
    actors.forEach(actor => {
        if (actor.constructor.name == 'Duck') {
            if (actor.escape && !isGameOver()) {
                setReleaseBackground()
            }
        }
    });
}

function bulletsLeft() {
    if (modalMenu.classList.contains("hidden") && startMenu.classList.contains("hidden")) {
        if (bulletsCount > 0) {
            document.getElementById("bullet-" + (bulletsCount)).remove();
            bulletsCount--

            if (bulletsCount === 0) {
                console.log("no bullets")
                var divElement = document.createElement('div');
                divElement.innerHTML = 0;
                divElement.id = 'bullets-left';
                document.querySelector("#shot").appendChild(divElement);
                if (!isAnyDuckAlive()) {
                    releaseDucks()
                }
            }
        }
    }

    function isAnyDuckAlive() {
        let bool = true
        actors.forEach(actor => {
            if (actor.constructor.name == 'Duck') {
                if (actor.alive) {
                    console.log("some ducks are alive")
                    bool = false
                }
            }
        });
        return bool
    }

    function releaseDucks() {
        actors.forEach(actor => {
            if (actor.constructor.name == 'Duck') {
                console.log('release duck')
                actor.release()
            }
        });
    }
}

function deleteActors() {
    deleteSpritesAndHitboxes()
    actors = []

    function deleteSpritesAndHitboxes() {
        const deleteSprites = () => {
            let sprites = document.querySelectorAll('.sprite')
            sprites.forEach(sprite => {
                sprite.remove()
            });
        }

        const deleteHitboxes = () => {
            let duckHitboxes = document.querySelectorAll('.hitbox')
            duckHitboxes.forEach(hitbox => {
                hitbox.remove()
            });
        }

        deleteSprites()
        deleteHitboxes()
    }
}

onresize = () => {
    // console.log('resize')
    let props = countProps()
    console.log(props)
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].constructor == "Duck") {
            actors[i].resize(props.duck.moveArea, props.duck.width, props.duck.top)
        } else {
            actors[i].resize(props.hunter.moveArea, props.hunter.width, props.hunter.top)
        }
    }
};