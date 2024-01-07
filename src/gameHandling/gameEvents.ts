import { canvas, fighters } from "../app";
import { selectData, rules } from "../data/data";

import { Fighter } from "../classes/fighter";

import { updateMoney } from "./userInterface";

export const restart = () => {
    start();
    canvas.style.display = 'none';
    ['#main', '#mo1', '#mo2'].forEach(name => {
        const element = document.querySelector(name) as HTMLDivElement;
        element.style.display = 'block';
    })
    selectData.money.forEach((value, i) => {
        selectData.money[i] += rules.money.addedValue;
    })
    updateMoney();
}
export const start = () => {
    const player1 = new Fighter(10, canvas.height / 2, 10, './img/f35.png', 0, 0, {
        left: 'a',
        right: 'd',
        shoot: 'w',
        equipment: 's',
        flairs: 'e',
    });
    fighters[0] = player1;
    const player2 = new Fighter(canvas.width - 10, canvas.height / 2, -10, './img/f35.png', Math.PI, 1, {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        shoot: 'ArrowUp',
        equipment: 'ArrowDown',
        flairs: 'num0',
    });
    fighters[1] = player2;
    fighters.forEach((fighter) => {
        fighter.startTracking();
    })
    if (rules.cooperation) {

    }
}

// ! handling extra data
export const createImg = (src: string) => {
    const img = new Image();
    img.src = src;
    return img;
}