import { Duck } from '/actors.js'
import { Hunter } from '/actors.js'

const countProps = () => {
    // background.png size 1265x769
    const kWidth = window.innerWidth / 1265, kHeight = window.innerHeight / 769, k = kHeight < kWidth ? kHeight : kWidth
    const duckWidth = Math.round(k * 70) + 'px'
    const duckMoveArea = { height: Math.round(window.innerHeight * 0.5), width: Math.round(window.innerWidth * 0.95) }
    const hunterTop = Math.round(window.innerHeight / 2 + (769 * k) * 0.1) + 'px'
    const hunterWidth = Math.round(k * 150) + 'px'
    const hunterMoveArea = { leftX: Math.round(window.innerWidth * 0.0005), rightX: Math.round(window.innerWidth * 0.84) }
    return { duck: { width: duckWidth, moveArea: duckMoveArea }, hunter: { top: hunterTop, width: hunterWidth, moveArea: hunterMoveArea } }
}

let props = countProps()
const duck = new Duck('duck-left-up.png', 10, props.duck.width, props.duck.moveArea)
const hunter = new Hunter('hunter-right.png', 15, parseInt(window.innerWidth) / 3 + 'px', props.hunter.top, props.hunter.width, props.hunter.moveArea)

onresize = () => {
    // console.log('resize')
    props = countProps()
    duck.resize(props.duck.moveArea, props.duck.width)
    hunter.resize(props.hunter.moveArea, props.hunter.width, props.hunter.top)
};