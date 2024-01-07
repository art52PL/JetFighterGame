import { c, smokes, particles } from "../app"
import { createImg } from "../gameHandling/gameEvents"

import { Smoke } from "./Smoke"
import { Particle } from "./Particle"

export class AAM {
    // look
    img: any
    src: string
    imgSave: any
    width: number
    height: number
    // position
    position: any
    velocity: any
    speed: number
    // rotation
    rotation: number
    angel: number
    rotationAvibility: number
    health: number
    // hit
    target: any
    damage: number

    constructor(velocity: any, position: any, angel: number, target: any, speed: number, rotationAvibility: number, dmg: number, img: string) {
        // look
        this.width = 50;
        this.height = 12.5;
        this.src = img;
        this.img = createImg(this.src);
        // rotation
        this.angel = angel;
        this.rotation = 0;
        this.rotationAvibility = rotationAvibility;
        // position
        this.speed = speed;
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }
        this.target = target;
        this.damage = dmg;
    }
    // ! updating
    draw() {
        c.save();
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        c.rotate(this.angel);
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        c.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
        c.restore();
        this.rotation = 0;
    }
    update() {
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;
        this.trackTarget();
        this.updateVelocity();
        this.draw();
    }
    //  ! efects
    smoke() {
        const smoke1 = new Smoke(this.position.x + this.width / 2, this.position.y + this.height / 2, 'orange', 4, 1, 2);
        smokes.push(smoke1);
    }
    explode() {
        for (let i = 0; i < 30; i++) {
            const n = Math.random() * 2;
            const color = (n > 1) ? 'darkgrey' : 'orange';
            const velocity = {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            }
            particles.push(new Particle(this.position, velocity, color));
        }
    }
    // ! movement
    trackTarget() {
        let x = this.target.position.x - this.position.x;
        let y = this.target.position.y - this.position.y;
        particles.forEach(particle => {
            if (particle.throwsSmoke) {
                const particleX = particle.position.x;
                const particleY = particle.position.y;
                if (this.position.x - particleX > -500 && this.position.x - particleX < 500 &&
                    this.position.y - particleY > -500 && this.position.y - particleX < 500) {
                    x = particleX - this.position.x;
                    y = particleY - this.position.y;
                }
            }
        })
        const angelOnTarget = Math.atan2(y, x) / Math.PI * 180;
        const angel = this.angel / Math.PI * 180
        if (angel < -90 && angelOnTarget > 90 || angel > 90 && angelOnTarget < -90) {
            if (angel < -90 && angelOnTarget > 90) {
                this.angel -= this.rotationAvibility / 100
            }
            if (angel > 90 && angelOnTarget < -90) {
                this.angel += this.rotationAvibility / 100
            }
        } else {
            if (angel >= angelOnTarget) {
                this.angel -= this.rotationAvibility / 100
            }
            if (angel < angelOnTarget) {
                this.angel += this.rotationAvibility / 100
            }
        }

    }
    updateVelocity() {
        const deg360 = Math.PI * 2;
        // if 0 < deg < 90
        if (this.angel > 0 && this.angel < deg360 / 4) {
            const y = this.angel / deg360 * 4;
            const x = 1 - y;
            this.velocity.x = x * this.speed;
            this.velocity.y = y * this.speed;
        }
        // if 0 > deg > -90
        if (this.angel <= 0 && this.angel > -deg360 / 4 || this.angel < -deg360 / 4 * 3) {
            const y = this.angel / deg360 * 4;
            const x = 1 + y;
            this.velocity.x = x * this.speed;
            this.velocity.y = y * this.speed;
        }
        // if 90 < deg < 180
        if (this.angel > deg360 / 4) {
            const currentAngel = this.angel - deg360 / 4;
            const x = currentAngel / deg360 * 4;
            const y = 1 - x;
            this.velocity.x = -x * this.speed;
            this.velocity.y = y * this.speed;
        }
        // if -90 > deg > -180 -broken-
        if (this.angel < -deg360 / 4) {
            const currentAngel = -this.angel - deg360 / 4;
            const x = currentAngel / deg360 * 4;
            const y = 1 - x;
            this.velocity.x = -x * this.speed;
            this.velocity.y = -y * this.speed;
        }
    }
}