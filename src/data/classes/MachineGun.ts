export class Mashingun {
    fireRate: number
    spread: number
    maxOverheat: number
    price: number
    damage: number
    bought: any

    constructor(fireRate: number, spread: number, maxOverheat: number, price: number, damage: number, bought?: any) {
        this.fireRate = fireRate;
        this.spread = spread;
        this.maxOverheat = maxOverheat;
        this.price = price;
        this.damage = damage;
        this.bought = bought || { player1: false, player2: false };
    }
}