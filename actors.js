class Actor {
    constructor(folder, src, id, classes, left, top) {
        this.SPRITES_FOLDER = folder
        this.img = this.#createImage(this.SPRITES_FOLDER + src, id, classes, left, top)
        document.body.appendChild(this.img)
        this.alive = true
    }

    #createImage(src, id, classes, left, top) {
        let img = document.createElement('img');
        img.src = src;
        img.setAttribute('id', id);
        img.style.left = left
        img.style.top = top
        img.classList.add(classes)
        return img
    }

    setPosition(x, y) {
        this.img.style.left = Math.round(x) + 'px';
        if (y != undefined) this.img.style.top = Math.round(y) + 'px';
    }

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

export class Duck extends Actor {
    constructor(src, speed) {
        super('./sprites/duck/', src, 'duck', 'sprite', '300px', '300px')
        this.flyArea = { height: 800, width: 1000 };
        this.#fly(speed)
    }

    #fly(speed) {
        let aim = this.#generateAim()
        this.#setAnimation(aim) // look at the direction first time
        let startTime = null;
        let lastTimestamp = null;

        const flyStep = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }

            if (Math.abs(parseInt(this.img.style.left) - aim.x) <= 5 && Math.abs(parseInt(this.img.style.top) - aim.y) <= 5) {
                aim = this.#generateAim()
                startTime = timestamp;
                lastTimestamp = timestamp;
                this.#setAnimation(aim)
            }
            // console.log(this.img.style.left, aim.x)
            // console.log(this.img.style.top, aim.y)

            // const progress = (timestamp - startTime) / 1000;
            const deltaT = (timestamp - lastTimestamp) / 1000;
            const deltaX = (aim.x - parseInt(this.img.style.left)) / speed;
            const deltaY = (aim.y - parseInt(this.img.style.top)) / speed;

            const newPos = {
                x: parseInt(this.img.style.left) + deltaX * deltaT,
                y: parseInt(this.img.style.top) + deltaY * deltaT
            };
            super.setPosition(newPos.x, newPos.y);

            if (this.alive) {
                requestAnimationFrame(flyStep);
            }
        };

        requestAnimationFrame(flyStep);
    }

    #setAnimation(aim) {
        const deltaX = aim.x - parseInt(this.img.style.left)
        const deltaY = -(aim.y - parseInt(this.img.style.top))
        const tan = deltaY / deltaX
        console.log('deltaX', deltaX)
        console.log('deltaY', deltaY)
        console.log(tan)

        let sector1 = deltaX > 0 && deltaX != deltaY && tan > 0 && tan <= Math.sqrt(3)
        let sector2 = (deltaX > 0 && deltaY > 0 && tan < Math.sqrt(3) && tan >= 0) || (deltaX > 0 &&tan < 0 && tan >= -Math.sqrt(3) / 3)
        // let sector3 = 
        // let sector4 = 
        // let sector5 = 
        // let sector6 = 

        if (sector1) {
            this.img.src = this.SPRITES_FOLDER + 'duck-right-up.png'
        } else if (sector2) {
            this.img.src = this.SPRITES_FOLDER + 'duck-right.png'
        }
        // else if (sector3){
        //     this.img.src = this.SPRITES_FOLDER + 'duck-right-down.png'
        // }
        // else if (sector4){
        //     this.img.src = this.SPRITES_FOLDER + 'duck-left-down.png'
        // }
        // else if (sector5){
        //     this.img.src = this.SPRITES_FOLDER + 'duck-left.png'
        // }
        // else if (sector6){
        //     this.img.src = this.SPRITES_FOLDER + 'duck-left-up.png'
        // }
        else {
            this.img.src = this.SPRITES_FOLDER + 'duck-left-up.png'
        }

    }

    #generateAim() {
        return { x: super.randomIntFromInterval(0, this.flyArea.width), y: super.randomIntFromInterval(0, this.flyArea.height) };
    }
}

export class Hunter extends Actor {
    constructor(src, speed) {
        super('./sprites/hunter/', src, 'hunter', 'sprite', '300px', '700px')
        this.moveArea = { leftX: 50, rightX: 1000 };
        this.#move(speed)
    }

    #move(speed) {
        let aim = this.#generateAim()
        // this.#setAnimation()
        let startTime = null;
        let lastTimestamp = null;

        const moveStep = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }

            if (Math.abs(parseInt(this.img.style.left) - aim.x) <= 5 ) {
                aim = this.#generateAim()
                startTime = timestamp;
                lastTimestamp = timestamp;
                // this.#setAnimation()
            }

            // const progress = (timestamp - startTime) / 1000;
            const deltaT = (timestamp - lastTimestamp) / 1000;
            const deltaX = (aim.x - parseInt(this.img.style.left)) / speed;
            // console.log('deltaX', deltaX)

            const newPos = {
                x: parseInt(this.img.style.left) + deltaX * deltaT
            };
            // console.log('this pos', this.img.style.left)
            // console.log('new pos', newPos.x)
            super.setPosition(newPos.x);

            if (this.alive) {
                requestAnimationFrame(moveStep);
            }
        };

        requestAnimationFrame(moveStep);
    }

    #generateAim() {
        return { x: super.randomIntFromInterval(this.moveArea.leftX, this.moveArea.rightX) };
    }
}