export class Rocket {
    speed: number
    rotationAvibility: number
    price: number
    bought: any
    skin: any
    damage: number
    multipleShoots: number

    constructor(speed: number, rotationAvibility: number, price: number, skin: any, damage: number, multipleShoots: number, bought?: any) {
        this.speed = speed;
        this.rotationAvibility = rotationAvibility;
        this.price = price;
        this.bought = bought || { player1: false, player2: false };
        this.skin = skin;
        this.damage = damage;
        this.multipleShoots = multipleShoots;
    }
}