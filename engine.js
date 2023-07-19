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

import { Duck } from '/actors.js'
import { Hunter } from '/actors.js'

export let actors = []

async function manageLevel() {
    let ducksReleased = 0, ducksBatchSize = 0

    while (ducksReleased <= 10) {

        console.log("ducksReleased: ", ducksReleased, "ducksBatchSize: ", ducksBatchSize)

        if (startMenu.classList.contains("hidden") && modalMenu.classList.contains("hidden")) {

            if (document.querySelectorAll('#duck').length == 0) {
                ducksBatchSize = getRandomInt(3) + 1

                console.log('ducks batch', ducksBatchSize)

                bulletsCount = 3
                createBullets(bulletsCount)

                console.log(bulletsCount)
                if (ducksReleased === 10) {
                    fillInterfaceElements()
                    ducksReleased = 0
                }
                if (ducksBatchSize <= 10 - ducksReleased) {
                    createDucksBanch(ducksBatchSize)
                    console.log('actors', actors)
                }
                else {
                    createDucksBanch(10 - ducksReleased)
                }
            }
        }

        const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        await sleep(1000)
    }

    return new Promise((resolve, reject) => {
        resolve('Level finished');
    });

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function createDucksBanch(n) {
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
}

import { resetTimer } from '/menu.js'

export async function manageGame() {
    deleteActors()
    resetTimer()
    while (true) {
        fillInterfaceElements()
        await manageLevel()
    }
}

manageGame()

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
                releaseDucks()
            }
        }
    }

    function releaseDucks() {
        actors.forEach(actor => {
            console.log('actor.constructor.name', actor.constructor.name)
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