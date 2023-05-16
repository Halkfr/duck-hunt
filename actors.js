class Actor {
    constructor(folder, src, id, classes, left, top, width) {
        this.SPRITES_FOLDER = folder
        this.img = this.#createImage(this.SPRITES_FOLDER + src, id, classes, left, top, width)
        document.body.appendChild(this.img)
        this.alive = true
    }

    #createImage(src, id, classes, left, top, width) {
        let img = document.createElement('img')
        img.src = src
        img.setAttribute('id', id)
        img.style.left = left
        img.style.top = top
        img.style.width = width
        img.classList.add(classes)

        return img
    }

    resize(moveArea, width, top) {
        this.moveArea = moveArea
        this.img.style.width = width
        if (top != undefined) this.img.style.top = top
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
    constructor(src, speed, width, moveArea) {
        super('./sprites/duck/', src, 'duck', 'sprite', '300px', '300px', width)
        this.moveArea = moveArea
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

        const sector1 = deltaX >= 0 && deltaY > 0 && tan > Math.sqrt(3)
        const sector2 = (deltaX > 0 && tan <= Math.sqrt(3) && tan >= 0) || (deltaX > 0 && tan < 0 && tan >= (-Math.sqrt(3) / 3))
        const sector3 = deltaX >= 0 && tan < (-Math.sqrt(3) / 3)
        const sector4 = deltaX < 0 && deltaY < 0 && tan > Math.sqrt(3)
        const sector5 = (deltaX < 0 && tan <= Math.sqrt(3) && tan >= 0) || (deltaX < 0 && tan < 0 && tan >= (-Math.sqrt(3) / 3))
        const sector6 = deltaX < 0 && tan < (-Math.sqrt(3) / 3)

        if (sector1) {
            this.img.src = this.SPRITES_FOLDER + 'duck-right-up.png'
        }
        else if (sector2) {
            this.img.src = this.SPRITES_FOLDER + 'duck-right.png'
        }
        else if (sector3) {
            this.img.src = this.SPRITES_FOLDER + 'duck-right-down.png'
        }
        else if (sector4) {
            this.img.src = this.SPRITES_FOLDER + 'duck-left-down.png'
        }
        else if (sector5) {
            this.img.src = this.SPRITES_FOLDER + 'duck-left.png'
        }
        else if (sector6) {
            this.img.src = this.SPRITES_FOLDER + 'duck-left-up.png'
        }
    }


    #generateAim() {
        return { x: super.randomIntFromInterval(0, this.moveArea.width), y: super.randomIntFromInterval(0, this.moveArea.height) };
    }
}

export class Hunter extends Actor {
    constructor(src, speed, left, top, width, moveArea) {
        super('./sprites/hunter/', src, 'hunter', 'sprite', left, top, width)
        this.moveArea = moveArea
        this.#move(speed)
    }

    #move(speed) {
        let aim = this.#generateAim()
        this.#setAnimation()
        let startTime = null;
        let lastTimestamp = null;

        const moveStep = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }

            if (Math.abs(parseInt(this.img.style.left) - aim.x) <= 5) {
                aim = this.#generateAim()
                startTime = timestamp;
                lastTimestamp = timestamp;
            }

            const deltaT = (timestamp - lastTimestamp) / 1000;
            const deltaX = (aim.x - parseInt(this.img.style.left)) / speed;

            const newPos = {
                x: parseInt(this.img.style.left) + deltaX * deltaT
            };
            super.setPosition(newPos.x);
            this.#setAnimation()

            if (this.alive) {
                requestAnimationFrame(moveStep);
            }
        };

        requestAnimationFrame(moveStep);
    }

    #setAnimation() {
        if (parseInt(this.img.style.left) < (window.innerWidth - this.img.width) / 2) {
            this.img.src = this.SPRITES_FOLDER + 'hunter-right.png'
        } else {
            this.img.src = this.SPRITES_FOLDER + 'hunter-left.png'
        }
    }


    #generateAim() {
        return { x: super.randomIntFromInterval(this.moveArea.leftX, this.moveArea.rightX) };
    }
}