'use strict';
class Viewport {
    #x;
    #y;

    constructor(x,y) {
        this.#x = x;
        this.#y = y;
    }

    focus() {
        this.#x = (app.ship.x - canvas.width / 2 + app.ship.r / 2);
        this.#y = (app.ship.y - canvas.height / 2 + app.ship.r / 2);
    }

    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }
    set x(x) {
        this.#x = x;
    }
    set y(y) {
        this.#y = y;
    }

    isInside(x, y) {
        return x > this.#x - 700 && x < (this.#x + canvas.width + 700) && y > this.#y - 700 && y < (this.#y + canvas.height + 700);
    }
}