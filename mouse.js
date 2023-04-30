
//Mouse class for storing mouse position, velocity, and whether mouse is down
class Mouse {
    constructor() {
        this.pos = new Vector(0, 0);
        this.vel = new Vector(0, 0);
        this.down = false;
    }

    updatePos(x, y) {
        this.pos = new Vector(x, y);
    }

    updateVel(x, y) {
        this.vel = new Vector(x, y);
    }

    updateDown(down) {
        this.down = down;
    }
}

function mouseEvents(e) {
    mouse.x = e.x;
    mouse.y = e.y;
    mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
}
["down", "up", "move"].forEach(name => document.addEventListener("mouse" + name, mouseEvents));

