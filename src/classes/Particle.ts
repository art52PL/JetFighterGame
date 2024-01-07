import { c } from '../app';
import { Smoke } from "./Smoke"
import { smokes } from '../app';

export class Particle {
    position: any
    velocity: any
    radious: number
    color: string
    alpha: number
    throwsSmoke: boolean

    constructor(position: any, velocity: any, color: string, size?: number, smokes?: boolean) {
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }
        this.radious = size || 1;
        this.color = color;
        this.alpha = 1;
        this.throwsSmoke = smokes || false;
    }
    //  ! updating
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radious, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath;
    }
    update() {
        this.alpha -= 0.01;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
    }
    // ! efects
    smoke() {
        const smoke1 = new Smoke(this.position.x, this.position.y, 'rgb(183, 183, 183)', 7, 0.5, 6);
        const smoke2 = new Smoke(this.position.x, this.position.y, 'rgb(253, 225, 102)', 6, 0.7, 3);


        smokes.push(smoke1);
        smokes.push(smoke2);

        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
    }
}