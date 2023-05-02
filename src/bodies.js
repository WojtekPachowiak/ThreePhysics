import { Vector } from "./vector.js";
import { Input } from "./input.js";
import { ctx } from './globals.js';
import { v4 as uuidv4 } from 'uuid';

export class Body{
    uuid;

    constructor() {
        this.uuid = uuidv4();
    }
}

class StaticBody extends Body{
    get dynamic() {
        return false;
    }
}

class DynamicBody extends Body{
    get dynamic() {
        return true;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Ball extends DynamicBody {
    constructor(x, y, r, m, e) {
        super();
        this.pos = new Vector(x, y);
        this.r = r;
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.playerControlled = false;
        this.mass = m || 1;
        this.inv_mass = 1 / this.mass;
        this.elasticity = e || 1;
    }

    draw() {

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        ctx.strokeStyle = "black"
        ctx.stroke()
        ctx.fillStyle = "red"
        ctx.fill()
        ctx.closePath();
    }

    drawDebug() {
        this.vel.drawVec(this.pos.x, this.pos.y, 10, "green");
        this.acc.drawVec(this.pos.x, this.pos.y, 100, "blue");
    }

    update(dt) {
        // let new_acc = new Vector(0, 0);
        // if (this.playerControlled) {
        //     //determine acceleration diriction
        //     if (Input.keys["w"]) new_acc.y -= 1;
        //     if (Input.keys["s"]) new_acc.y += 1;
        //     if (Input.keys["a"]) new_acc.x -= 1;
        //     if (Input.keys["d"]) new_acc.x += 1;
        // }
        // //normalize acceleration
        // this.acc = Vector.add(this.acc, new_acc.normalize().mult(this.acceleration));


        //update pos, vel and acc
        this.vel = Vector.add(this.vel, this.acc.mult(dt));
        this.pos = Vector.add(this.pos, this.vel.mult(dt));
        this.acc = new Vector(0, 0);
    }

    applyForce(f) {
        this.acc = Vector.add(this.acc, f.mult(this.inv_mass));
    }


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export class Wall extends StaticBody {
    constructor(x1, y1, x2, y2) {
        super();
        this.p1 = new Vector(x1, y1);
        this.p2 = new Vector(x2, y2);
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.strokeStyle = "black"
        ctx.stroke()
        ctx.closePath();
    }
}