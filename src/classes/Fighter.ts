import { c, canvas, projectiles, fighters, AAMs, smokes, particles } from '../app';
import { restart, createImg } from '../gameHandling/gameEvents';
import { equipBest } from '../gameHandling/userInterface';
import { keys } from '../data/data';

import { Projectile } from './Projectile';
import { Smoke } from './Smoke';
import { Particle } from './Particle';
import { AAM } from './AAM';

import { selectData, rules } from '../data/data';

export class Fighter {
    // look
    img: any
    imgSave: any
    width: number
    height: number
    // upgrades
    upgrades: any
    // position
    position: any
    velocity: any
    speed: number
    slowDown: number
    // rotation
    rotation: number
    angel: number
    rotationAvibility: number
    // shoot 
    fireRate: number
    spread: number
    maxOverheat: number;
    damage: number
    overHeat: number;
    overHeated: boolean;
    equipment: any;
    AAMfired: boolean;
    flairsShoot: boolean;
    // handling
    health: number
    maxHealth: number
    keys: any;
    id: number;
    gun: any;

    constructor(x: number, y: number, velX: number, img: any, rotation: number, id: number, keys: any) {
        // look
        this.img = createImg(img);
        this.imgSave = createImg(img);
        this.width = 75;
        this.height = 50;
        // upgrades
        this.upgrades = {
            f: 0,
            e: 0,
            m: 0,
            r: 0
        }
        // position
        this.position = {
            x: x,
            y: y
        }
        this.velocity = {
            x: velX,
            y: 0
        }
        this.speed = 10;
        this.slowDown = 0;
        // rotation
        this.rotation = rotation;
        this.angel = 0;
        this.rotationAvibility = 0.02;
        // waeponary
        // gun
        this.gun = {
            shootTime: 1
        }
        this.fireRate = 1;
        this.spread = 1;
        this.maxOverheat = 100;
        this.overHeat = 0;
        this.overHeated = false;
        this.damage = 1;
        // AAM
        this.equipment = {
            AAM: 2,
            AAMStatus: {
                speed: 4,
                rotationAvibility: 0,
                damage: 149,
                multipleShoots: 1,
                targetLocked: false,
                targetLockStatus: 0,
                trackingIntervalFlag: 1
            },
            AAMSkin: './img/AG.jpg'
        }
        this.AAMfired = false;
        this.flairsShoot = false;
        // handling
        this.keys = keys;
        this.id = id;
        this.health = 150;
        this.maxHealth = this.health;
    }
    // ! weaponary
    shoot() {
        for (let i = 0; i < this.fireRate; i++) {
            if (this.fireRate < 1) {
                this.gun.shootTime += this.fireRate;
            }
            if (!this.overHeated && this.gun.shootTime >= 1) {
                const randomX = (Math.random() - 0.5) * this.spread;
                const randomY = (Math.random() - 0.5) * this.spread;
                const position = {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height / 2
                }
                const velocity = {
                    x: this.velocity.x * 3 + randomX * 3,
                    y: this.velocity.y * 3 + randomY * 3
                }
                const currentProjectile = new Projectile(position, velocity, this.id, this.damage)

                projectiles.push(currentProjectile);
                this.overHeat += this.damage;
                if (this.fireRate < 1 && this.gun.shootTime) {
                    this.gun.shootTime = 0;
                }
            }
        }
    }
    // checks if target is in tracking range
    startTracking() {
        const targetId = (this.id == 1) ? 1 : 2;
        const target = fighters[targetId - 1];

        const checkIfTargetTracked = () => {
            const x = target.position.x - this.position.x;
            const y = target.position.y - this.position.y;

            const angelOnTarget = Math.atan2(y, x) / Math.PI * -180;
            const angel = this.angel / Math.PI * -180

            const maxAngelOfTracking = 30;
            if (Math.round(angel) - Math.round(angelOnTarget) < maxAngelOfTracking
                && Math.round(angel) - Math.round(angelOnTarget) > -maxAngelOfTracking) {
                return true
            } else {
                return false
            }
        }
        // checks if target was in range for 5 seconds
        setInterval(() => {
            console.log(checkIfTargetTracked());
            if (checkIfTargetTracked()) {
                if (this.equipment.AAMStatus.targetLockStatus < 10) {
                    this.equipment.AAMStatus.targetLockStatus += 1;
                }
            } else {
                this.equipment.AAMStatus.targetLockStatus = 0;
            }
            if (this.equipment.AAMStatus.targetLockStatus == 10) {
                this.equipment.AAMStatus.targetLocked = true
            } else {
                this.equipment.AAMStatus.targetLocked = false
            }
        }, 100)
        setInterval(() => {
            this.equipment.AAMStatus.trackingIntervalFlag *= -1;
        }, 250)
    }
    fireAAM() {
        const keyShoot = keys[this.keys.equipment];
        const targetId = (this.id == 1) ? 1 : 2;
        const target = fighters[targetId - 1];
        const checkDistance = () => {
            const distanceX = (this.position.x - target.position.x > 0) ? this.position.x - target.position.x : target.position.x - this.position.x;
            const distanceY = (this.position.y - target.position.y > 0) ? this.position.y - target.position.y : target.position.y - this.position.y;
            if (Math.sqrt(distanceX * distanceX + distanceY * distanceY) > 500) {
                return true;
            }
            return false;
        }
        // ! Shoot
        if (keyShoot.pressed && this.equipment.AAM > 0 && !this.AAMfired && checkDistance() && this.equipment.AAMStatus.targetLocked
            || keyShoot.pressed && this.equipment.AAM > 0 && !this.AAMfired && checkDistance() && this.equipment.AAMStatus.rotationAvibility == 0) {
            if (fighters[targetId - 1]) {
                let shoots = this.equipment.AAMStatus.multipleShoots;
                const shooting = setInterval(() => {
                    --shoots;
                    const position = {
                        x: this.position.x + this.width / 2,
                        y: this.position.y + this.height / 2
                    }
                    const velocity = {
                        x: 0,
                        y: 0
                    }
                    const missle = new AAM(velocity, position, (this.equipment.AAMStatus.multipleShoots > 1) ? this.angel + (Math.random() - 0.5) * 0.1 : this.angel, target,
                        this.equipment.AAMStatus.speed, this.equipment.AAMStatus.rotationAvibility, this.equipment.AAMStatus.damage, this.equipment.AAMSkin);
                    AAMs.push(missle);
                    if (shoots <= 0) {
                        clearInterval(shooting);
                    }
                }, 100)
                this.AAMfired = true;
                setTimeout(() => {
                    this.AAMfired = false;
                }, 500)
                this.equipment.AAM--;
            }
        }
    }
    // ! updating
    updateStats() {
        const getData = (char: string) => selectData[char][this.upgrades[char]];
        let data: any;
        // fighter
        data = getData('f')
        this.rotationAvibility = data.rotationAvibility;
        this.health = data.health;
        this.maxHealth = data.health;
        this.equipment.AAM = data.equipmentNumber;
        this.img = createImg(data.img);
        this.imgSave = createImg(data.img);
        // engine
        data = getData('e')
        this.speed = data.speed;
        // MachineGun
        data = getData('m')
        this.spread = data.spread;
        this.fireRate = data.fireRate;
        this.damage = data.damage;
        this.maxOverheat = data.maxOverheat;
        // AAM
        data = getData('r')
        this.equipment.AAMStatus.rotationAvibility = data.rotationAvibility;
        this.equipment.AAMStatus.speed = data.speed;
        this.equipment.AAMStatus.damage = data.damage;
        this.equipment.AAMSkin = data.skin;
        this.equipment.AAMStatus.multipleShoots = data.multipleShoots;
    }
    draw() {
        c.save();
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        c.rotate(this.angel);
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        c.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
        c.restore()
        this.rotation = 0;
    }
    // ^ main function calling another functions in designated order
    update() {
        if (keys[this.keys.flairs].pressed && !this.flairsShoot) this.lunchFlairs();
        this.updateRotation();
        this.updateVelocity();
        this.smoke();
        this.fireAAM();

        // update guns status 
        const keyShoot = keys[this.keys.shoot];
        if (keyShoot.pressed) {
            this.shoot();
        } else {
            if (this.overHeat < 0) {
                this.overHeat = 0;
            } else {
                this.overHeat -= 0.5;
            }
        }
        if (this.overHeat >= this.maxOverheat) {
            this.overHeated = true;
        }
        if (this.overHeat <= 0) {
            this.overHeat = 0;
            this.overHeated = false;
        }

        // if hits side of map
        if (rules.map.stopX) {
            if (this.position.x < 10) {
                if (this.velocity.x > 0) {
                    this.position.x += this.velocity.x;
                }
            } else if (this.position.x > canvas.width - 100) {
                if (this.velocity.x < 0) {
                    this.position.x += this.velocity.x;
                }
            } else {
                this.position.x += this.velocity.x;
            }
        } else {
            if (this.position.x < 0) {
                this.position.x = canvas.width
            }
            if (this.position.x > canvas.width) {
                this.position.x = 0
            }
            this.position.x += this.velocity.x;
        }
        if (rules.map.stopY) {
            if (this.position.y < 10) {
                if (this.velocity.y > 0) {
                    this.position.y += this.velocity.y;
                }
            } else if (this.position.y > canvas.height - 100) {
                if (this.velocity.y < 0) {
                    this.position.y += this.velocity.y;
                }
            } else {
                this.position.y += this.velocity.y;
            }
        } else {
            if (this.position.y < 0) {
                this.position.y = canvas.height
            }

            if (this.position.y > canvas.height) {
                this.position.y = 0
            }
            this.position.y += this.velocity.y;
        }
        this.draw();
    }
    // ! efects
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
        const num = (this.id == 1) ? 0 : 1;
        selectData.kills[num] += 1;
        setTimeout(() => {
            restart()
            equipBest()
        }, 5000);
    }
    lunchFlairs() {
        this.flairsShoot = true;
        const lunch = () => {
            const position = {
                x: this.position.x,
                y: this.position.y
            }
            const velocity1 = {
                x: (this.velocity.y - this.velocity.x / 2 + (Math.random() - 0.5) * 3) * 1.5,
                y: (this.velocity.x - this.velocity.y / 2 + (Math.random() - 0.5) * 3) * 1.5
            }
            const velocity2 = {
                x: (-this.velocity.y - this.velocity.x / 2 + (Math.random() - 0.5) * 3) * 1.5,
                y: (-this.velocity.x - this.velocity.y / 2 + (Math.random() - 0.5) * 3) * 1.5
            }
            const color = 'rgb(253, 225, 102)';
            const flair1 = new Particle(position, velocity1, color, 5, true);
            const flair2 = new Particle(position, velocity2, color, 5, true);
            particles.push(flair1);
            particles.push(flair2);
        }
        for (let i = 1; i > 0; i--) {
            lunch();
            setTimeout(lunch, 1000)
        }
        const lunching = setInterval(() => {
            for (let i = 1; i > 0; i--) {
                lunch();
            }
        }, 166)
        setTimeout(() => {
            clearInterval(lunching);
        }, 1500)
        setTimeout(() => {
            this.flairsShoot = false;
        }, 7000)
    }
    smoke() {
        const x = this.position.x + this.width / 2;
        const y = this.position.y + this.height / 2;

        const smoke1 = new Smoke(x, y, 'orange', 5, 1, 1);
        const smoke3 = new Smoke(x, y, 'white', 30, 0.1, 20);
        const smoke4 = new Smoke(x, y, 'grey', 30, 0.1, 20);

        setTimeout(() => {
            smokes.push(smoke1);
            if (this.health < 100) {
                smokes.push(smoke3);
                smokes.push(smoke4);
            }
        }, 50)
    }
    // ! movement
    updateVelocity() {
        const turnKeys = [this.keys.left, this.keys.right];
        const getTurnKeysPressStatus = () => {
            const keys1 = [];
            turnKeys.forEach(key => keys1.push(keys[key].pressed))
            return keys1;
        };
        const turnKeysPressStatus = getTurnKeysPressStatus();
        if (this.slowDown < 0.2 && turnKeysPressStatus[0] && !turnKeysPressStatus[1] || this.slowDown < 0.2 && turnKeysPressStatus[1] && !turnKeysPressStatus[0]) {
            this.slowDown += 0.004;
        } else {
            if (this.slowDown <= 0) {
                this.slowDown = 0;
            } else {
                this.slowDown -= 0.01;
            }
        }
        const deg360 = Math.PI * 2;
        // if 0 < deg < 90
        if (this.angel > 0 && this.angel < deg360 / 4) {
            const y = this.angel / deg360 * 4;
            const x = 1 - y;
            this.velocity.x = x * this.speed * (1 - this.slowDown);
            this.velocity.y = y * this.speed * (1 - this.slowDown);
        }
        // if 0 > deg > -90
        if (this.angel < 0 && this.angel > -deg360 / 4 || this.angel < -deg360 / 4 * 3) {
            const y = this.angel / deg360 * 4;
            const x = 1 + y;
            this.velocity.x = x * this.speed * (1 - this.slowDown);
            this.velocity.y = y * this.speed * (1 - this.slowDown);
        }
        // if 90 < deg < 180
        if (this.angel > deg360 / 4) {
            const currentAngel = this.angel - deg360 / 4;
            const x = currentAngel / deg360 * 4;
            const y = 1 - x;
            this.velocity.x = -x * this.speed * (1 - this.slowDown);
            this.velocity.y = y * this.speed * (1 - this.slowDown);
        }
        // if -90 > deg > -180
        if (this.angel < -deg360 / 4) {
            const currentAngel = -this.angel - deg360 / 4;
            const x = currentAngel / deg360 * 4;
            const y = 1 - x;
            this.velocity.x = -x * this.speed * (1 - this.slowDown);
            this.velocity.y = -y * this.speed * (1 - this.slowDown);
        }
    }
    updateRotation() {
        const keyLeft = keys[this.keys.left];
        const keyRight = keys[this.keys.right];
        const keys1 = {
            keyLeft: keyLeft,
            keyRight: keyRight,
        }
        this.img = this.imgSave;
        let fighterDamage = (this.health < 100) ? 0.7 : 1;
        if (keys1.keyLeft.pressed) {
            this.rotation = -this.rotationAvibility * fighterDamage;
            if (this.img.src.includes('f16')) {
                this.img = createImg('./img/f16v2.png');
            }
            if (this.img.src.includes('su17')) {
                this.img = createImg('./img/su17-2.png');
            }
        }
        if (keys1.keyRight.pressed) {
            this.rotation = this.rotationAvibility * fighterDamage;
            if (this.img.src.includes('f16')) {
                this.img = createImg('./img/f16v3.png');
            }
            if (this.img.src.includes('su17')) {
                this.img = createImg('./img/su17-3.png');
            }
        }
        if (keys1.keyRight.pressed && keys1.keyLeft.pressed) {
            this.rotation = 0;
            this.img = this.imgSave;
        }
        if (this.angel > Math.PI) {
            this.angel = -Math.PI
        }
        if (this.angel < -Math.PI) {
            this.angel = Math.PI
        }
        this.angel += this.rotation;
    }
}