class Actor {
    constructor(folder, src, id, classes, left, top, width, hitbox) {
        this.SPRITES_FOLDER = folder
        this.img = this.#createImage(this.SPRITES_FOLDER + src, id, classes, left, top, width)
        document.body.appendChild(this.img)
        this.hitBox = this.#createHitBox(hitbox)
        document.body.appendChild(this.hitBox.element)
        // this.resizeHitBox()
        this.alive = true
        this.paused = false

        this.hitBox.element.addEventListener('click', (event) => {
            event.preventDefault()
            this.kill()
        })
    }

    pause() {
        this.paused = true
    }

    continue() {
        this.paused = false
    }

    #createImage(src, id, classes, left, top, width) {
        const img = document.createElement('img')
        img.src = src
        img.setAttribute('id', id)
        img.style.left = left
        img.style.top = top
        img.style.width = width
        img.classList.add(classes)

        return img
    }

    #createHitBox(props) {
        const hitBox = document.createElement('span')
        hitBox.setAttribute('id', props.id)
        hitBox.style.width = this.img.width * props.k + 'px'
        hitBox.style.height = this.img.height * props.k + 'px'
        hitBox.style.left = parseInt(this.img.style.left) + this.img.width / 2 - parseInt(hitBox.style.width) / 2 + 'px'
        hitBox.style.top = parseInt(this.img.style.top) + this.img.height / 2 - parseInt(hitBox.style.height) / 2 + 'px'
        hitBox.classList.add(props.classes)

        return { element: hitBox, k: props.k }
    }

    resize(moveArea, width, top) {
        this.moveArea = moveArea
        this.img.style.width = width
        if (top != undefined) this.img.style.top = top
        this.moveAndResizeHitBox()
    }

    moveAndResizeHitBox() {
        this.hitBox.element.style.width = this.img.width * this.hitBox.k + 'px'
        this.hitBox.element.style.height = this.img.height * this.hitBox.k + 'px'
        this.hitBox.element.style.left = parseInt(this.img.style.left) + this.img.width / 2 - parseInt(this.hitBox.element.style.width) / 2 + 'px'
        this.hitBox.element.style.top = parseInt(this.img.style.top) + this.img.height / 2 - parseInt(this.hitBox.element.style.height) / 2 + 'px'
    }

    setPosition(x, y) {
        this.img.style.left = Math.round(x) + 'px';
        if (y != undefined) {
            this.img.style.top = Math.round(y) + 'px';
        }
        this.moveAndResizeHitBox()
    }

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}

export class Duck extends Actor {
    constructor(src, speed, left, top, width, moveArea) {
        super('./sprites/duck/', src, 'duck', 'sprite', left, top, width, { id: 'duck-hitbox', classes: 'hitbox', k: 1.4 })
        this.moveArea = moveArea
        this.#fly(speed)
        this.animationFrameId = null
    }

    #fly(speed) {
        let aim = this.#generateAim()
        this.#setAnimation(aim) // look at the direction first time
        let animationFrameId = null

        const flyStep = () => {
            if (!this.alive) {
                cancelAnimationFrame(animationFrameId)
                return
            }

            if (!this.paused) {
                if (Math.abs(parseInt(this.img.style.left) - aim.x) <= 10 && Math.abs(parseInt(this.img.style.top) - aim.y) <= 10) {
                    aim = this.#generateAim()
                    this.#setAnimation(aim)
                }
                let distanceX = aim.x - parseInt(this.img.style.left)
                let distanceY = aim.y - parseInt(this.img.style.top)
                var magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                const deltaX = distanceX * speed / magnitude
                const deltaY = distanceY * speed / magnitude

                const newPos = {
                    x: parseInt(this.img.style.left) + deltaX,
                    y: parseInt(this.img.style.top) + deltaY
                };
                super.setPosition(newPos.x, newPos.y);
            }
            animationFrameId = requestAnimationFrame(flyStep)
        };
        animationFrameId = requestAnimationFrame(flyStep);
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
            this.img.src = this.SPRITES_FOLDER + 'duck-right-up.gif'
        }
        else if (sector2) {
            this.img.src = this.SPRITES_FOLDER + 'duck-right.gif'
        }
        else if (sector3) {
            this.img.src = this.SPRITES_FOLDER + 'duck-right-up.gif' // right-down
        }
        else if (sector4) {
            this.img.src = this.SPRITES_FOLDER + 'duck-left-up.gif' // left down
        }
        else if (sector5) {
            this.img.src = this.SPRITES_FOLDER + 'duck-left.gif'
        }
        else if (sector6) {
            this.img.src = this.SPRITES_FOLDER + 'duck-left-up.gif'
        }
        // console.log('resize duck hit box')
        super.moveAndResizeHitBox()
    }

    kill = () => {
        this.alive = false
        console.log('duck killed')
    }

    #generateAim() {
        return { x: super.randomIntFromInterval(0, this.moveArea.width), y: super.randomIntFromInterval(0, this.moveArea.height) };
    }
}

export class Hunter extends Actor {
    constructor(src, speed, left, top, width, moveArea) {
        super('./sprites/hunter/', src, 'hunter', 'sprite', left, top, width, { id: 'hunter-hitbox', classes: 'hitbox', k: 1 })
        this.moveArea = moveArea
        this.#move(speed)
    }

    #move(speed) {
        let aim = this.#generateAim()
        this.#setAnimation()
        let lastTimestamp = null;
        let animationFrameId = null

        const moveStep = (timestamp) => {
            if (!this.alive) {
                cancelAnimationFrame(animationFrameId)
                return
            }
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }
            if (!this.paused) {
                if (Math.abs(parseInt(this.img.style.left) - aim.x) <= 5) {
                    aim = this.#generateAim()
                    lastTimestamp = timestamp;
                }

                const deltaT = (timestamp - lastTimestamp) / 1000;
                const deltaX = (aim.x - parseInt(this.img.style.left)) / speed;

                const newPos = {
                    x: parseInt(this.img.style.left) + deltaX * deltaT
                };
                super.setPosition(newPos.x);
                this.#setAnimation()
            } else {
                lastTimestamp = timestamp;
            }

            animationFrameId = requestAnimationFrame(moveStep);
        };

        animationFrameId = requestAnimationFrame(moveStep);
    }

    #setAnimation() {
        if (parseInt(this.img.style.left) < (window.innerWidth - this.img.width) / 2) {
            this.img.src = this.SPRITES_FOLDER + 'hunter-right.png'
        } else {
            this.img.src = this.SPRITES_FOLDER + 'hunter-left.png'
        }
        super.moveAndResizeHitBox()
    }

    kill = () => {
        this.alive = false
        console.log('hunter scared')
        cancelAnimationFrame(this.animationFrameId)
    }

    #generateAim() {
        return { x: super.randomIntFromInterval(this.moveArea.leftX, this.moveArea.rightX) };
    }
}