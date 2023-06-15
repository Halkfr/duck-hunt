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

import { Duck } from '/actors.js'
import { Hunter } from '/actors.js'

const countProps = () => {
    // background.png size 1265x769
    const kWidth = window.innerWidth / 1265, kHeight = window.innerHeight / 769, k = kHeight < kWidth ? kHeight : kWidth
    const duckLeft = parseInt(window.innerWidth) * 0.48 + 'px'
    const duckTop = Math.round(window.innerHeight / 2 + (769 * k) * 0.25) + 'px'
    const duckWidth = Math.round(k * 70) + 'px'
    const duckMoveArea = { height: Math.round(window.innerHeight * 0.5), width: Math.round(window.innerWidth * 0.95) }
    const hunterLeft = parseInt(window.innerWidth) / 3 + 'px'
    const hunterTop = Math.round(window.innerHeight / 2 + (769 * k) * 0.1) + 'px'
    const hunterWidth = Math.round(k * 150) + 'px'
    const hunterMoveArea = { leftX: Math.round(window.innerWidth * 0.0005), rightX: Math.round(window.innerWidth * 0.84) }
    return { duck: { top: duckTop, left: duckLeft, width: duckWidth, moveArea: duckMoveArea }, hunter: { top: hunterTop, left: hunterLeft, width: hunterWidth, moveArea: hunterMoveArea } }
}


function startLevel() {
    let props = countProps()
    console.log(props.duck.top)
    const duck = new Duck('duck-left-up.gif', 7, props.duck.left, props.duck.top, props.duck.width, props.duck.moveArea)
    const hunter = new Hunter('hunter-right.png', 15, props.hunter.left, props.hunter.top, props.hunter.width, props.hunter.moveArea)

    return [duck, hunter]
}

export let actors = startLevel()

// console.log(duck.getImg)

// duck.getImg.addEventListener("change", (event) => {
//     console.log('duck changed')
//     if (duck.getAlive == false) addKilledDuckToHitInterface()
// });

// function addKilledDuckToHitInterface() {
//     const hitDucks = document.body.querySelectorAll('.hit-duck')
//     const hitElement = document.body.querySelector('#hit')
//     hitElement.removeChild(hitDucks[hitDucks.length - 1])
// }

onresize = () => {
    // console.log('resize')
    props = countProps()
    duck.resize(props.duck.moveArea, props.duck.width)
    hunter.resize(props.hunter.moveArea, props.hunter.width, props.hunter.top)
};