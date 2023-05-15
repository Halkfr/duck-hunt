import { Duck } from '/actors.js'
import { Hunter } from '/actors.js'

const countProps = () => {
    // background.png size 1265x769
    const kWidth = window.innerWidth / 1265, kHeight = window.innerHeight / 769, k = kHeight < kWidth ? kHeight : kWidth
    const duckWidth = k * 70 + 'px'
    const duckMoveArea = { height: window.innerHeight * 0.5, width: window.innerWidth * 0.95 }
    const hunterTop = window.innerHeight / 2 + (769 * k) * 0.05 + 'px'
    const hunterWidth = k * 200 + 'px'
    const hunterMoveArea = { leftX: window.innerWidth * 0.0005, rightX: window.innerWidth * 0.84 }
    return { duck: { width: duckWidth, moveArea: duckMoveArea }, hunter: { top: hunterTop, width: hunterWidth, moveArea: hunterMoveArea } }
}

let props = countProps()
const duck = new Duck('duck-left-up.png', 10, props.duck.width, props.duck.moveArea)
const hunter = new Hunter('hunter-right.png', 15, '300px', props.hunter.top, props.hunter.width, props.hunter.moveArea)

// duck.watch('alive', function() {
//     console.log('duck killed')
// })

onresize = () => {
    console.log('resize')
    props = countProps()
    duck.resize(props.duck.moveArea, props.duck.width)
    hunter.resize(props.hunter.moveArea, props.hunter.width, props.hunter.top)
};