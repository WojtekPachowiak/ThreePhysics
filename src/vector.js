export class Vector {
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