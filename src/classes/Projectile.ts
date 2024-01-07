import { c, smokes } from '../app';
import { Smoke } from './Smoke';

export class Projectile {
    position: any
    velocity: any
    color: string
    radious: number
    target: any
    damage: number

    constructor(position: any, velocity: any, target: any, damage: number) {
        this.position = {
            x: position.x,
            y: position.y
        }

        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }
        this.color = 'orange';
        this.damage = damage;
        this.radious = this.damage / 8 + 2;
        this.target = target;
    }
    // ! updating
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radious, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath;
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
        this.smoke();
    }
    // ! efects
    smoke() {
        const smoke1 = new Smoke(this.position.x, this.position.y, 'orange', this.radious, 0.9, 0.5 + this.damage / 8);
        smokes.push(smoke1);
    }
}