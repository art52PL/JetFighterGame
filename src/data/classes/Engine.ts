export class Engine {
    speed: number
    price: number
    bought: any

    constructor(speed: number, price: number, bought?: any) {
        this.speed = speed;
        this.price = price;
        this.bought = bought || { player1: false, player2: false };
    }
}