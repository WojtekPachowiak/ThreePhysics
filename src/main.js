import { Input } from './input.js';
import { Vector } from './vector.js';
import { Physics } from './physics.js';
import { Ball, Wall } from './bodies.js';
import { ctx, canvas } from './globals.js';
import { drawText, calculateGlobalMomentum } from './utils.js';
import { UniformGrid } from './uniform_grid.ts';
import { Debug } from './debug.ts';



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Input.init()

let ball = new Ball(100, 100, 20, 10);
let ball2 = new Ball(300, 100, 20, 10);
let ball3 = new Ball(500, 400, 20, 10);


let wall = new Wall(200, 200, 400, 400);

let floor = new Wall(0, canvas.clientHeight, canvas.clientWidth, canvas.clientHeight);
let wallLeft = new Wall(0, 0, 0, canvas.clientHeight);
let wallRight = new Wall(canvas.clientWidth, 0, canvas.clientWidth, canvas.clientHeight);
let ceiling = new Wall(0, 0, canvas.clientWidth, 0);

let rigidBodies = []
rigidBodies.push(ball);
rigidBodies.push(ball2);
rigidBodies.push(ball3);
// rigidBodies.push(wall);
rigidBodies.push(floor);
rigidBodies.push(wallLeft);
rigidBodies.push(wallRight);
rigidBodies.push(ceiling);

let ball4;
console.log(rigidBodies)

let currentTime = 0;
let dt = 0;
let lastTime = (new Date()).getTime();

// initialize grid and assign rigidbodies to cells
const grid = new UniformGrid(100, canvas.clientWidth, canvas.clientHeight);
rigidBodies.forEach(rb => {
    if (rb.dynamic) grid.assignToCell(rb);
});

loop()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function loop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    currentTime = (new Date()).getTime();
    dt = (currentTime - lastTime) / 1000;
    console.log(dt)
    if (dt > 1) dt = 0;
    lastTime = currentTime;


    //game logic + physics
    rigidBodies.forEach((rb, i) => {


        if (rb.dynamic === true) {
            //apply forces
            // Physics.applyGravity(rb);
            Physics.applyCentralGravity(rb);
            Physics.applyFriction(rb);

            //player control
            if (Input.mouse.left === true && Physics.detectPenetration_PointBall(new Vector(Input.mouse.x, Input.mouse.y), rb)) {
                let new_pos = new Vector(Input.mouse.x, Input.mouse.y);
                rb.vel = Vector.sub(new_pos, rb.pos).mult(50);
                rb.pos = new_pos;
            }
            else {
                //update
                rb.update(dt);
            }

            grid.update(rb)

            //collision detection and solving constraints
            for (let j = 0; j < rigidBodies.length; j++) {
                if (i == j) continue;

                let rb2 = rigidBodies[j];
                if (rb.constructor.name == "Ball" && rb2.constructor.name == "Wall" && Physics.detectCollision_BallLine(rb, rb2)) {
                    Physics.resolvePenetration_BallLine(rb, rb2);
                    Physics.resolveCollision_BallLine(rb, rb2);
                }

                if (rb.constructor.name == "Ball" && rb2.constructor.name == "Ball" && Physics.detectCollison_BallBall(rb, rb2)) {
                    Physics.resolvePenetration_BallBall(rb, rb2);
                    Physics.resolveCollision_BallBall(rb, rb2);
                }

            }
        }


        //render  
        rb.draw();
    });



    if (Input.mouse.click.middle === true || Input.keys.s === true) {
        //spawn ball with random radius
        const ball = new Ball(Input.mouse.x, Input.mouse.y, 1, 1)
        rigidBodies.push(ball);
    }

    drawText(ctx, calculateGlobalMomentum(rigidBodies), 10, 20)
    Debug.drawGrid(grid, ctx);

    Input.update();
    requestAnimationFrame(loop)
}
