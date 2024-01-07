import { c } from '../app'

export class Smoke {
    position: any
    radious: number
    color: string
    alpha: number
    lenght: number

    constructor(x: number, y: number, color: string, radious: number, alpha: number, lenght: number) {
        this.position = {
            x: x,
            y: y
        }
        this.radious = radious;
        this.color = color;
        this.alpha = alpha;
        this.lenght = lenght;
    }
    draw() {
        if (this.alpha > 0) {
            c.beginPath();
            c.save();
            c.globalAlpha = this.alpha;
            c.arc(this.position.x, this.position.y, this.radious, 0, Math.PI * 2);
            c.fillStyle = this.color;
            c.fill();
            c.restore();
            c.closePath();
        }
    }
}