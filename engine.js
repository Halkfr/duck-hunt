// function preloadImages(array) {
//     if (!preloadImages.list) {
//         preloadImages.list = [];
//     }
//     var list = preloadImages.list;
//     for (var i = 0; i < array.length; i++) {
//         var img = new Image();
//         img.onload = function() {
//             var index = list.indexOf(this);
//             if (index !== -1) {
//                 // remove image from the array once it's loaded
//                 // for memory consumption reasons
//                 list.splice(index, 1);
//             }
//         }
//         list.push(img);
//         img.src = array[i];
//     }
// }

// preloadImages(["url1.jpg", "url2.jpg", "url3.jpg"]);

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

let props = countProps()
console.log(props.duck.top)
const duck = new Duck('duck-left-up.gif', 7, props.duck.left, props.duck.top, props.duck.width, props.duck.moveArea)
const hunter = new Hunter('hunter-right.png', 15, props.hunter.left, props.hunter.top, props.hunter.width, props.hunter.moveArea)

export let actors = [duck, hunter]

onresize = () => {
    // console.log('resize')
    props = countProps()
    duck.resize(props.duck.moveArea, props.duck.width)
    hunter.resize(props.hunter.moveArea, props.hunter.width, props.hunter.top)
};