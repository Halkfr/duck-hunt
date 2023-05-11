class Actor {
    constructor() {

    }
}

class Duck extends Actor {
    constructor(src) {
        super()
        document.body.appendChild(this.#createImage(src, 'duck', 'sprite'))
        this.alive = true
        this.#fly()
    }

    #createImage(src, id, classes) {
        var img = document.createElement('img');
        img.src = src;
        img.setAttribute('id', id);
        img.classList.add(classes)
        document.body.appendChild(img)
        return img
    }

    #fly() {
        while (this.alive) {
            
        }
    }
}

class Dog extends Actor {

}

let duck = new Duck('duck.png')