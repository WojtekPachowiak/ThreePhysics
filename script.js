const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')


/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};




class Input {
    static keys = {};
    static mouse = {};

    static init() {
        document.addEventListener("keydown", (e) => Input.keys[e.key] = true);
        document.addEventListener("keyup", (e) => Input.keys[e.key] = false);

        document.addEventListener("mousedown", (e) => Input.mouse[Input.mouseCodeToName(e.button)] = true);
        document.addEventListener("mouseup", (e) => Input.mouse[Input.mouseCodeToName(e.button)] = false);
        document.addEventListener("mousemove", (e) => {
            Input.mouse.x = e.clientX - canvas.offsetLeft;
            Input.mouse.y = e.clientY - canvas.offsetTop;
        });
    }

    static mouseCodeToName(code) {
        switch (code) {
            case 0:
                return "left";
            case 1:
                return "middle";
            case 2:
                return "right";
        }
    }

}
Input.init()


function getClosestPoint_PointLine(p, l) {
    let line = Vector.sub(l.p2, l.p1);
    let lineLen = line.mag();
    let lineDir = line.normalize();
    let point = Vector.sub(p, l.p1);
    let dot = Vector.dot(point, lineDir);
    dot = dot.clamp(0, lineLen);
    let closestPoint = Vector.add(l.p1, lineDir.mult(dot));
    return closestPoint;
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }



    static add(v, u) {
        return new Vector(v.x + u.x, v.y + u.y)
    }

    static sub(v, u) {
        return new Vector(v.x - u.x, v.y - u.y)
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    mult(n) {
        return new Vector(this.x * n, this.y * n)
    }

    static dot(v, u) {
        return v.x * u.x + v.y * u.y
    }

    static dist(v, u) {
        return Math.sqrt((v.x - u.x) * (v.x - u.x) + (v.y - u.y) * (v.y - u.y))
    }

    normalize() {
        let m = this.mag();
        if (m === 0) return new Vector(0, 0)
        return new Vector(this.x / m, this.y / m)
    }

    rotate(angle) {
        let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector(x, y)
    }

    drawVec(orig_x, orig_y, len, color) {
        ctx.beginPath();
        ctx.moveTo(orig_x, orig_y);
        ctx.lineTo(orig_x + this.x * len, orig_y + this.y * len);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    static drawVec(from, to, color) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

class Physics {
    static gravity = new Vector(0, 0.1);
    static friction = 0.01;


    static applyGravity(obj) {
        obj.acc = Vector.add(obj.acc, this.gravity);
    }

    static applyFriction(obj) {
        obj.vel = obj.vel.mult(1 - Physics.friction);
    }

    static detectCollison_BallBall(ball1, ball2) {
        let dist = Vector.dist(ball1.pos, ball2.pos);
        return dist < ball1.r + ball2.r;
    }

    static resolvePenetration_BallBall(b1, b2) {
        let dist = Vector.dist(b1.pos, b2.pos);
        let overlap = b1.r + b2.r - dist;
        let normal = Vector.sub(b1.pos, b2.pos).normalize().mult(overlap);
        b1.pos = Vector.add(b1.pos, normal.mult(b1.inv_mass / (b1.inv_mass + b2.inv_mass) ));
        b2.pos = Vector.sub(b2.pos, normal.mult(b2.inv_mass/ (b1.inv_mass + b2.inv_mass) ));
    }

    static resolveCollision_BallBall(b1, b2) {
        let normal = Vector.sub(b1.pos, b2.pos).normalize();
        let relVel = Vector.sub(b1.vel, b2.vel);
        let sepVel = Vector.dot(relVel, normal);
        let impulse = -(1 + Math.min(b1.elasticity, b2.elasticity) ) * sepVel / (b1.inv_mass + b2.inv_mass);
        let impulseVec = normal.mult(impulse);

        b1.vel = Vector.add(b1.vel, impulseVec.mult(b1.inv_mass));
        b2.vel = Vector.sub(b2.vel, impulseVec.mult(b2.inv_mass));
    }

    static detectCollision_BallLine(b, l) {
        let closestPoint = getClosestPoint_PointLine(b.pos, l);
        let dist = Vector.dist(b.pos, closestPoint);
        return dist < b.r;
    }

    static resolveCollision_BallLine(b, l) {
        let closestPoint = getClosestPoint_PointLine(b.pos, l);
        let normal = Vector.sub(b.pos, closestPoint).normalize();
        let sepVel = Vector.dot(b.vel, normal);
        let velSepDiff = - (1 + b.elasticity) * sepVel;
        b.vel = Vector.add(b.vel, normal.mult(velSepDiff));
    }

    static resolvePenetration_BallLine(b, l) {
        let closestPoint = getClosestPoint_PointLine(b.pos, l);
        let dist = Vector.dist(b.pos, closestPoint);

        b.pos = Vector.sub(b.pos, Vector.sub(b.pos, closestPoint).normalize().mult(dist - b.r));
    }

    static detectPenetration_PointBall(p, b) {
        if (Input.keys.w) console.log(p, b.pos)
        let dist = Vector.dist(p, b.pos);
        return dist < b.r;
    }



}


class Ball {
    constructor(x, y, r, m, e) {
        this.pos = new Vector(x, y);
        this.r = r;
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.acceleration = 0.5;
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

    update() {
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
        console.log(Physics.detectPenetration_PointBall(new Vector(Input.mouse.x, Input.mouse.y), this))
        if (Input.mouse.left === true && Physics.detectPenetration_PointBall(new Vector(Input.mouse.x, Input.mouse.y), this)) {
            console.log("clicked")
            let new_pos = new Vector(Input.mouse.x, Input.mouse.y);
            this.vel = Vector.sub(new_pos, this.pos).mult(0.5);
            this.pos = new_pos;
        }
        else {
            //update pos, vel and acc
            this.vel = Vector.add(this.vel, this.acc);
            this.pos = Vector.add(this.pos, this.vel);
        }

        this.acc = new Vector(0, 0);



    }


}

class Wall {
    constructor(x1, y1, x2, y2) {
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



let ball = new Ball(100, 100, 20, 1);
ball.playerControlled = true;
let ball2 = new Ball(300, 100, 50, 3);
let ball3 = new Ball(500, 400, 30, 2);


let wall = new Wall(200, 200, 400, 400);

let floor = new Wall(0, canvas.clientHeight, canvas.clientWidth, canvas.clientHeight);
let wallLeft = new Wall(0, 0, 0, canvas.clientHeight);
let wallRight = new Wall(canvas.clientWidth, 0, canvas.clientWidth, canvas.clientHeight);
let ceiling = new Wall(0, 0, canvas.clientWidth, 0);

let rigidBodies = []
rigidBodies.push(ball);
rigidBodies.push(ball2);
rigidBodies.push(ball3);
rigidBodies.push(wall);
rigidBodies.push(floor);
rigidBodies.push(wallLeft);
rigidBodies.push(wallRight);
rigidBodies.push(ceiling);


function loop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    //game logic + physics
    rigidBodies.forEach((rb, i) => {

        if (rb.constructor.name == "Ball") {
            // Physics.applyGravity(rb);
            rb.update();
            // Physics.applyFriction(rb);
        }

        for (let j = i + 1; j < rigidBodies.length; j++) {
            rb2 = rigidBodies[j];
            if (rb.constructor.name == "Ball" && rb2.constructor.name == "Wall" && Physics.detectCollision_BallLine(rb, rb2)) {
                Physics.resolvePenetration_BallLine(rb, rb2);
                Physics.resolveCollision_BallLine(rb, rb2);
            }

            if (rb.constructor.name == "Ball" && rb2.constructor.name == "Ball" && Physics.detectCollison_BallBall(rb, rb2)) {
                Physics.resolvePenetration_BallBall(rb, rb2);
                Physics.resolveCollision_BallBall(rb, rb2);
            }

        }

        // console.log(Input.mouse)
        //render  
        rb.draw();
    });

    requestAnimationFrame(loop)
}
loop()