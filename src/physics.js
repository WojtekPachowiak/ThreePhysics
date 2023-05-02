import { Vector } from "./vector.js";
import { getClosestPoint_PointLine } from "./utils.js";

export class Physics {
    static gravity = 100;
    static friction = 0.01;


    static applyDownGravity(obj) {
        obj.acc = Vector.add(obj.acc, new Vector(0, this.gravity));
    }
    static applyCentralGravity(obj) {
        const center = new Vector(canvas.width / 2, canvas.height / 2);
        obj.acc = Vector.add(obj.acc, Vector.sub(center, obj.pos).normalize().mult(this.gravity));
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
        b1.pos = Vector.add(b1.pos, normal.mult(b1.inv_mass / (b1.inv_mass + b2.inv_mass)));
        b2.pos = Vector.sub(b2.pos, normal.mult(b2.inv_mass / (b1.inv_mass + b2.inv_mass)));
    }

    static resolveCollision_BallBall(b1, b2) {
        let normal = Vector.sub(b1.pos, b2.pos).normalize();
        let relVel = Vector.sub(b1.vel, b2.vel);
        let sepVel = Vector.dot(relVel, normal);
        let impulse = -(1 + Math.min(b1.elasticity, b2.elasticity)) * sepVel / (b1.inv_mass + b2.inv_mass);
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
        let dist = Vector.dist(p, b.pos);
        return dist < b.r;
    }



}