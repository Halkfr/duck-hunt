const startMenu = document.body.querySelector('#start-menu')
const modalMenu = document.body.querySelector('#menu')

function fillInterfaceElements() {
    const shotElement = document.body.querySelector('#shot')
    for (let i = 0; i < 3; i++) {
        const element = createElement('./sprites/interface/bullet.png', 'bullet-' + i, 'bullet')
        shotElement.appendChild(element)
    }

    const hitElement = document.body.querySelector('#hit')
    for (let i = 0; i < 10; i++) {
        const element = createElement('./sprites/interface/hit-duck-inactive.png', 'hit-duck-' + i, 'hit-duck')
        hitElement.appendChild(element)
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
}

fillInterfaceElements()

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

    while (ducksReleased < 10) {
        if (startMenu.classList.contains("hidden") && modalMenu.classList.contains("hidden")) {

            if (document.querySelectorAll('#duck').length == 0) {
                ducksBatchSize = getRandomInt(3) + 1

                console.log('ducks batch', ducksBatchSize)
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
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function createDucksBanch(n) {
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

setTimeout(manageLevel, 1000)

console.log(actors)

document.querySelector("#grass").addEventListener("click", bulletsLeft);

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
                    node.addEventListener("click", bulletsLeft)
                }
            });
        }
    }
});

observer.observe(targetNode, config);

function bulletsLeft() {
    if (modalMenu.classList.contains("hidden") && startMenu.classList.contains("hidden")) {
        let bulletsLeftElement = document.getElementById("bullets-left");
        let bulletsLeft = bulletsLeftElement.innerHTML;

        if (bulletsLeft > 0) {
            bulletsLeftElement.innerHTML = Number(bulletsLeft) - 1;
            document.getElementById("bullet-" + (bulletsLeft - 1)).remove();

            if (bulletsLeftElement.innerHTML == 0) {
                bulletsLeftElement.classList.remove("hidden");
                // TODO: if no bullets all ducks fly away
            }
        }
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