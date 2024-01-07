import { Plane } from "./classes/Plane"
import { Engine } from "./classes/Engine"
import { Mashingun } from "./classes/MachineGun"
import { Rocket } from "./classes/Rocket"

export const rules = {
    map: {
        stopX: true,
        stopY: true
    },
    money: {
        startValue: 200,
        addedValue: 500
    },
    cooperation: false,
    askOnSelection: false,
}

export const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    s: { pressed: false },
    e: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false },
    ArrowDown: { pressed: false },
    num0: { pressed: false },
};

export const selectData = {
    f: [
        new Plane(0.02, 150, 0, 2, './img/czerwony.png', { player1: true, player2: true }),
        new Plane(0.025, 200, 100, 2, './img/su17.png'),
        new Plane(0.027, 250, 250, 4, './img/mig29-KiowGhost-2.png'),
        new Plane(0.03, 350, 450, 6, './img/f16v1.png'),
        new Plane(0.035, 500, 500, 8, './img/F-35.png'),
    ],
    e: [
        new Engine(10, 0, { player1: true, player2: true }),
        new Engine(11, 50),
        new Engine(12, 150),
        new Engine(13, 350),
        new Engine(15, 500),
    ],
    m: [
        new Mashingun(1, 0.4, 200, 0, 2, { player1: true, player2: true }),
        new Mashingun(1.5, 0.6, 250, 150, 2),
        new Mashingun(0.05, 0.1, 250, 400, 30),
        new Mashingun(3, 0.7, 450, 500, 3),
        new Mashingun(5, 0.5, 510, 700, 2),
    ],
    r: [
        new Rocket(4.5, 0, 0, './img/AG.jpg', 70, 1, { player1: true, player2: true }),
        new Rocket(6, 0, 200, './img/VL-SRSAM.jpg', 150, 1),
        new Rocket(4.5, 0, 300, './img/AG.jpg', 20, 7),
        new Rocket(5, 1.2, 400, './img/missle.jpg', 100, 1),
        new Rocket(6, 2.2, 500, './img/topAAM.png', 225, 1),
    ],
    currentPlayer: 1,
    money: [rules.money.startValue, rules.money.startValue],
    kills: [0, 0]
}