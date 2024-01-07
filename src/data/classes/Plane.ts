export class Plane {
    img: any
    speed: number
    rotationAvibility: number
    health: number
    price: number
    equipmentNumber: number
    bought: any

    constructor(rotationAvibility: number, health: number, price: number, equipmentNumber: number, img: any, bought?: any) {
        this.img = img;
        this.rotationAvibility = rotationAvibility;
        this.health = health;
        this.price = price;
        this.equipmentNumber = equipmentNumber;
        this.bought = bought || { player1: false, player2: false };
    }
}