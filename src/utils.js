import { Vector } from "./vector.js";

export function getClosestPoint_PointLine(p, l) {
    let line = Vector.sub(l.p2, l.p1);
    let lineLen = line.mag();
    let lineDir = line.normalize();
    let point = Vector.sub(p, l.p1);
    let dot = Vector.dot(point, lineDir);
    dot = dot.clamp(0, lineLen);
    let closestPoint = Vector.add(l.p1, lineDir.mult(dot));
    return closestPoint;
}


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


export function drawText(ctx, text, x, y) {
    ctx.fillText(text, x, y);
}

export function calculateGlobalMomentum(rigidBodies) {
    if (rigidBodies === undefined) { return 0; }
    else {
        return rigidBodies
            .filter(rb => rb.constructor.name == "Ball")
            .reduce((acc, b) => acc + (b.mass * b.vel.mag()), 0)
    }
}