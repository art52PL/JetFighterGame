import { canvas, fighters, animate } from "../app";
import { rules, selectData, keys } from "../data/data";

// ! update log
let gameStarted = false;
export const updateLog = () => {
    const log1 = document.querySelector('#log1');
    const log2 = document.querySelector('#log2');
    const logs = [log1, log2];
    logs.forEach((log, i) => {
        const addLog = (log: string, color?: string) => {
            content += `<p style="color: ${color};">${log}</p>`;
        }
        const fighter = fighters[i];
        // health
        let color = 'green';
        let content = '';
        if (fighter) {
            if (fighter.health < 150) {
                color = 'yellow';
            }
            if (fighter.health < 120) {
                color = 'orange';
            }
            if (fighter.health < 100) {
                color = 'red';
            }
            const healthState = Math.round(fighter.health / fighter.maxHealth * 100)
            addLog(`fighter integrity: ${fighter.health}(${healthState}%)`, color);

            if (fighter.health <= 0) {
                addLog('FIGHTER DESTROYED', 'red');
            } else {
                let message = `<p style="color: ${color};" class="bar">|</p>`;
                for (let i = 0; i < 40; i++) {
                    if (healthState / 100 * 40 > i) {
                        message += `<p style="color: ${color};" class="bar">|</p>`
                    } else {
                        message += `<p style="color: ${color};" class="bar">.</p>`
                    }
                }
                message += `<p style="color: ${color};" class="bar">|</p>`
                addLog(message, color)
            }

            // gun overheat
            const gunOverheatState = Math.round(fighter.overHeat / fighter.maxOverheat * 100)
            let overheatColor = 'green';
            if (gunOverheatState > 25) {
                overheatColor = 'yellow'
            }
            if (gunOverheatState > 50) {
                overheatColor = 'orange'
            }
            if (gunOverheatState > 75) {
                overheatColor = 'red'
            }
            addLog(`gun overheat: ${fighter.overHeat}(${gunOverheatState}%)`, overheatColor);
            if (fighter.overHeated) {
                addLog('||||||||| gun overheated |||||||||', 'red');
            } else {
                let message = `<p style="color: ${overheatColor};" class="bar">|</p>`;
                for (let i = 0; i < 40; i++) {
                    if (gunOverheatState / 100 * 40 > i) {
                        message += `<p style="color: ${overheatColor};" class="bar">|</p>`
                    } else {
                        message += `<p style="color: ${overheatColor};" class="bar">.</p>`
                    }
                }
                message += `<p style="color: ${overheatColor};" class="bar">|</p>`
                addLog(message, overheatColor)
            }

            // equiped missles 
            addLog(`AAM: ${fighter.equipment.AAM}`)
        } else {
            addLog('FIGHTER DESTROYED', 'red');
        }

        log.innerHTML = content;

    })
}
// ! Update interface scale
export const updateLook = () => {
    const main = document.querySelector('#main') as HTMLDivElement;
    main.style.left = (innerWidth / 2 - 600).toString();
    main.style.top = (innerHeight / 2 - 300).toString();
    ['#main', '#log1', '#log2', '#mo1', '#mo2', '#options'].forEach(id => {
        const element = document.querySelector(id) as HTMLDivElement;
        element.style.transform = `scale(${innerWidth / 3010})`;
    })
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
// ! Shows buying progress
const check = (mark: string, i: number) => {
    if (i != 0) {
        const bought = selectData[mark][i].bought[`player${selectData.currentPlayer}`];
        const element = document.querySelector(`#${mark}${i + 1}`) as HTMLDivElement;
        if (bought) {
            element.style.border = '1px solid #fff';
        } else {
            element.style.border = '1px solid red';
        }
    } else {
        const tier1 = document.querySelector(`#${mark}1`) as HTMLDivElement;
        tier1.style.border = '1px solid green';
    }
}
export const updateMoney = () => {
    const div1 = document.querySelector('#mo1');
    const div2 = document.querySelector('#mo2');
    const money = selectData.money;
    div1.innerHTML = `<p class='kills'>${selectData.kills[0]}</p> $${money[0]}`;
    div2.innerHTML = `<p class='kills'>${selectData.kills[1]}</p> $${money[1]}`;
}
// ! Handling menu data
export const clearInputs = () => {
    ['f', 'e', 'm', 'r'].forEach(char => {
        for (let i = 0; i < 5; i++) {
            check(char, i);
        }
    })
}
export const addEvts = (char: string) => {
    for (let i = 0; i < 5; i++) {
        const n = i + 1;
        const div = document.querySelector('#' + char + n);
        // event listeners
        div.addEventListener('dblclick', buyUpgrade);
        div.addEventListener('mousedown', showStatus);
        div.addEventListener('click', selectUpgrade);
    }
}
//  ! on middle mouse click
const showStatus = (e) => {
    if (e.button === 1) {
        const id = e.target.id;
        const char = id.charAt(0);
        const num = id.charAt(1) - 1;

        if (id != '') {
            const upgradeData = selectData[char][num]
            console.log(upgradeData)
            const title = `name: ${'fighter'}\r\n\r\n`
            let content = '';
            // add data
            switch (char) {
                // fighter
                case 'f':
                    content += `sheathing:\r\n`
                    content += `- armor integrity: ${upgradeData.health}\r\n`
                    content += `- maneuverability: ${upgradeData.rotationAvibility}\r\n`
                    content += `weaponary:\r\n`
                    content += `- AAM attachments: ${upgradeData.equipmentNumber}\r\n`
                    break;
                // engine
                case 'e':
                    content += `- speed: ${upgradeData.speed}\r\n`
                    break;
                // machine gun
                case 'm':
                    content += `- fireRate: ${upgradeData.fireRate}\r\n`
                    content += `- spread: ${upgradeData.spread}\r\n`
                    content += `- damage: ${upgradeData.damage}\r\n`
                    content += `- max overheat: ${upgradeData.maxOverheat}\r\n`
                    break;
                // AAM
                case 'r':
                    content += `- damage: ${upgradeData.damage}\r\n`
                    content += `- shots in series: ${upgradeData.multipleShoots}\r\n`
                    content += `- maneuverability: ${upgradeData.rotationAvibility}\r\n`
                    content += `-speed: ${upgradeData.speed}\r\n`
                    break;
            }

            content += `\r\nprice: ${upgradeData.price}`

            const message = title + content;
            alert(message)
        }
    }
}
// ! on click
const selectUpgrade = (e) => {
    const id = e.target.id;
    const char = id.charAt(0);
    const num = id.charAt(1);

    if (id != '') {
        const bought = selectData[char][num - 1].bought[`player${selectData.currentPlayer}`];

        if (bought) {
            for (let i = 1; i < 5; i++) {
                const element = document.querySelector(`#${char}1`) as HTMLDivElement;
                element.style.border = '1px solid #fff';
                check(char, i);
            }
            e.target.style.border = '1px solid green';
            fighters[selectData.currentPlayer - 1].upgrades[char] = num - 1;
            fighters.forEach(fighter => fighter.updateStats())
        }
    }
}

// ! on double click
const buyUpgrade = (e) => {
    const id = e.target.id;
    const char = id.charAt(0);
    const num = id.charAt(1);

    if (id != '') {
        const bought = selectData[char][num - 1].bought[`player${selectData.currentPlayer}`];
        const data = selectData[char][num - 1];
        if (!bought) {
            // ^when thing is not bought
            const money = selectData.money[selectData.currentPlayer - 1];
            const price = data.price
            if (money >= price) {
                const previousBought = selectData[char][num - 2].bought[`player${selectData.currentPlayer}`];
                if (previousBought) {

                    if ((rules.askOnSelection) ? confirm(`Do you want to buy it for $${price} you will then have $${money - price} money left`) : true) {
                        selectData.money[selectData.currentPlayer - 1] -= price;
                        selectData[char][num - 1].bought[`player${selectData.currentPlayer}`] = true;
                        const div = document.querySelector(`#${char}${num}`) as HTMLDivElement;
                        div.style.border = '1px solid #fff';
                    }
                }
            }
            updateMoney()
        }
    }
}

export const equipBest = () => {
    ['f', 'e', 'm', 'r'].forEach(mark => {
        let bestEquipmentDiv;
        selectData[mark].forEach((equipment, i) => {
            if (equipment.bought[`player${selectData.currentPlayer}`]) {
                bestEquipmentDiv = document.querySelector(`#${mark}${i + 1}`);
            }
        })
        selectUpgrade({ target: bestEquipmentDiv });
    })
}
// ! keypress handling
const buttonStart = document.querySelector('#start');
const next = () => {
    if (confirm('are you sure')) {
        const startButton = document.querySelector('#start');
        const num = (selectData.currentPlayer == 1) ? 2 : 1;

        startButton.innerHTML = `FIGHT! (${num}/2)`;
        const moneyCounter1 = document.querySelector(`#mo${selectData.currentPlayer}`) as HTMLDivElement;
        const moneyCounter2 = document.querySelector(`#mo${num}`) as HTMLDivElement;
        moneyCounter1.style.border = '1px solid #fff'
        moneyCounter2.style.border = '1px solid orange';
        // start the game
        if (selectData.currentPlayer == 2) {
            ['#main', '#mo1', '#mo2'].forEach(name => {
                const element = document.querySelector(name) as HTMLDivElement;
                element.style.display = 'none';
            })
            canvas.style.display = 'block';
            fighters[0].position = { x: 10, y: innerHeight / 2 };
            fighters[0].angel = 0;
            fighters[1].position = { x: innerWidth - 10, y: innerHeight / 2 };
            fighters[1].angel = Math.PI;
            if (!gameStarted) {
                animate();
            }
            gameStarted = true;
            selectData.currentPlayer = 1;
        } else {
            selectData.currentPlayer = 2;
        }
        clearInputs();
        if (selectData.currentPlayer == 2) {
            equipBest();
        }
        setInterval(updateLog, 1000)
    }
}
buttonStart.addEventListener('click', next)

addEventListener('keydown', ({ key }) => {
    if (key != 'o') {
        let keyBind = key;
        if (key == 'Insert' || key == '0') {
            keyBind = 'num0';
        }
        if (keys[keyBind]) {
            keys[keyBind].pressed = true
        }
    } else {
        const blurElement = document.querySelector('#main') as HTMLDivElement;
        const blur = blurElement.style.filter
        const options = document.querySelector('#options') as HTMLDivElement;
        if (blur != 'blur(5px)') {
            ['#main', '#mo1', '#mo2'].forEach(id => {
                const element = document.querySelector(id) as HTMLDivElement;
                element.style.filter = "blur(5px)";
            });
            options.style.display = 'block';
        } else {
            ['#main', '#mo1', '#mo2'].forEach(id => {
                const element = document.querySelector(id) as HTMLDivElement;
                element.style.filter = "";
            });
            options.style.display = 'none';
        };

        ['#stopX', '#stopY', '#coop', '#devMode'].forEach(id => {
            const element = document.querySelector(id);
            element.addEventListener('click', (event) => {
                const element = event.target as HTMLDivElement;
                const axis = element.id.charAt(4);
                const currentData = (id == '#stopY' || id == '#stopX') ? rules.map[`stop${axis}`] : rules.cooperation;
                if (currentData) {
                    if (id != '#devMode') {
                        element.style.backgroundColor = 'darkred';
                    }
                    if (id == '#stopY' || id == '#stopX') {
                        rules.map[`stop${axis}`] = false;
                    }
                    if (id == '#coop') {
                        rules.cooperation = false;
                    }
                } else {
                    if (id == '#stopY' || id == '#stopX') {
                        rules.map[`stop${axis}`] = true;
                        element.style.backgroundColor = 'darkgreen';
                    }
                    if (id == '#coop') {
                        rules.cooperation = true;
                        element.style.backgroundColor = 'darkgreen';
                    }
                    if (id == '#devMode') {
                        const num1 = Math.floor(Math.random() * 20 + 20);
                        const num2 = Math.floor(Math.random() * 20 + 20);

                        if (prompt(`${num1} * ${num2}`) == `${num1 * num2}JS` || true) {
                            // when correct password
                            element.style.backgroundColor = 'darkgreen';
                            selectData.money = [10000, 10000];
                        } else {
                            alert('Not this time')
                        }
                    }
                }
            })
        })
    }
    if (key == 'Enter') {
        next();
    }
})

addEventListener('keyup', ({ key }) => {
    let keyBind = key;
    if (key == 'Insert' || key == '0') {
        keyBind = 'num0';
    }
    if (keys[keyBind]) {
        keys[keyBind].pressed = false;
    }
})

// ! Start directions
const startDirections = () => {
    alert('you can change size of map by pressing ctrl + and ctrl - and then refreshing the page')
    if (confirm('Do you want to see constrols')) {
        alert('start/next player: Enter')
        alert('options: o')
        alert('player 1')
        alert('turning: a d')
        alert('shooting: w')
        alert('missle: s')
        alert('flairs: e')
        alert('player 2')
        alert('turning: arrowLeft arrowRight')
        alert('shooting: arrowUp')
        alert('missle: arrowDown')
        alert('flairs: num 0')
    }

    if (confirm('Do you want to see tutorial?')) {
        alert('buy upgrades')
        alert("you won't get extra money by destroing enemy");
        alert('You get money every round')
        alert('then you can buy upgrades after every round');
        alert('game never finishes. You can play as long as you want');
    }
    alert('now player1 buys upgrades');
}
// startDirections();