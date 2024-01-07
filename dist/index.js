/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.animate = exports.fighters = exports.particles = exports.smokes = exports.projectiles = exports.AAMs = exports.c = exports.canvas = void 0;
var userInterface_1 = __webpack_require__(/*! ./gameHandling/userInterface */ "./src/gameHandling/userInterface.ts");
var gameEvents_1 = __webpack_require__(/*! ./gameHandling/gameEvents */ "./src/gameHandling/gameEvents.ts");
var weaponaryInterface_1 = __webpack_require__(/*! ./gameHandling/weaponaryInterface */ "./src/gameHandling/weaponaryInterface.ts");
var Particle_1 = __webpack_require__(/*! ./classes/Particle */ "./src/classes/Particle.ts");
exports.canvas = document.querySelector('canvas');
exports.c = exports.canvas.getContext('2d');
(0, userInterface_1.updateLook)();
setInterval(userInterface_1.updateLook, 1);
exports.AAMs = [];
exports.projectiles = [];
exports.smokes = [];
exports.particles = [];
exports.fighters = [];
// !animate
// Is called every animation frame
var animate = function () {
    // prepare map
    exports.c.clearRect(0, 0, exports.canvas.width, exports.canvas.height);
    exports.c.beginPath();
    exports.c.fillStyle = 'black';
    exports.c.fillRect(0, 0, exports.canvas.width, exports.canvas.height);
    exports.c.fill();
    exports.c.closePath();
    // draw tracking interface
    exports.fighters.forEach(weaponaryInterface_1.drawTrackingInterface);
    exports.fighters.forEach(function (fighter, i) {
        if (fighter.health <= 0) {
            fighter.explode();
            exports.fighters.splice(i, 1);
        }
        fighter.update();
    });
    // ! update projectiles
    exports.projectiles.forEach(function (projectile, i) {
        projectile.update();
        if (projectile.position.x < 0 ||
            projectile.position.x > exports.canvas.width ||
            projectile.position.y < 0 ||
            projectile.position.y > exports.canvas.height) {
            exports.projectiles.splice(i, 1);
        }
        else {
            exports.fighters.forEach(function (fighter, j) {
                // ^on hit
                if (projectile.position.x > fighter.position.x &&
                    projectile.position.x < fighter.position.x + fighter.width &&
                    projectile.position.y > fighter.position.y &&
                    projectile.position.y < fighter.position.y + fighter.height && j !=
                    projectile.target) {
                    exports.projectiles.splice(i, 1);
                    fighter.health -= projectile.damage;
                    for (var i_1 = 0; i_1 < 3; i_1++) {
                        var n = Math.random() * 2;
                        var color = (n > 1) ? 'darkgrey' : 'orange';
                        var position = {
                            x: fighter.position.x + fighter.width / 2,
                            y: fighter.position.y + fighter.height / 2
                        };
                        var velocity = {
                            x: (Math.random() - 0.5) * 4 + fighter.velocity.x / 2,
                            y: (Math.random() - 0.5) * 4 + fighter.velocity.y / 2
                        };
                        exports.particles.push(new Particle_1.Particle(position, velocity, color));
                    }
                }
            });
        }
    });
    exports.particles.forEach(function (particle, i) {
        if (particle.throwsSmoke) {
            particle.smoke();
        }
        if (particle.alpha <= 0) {
            exports.particles.splice(i, 1);
        }
        else {
            particle.update();
        }
    });
    exports.smokes.forEach(function (smoke, i) {
        smoke.draw();
        if (smoke.alpha <= 0) {
            exports.smokes.splice(i, 1);
        }
        else {
            var n = 0.1 / smoke.lenght;
            smoke.alpha -= n;
        }
    });
    exports.AAMs.forEach(function (missle, i) {
        missle.smoke();
        missle.update();
        // ^when escapes the map
        if (missle.position.x < 0 || missle.position.x + missle.width > exports.canvas.width ||
            missle.position.y < 0 || missle.position.y + missle.height > exports.canvas.height) {
            exports.AAMs.splice(i, 1);
        }
        var targetPos = missle.target.position;
        // ^when hits the target
        if (missle.position.x > targetPos.x - 20 && missle.position.x < targetPos.x + missle.target.width + 20 &&
            missle.position.y > targetPos.y - 20 && missle.position.y < targetPos.y + missle.target.height + 20) {
            missle.target.health -= missle.damage;
            missle.explode();
            exports.AAMs.splice(i, 1);
        }
    });
    requestAnimationFrame(exports.animate);
};
exports.animate = animate;
// ! Handle menu selection 
['f', 'e', 'm', 'r'].forEach(function (char) { return (0, userInterface_1.addEvts)(char); });
(0, userInterface_1.clearInputs)();
(0, gameEvents_1.start)();
exports.fighters.forEach(function (fighter) {
    fighter.startTracking();
});
// --- NOTES ---
// TO DO
// - Targeting system
// 1 - gun
// 2 - missle
// equipment setup
// - Game types
// -  missle classes
// - another tiers


/***/ }),

/***/ "./src/classes/AAM.ts":
/*!****************************!*\
  !*** ./src/classes/AAM.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.AAM = void 0;
var app_1 = __webpack_require__(/*! ../app */ "./src/app.ts");
var gameEvents_1 = __webpack_require__(/*! ../gameHandling/gameEvents */ "./src/gameHandling/gameEvents.ts");
var Smoke_1 = __webpack_require__(/*! ./Smoke */ "./src/classes/Smoke.ts");
var Particle_1 = __webpack_require__(/*! ./Particle */ "./src/classes/Particle.ts");
var AAM = /** @class */ (function () {
    function AAM(velocity, position, angel, target, speed, rotationAvibility, dmg, img) {
        // look
        this.width = 50;
        this.height = 12.5;
        this.src = img;
        this.img = (0, gameEvents_1.createImg)(this.src);
        // rotation
        this.angel = angel;
        this.rotation = 0;
        this.rotationAvibility = rotationAvibility;
        // position
        this.speed = speed;
        this.position = {
            x: position.x,
            y: position.y
        };
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        };
        this.target = target;
        this.damage = dmg;
    }
    // ! updating
    AAM.prototype.draw = function () {
        app_1.c.save();
        app_1.c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        app_1.c.rotate(this.angel);
        app_1.c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        app_1.c.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
        app_1.c.restore();
        this.rotation = 0;
    };
    AAM.prototype.update = function () {
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;
        this.trackTarget();
        this.updateVelocity();
        this.draw();
    };
    //  ! efects
    AAM.prototype.smoke = function () {
        var smoke1 = new Smoke_1.Smoke(this.position.x + this.width / 2, this.position.y + this.height / 2, 'orange', 4, 1, 2);
        app_1.smokes.push(smoke1);
    };
    AAM.prototype.explode = function () {
        for (var i = 0; i < 30; i++) {
            var n = Math.random() * 2;
            var color = (n > 1) ? 'darkgrey' : 'orange';
            var velocity = {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            };
            app_1.particles.push(new Particle_1.Particle(this.position, velocity, color));
        }
    };
    // ! movement
    AAM.prototype.trackTarget = function () {
        var _this = this;
        var x = this.target.position.x - this.position.x;
        var y = this.target.position.y - this.position.y;
        app_1.particles.forEach(function (particle) {
            if (particle.throwsSmoke) {
                var particleX = particle.position.x;
                var particleY = particle.position.y;
                if (_this.position.x - particleX > -500 && _this.position.x - particleX < 500 &&
                    _this.position.y - particleY > -500 && _this.position.y - particleX < 500) {
                    x = particleX - _this.position.x;
                    y = particleY - _this.position.y;
                }
            }
        });
        var angelOnTarget = Math.atan2(y, x) / Math.PI * 180;
        var angel = this.angel / Math.PI * 180;
        if (angel < -90 && angelOnTarget > 90 || angel > 90 && angelOnTarget < -90) {
            if (angel < -90 && angelOnTarget > 90) {
                this.angel -= this.rotationAvibility / 100;
            }
            if (angel > 90 && angelOnTarget < -90) {
                this.angel += this.rotationAvibility / 100;
            }
        }
        else {
            if (angel >= angelOnTarget) {
                this.angel -= this.rotationAvibility / 100;
            }
            if (angel < angelOnTarget) {
                this.angel += this.rotationAvibility / 100;
            }
        }
    };
    AAM.prototype.updateVelocity = function () {
        var deg360 = Math.PI * 2;
        // if 0 < deg < 90
        if (this.angel > 0 && this.angel < deg360 / 4) {
            var y = this.angel / deg360 * 4;
            var x = 1 - y;
            this.velocity.x = x * this.speed;
            this.velocity.y = y * this.speed;
        }
        // if 0 > deg > -90
        if (this.angel <= 0 && this.angel > -deg360 / 4 || this.angel < -deg360 / 4 * 3) {
            var y = this.angel / deg360 * 4;
            var x = 1 + y;
            this.velocity.x = x * this.speed;
            this.velocity.y = y * this.speed;
        }
        // if 90 < deg < 180
        if (this.angel > deg360 / 4) {
            var currentAngel = this.angel - deg360 / 4;
            var x = currentAngel / deg360 * 4;
            var y = 1 - x;
            this.velocity.x = -x * this.speed;
            this.velocity.y = y * this.speed;
        }
        // if -90 > deg > -180 -broken-
        if (this.angel < -deg360 / 4) {
            var currentAngel = -this.angel - deg360 / 4;
            var x = currentAngel / deg360 * 4;
            var y = 1 - x;
            this.velocity.x = -x * this.speed;
            this.velocity.y = -y * this.speed;
        }
    };
    return AAM;
}());
exports.AAM = AAM;


/***/ }),

/***/ "./src/classes/Particle.ts":
/*!*********************************!*\
  !*** ./src/classes/Particle.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Particle = void 0;
var app_1 = __webpack_require__(/*! ../app */ "./src/app.ts");
var Smoke_1 = __webpack_require__(/*! ./Smoke */ "./src/classes/Smoke.ts");
var app_2 = __webpack_require__(/*! ../app */ "./src/app.ts");
var Particle = /** @class */ (function () {
    function Particle(position, velocity, color, size, smokes) {
        this.position = {
            x: position.x,
            y: position.y
        };
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        };
        this.radious = size || 1;
        this.color = color;
        this.alpha = 1;
        this.throwsSmoke = smokes || false;
    }
    //  ! updating
    Particle.prototype.draw = function () {
        app_1.c.beginPath();
        app_1.c.arc(this.position.x, this.position.y, this.radious, 0, Math.PI * 2);
        app_1.c.fillStyle = this.color;
        app_1.c.fill();
        app_1.c.closePath;
    };
    Particle.prototype.update = function () {
        this.alpha -= 0.01;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
    };
    // ! efects
    Particle.prototype.smoke = function () {
        var smoke1 = new Smoke_1.Smoke(this.position.x, this.position.y, 'rgb(183, 183, 183)', 7, 0.5, 6);
        var smoke2 = new Smoke_1.Smoke(this.position.x, this.position.y, 'rgb(253, 225, 102)', 6, 0.7, 3);
        app_2.smokes.push(smoke1);
        app_2.smokes.push(smoke2);
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
    };
    return Particle;
}());
exports.Particle = Particle;


/***/ }),

/***/ "./src/classes/Projectile.ts":
/*!***********************************!*\
  !*** ./src/classes/Projectile.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Projectile = void 0;
var app_1 = __webpack_require__(/*! ../app */ "./src/app.ts");
var Smoke_1 = __webpack_require__(/*! ./Smoke */ "./src/classes/Smoke.ts");
var Projectile = /** @class */ (function () {
    function Projectile(position, velocity, target, damage) {
        this.position = {
            x: position.x,
            y: position.y
        };
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        };
        this.color = 'orange';
        this.damage = damage;
        this.radious = this.damage / 8 + 2;
        this.target = target;
    }
    // ! updating
    Projectile.prototype.draw = function () {
        app_1.c.beginPath();
        app_1.c.arc(this.position.x, this.position.y, this.radious, 0, Math.PI * 2);
        app_1.c.fillStyle = this.color;
        app_1.c.fill();
        app_1.c.closePath;
    };
    Projectile.prototype.update = function () {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
        this.smoke();
    };
    // ! efects
    Projectile.prototype.smoke = function () {
        var smoke1 = new Smoke_1.Smoke(this.position.x, this.position.y, 'orange', this.radious, 0.9, 0.5 + this.damage / 8);
        app_1.smokes.push(smoke1);
    };
    return Projectile;
}());
exports.Projectile = Projectile;


/***/ }),

/***/ "./src/classes/Smoke.ts":
/*!******************************!*\
  !*** ./src/classes/Smoke.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Smoke = void 0;
var app_1 = __webpack_require__(/*! ../app */ "./src/app.ts");
var Smoke = /** @class */ (function () {
    function Smoke(x, y, color, radious, alpha, lenght) {
        this.position = {
            x: x,
            y: y
        };
        this.radious = radious;
        this.color = color;
        this.alpha = alpha;
        this.lenght = lenght;
    }
    Smoke.prototype.draw = function () {
        if (this.alpha > 0) {
            app_1.c.beginPath();
            app_1.c.save();
            app_1.c.globalAlpha = this.alpha;
            app_1.c.arc(this.position.x, this.position.y, this.radious, 0, Math.PI * 2);
            app_1.c.fillStyle = this.color;
            app_1.c.fill();
            app_1.c.restore();
            app_1.c.closePath();
        }
    };
    return Smoke;
}());
exports.Smoke = Smoke;


/***/ }),

/***/ "./src/classes/fighter.ts":
/*!********************************!*\
  !*** ./src/classes/fighter.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.Fighter = void 0;
var app_1 = __webpack_require__(/*! ../app */ "./src/app.ts");
var gameEvents_1 = __webpack_require__(/*! ../gameHandling/gameEvents */ "./src/gameHandling/gameEvents.ts");
var userInterface_1 = __webpack_require__(/*! ../gameHandling/userInterface */ "./src/gameHandling/userInterface.ts");
var data_1 = __webpack_require__(/*! ../data/data */ "./src/data/data.ts");
var Projectile_1 = __webpack_require__(/*! ./Projectile */ "./src/classes/Projectile.ts");
var Smoke_1 = __webpack_require__(/*! ./Smoke */ "./src/classes/Smoke.ts");
var Particle_1 = __webpack_require__(/*! ./Particle */ "./src/classes/Particle.ts");
var AAM_1 = __webpack_require__(/*! ./AAM */ "./src/classes/AAM.ts");
var data_2 = __webpack_require__(/*! ../data/data */ "./src/data/data.ts");
var Fighter = /** @class */ (function () {
    function Fighter(x, y, velX, img, rotation, id, keys) {
        // look
        this.img = (0, gameEvents_1.createImg)(img);
        this.imgSave = (0, gameEvents_1.createImg)(img);
        this.width = 75;
        this.height = 50;
        // upgrades
        this.upgrades = {
            f: 0,
            e: 0,
            m: 0,
            r: 0
        };
        // position
        this.position = {
            x: x,
            y: y
        };
        this.velocity = {
            x: velX,
            y: 0
        };
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
        };
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
        };
        this.AAMfired = false;
        this.flairsShoot = false;
        // handling
        this.keys = keys;
        this.id = id;
        this.health = 150;
        this.maxHealth = this.health;
    }
    // ! weaponary
    Fighter.prototype.shoot = function () {
        for (var i = 0; i < this.fireRate; i++) {
            if (this.fireRate < 1) {
                this.gun.shootTime += this.fireRate;
            }
            if (!this.overHeated && this.gun.shootTime >= 1) {
                var randomX = (Math.random() - 0.5) * this.spread;
                var randomY = (Math.random() - 0.5) * this.spread;
                var position = {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height / 2
                };
                var velocity = {
                    x: this.velocity.x * 3 + randomX * 3,
                    y: this.velocity.y * 3 + randomY * 3
                };
                var currentProjectile = new Projectile_1.Projectile(position, velocity, this.id, this.damage);
                app_1.projectiles.push(currentProjectile);
                this.overHeat += this.damage;
                if (this.fireRate < 1 && this.gun.shootTime) {
                    this.gun.shootTime = 0;
                }
            }
        }
    };
    // checks if target is in tracking range
    Fighter.prototype.startTracking = function () {
        var _this = this;
        var targetId = (this.id == 1) ? 1 : 2;
        var target = app_1.fighters[targetId - 1];
        var checkIfTargetTracked = function () {
            var x = target.position.x - _this.position.x;
            var y = target.position.y - _this.position.y;
            var angelOnTarget = Math.atan2(y, x) / Math.PI * -180;
            var angel = _this.angel / Math.PI * -180;
            var maxAngelOfTracking = 30;
            if (Math.round(angel) - Math.round(angelOnTarget) < maxAngelOfTracking
                && Math.round(angel) - Math.round(angelOnTarget) > -maxAngelOfTracking) {
                return true;
            }
            else {
                return false;
            }
        };
        // checks if target was in range for 5 seconds
        setInterval(function () {
            console.log(checkIfTargetTracked());
            if (checkIfTargetTracked()) {
                if (_this.equipment.AAMStatus.targetLockStatus < 10) {
                    _this.equipment.AAMStatus.targetLockStatus += 1;
                }
            }
            else {
                _this.equipment.AAMStatus.targetLockStatus = 0;
            }
            if (_this.equipment.AAMStatus.targetLockStatus == 10) {
                _this.equipment.AAMStatus.targetLocked = true;
            }
            else {
                _this.equipment.AAMStatus.targetLocked = false;
            }
        }, 100);
        setInterval(function () {
            _this.equipment.AAMStatus.trackingIntervalFlag *= -1;
        }, 250);
    };
    Fighter.prototype.fireAAM = function () {
        var _this = this;
        var keyShoot = data_1.keys[this.keys.equipment];
        var targetId = (this.id == 1) ? 1 : 2;
        var target = app_1.fighters[targetId - 1];
        var checkDistance = function () {
            var distanceX = (_this.position.x - target.position.x > 0) ? _this.position.x - target.position.x : target.position.x - _this.position.x;
            var distanceY = (_this.position.y - target.position.y > 0) ? _this.position.y - target.position.y : target.position.y - _this.position.y;
            if (Math.sqrt(distanceX * distanceX + distanceY * distanceY) > 500) {
                return true;
            }
            return false;
        };
        // ! Shoot
        if (keyShoot.pressed && this.equipment.AAM > 0 && !this.AAMfired && checkDistance() && this.equipment.AAMStatus.targetLocked
            || keyShoot.pressed && this.equipment.AAM > 0 && !this.AAMfired && checkDistance() && this.equipment.AAMStatus.rotationAvibility == 0) {
            if (app_1.fighters[targetId - 1]) {
                var shoots_1 = this.equipment.AAMStatus.multipleShoots;
                var shooting_1 = setInterval(function () {
                    --shoots_1;
                    var position = {
                        x: _this.position.x + _this.width / 2,
                        y: _this.position.y + _this.height / 2
                    };
                    var velocity = {
                        x: 0,
                        y: 0
                    };
                    var missle = new AAM_1.AAM(velocity, position, (_this.equipment.AAMStatus.multipleShoots > 1) ? _this.angel + (Math.random() - 0.5) * 0.1 : _this.angel, target, _this.equipment.AAMStatus.speed, _this.equipment.AAMStatus.rotationAvibility, _this.equipment.AAMStatus.damage, _this.equipment.AAMSkin);
                    app_1.AAMs.push(missle);
                    if (shoots_1 <= 0) {
                        clearInterval(shooting_1);
                    }
                }, 100);
                this.AAMfired = true;
                setTimeout(function () {
                    _this.AAMfired = false;
                }, 500);
                this.equipment.AAM--;
            }
        }
    };
    // ! updating
    Fighter.prototype.updateStats = function () {
        var _this = this;
        var getData = function (char) { return data_2.selectData[char][_this.upgrades[char]]; };
        var data;
        // fighter
        data = getData('f');
        this.rotationAvibility = data.rotationAvibility;
        this.health = data.health;
        this.maxHealth = data.health;
        this.equipment.AAM = data.equipmentNumber;
        this.img = (0, gameEvents_1.createImg)(data.img);
        this.imgSave = (0, gameEvents_1.createImg)(data.img);
        // engine
        data = getData('e');
        this.speed = data.speed;
        // MachineGun
        data = getData('m');
        this.spread = data.spread;
        this.fireRate = data.fireRate;
        this.damage = data.damage;
        this.maxOverheat = data.maxOverheat;
        // AAM
        data = getData('r');
        this.equipment.AAMStatus.rotationAvibility = data.rotationAvibility;
        this.equipment.AAMStatus.speed = data.speed;
        this.equipment.AAMStatus.damage = data.damage;
        this.equipment.AAMSkin = data.skin;
        this.equipment.AAMStatus.multipleShoots = data.multipleShoots;
    };
    Fighter.prototype.draw = function () {
        app_1.c.save();
        app_1.c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        app_1.c.rotate(this.angel);
        app_1.c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        app_1.c.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
        app_1.c.restore();
        this.rotation = 0;
    };
    // ^ main function calling another functions in designated order
    Fighter.prototype.update = function () {
        if (data_1.keys[this.keys.flairs].pressed && !this.flairsShoot)
            this.lunchFlairs();
        this.updateRotation();
        this.updateVelocity();
        this.smoke();
        this.fireAAM();
        // update guns status 
        var keyShoot = data_1.keys[this.keys.shoot];
        if (keyShoot.pressed) {
            this.shoot();
        }
        else {
            if (this.overHeat < 0) {
                this.overHeat = 0;
            }
            else {
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
        if (data_2.rules.map.stopX) {
            if (this.position.x < 10) {
                if (this.velocity.x > 0) {
                    this.position.x += this.velocity.x;
                }
            }
            else if (this.position.x > app_1.canvas.width - 100) {
                if (this.velocity.x < 0) {
                    this.position.x += this.velocity.x;
                }
            }
            else {
                this.position.x += this.velocity.x;
            }
        }
        else {
            if (this.position.x < 0) {
                this.position.x = app_1.canvas.width;
            }
            if (this.position.x > app_1.canvas.width) {
                this.position.x = 0;
            }
            this.position.x += this.velocity.x;
        }
        if (data_2.rules.map.stopY) {
            if (this.position.y < 10) {
                if (this.velocity.y > 0) {
                    this.position.y += this.velocity.y;
                }
            }
            else if (this.position.y > app_1.canvas.height - 100) {
                if (this.velocity.y < 0) {
                    this.position.y += this.velocity.y;
                }
            }
            else {
                this.position.y += this.velocity.y;
            }
        }
        else {
            if (this.position.y < 0) {
                this.position.y = app_1.canvas.height;
            }
            if (this.position.y > app_1.canvas.height) {
                this.position.y = 0;
            }
            this.position.y += this.velocity.y;
        }
        this.draw();
    };
    // ! efects
    Fighter.prototype.explode = function () {
        for (var i = 0; i < 30; i++) {
            var n = Math.random() * 2;
            var color = (n > 1) ? 'darkgrey' : 'orange';
            var velocity = {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            };
            app_1.particles.push(new Particle_1.Particle(this.position, velocity, color));
        }
        var num = (this.id == 1) ? 0 : 1;
        data_2.selectData.kills[num] += 1;
        setTimeout(function () {
            (0, gameEvents_1.restart)();
            (0, userInterface_1.equipBest)();
        }, 5000);
    };
    Fighter.prototype.lunchFlairs = function () {
        var _this = this;
        this.flairsShoot = true;
        var lunch = function () {
            var position = {
                x: _this.position.x,
                y: _this.position.y
            };
            var velocity1 = {
                x: (_this.velocity.y - _this.velocity.x / 2 + (Math.random() - 0.5) * 3) * 1.5,
                y: (_this.velocity.x - _this.velocity.y / 2 + (Math.random() - 0.5) * 3) * 1.5
            };
            var velocity2 = {
                x: (-_this.velocity.y - _this.velocity.x / 2 + (Math.random() - 0.5) * 3) * 1.5,
                y: (-_this.velocity.x - _this.velocity.y / 2 + (Math.random() - 0.5) * 3) * 1.5
            };
            var color = 'rgb(253, 225, 102)';
            var flair1 = new Particle_1.Particle(position, velocity1, color, 5, true);
            var flair2 = new Particle_1.Particle(position, velocity2, color, 5, true);
            app_1.particles.push(flair1);
            app_1.particles.push(flair2);
        };
        for (var i = 1; i > 0; i--) {
            lunch();
            setTimeout(lunch, 1000);
        }
        var lunching = setInterval(function () {
            for (var i = 1; i > 0; i--) {
                lunch();
            }
        }, 166);
        setTimeout(function () {
            clearInterval(lunching);
        }, 1500);
        setTimeout(function () {
            _this.flairsShoot = false;
        }, 7000);
    };
    Fighter.prototype.smoke = function () {
        var _this = this;
        var x = this.position.x + this.width / 2;
        var y = this.position.y + this.height / 2;
        var smoke1 = new Smoke_1.Smoke(x, y, 'orange', 5, 1, 1);
        var smoke3 = new Smoke_1.Smoke(x, y, 'white', 30, 0.1, 20);
        var smoke4 = new Smoke_1.Smoke(x, y, 'grey', 30, 0.1, 20);
        setTimeout(function () {
            app_1.smokes.push(smoke1);
            if (_this.health < 100) {
                app_1.smokes.push(smoke3);
                app_1.smokes.push(smoke4);
            }
        }, 50);
    };
    // ! movement
    Fighter.prototype.updateVelocity = function () {
        var turnKeys = [this.keys.left, this.keys.right];
        var getTurnKeysPressStatus = function () {
            var keys1 = [];
            turnKeys.forEach(function (key) { return keys1.push(data_1.keys[key].pressed); });
            return keys1;
        };
        var turnKeysPressStatus = getTurnKeysPressStatus();
        if (this.slowDown < 0.2 && turnKeysPressStatus[0] && !turnKeysPressStatus[1] || this.slowDown < 0.2 && turnKeysPressStatus[1] && !turnKeysPressStatus[0]) {
            this.slowDown += 0.004;
        }
        else {
            if (this.slowDown <= 0) {
                this.slowDown = 0;
            }
            else {
                this.slowDown -= 0.01;
            }
        }
        var deg360 = Math.PI * 2;
        // if 0 < deg < 90
        if (this.angel > 0 && this.angel < deg360 / 4) {
            var y = this.angel / deg360 * 4;
            var x = 1 - y;
            this.velocity.x = x * this.speed * (1 - this.slowDown);
            this.velocity.y = y * this.speed * (1 - this.slowDown);
        }
        // if 0 > deg > -90
        if (this.angel < 0 && this.angel > -deg360 / 4 || this.angel < -deg360 / 4 * 3) {
            var y = this.angel / deg360 * 4;
            var x = 1 + y;
            this.velocity.x = x * this.speed * (1 - this.slowDown);
            this.velocity.y = y * this.speed * (1 - this.slowDown);
        }
        // if 90 < deg < 180
        if (this.angel > deg360 / 4) {
            var currentAngel = this.angel - deg360 / 4;
            var x = currentAngel / deg360 * 4;
            var y = 1 - x;
            this.velocity.x = -x * this.speed * (1 - this.slowDown);
            this.velocity.y = y * this.speed * (1 - this.slowDown);
        }
        // if -90 > deg > -180
        if (this.angel < -deg360 / 4) {
            var currentAngel = -this.angel - deg360 / 4;
            var x = currentAngel / deg360 * 4;
            var y = 1 - x;
            this.velocity.x = -x * this.speed * (1 - this.slowDown);
            this.velocity.y = -y * this.speed * (1 - this.slowDown);
        }
    };
    Fighter.prototype.updateRotation = function () {
        var keyLeft = data_1.keys[this.keys.left];
        var keyRight = data_1.keys[this.keys.right];
        var keys1 = {
            keyLeft: keyLeft,
            keyRight: keyRight
        };
        this.img = this.imgSave;
        var fighterDamage = (this.health < 100) ? 0.7 : 1;
        if (keys1.keyLeft.pressed) {
            this.rotation = -this.rotationAvibility * fighterDamage;
            if (this.img.src.includes('f16')) {
                this.img = (0, gameEvents_1.createImg)('./img/f16v2.png');
            }
            if (this.img.src.includes('su17')) {
                this.img = (0, gameEvents_1.createImg)('./img/su17-2.png');
            }
        }
        if (keys1.keyRight.pressed) {
            this.rotation = this.rotationAvibility * fighterDamage;
            if (this.img.src.includes('f16')) {
                this.img = (0, gameEvents_1.createImg)('./img/f16v3.png');
            }
            if (this.img.src.includes('su17')) {
                this.img = (0, gameEvents_1.createImg)('./img/su17-3.png');
            }
        }
        if (keys1.keyRight.pressed && keys1.keyLeft.pressed) {
            this.rotation = 0;
            this.img = this.imgSave;
        }
        if (this.angel > Math.PI) {
            this.angel = -Math.PI;
        }
        if (this.angel < -Math.PI) {
            this.angel = Math.PI;
        }
        this.angel += this.rotation;
    };
    return Fighter;
}());
exports.Fighter = Fighter;


/***/ }),

/***/ "./src/data/classes/Engine.ts":
/*!************************************!*\
  !*** ./src/data/classes/Engine.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Engine = void 0;
var Engine = /** @class */ (function () {
    function Engine(speed, price, bought) {
        this.speed = speed;
        this.price = price;
        this.bought = bought || { player1: false, player2: false };
    }
    return Engine;
}());
exports.Engine = Engine;


/***/ }),

/***/ "./src/data/classes/MachineGun.ts":
/*!****************************************!*\
  !*** ./src/data/classes/MachineGun.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Mashingun = void 0;
var Mashingun = /** @class */ (function () {
    function Mashingun(fireRate, spread, maxOverheat, price, damage, bought) {
        this.fireRate = fireRate;
        this.spread = spread;
        this.maxOverheat = maxOverheat;
        this.price = price;
        this.damage = damage;
        this.bought = bought || { player1: false, player2: false };
    }
    return Mashingun;
}());
exports.Mashingun = Mashingun;


/***/ }),

/***/ "./src/data/classes/Plane.ts":
/*!***********************************!*\
  !*** ./src/data/classes/Plane.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Plane = void 0;
var Plane = /** @class */ (function () {
    function Plane(rotationAvibility, health, price, equipmentNumber, img, bought) {
        this.img = img;
        this.rotationAvibility = rotationAvibility;
        this.health = health;
        this.price = price;
        this.equipmentNumber = equipmentNumber;
        this.bought = bought || { player1: false, player2: false };
    }
    return Plane;
}());
exports.Plane = Plane;


/***/ }),

/***/ "./src/data/classes/Rocket.ts":
/*!************************************!*\
  !*** ./src/data/classes/Rocket.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.Rocket = void 0;
var Rocket = /** @class */ (function () {
    function Rocket(speed, rotationAvibility, price, skin, damage, multipleShoots, bought) {
        this.speed = speed;
        this.rotationAvibility = rotationAvibility;
        this.price = price;
        this.bought = bought || { player1: false, player2: false };
        this.skin = skin;
        this.damage = damage;
        this.multipleShoots = multipleShoots;
    }
    return Rocket;
}());
exports.Rocket = Rocket;


/***/ }),

/***/ "./src/data/data.ts":
/*!**************************!*\
  !*** ./src/data/data.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.selectData = exports.keys = exports.rules = void 0;
var Plane_1 = __webpack_require__(/*! ./classes/Plane */ "./src/data/classes/Plane.ts");
var Engine_1 = __webpack_require__(/*! ./classes/Engine */ "./src/data/classes/Engine.ts");
var MachineGun_1 = __webpack_require__(/*! ./classes/MachineGun */ "./src/data/classes/MachineGun.ts");
var Rocket_1 = __webpack_require__(/*! ./classes/Rocket */ "./src/data/classes/Rocket.ts");
exports.rules = {
    map: {
        stopX: true,
        stopY: true
    },
    money: {
        startValue: 200,
        addedValue: 500
    },
    cooperation: false,
    askOnSelection: false
};
exports.keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    s: { pressed: false },
    e: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false },
    ArrowDown: { pressed: false },
    num0: { pressed: false }
};
exports.selectData = {
    f: [
        new Plane_1.Plane(0.02, 150, 0, 2, './img/czerwony.png', { player1: true, player2: true }),
        new Plane_1.Plane(0.025, 200, 100, 2, './img/su17.png'),
        new Plane_1.Plane(0.027, 250, 250, 3, './img/mig29-KiowGhost-2.png'),
        new Plane_1.Plane(0.03, 350, 450, 3, './img/f16v1.png'),
        new Plane_1.Plane(0.035, 500, 500, 4, './img/F-35.png'),
    ],
    e: [
        new Engine_1.Engine(10, 0, { player1: true, player2: true }),
        new Engine_1.Engine(11, 50),
        new Engine_1.Engine(12, 150),
        new Engine_1.Engine(13, 350),
        new Engine_1.Engine(15, 500),
    ],
    m: [
        new MachineGun_1.Mashingun(1, 0.4, 200, 0, 2, { player1: true, player2: true }),
        new MachineGun_1.Mashingun(1.5, 0.6, 250, 150, 2),
        new MachineGun_1.Mashingun(0.05, 0.1, 250, 400, 30),
        new MachineGun_1.Mashingun(3, 0.7, 450, 500, 3),
        new MachineGun_1.Mashingun(5, 0.5, 510, 700, 2),
    ],
    r: [
        new Rocket_1.Rocket(4.5, 0, 0, './img/AG.jpg', 70, 1, { player1: true, player2: true }),
        new Rocket_1.Rocket(6, 0, 200, './img/VL-SRSAM.jpg', 150, 1),
        new Rocket_1.Rocket(4.5, 0, 300, './img/AG.jpg', 20, 7),
        new Rocket_1.Rocket(5, 1.2, 400, './img/missle.jpg', 100, 1),
        new Rocket_1.Rocket(6, 2.2, 500, './img/topAAM.png', 225, 1),
    ],
    currentPlayer: 1,
    money: [exports.rules.money.startValue, exports.rules.money.startValue],
    kills: [0, 0]
};


/***/ }),

/***/ "./src/gameHandling/gameEvents.ts":
/*!****************************************!*\
  !*** ./src/gameHandling/gameEvents.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.createImg = exports.start = exports.restart = void 0;
var app_1 = __webpack_require__(/*! ../app */ "./src/app.ts");
var data_1 = __webpack_require__(/*! ../data/data */ "./src/data/data.ts");
var fighter_1 = __webpack_require__(/*! ../classes/fighter */ "./src/classes/fighter.ts");
var userInterface_1 = __webpack_require__(/*! ./userInterface */ "./src/gameHandling/userInterface.ts");
var restart = function () {
    (0, exports.start)();
    app_1.canvas.style.display = 'none';
    ['#main', '#mo1', '#mo2'].forEach(function (name) {
        var element = document.querySelector(name);
        element.style.display = 'block';
    });
    data_1.selectData.money.forEach(function (value, i) {
        data_1.selectData.money[i] += data_1.rules.money.addedValue;
    });
    (0, userInterface_1.updateMoney)();
};
exports.restart = restart;
var start = function () {
    var player1 = new fighter_1.Fighter(10, app_1.canvas.height / 2, 10, './img/f35.png', 0, 0, {
        left: 'a',
        right: 'd',
        shoot: 'w',
        equipment: 's',
        flairs: 'e'
    });
    app_1.fighters[0] = player1;
    var player2 = new fighter_1.Fighter(app_1.canvas.width - 10, app_1.canvas.height / 2, -10, './img/f35.png', Math.PI, 1, {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        shoot: 'ArrowUp',
        equipment: 'ArrowDown',
        flairs: 'num0'
    });
    app_1.fighters[1] = player2;
    app_1.fighters.forEach(function (fighter) {
        fighter.startTracking();
    });
    if (data_1.rules.cooperation) {
    }
};
exports.start = start;
// ! handling extra data
var createImg = function (src) {
    var img = new Image();
    img.src = src;
    return img;
};
exports.createImg = createImg;


/***/ }),

/***/ "./src/gameHandling/userInterface.ts":
/*!*******************************************!*\
  !*** ./src/gameHandling/userInterface.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.equipBest = exports.addEvts = exports.clearInputs = exports.updateMoney = exports.updateLook = exports.updateLog = void 0;
var app_1 = __webpack_require__(/*! ../app */ "./src/app.ts");
var data_1 = __webpack_require__(/*! ../data/data */ "./src/data/data.ts");
// ! update log
var gameStarted = false;
var updateLog = function () {
    var log1 = document.querySelector('#log1');
    var log2 = document.querySelector('#log2');
    var logs = [log1, log2];
    logs.forEach(function (log, i) {
        var addLog = function (log, color) {
            content += "<p style=\"color: ".concat(color, ";\">").concat(log, "</p>");
        };
        var fighter = app_1.fighters[i];
        // health
        var color = 'green';
        var content = '';
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
            var healthState = Math.round(fighter.health / fighter.maxHealth * 100);
            addLog("fighter integrity: ".concat(fighter.health, "(").concat(healthState, "%)"), color);
            if (fighter.health <= 0) {
                addLog('FIGHTER DESTROYED', 'red');
            }
            else {
                var message = "<p style=\"color: ".concat(color, ";\" class=\"bar\">|</p>");
                for (var i_1 = 0; i_1 < 40; i_1++) {
                    if (healthState / 100 * 40 > i_1) {
                        message += "<p style=\"color: ".concat(color, ";\" class=\"bar\">|</p>");
                    }
                    else {
                        message += "<p style=\"color: ".concat(color, ";\" class=\"bar\">.</p>");
                    }
                }
                message += "<p style=\"color: ".concat(color, ";\" class=\"bar\">|</p>");
                addLog(message, color);
            }
            // gun overheat
            var gunOverheatState = Math.round(fighter.overHeat / fighter.maxOverheat * 100);
            var overheatColor = 'green';
            if (gunOverheatState > 25) {
                overheatColor = 'yellow';
            }
            if (gunOverheatState > 50) {
                overheatColor = 'orange';
            }
            if (gunOverheatState > 75) {
                overheatColor = 'red';
            }
            addLog("gun overheat: ".concat(fighter.overHeat, "(").concat(gunOverheatState, "%)"), overheatColor);
            if (fighter.overHeated) {
                addLog('||||||||| gun overheated |||||||||', 'red');
            }
            else {
                var message = "<p style=\"color: ".concat(overheatColor, ";\" class=\"bar\">|</p>");
                for (var i_2 = 0; i_2 < 40; i_2++) {
                    if (gunOverheatState / 100 * 40 > i_2) {
                        message += "<p style=\"color: ".concat(overheatColor, ";\" class=\"bar\">|</p>");
                    }
                    else {
                        message += "<p style=\"color: ".concat(overheatColor, ";\" class=\"bar\">.</p>");
                    }
                }
                message += "<p style=\"color: ".concat(overheatColor, ";\" class=\"bar\">|</p>");
                addLog(message, overheatColor);
            }
            // equiped missles 
            addLog("AAM: ".concat(fighter.equipment.AAM));
        }
        else {
            addLog('FIGHTER DESTROYED', 'red');
        }
        log.innerHTML = content;
    });
};
exports.updateLog = updateLog;
// ! Update interface scale
var updateLook = function () {
    var main = document.querySelector('#main');
    main.style.left = (innerWidth / 2 - 600).toString();
    main.style.top = (innerHeight / 2 - 300).toString();
    ['#main', '#log1', '#log2', '#mo1', '#mo2', '#options'].forEach(function (id) {
        var element = document.querySelector(id);
        element.style.transform = "scale(".concat(innerWidth / 3010, ")");
    });
    app_1.canvas.width = innerWidth;
    app_1.canvas.height = innerHeight;
};
exports.updateLook = updateLook;
// ! Shows buying progress
var check = function (mark, i) {
    if (i != 0) {
        var bought = data_1.selectData[mark][i].bought["player".concat(data_1.selectData.currentPlayer)];
        var element = document.querySelector("#".concat(mark).concat(i + 1));
        if (bought) {
            element.style.border = '1px solid #fff';
        }
        else {
            element.style.border = '1px solid red';
        }
    }
    else {
        var tier1 = document.querySelector("#".concat(mark, "1"));
        tier1.style.border = '1px solid green';
    }
};
var updateMoney = function () {
    var div1 = document.querySelector('#mo1');
    var div2 = document.querySelector('#mo2');
    var money = data_1.selectData.money;
    div1.innerHTML = "<p class='kills'>".concat(data_1.selectData.kills[0], "</p> $").concat(money[0]);
    div2.innerHTML = "<p class='kills'>".concat(data_1.selectData.kills[1], "</p> $").concat(money[1]);
};
exports.updateMoney = updateMoney;
// ! Handling menu data
var clearInputs = function () {
    ['f', 'e', 'm', 'r'].forEach(function (char) {
        for (var i = 0; i < 5; i++) {
            check(char, i);
        }
    });
};
exports.clearInputs = clearInputs;
var addEvts = function (char) {
    for (var i = 0; i < 5; i++) {
        var n = i + 1;
        var div = document.querySelector('#' + char + n);
        // event listeners
        div.addEventListener('dblclick', buyUpgrade);
        div.addEventListener('mousedown', showStatus);
        div.addEventListener('click', selectUpgrade);
    }
};
exports.addEvts = addEvts;
//  ! on middle mouse click
var showStatus = function (e) {
    if (e.button === 1) {
        var id = e.target.id;
        var char = id.charAt(0);
        var num = id.charAt(1) - 1;
        if (id != '') {
            var upgradeData = data_1.selectData[char][num];
            console.log(upgradeData);
            var title = "name: ".concat('fighter', "\r\n\r\n");
            var content = '';
            // add data
            switch (char) {
                // fighter
                case 'f':
                    content += "sheathing:\r\n";
                    content += "- armor integrity: ".concat(upgradeData.health, "\r\n");
                    content += "- maneuverability: ".concat(upgradeData.rotationAvibility, "\r\n");
                    content += "weaponary:\r\n";
                    content += "- AAM attachments: ".concat(upgradeData.equipmentNumber, "\r\n");
                    break;
                // engine
                case 'e':
                    content += "- speed: ".concat(upgradeData.speed, "\r\n");
                    break;
                // machine gun
                case 'm':
                    content += "- fireRate: ".concat(upgradeData.fireRate, "\r\n");
                    content += "- spread: ".concat(upgradeData.spread, "\r\n");
                    content += "- damage: ".concat(upgradeData.damage, "\r\n");
                    content += "- max overheat: ".concat(upgradeData.maxOverheat, "\r\n");
                    break;
                // AAM
                case 'r':
                    content += "- damage: ".concat(upgradeData.damage, "\r\n");
                    content += "- shots in series: ".concat(upgradeData.multipleShoots, "\r\n");
                    content += "- maneuverability: ".concat(upgradeData.rotationAvibility, "\r\n");
                    content += "-speed: ".concat(upgradeData.speed, "\r\n");
                    break;
            }
            content += "\r\nprice: ".concat(upgradeData.price);
            var message = title + content;
            alert(message);
        }
    }
};
// ! on click
var selectUpgrade = function (e) {
    var id = e.target.id;
    var char = id.charAt(0);
    var num = id.charAt(1);
    if (id != '') {
        var bought = data_1.selectData[char][num - 1].bought["player".concat(data_1.selectData.currentPlayer)];
        if (bought) {
            for (var i = 1; i < 5; i++) {
                var element = document.querySelector("#".concat(char, "1"));
                element.style.border = '1px solid #fff';
                check(char, i);
            }
            e.target.style.border = '1px solid green';
            app_1.fighters[data_1.selectData.currentPlayer - 1].upgrades[char] = num - 1;
            app_1.fighters.forEach(function (fighter) { return fighter.updateStats(); });
        }
    }
};
// ! on double click
var buyUpgrade = function (e) {
    var id = e.target.id;
    var char = id.charAt(0);
    var num = id.charAt(1);
    if (id != '') {
        var bought = data_1.selectData[char][num - 1].bought["player".concat(data_1.selectData.currentPlayer)];
        var data = data_1.selectData[char][num - 1];
        if (!bought) {
            // ^when thing is not bought
            var money = data_1.selectData.money[data_1.selectData.currentPlayer - 1];
            var price = data.price;
            if (money >= price) {
                var previousBought = data_1.selectData[char][num - 2].bought["player".concat(data_1.selectData.currentPlayer)];
                if (previousBought) {
                    if ((data_1.rules.askOnSelection) ? confirm("Do you want to buy it for $".concat(price, " you will then have $").concat(money - price, " money left")) : true) {
                        data_1.selectData.money[data_1.selectData.currentPlayer - 1] -= price;
                        data_1.selectData[char][num - 1].bought["player".concat(data_1.selectData.currentPlayer)] = true;
                        var div = document.querySelector("#".concat(char).concat(num));
                        div.style.border = '1px solid #fff';
                    }
                }
            }
            (0, exports.updateMoney)();
        }
    }
};
var equipBest = function () {
    ['f', 'e', 'm', 'r'].forEach(function (mark) {
        var bestEquipmentDiv;
        data_1.selectData[mark].forEach(function (equipment, i) {
            if (equipment.bought["player".concat(data_1.selectData.currentPlayer)]) {
                bestEquipmentDiv = document.querySelector("#".concat(mark).concat(i + 1));
            }
        });
        selectUpgrade({ target: bestEquipmentDiv });
    });
};
exports.equipBest = equipBest;
// ! keypress handling
var buttonStart = document.querySelector('#start');
var next = function () {
    if (confirm('are you sure')) {
        var startButton = document.querySelector('#start');
        var num = (data_1.selectData.currentPlayer == 1) ? 2 : 1;
        startButton.innerHTML = "FIGHT! (".concat(num, "/2)");
        var moneyCounter1 = document.querySelector("#mo".concat(data_1.selectData.currentPlayer));
        var moneyCounter2 = document.querySelector("#mo".concat(num));
        moneyCounter1.style.border = '1px solid #fff';
        moneyCounter2.style.border = '1px solid orange';
        // start the game
        if (data_1.selectData.currentPlayer == 2) {
            ['#main', '#mo1', '#mo2'].forEach(function (name) {
                var element = document.querySelector(name);
                element.style.display = 'none';
            });
            app_1.canvas.style.display = 'block';
            app_1.fighters[0].position = { x: 10, y: innerHeight / 2 };
            app_1.fighters[0].angel = 0;
            app_1.fighters[1].position = { x: innerWidth - 10, y: innerHeight / 2 };
            app_1.fighters[1].angel = Math.PI;
            if (!gameStarted) {
                (0, app_1.animate)();
            }
            gameStarted = true;
            data_1.selectData.currentPlayer = 1;
        }
        else {
            data_1.selectData.currentPlayer = 2;
        }
        (0, exports.clearInputs)();
        if (data_1.selectData.currentPlayer == 2) {
            (0, exports.equipBest)();
        }
        setInterval(exports.updateLog, 1000);
    }
};
buttonStart.addEventListener('click', next);
addEventListener('keydown', function (_a) {
    var key = _a.key;
    if (key != 'o') {
        var keyBind = key;
        if (key == 'Insert' || key == '0') {
            keyBind = 'num0';
        }
        if (data_1.keys[keyBind]) {
            data_1.keys[keyBind].pressed = true;
        }
    }
    else {
        var blurElement = document.querySelector('#main');
        var blur_1 = blurElement.style.filter;
        var options = document.querySelector('#options');
        if (blur_1 != 'blur(5px)') {
            ['#main', '#mo1', '#mo2'].forEach(function (id) {
                var element = document.querySelector(id);
                element.style.filter = "blur(5px)";
            });
            options.style.display = 'block';
        }
        else {
            ['#main', '#mo1', '#mo2'].forEach(function (id) {
                var element = document.querySelector(id);
                element.style.filter = "";
            });
            options.style.display = 'none';
        }
        ;
        ['#stopX', '#stopY', '#coop', '#devMode'].forEach(function (id) {
            var element = document.querySelector(id);
            element.addEventListener('click', function (event) {
                var element = event.target;
                var axis = element.id.charAt(4);
                var currentData = (id == '#stopY' || id == '#stopX') ? data_1.rules.map["stop".concat(axis)] : data_1.rules.cooperation;
                if (currentData) {
                    if (id != '#devMode') {
                        element.style.backgroundColor = 'darkred';
                    }
                    if (id == '#stopY' || id == '#stopX') {
                        data_1.rules.map["stop".concat(axis)] = false;
                    }
                    if (id == '#coop') {
                        data_1.rules.cooperation = false;
                    }
                }
                else {
                    if (id == '#stopY' || id == '#stopX') {
                        data_1.rules.map["stop".concat(axis)] = true;
                        element.style.backgroundColor = 'darkgreen';
                    }
                    if (id == '#coop') {
                        data_1.rules.cooperation = true;
                        element.style.backgroundColor = 'darkgreen';
                    }
                    if (id == '#devMode') {
                        var num1 = Math.floor(Math.random() * 20 + 20);
                        var num2 = Math.floor(Math.random() * 20 + 20);
                        if (prompt("".concat(num1, " * ").concat(num2)) == "".concat(num1 * num2, "JS") || true) {
                            // when correct password
                            element.style.backgroundColor = 'darkgreen';
                            data_1.selectData.money = [10000, 10000];
                        }
                        else {}
                    }
                }
            });
        });
    }
    if (key == 'Enter') {
        next();
    }
});
addEventListener('keyup', function (_a) {
    var key = _a.key;
    var keyBind = key;
    if (key == 'Insert' || key == '0') {
        keyBind = 'num0';
    }
    if (data_1.keys[keyBind]) {
        data_1.keys[keyBind].pressed = false;
    }
});
// ! Start directions
var startDirections = function () {
    alert('you can change size of map by pressing ctrl + and ctrl - and then refreshing the page');
    if (confirm('Do you want to see constrols')) {
        alert('start/next player: Enter');
        alert('options: o');
        alert('player 1');
        alert('turning: a d');
        alert('shooting: w');
        alert('missle: s');
        alert('flairs: e');
        alert('player 2');
        alert('turning: arrowLeft arrowRight');
        alert('shooting: arrowUp');
        alert('missle: arrowDown');
        alert('flairs: num 0');
    }
    if (confirm('Do you want to see tutorial?')) {
        alert('buy upgrades');
        alert("you won't get extra money by destroing enemy");
        alert('You get money every round');
        alert('then you can buy upgrades after every round');
        alert('game never finishes. You can play as long as you want');
    }
    alert('now player1 buys upgrades');
};
// startDirections();


/***/ }),

/***/ "./src/gameHandling/weaponaryInterface.ts":
/*!************************************************!*\
  !*** ./src/gameHandling/weaponaryInterface.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


exports.__esModule = true;
exports.drawTrackingInterface = void 0;
var app_1 = __webpack_require__(/*! ../app */ "./src/app.ts");
var drawTrackingInterface = function (fighter) {
    if (app_1.fighters[(fighter.id == 1) ? 0 : 1]) {
        if (fighter.equipment.AAMStatus.targetLockStatus != 0) {
            var target_1 = app_1.fighters[(fighter.id == 1) ? 0 : 1];
            var checkDistance = function () {
                var distanceX = (fighter.position.x - target_1.position.x > 0) ? fighter.position.x - target_1.position.x : target_1.position.x - fighter.position.x;
                var distanceY = (fighter.position.y - target_1.position.y > 0) ? fighter.position.y - target_1.position.y : target_1.position.y - fighter.position.y;
                if (Math.sqrt(distanceX * distanceX + distanceY * distanceY) > 500) {
                    return true;
                }
                return false;
            };
            // ! aiming square
            var distance = Math.sqrt((fighter.position.x - target_1.position.x) * (fighter.position.x - target_1.position.x)
                + (fighter.position.y - target_1.position.y) * (fighter.position.y - target_1.position.y));
            var bulletSpeed = Math.sqrt(fighter.velocity.x * fighter.velocity.x * 9 + fighter.velocity.y * fighter.velocity.y * 9);
            var travelTime = distance / bulletSpeed;
            var MeetPos = {
                x: target_1.position.x + target_1.velocity.x * travelTime,
                y: target_1.position.y + target_1.velocity.y * travelTime
            };
            // difference beetwen fighters position and MeetPos
            var dMitFig = {
                x: MeetPos.x - fighter.position.x,
                y: MeetPos.y - fighter.position.y
            };
            // angel on target
            var gunAimPos = {
                x: fighter.position.x + dMitFig.x / (Math.abs(dMitFig.x) + Math.abs(dMitFig.y)) * 200,
                y: fighter.position.y + dMitFig.y / (Math.abs(dMitFig.x) + Math.abs(dMitFig.y)) * 200
            };
            //  current angel
            var currentAngel = {
                x: fighter.position.x + fighter.velocity.x / (Math.abs(fighter.velocity.x) + Math.abs(fighter.velocity.y)) * 200,
                y: fighter.position.y + fighter.velocity.y / (Math.abs(fighter.velocity.x) + Math.abs(fighter.velocity.y)) * 200
            };
            //draw
            if (fighter.equipment.AAMStatus.trackingIntervalFlag == 1 || fighter.equipment.AAMStatus.targetLocked && checkDistance()) {
                // angel on target
                app_1.c.beginPath();
                app_1.c.fillStyle = 'green';
                app_1.c.fillRect(gunAimPos.x, gunAimPos.y, 40, 40);
                app_1.c.fillStyle = 'black';
                app_1.c.fillRect(gunAimPos.x + 1, gunAimPos.y + 1, 38, 38);
                app_1.c.fill();
                // text
                app_1.c.fillStyle = 'green';
                app_1.c.font = "40px LATO";
                app_1.c.fillText("".concat(Math.round(distance), "m"), gunAimPos.x + 60, gunAimPos.y + 30);
                app_1.c.fillText((fighter.equipment.AAMStatus.targetLocked && checkDistance()) ? 'LOCK' : '', gunAimPos.x + 60, gunAimPos.y);
                app_1.c.closePath();
            }
            // current angel
            app_1.c.beginPath();
            app_1.c.fillStyle = 'green';
            app_1.c.fillRect(currentAngel.x + 10, currentAngel.y + 10, 20, 20);
            app_1.c.fillStyle = 'black';
            app_1.c.fillRect(currentAngel.x + 14, currentAngel.y + 14, 12, 12);
            app_1.c.fill();
        }
    }
};
exports.drawTrackingInterface = drawTrackingInterface;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsT0FBTztBQUNuQztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4Qyw4Q0FBOEM7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxlQUFlOzs7Ozs7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixFQUVKO0FBQ3pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDL1lhO0FBQ2Isa0JBQWtCO0FBQ2xCLDZCQUE2QjtBQUM3QixZQUFZLG1CQUFPLENBQUMsNEJBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qjs7Ozs7OztVQ2xFN0I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2luZGV4Ly4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9pbmRleC8uL3NyYy9jbGFzc2VzL0FBTS50cyIsIndlYnBhY2s6Ly9pbmRleC8uL3NyYy9jbGFzc2VzL1BhcnRpY2xlLnRzIiwid2VicGFjazovL2luZGV4Ly4vc3JjL2NsYXNzZXMvUHJvamVjdGlsZS50cyIsIndlYnBhY2s6Ly9pbmRleC8uL3NyYy9jbGFzc2VzL1Ntb2tlLnRzIiwid2VicGFjazovL2luZGV4Ly4vc3JjL2NsYXNzZXMvZmlnaHRlci50cyIsIndlYnBhY2s6Ly9pbmRleC8uL3NyYy9kYXRhL2NsYXNzZXMvRW5naW5lLnRzIiwid2VicGFjazovL2luZGV4Ly4vc3JjL2RhdGEvY2xhc3Nlcy9NYWNoaW5lR3VuLnRzIiwid2VicGFjazovL2luZGV4Ly4vc3JjL2RhdGEvY2xhc3Nlcy9QbGFuZS50cyIsIndlYnBhY2s6Ly9pbmRleC8uL3NyYy9kYXRhL2NsYXNzZXMvUm9ja2V0LnRzIiwid2VicGFjazovL2luZGV4Ly4vc3JjL2RhdGEvZGF0YS50cyIsIndlYnBhY2s6Ly9pbmRleC8uL3NyYy9nYW1lSGFuZGxpbmcvZ2FtZUV2ZW50cy50cyIsIndlYnBhY2s6Ly9pbmRleC8uL3NyYy9nYW1lSGFuZGxpbmcvdXNlckludGVyZmFjZS50cyIsIndlYnBhY2s6Ly9pbmRleC8uL3NyYy9nYW1lSGFuZGxpbmcvd2VhcG9uYXJ5SW50ZXJmYWNlLnRzIiwid2VicGFjazovL2luZGV4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2luZGV4L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vaW5kZXgvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2luZGV4L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5hbmltYXRlID0gZXhwb3J0cy5maWdodGVycyA9IGV4cG9ydHMucGFydGljbGVzID0gZXhwb3J0cy5zbW9rZXMgPSBleHBvcnRzLnByb2plY3RpbGVzID0gZXhwb3J0cy5BQU1zID0gZXhwb3J0cy5jID0gZXhwb3J0cy5jYW52YXMgPSB2b2lkIDA7XHJcbnZhciB1c2VySW50ZXJmYWNlXzEgPSByZXF1aXJlKFwiLi9nYW1lSGFuZGxpbmcvdXNlckludGVyZmFjZVwiKTtcclxudmFyIGdhbWVFdmVudHNfMSA9IHJlcXVpcmUoXCIuL2dhbWVIYW5kbGluZy9nYW1lRXZlbnRzXCIpO1xyXG52YXIgd2VhcG9uYXJ5SW50ZXJmYWNlXzEgPSByZXF1aXJlKFwiLi9nYW1lSGFuZGxpbmcvd2VhcG9uYXJ5SW50ZXJmYWNlXCIpO1xyXG52YXIgUGFydGljbGVfMSA9IHJlcXVpcmUoXCIuL2NsYXNzZXMvUGFydGljbGVcIik7XHJcbmV4cG9ydHMuY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XHJcbmV4cG9ydHMuYyA9IGV4cG9ydHMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbigwLCB1c2VySW50ZXJmYWNlXzEudXBkYXRlTG9vaykoKTtcclxuc2V0SW50ZXJ2YWwodXNlckludGVyZmFjZV8xLnVwZGF0ZUxvb2ssIDEpO1xyXG5leHBvcnRzLkFBTXMgPSBbXTtcclxuZXhwb3J0cy5wcm9qZWN0aWxlcyA9IFtdO1xyXG5leHBvcnRzLnNtb2tlcyA9IFtdO1xyXG5leHBvcnRzLnBhcnRpY2xlcyA9IFtdO1xyXG5leHBvcnRzLmZpZ2h0ZXJzID0gW107XHJcbi8vICFhbmltYXRlXHJcbi8vIElzIGNhbGxlZCBldmVyeSBhbmltYXRpb24gZnJhbWVcclxudmFyIGFuaW1hdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBwcmVwYXJlIG1hcFxyXG4gICAgZXhwb3J0cy5jLmNsZWFyUmVjdCgwLCAwLCBleHBvcnRzLmNhbnZhcy53aWR0aCwgZXhwb3J0cy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIGV4cG9ydHMuYy5iZWdpblBhdGgoKTtcclxuICAgIGV4cG9ydHMuYy5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgZXhwb3J0cy5jLmZpbGxSZWN0KDAsIDAsIGV4cG9ydHMuY2FudmFzLndpZHRoLCBleHBvcnRzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgZXhwb3J0cy5jLmZpbGwoKTtcclxuICAgIGV4cG9ydHMuYy5jbG9zZVBhdGgoKTtcclxuICAgIC8vIGRyYXcgdHJhY2tpbmcgaW50ZXJmYWNlXHJcbiAgICBleHBvcnRzLmZpZ2h0ZXJzLmZvckVhY2god2VhcG9uYXJ5SW50ZXJmYWNlXzEuZHJhd1RyYWNraW5nSW50ZXJmYWNlKTtcclxuICAgIGV4cG9ydHMuZmlnaHRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZmlnaHRlciwgaSkge1xyXG4gICAgICAgIGlmIChmaWdodGVyLmhlYWx0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIGZpZ2h0ZXIuZXhwbG9kZSgpO1xyXG4gICAgICAgICAgICBleHBvcnRzLmZpZ2h0ZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmlnaHRlci51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgLy8gISB1cGRhdGUgcHJvamVjdGlsZXNcclxuICAgIGV4cG9ydHMucHJvamVjdGlsZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvamVjdGlsZSwgaSkge1xyXG4gICAgICAgIHByb2plY3RpbGUudXBkYXRlKCk7XHJcbiAgICAgICAgaWYgKHByb2plY3RpbGUucG9zaXRpb24ueCA8IDAgfHxcclxuICAgICAgICAgICAgcHJvamVjdGlsZS5wb3NpdGlvbi54ID4gZXhwb3J0cy5jYW52YXMud2lkdGggfHxcclxuICAgICAgICAgICAgcHJvamVjdGlsZS5wb3NpdGlvbi55IDwgMCB8fFxyXG4gICAgICAgICAgICBwcm9qZWN0aWxlLnBvc2l0aW9uLnkgPiBleHBvcnRzLmNhbnZhcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgZXhwb3J0cy5wcm9qZWN0aWxlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBleHBvcnRzLmZpZ2h0ZXJzLmZvckVhY2goZnVuY3Rpb24gKGZpZ2h0ZXIsIGopIHtcclxuICAgICAgICAgICAgICAgIC8vIF5vbiBoaXRcclxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aWxlLnBvc2l0aW9uLnggPiBmaWdodGVyLnBvc2l0aW9uLnggJiZcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aWxlLnBvc2l0aW9uLnggPCBmaWdodGVyLnBvc2l0aW9uLnggKyBmaWdodGVyLndpZHRoICYmXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlsZS5wb3NpdGlvbi55ID4gZmlnaHRlci5wb3NpdGlvbi55ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlsZS5wb3NpdGlvbi55IDwgZmlnaHRlci5wb3NpdGlvbi55ICsgZmlnaHRlci5oZWlnaHQgJiYgaiAhPVxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RpbGUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cy5wcm9qZWN0aWxlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlnaHRlci5oZWFsdGggLT0gcHJvamVjdGlsZS5kYW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaV8xID0gMDsgaV8xIDwgMzsgaV8xKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBNYXRoLnJhbmRvbSgpICogMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gKG4gPiAxKSA/ICdkYXJrZ3JleScgOiAnb3JhbmdlJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZmlnaHRlci5wb3NpdGlvbi54ICsgZmlnaHRlci53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBmaWdodGVyLnBvc2l0aW9uLnkgKyBmaWdodGVyLmhlaWdodCAvIDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZlbG9jaXR5ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogNCArIGZpZ2h0ZXIudmVsb2NpdHkueCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA0ICsgZmlnaHRlci52ZWxvY2l0eS55IC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRzLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZV8xLlBhcnRpY2xlKHBvc2l0aW9uLCB2ZWxvY2l0eSwgY29sb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZXhwb3J0cy5wYXJ0aWNsZXMuZm9yRWFjaChmdW5jdGlvbiAocGFydGljbGUsIGkpIHtcclxuICAgICAgICBpZiAocGFydGljbGUudGhyb3dzU21va2UpIHtcclxuICAgICAgICAgICAgcGFydGljbGUuc21va2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBhcnRpY2xlLmFscGhhIDw9IDApIHtcclxuICAgICAgICAgICAgZXhwb3J0cy5wYXJ0aWNsZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcGFydGljbGUudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBleHBvcnRzLnNtb2tlcy5mb3JFYWNoKGZ1bmN0aW9uIChzbW9rZSwgaSkge1xyXG4gICAgICAgIHNtb2tlLmRyYXcoKTtcclxuICAgICAgICBpZiAoc21va2UuYWxwaGEgPD0gMCkge1xyXG4gICAgICAgICAgICBleHBvcnRzLnNtb2tlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbiA9IDAuMSAvIHNtb2tlLmxlbmdodDtcclxuICAgICAgICAgICAgc21va2UuYWxwaGEgLT0gbjtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGV4cG9ydHMuQUFNcy5mb3JFYWNoKGZ1bmN0aW9uIChtaXNzbGUsIGkpIHtcclxuICAgICAgICBtaXNzbGUuc21va2UoKTtcclxuICAgICAgICBtaXNzbGUudXBkYXRlKCk7XHJcbiAgICAgICAgLy8gXndoZW4gZXNjYXBlcyB0aGUgbWFwXHJcbiAgICAgICAgaWYgKG1pc3NsZS5wb3NpdGlvbi54IDwgMCB8fCBtaXNzbGUucG9zaXRpb24ueCArIG1pc3NsZS53aWR0aCA+IGV4cG9ydHMuY2FudmFzLndpZHRoIHx8XHJcbiAgICAgICAgICAgIG1pc3NsZS5wb3NpdGlvbi55IDwgMCB8fCBtaXNzbGUucG9zaXRpb24ueSArIG1pc3NsZS5oZWlnaHQgPiBleHBvcnRzLmNhbnZhcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgZXhwb3J0cy5BQU1zLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRhcmdldFBvcyA9IG1pc3NsZS50YXJnZXQucG9zaXRpb247XHJcbiAgICAgICAgLy8gXndoZW4gaGl0cyB0aGUgdGFyZ2V0XHJcbiAgICAgICAgaWYgKG1pc3NsZS5wb3NpdGlvbi54ID4gdGFyZ2V0UG9zLnggLSAyMCAmJiBtaXNzbGUucG9zaXRpb24ueCA8IHRhcmdldFBvcy54ICsgbWlzc2xlLnRhcmdldC53aWR0aCArIDIwICYmXHJcbiAgICAgICAgICAgIG1pc3NsZS5wb3NpdGlvbi55ID4gdGFyZ2V0UG9zLnkgLSAyMCAmJiBtaXNzbGUucG9zaXRpb24ueSA8IHRhcmdldFBvcy55ICsgbWlzc2xlLnRhcmdldC5oZWlnaHQgKyAyMCkge1xyXG4gICAgICAgICAgICBtaXNzbGUudGFyZ2V0LmhlYWx0aCAtPSBtaXNzbGUuZGFtYWdlO1xyXG4gICAgICAgICAgICBtaXNzbGUuZXhwbG9kZSgpO1xyXG4gICAgICAgICAgICBleHBvcnRzLkFBTXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGV4cG9ydHMuYW5pbWF0ZSk7XHJcbn07XHJcbmV4cG9ydHMuYW5pbWF0ZSA9IGFuaW1hdGU7XHJcbi8vICEgSGFuZGxlIG1lbnUgc2VsZWN0aW9uIFxyXG5bJ2YnLCAnZScsICdtJywgJ3InXS5mb3JFYWNoKGZ1bmN0aW9uIChjaGFyKSB7IHJldHVybiAoMCwgdXNlckludGVyZmFjZV8xLmFkZEV2dHMpKGNoYXIpOyB9KTtcclxuKDAsIHVzZXJJbnRlcmZhY2VfMS5jbGVhcklucHV0cykoKTtcclxuKDAsIGdhbWVFdmVudHNfMS5zdGFydCkoKTtcclxuZXhwb3J0cy5maWdodGVycy5mb3JFYWNoKGZ1bmN0aW9uIChmaWdodGVyKSB7XHJcbiAgICBmaWdodGVyLnN0YXJ0VHJhY2tpbmcoKTtcclxufSk7XHJcbi8vIC0tLSBOT1RFUyAtLS1cclxuLy8gVE8gRE9cclxuLy8gLSBUYXJnZXRpbmcgc3lzdGVtXHJcbi8vIDEgLSBndW5cclxuLy8gMiAtIG1pc3NsZVxyXG4vLyBlcXVpcG1lbnQgc2V0dXBcclxuLy8gLSBHYW1lIHR5cGVzXHJcbi8vIC0gIG1pc3NsZSBjbGFzc2VzXHJcbi8vIC0gYW5vdGhlciB0aWVyc1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5BQU0gPSB2b2lkIDA7XHJcbnZhciBhcHBfMSA9IHJlcXVpcmUoXCIuLi9hcHBcIik7XHJcbnZhciBnYW1lRXZlbnRzXzEgPSByZXF1aXJlKFwiLi4vZ2FtZUhhbmRsaW5nL2dhbWVFdmVudHNcIik7XHJcbnZhciBTbW9rZV8xID0gcmVxdWlyZShcIi4vU21va2VcIik7XHJcbnZhciBQYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vUGFydGljbGVcIik7XHJcbnZhciBBQU0gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBBQU0odmVsb2NpdHksIHBvc2l0aW9uLCBhbmdlbCwgdGFyZ2V0LCBzcGVlZCwgcm90YXRpb25BdmliaWxpdHksIGRtZywgaW1nKSB7XHJcbiAgICAgICAgLy8gbG9va1xyXG4gICAgICAgIHRoaXMud2lkdGggPSA1MDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDEyLjU7XHJcbiAgICAgICAgdGhpcy5zcmMgPSBpbWc7XHJcbiAgICAgICAgdGhpcy5pbWcgPSAoMCwgZ2FtZUV2ZW50c18xLmNyZWF0ZUltZykodGhpcy5zcmMpO1xyXG4gICAgICAgIC8vIHJvdGF0aW9uXHJcbiAgICAgICAgdGhpcy5hbmdlbCA9IGFuZ2VsO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25BdmliaWxpdHkgPSByb3RhdGlvbkF2aWJpbGl0eTtcclxuICAgICAgICAvLyBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgICB4OiBwb3NpdGlvbi54LFxyXG4gICAgICAgICAgICB5OiBwb3NpdGlvbi55XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0ge1xyXG4gICAgICAgICAgICB4OiB2ZWxvY2l0eS54LFxyXG4gICAgICAgICAgICB5OiB2ZWxvY2l0eS55XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLmRhbWFnZSA9IGRtZztcclxuICAgIH1cclxuICAgIC8vICEgdXBkYXRpbmdcclxuICAgIEFBTS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHBfMS5jLnNhdmUoKTtcclxuICAgICAgICBhcHBfMS5jLnRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQgLyAyKTtcclxuICAgICAgICBhcHBfMS5jLnJvdGF0ZSh0aGlzLmFuZ2VsKTtcclxuICAgICAgICBhcHBfMS5jLnRyYW5zbGF0ZSgtdGhpcy5wb3NpdGlvbi54IC0gdGhpcy53aWR0aCAvIDIsIC10aGlzLnBvc2l0aW9uLnkgLSB0aGlzLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGFwcF8xLmMuZHJhd0ltYWdlKHRoaXMuaW1nLCB0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGFwcF8xLmMucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgfTtcclxuICAgIEFBTS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiB0aGlzLnNwZWVkO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5LnkgKiB0aGlzLnNwZWVkO1xyXG4gICAgICAgIHRoaXMudHJhY2tUYXJnZXQoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZlbG9jaXR5KCk7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG4gICAgLy8gICEgZWZlY3RzXHJcbiAgICBBQU0ucHJvdG90eXBlLnNtb2tlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzbW9rZTEgPSBuZXcgU21va2VfMS5TbW9rZSh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQgLyAyLCAnb3JhbmdlJywgNCwgMSwgMik7XHJcbiAgICAgICAgYXBwXzEuc21va2VzLnB1c2goc21va2UxKTtcclxuICAgIH07XHJcbiAgICBBQU0ucHJvdG90eXBlLmV4cGxvZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBuID0gTWF0aC5yYW5kb20oKSAqIDI7XHJcbiAgICAgICAgICAgIHZhciBjb2xvciA9IChuID4gMSkgPyAnZGFya2dyZXknIDogJ29yYW5nZSc7XHJcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eSA9IHtcclxuICAgICAgICAgICAgICAgIHg6IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDMsXHJcbiAgICAgICAgICAgICAgICB5OiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGFwcF8xLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZV8xLlBhcnRpY2xlKHRoaXMucG9zaXRpb24sIHZlbG9jaXR5LCBjb2xvcikpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyAhIG1vdmVtZW50XHJcbiAgICBBQU0ucHJvdG90eXBlLnRyYWNrVGFyZ2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHggPSB0aGlzLnRhcmdldC5wb3NpdGlvbi54IC0gdGhpcy5wb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciB5ID0gdGhpcy50YXJnZXQucG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueTtcclxuICAgICAgICBhcHBfMS5wYXJ0aWNsZXMuZm9yRWFjaChmdW5jdGlvbiAocGFydGljbGUpIHtcclxuICAgICAgICAgICAgaWYgKHBhcnRpY2xlLnRocm93c1Ntb2tlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFydGljbGVYID0gcGFydGljbGUucG9zaXRpb24ueDtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJ0aWNsZVkgPSBwYXJ0aWNsZS5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnBvc2l0aW9uLnggLSBwYXJ0aWNsZVggPiAtNTAwICYmIF90aGlzLnBvc2l0aW9uLnggLSBwYXJ0aWNsZVggPCA1MDAgJiZcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5wb3NpdGlvbi55IC0gcGFydGljbGVZID4gLTUwMCAmJiBfdGhpcy5wb3NpdGlvbi55IC0gcGFydGljbGVYIDwgNTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IHBhcnRpY2xlWCAtIF90aGlzLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgICAgICAgICAgeSA9IHBhcnRpY2xlWSAtIF90aGlzLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgYW5nZWxPblRhcmdldCA9IE1hdGguYXRhbjIoeSwgeCkgLyBNYXRoLlBJICogMTgwO1xyXG4gICAgICAgIHZhciBhbmdlbCA9IHRoaXMuYW5nZWwgLyBNYXRoLlBJICogMTgwO1xyXG4gICAgICAgIGlmIChhbmdlbCA8IC05MCAmJiBhbmdlbE9uVGFyZ2V0ID4gOTAgfHwgYW5nZWwgPiA5MCAmJiBhbmdlbE9uVGFyZ2V0IDwgLTkwKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmdlbCA8IC05MCAmJiBhbmdlbE9uVGFyZ2V0ID4gOTApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5nZWwgLT0gdGhpcy5yb3RhdGlvbkF2aWJpbGl0eSAvIDEwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYW5nZWwgPiA5MCAmJiBhbmdlbE9uVGFyZ2V0IDwgLTkwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VsICs9IHRoaXMucm90YXRpb25BdmliaWxpdHkgLyAxMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChhbmdlbCA+PSBhbmdlbE9uVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ2VsIC09IHRoaXMucm90YXRpb25BdmliaWxpdHkgLyAxMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFuZ2VsIDwgYW5nZWxPblRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmdlbCArPSB0aGlzLnJvdGF0aW9uQXZpYmlsaXR5IC8gMTAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEFBTS5wcm90b3R5cGUudXBkYXRlVmVsb2NpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRlZzM2MCA9IE1hdGguUEkgKiAyO1xyXG4gICAgICAgIC8vIGlmIDAgPCBkZWcgPCA5MFxyXG4gICAgICAgIGlmICh0aGlzLmFuZ2VsID4gMCAmJiB0aGlzLmFuZ2VsIDwgZGVnMzYwIC8gNCkge1xyXG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuYW5nZWwgLyBkZWczNjAgKiA0O1xyXG4gICAgICAgICAgICB2YXIgeCA9IDEgLSB5O1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSB4ICogdGhpcy5zcGVlZDtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS55ID0geSAqIHRoaXMuc3BlZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIDAgPiBkZWcgPiAtOTBcclxuICAgICAgICBpZiAodGhpcy5hbmdlbCA8PSAwICYmIHRoaXMuYW5nZWwgPiAtZGVnMzYwIC8gNCB8fCB0aGlzLmFuZ2VsIDwgLWRlZzM2MCAvIDQgKiAzKSB7XHJcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5hbmdlbCAvIGRlZzM2MCAqIDQ7XHJcbiAgICAgICAgICAgIHZhciB4ID0gMSArIHk7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCA9IHggKiB0aGlzLnNwZWVkO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnkgPSB5ICogdGhpcy5zcGVlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgOTAgPCBkZWcgPCAxODBcclxuICAgICAgICBpZiAodGhpcy5hbmdlbCA+IGRlZzM2MCAvIDQpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRBbmdlbCA9IHRoaXMuYW5nZWwgLSBkZWczNjAgLyA0O1xyXG4gICAgICAgICAgICB2YXIgeCA9IGN1cnJlbnRBbmdlbCAvIGRlZzM2MCAqIDQ7XHJcbiAgICAgICAgICAgIHZhciB5ID0gMSAtIHg7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCA9IC14ICogdGhpcy5zcGVlZDtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS55ID0geSAqIHRoaXMuc3BlZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIC05MCA+IGRlZyA+IC0xODAgLWJyb2tlbi1cclxuICAgICAgICBpZiAodGhpcy5hbmdlbCA8IC1kZWczNjAgLyA0KSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50QW5nZWwgPSAtdGhpcy5hbmdlbCAtIGRlZzM2MCAvIDQ7XHJcbiAgICAgICAgICAgIHZhciB4ID0gY3VycmVudEFuZ2VsIC8gZGVnMzYwICogNDtcclxuICAgICAgICAgICAgdmFyIHkgPSAxIC0geDtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS54ID0gLXggKiB0aGlzLnNwZWVkO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnkgPSAteSAqIHRoaXMuc3BlZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBBQU07XHJcbn0oKSk7XHJcbmV4cG9ydHMuQUFNID0gQUFNO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5QYXJ0aWNsZSA9IHZvaWQgMDtcclxudmFyIGFwcF8xID0gcmVxdWlyZShcIi4uL2FwcFwiKTtcclxudmFyIFNtb2tlXzEgPSByZXF1aXJlKFwiLi9TbW9rZVwiKTtcclxudmFyIGFwcF8yID0gcmVxdWlyZShcIi4uL2FwcFwiKTtcclxudmFyIFBhcnRpY2xlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUGFydGljbGUocG9zaXRpb24sIHZlbG9jaXR5LCBjb2xvciwgc2l6ZSwgc21va2VzKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgeDogcG9zaXRpb24ueCxcclxuICAgICAgICAgICAgeTogcG9zaXRpb24ueVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IHtcclxuICAgICAgICAgICAgeDogdmVsb2NpdHkueCxcclxuICAgICAgICAgICAgeTogdmVsb2NpdHkueVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5yYWRpb3VzID0gc2l6ZSB8fCAxO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmFscGhhID0gMTtcclxuICAgICAgICB0aGlzLnRocm93c1Ntb2tlID0gc21va2VzIHx8IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gICEgdXBkYXRpbmdcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFwcF8xLmMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgYXBwXzEuYy5hcmModGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMucmFkaW91cywgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIGFwcF8xLmMuZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICBhcHBfMS5jLmZpbGwoKTtcclxuICAgICAgICBhcHBfMS5jLmNsb3NlUGF0aDtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuYWxwaGEgLT0gMC4wMTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5Lnk7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG4gICAgLy8gISBlZmVjdHNcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5zbW9rZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc21va2UxID0gbmV3IFNtb2tlXzEuU21va2UodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksICdyZ2IoMTgzLCAxODMsIDE4MyknLCA3LCAwLjUsIDYpO1xyXG4gICAgICAgIHZhciBzbW9rZTIgPSBuZXcgU21va2VfMS5TbW9rZSh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgJ3JnYigyNTMsIDIyNSwgMTAyKScsIDYsIDAuNywgMyk7XHJcbiAgICAgICAgYXBwXzIuc21va2VzLnB1c2goc21va2UxKTtcclxuICAgICAgICBhcHBfMi5zbW9rZXMucHVzaChzbW9rZTIpO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkueCAqPSAwLjk4O1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkueSAqPSAwLjk4O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQYXJ0aWNsZTtcclxufSgpKTtcclxuZXhwb3J0cy5QYXJ0aWNsZSA9IFBhcnRpY2xlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5Qcm9qZWN0aWxlID0gdm9pZCAwO1xyXG52YXIgYXBwXzEgPSByZXF1aXJlKFwiLi4vYXBwXCIpO1xyXG52YXIgU21va2VfMSA9IHJlcXVpcmUoXCIuL1Ntb2tlXCIpO1xyXG52YXIgUHJvamVjdGlsZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFByb2plY3RpbGUocG9zaXRpb24sIHZlbG9jaXR5LCB0YXJnZXQsIGRhbWFnZSkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgIHg6IHBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgIHk6IHBvc2l0aW9uLnlcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB7XHJcbiAgICAgICAgICAgIHg6IHZlbG9jaXR5LngsXHJcbiAgICAgICAgICAgIHk6IHZlbG9jaXR5LnlcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSAnb3JhbmdlJztcclxuICAgICAgICB0aGlzLmRhbWFnZSA9IGRhbWFnZTtcclxuICAgICAgICB0aGlzLnJhZGlvdXMgPSB0aGlzLmRhbWFnZSAvIDggKyAyO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgLy8gISB1cGRhdGluZ1xyXG4gICAgUHJvamVjdGlsZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHBfMS5jLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGFwcF8xLmMuYXJjKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLnJhZGlvdXMsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICBhcHBfMS5jLmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgYXBwXzEuYy5maWxsKCk7XHJcbiAgICAgICAgYXBwXzEuYy5jbG9zZVBhdGg7XHJcbiAgICB9O1xyXG4gICAgUHJvamVjdGlsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5Lng7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICB0aGlzLnNtb2tlKCk7XHJcbiAgICB9O1xyXG4gICAgLy8gISBlZmVjdHNcclxuICAgIFByb2plY3RpbGUucHJvdG90eXBlLnNtb2tlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzbW9rZTEgPSBuZXcgU21va2VfMS5TbW9rZSh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgJ29yYW5nZScsIHRoaXMucmFkaW91cywgMC45LCAwLjUgKyB0aGlzLmRhbWFnZSAvIDgpO1xyXG4gICAgICAgIGFwcF8xLnNtb2tlcy5wdXNoKHNtb2tlMSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFByb2plY3RpbGU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuUHJvamVjdGlsZSA9IFByb2plY3RpbGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLlNtb2tlID0gdm9pZCAwO1xyXG52YXIgYXBwXzEgPSByZXF1aXJlKFwiLi4vYXBwXCIpO1xyXG52YXIgU21va2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTbW9rZSh4LCB5LCBjb2xvciwgcmFkaW91cywgYWxwaGEsIGxlbmdodCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICAgIHk6IHlcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmFkaW91cyA9IHJhZGlvdXM7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuYWxwaGEgPSBhbHBoYTtcclxuICAgICAgICB0aGlzLmxlbmdodCA9IGxlbmdodDtcclxuICAgIH1cclxuICAgIFNtb2tlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFscGhhID4gMCkge1xyXG4gICAgICAgICAgICBhcHBfMS5jLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBhcHBfMS5jLnNhdmUoKTtcclxuICAgICAgICAgICAgYXBwXzEuYy5nbG9iYWxBbHBoYSA9IHRoaXMuYWxwaGE7XHJcbiAgICAgICAgICAgIGFwcF8xLmMuYXJjKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLnJhZGlvdXMsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICAgICAgYXBwXzEuYy5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgICAgICBhcHBfMS5jLmZpbGwoKTtcclxuICAgICAgICAgICAgYXBwXzEuYy5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGFwcF8xLmMuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBTbW9rZTtcclxufSgpKTtcclxuZXhwb3J0cy5TbW9rZSA9IFNtb2tlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5GaWdodGVyID0gdm9pZCAwO1xyXG52YXIgYXBwXzEgPSByZXF1aXJlKFwiLi4vYXBwXCIpO1xyXG52YXIgZ2FtZUV2ZW50c18xID0gcmVxdWlyZShcIi4uL2dhbWVIYW5kbGluZy9nYW1lRXZlbnRzXCIpO1xyXG52YXIgdXNlckludGVyZmFjZV8xID0gcmVxdWlyZShcIi4uL2dhbWVIYW5kbGluZy91c2VySW50ZXJmYWNlXCIpO1xyXG52YXIgZGF0YV8xID0gcmVxdWlyZShcIi4uL2RhdGEvZGF0YVwiKTtcclxudmFyIFByb2plY3RpbGVfMSA9IHJlcXVpcmUoXCIuL1Byb2plY3RpbGVcIik7XHJcbnZhciBTbW9rZV8xID0gcmVxdWlyZShcIi4vU21va2VcIik7XHJcbnZhciBQYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vUGFydGljbGVcIik7XHJcbnZhciBBQU1fMSA9IHJlcXVpcmUoXCIuL0FBTVwiKTtcclxudmFyIGRhdGFfMiA9IHJlcXVpcmUoXCIuLi9kYXRhL2RhdGFcIik7XHJcbnZhciBGaWdodGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRmlnaHRlcih4LCB5LCB2ZWxYLCBpbWcsIHJvdGF0aW9uLCBpZCwga2V5cykge1xyXG4gICAgICAgIC8vIGxvb2tcclxuICAgICAgICB0aGlzLmltZyA9ICgwLCBnYW1lRXZlbnRzXzEuY3JlYXRlSW1nKShpbWcpO1xyXG4gICAgICAgIHRoaXMuaW1nU2F2ZSA9ICgwLCBnYW1lRXZlbnRzXzEuY3JlYXRlSW1nKShpbWcpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSA3NTtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDUwO1xyXG4gICAgICAgIC8vIHVwZ3JhZGVzXHJcbiAgICAgICAgdGhpcy51cGdyYWRlcyA9IHtcclxuICAgICAgICAgICAgZjogMCxcclxuICAgICAgICAgICAgZTogMCxcclxuICAgICAgICAgICAgbTogMCxcclxuICAgICAgICAgICAgcjogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gcG9zaXRpb25cclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICB5OiB5XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0ge1xyXG4gICAgICAgICAgICB4OiB2ZWxYLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNwZWVkID0gMTA7XHJcbiAgICAgICAgdGhpcy5zbG93RG93biA9IDA7XHJcbiAgICAgICAgLy8gcm90YXRpb25cclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb247XHJcbiAgICAgICAgdGhpcy5hbmdlbCA9IDA7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbkF2aWJpbGl0eSA9IDAuMDI7XHJcbiAgICAgICAgLy8gd2FlcG9uYXJ5XHJcbiAgICAgICAgLy8gZ3VuXHJcbiAgICAgICAgdGhpcy5ndW4gPSB7XHJcbiAgICAgICAgICAgIHNob290VGltZTogMVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5maXJlUmF0ZSA9IDE7XHJcbiAgICAgICAgdGhpcy5zcHJlYWQgPSAxO1xyXG4gICAgICAgIHRoaXMubWF4T3ZlcmhlYXQgPSAxMDA7XHJcbiAgICAgICAgdGhpcy5vdmVySGVhdCA9IDA7XHJcbiAgICAgICAgdGhpcy5vdmVySGVhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kYW1hZ2UgPSAxO1xyXG4gICAgICAgIC8vIEFBTVxyXG4gICAgICAgIHRoaXMuZXF1aXBtZW50ID0ge1xyXG4gICAgICAgICAgICBBQU06IDIsXHJcbiAgICAgICAgICAgIEFBTVN0YXR1czoge1xyXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDQsXHJcbiAgICAgICAgICAgICAgICByb3RhdGlvbkF2aWJpbGl0eTogMCxcclxuICAgICAgICAgICAgICAgIGRhbWFnZTogMTQ5LFxyXG4gICAgICAgICAgICAgICAgbXVsdGlwbGVTaG9vdHM6IDEsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRMb2NrZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TG9ja1N0YXR1czogMCxcclxuICAgICAgICAgICAgICAgIHRyYWNraW5nSW50ZXJ2YWxGbGFnOiAxXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEFBTVNraW46ICcuL2ltZy9BRy5qcGcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLkFBTWZpcmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5mbGFpcnNTaG9vdCA9IGZhbHNlO1xyXG4gICAgICAgIC8vIGhhbmRsaW5nXHJcbiAgICAgICAgdGhpcy5rZXlzID0ga2V5cztcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSAxNTA7XHJcbiAgICAgICAgdGhpcy5tYXhIZWFsdGggPSB0aGlzLmhlYWx0aDtcclxuICAgIH1cclxuICAgIC8vICEgd2VhcG9uYXJ5XHJcbiAgICBGaWdodGVyLnByb3RvdHlwZS5zaG9vdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmlyZVJhdGU7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5maXJlUmF0ZSA8IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3VuLnNob290VGltZSArPSB0aGlzLmZpcmVSYXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vdmVySGVhdGVkICYmIHRoaXMuZ3VuLnNob290VGltZSA+PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmFuZG9tWCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMuc3ByZWFkO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJhbmRvbVkgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLnNwcmVhZDtcclxuICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodCAvIDJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgdmVsb2NpdHkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy52ZWxvY2l0eS54ICogMyArIHJhbmRvbVggKiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHRoaXMudmVsb2NpdHkueSAqIDMgKyByYW5kb21ZICogM1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UHJvamVjdGlsZSA9IG5ldyBQcm9qZWN0aWxlXzEuUHJvamVjdGlsZShwb3NpdGlvbiwgdmVsb2NpdHksIHRoaXMuaWQsIHRoaXMuZGFtYWdlKTtcclxuICAgICAgICAgICAgICAgIGFwcF8xLnByb2plY3RpbGVzLnB1c2goY3VycmVudFByb2plY3RpbGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdmVySGVhdCArPSB0aGlzLmRhbWFnZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpcmVSYXRlIDwgMSAmJiB0aGlzLmd1bi5zaG9vdFRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmd1bi5zaG9vdFRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vIGNoZWNrcyBpZiB0YXJnZXQgaXMgaW4gdHJhY2tpbmcgcmFuZ2VcclxuICAgIEZpZ2h0ZXIucHJvdG90eXBlLnN0YXJ0VHJhY2tpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgdGFyZ2V0SWQgPSAodGhpcy5pZCA9PSAxKSA/IDEgOiAyO1xyXG4gICAgICAgIHZhciB0YXJnZXQgPSBhcHBfMS5maWdodGVyc1t0YXJnZXRJZCAtIDFdO1xyXG4gICAgICAgIHZhciBjaGVja0lmVGFyZ2V0VHJhY2tlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHggPSB0YXJnZXQucG9zaXRpb24ueCAtIF90aGlzLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgIHZhciB5ID0gdGFyZ2V0LnBvc2l0aW9uLnkgLSBfdGhpcy5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgICB2YXIgYW5nZWxPblRhcmdldCA9IE1hdGguYXRhbjIoeSwgeCkgLyBNYXRoLlBJICogLTE4MDtcclxuICAgICAgICAgICAgdmFyIGFuZ2VsID0gX3RoaXMuYW5nZWwgLyBNYXRoLlBJICogLTE4MDtcclxuICAgICAgICAgICAgdmFyIG1heEFuZ2VsT2ZUcmFja2luZyA9IDMwO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5yb3VuZChhbmdlbCkgLSBNYXRoLnJvdW5kKGFuZ2VsT25UYXJnZXQpIDwgbWF4QW5nZWxPZlRyYWNraW5nXHJcbiAgICAgICAgICAgICAgICAmJiBNYXRoLnJvdW5kKGFuZ2VsKSAtIE1hdGgucm91bmQoYW5nZWxPblRhcmdldCkgPiAtbWF4QW5nZWxPZlRyYWNraW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gY2hlY2tzIGlmIHRhcmdldCB3YXMgaW4gcmFuZ2UgZm9yIDUgc2Vjb25kc1xyXG4gICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2hlY2tJZlRhcmdldFRyYWNrZWQoKSk7XHJcbiAgICAgICAgICAgIGlmIChjaGVja0lmVGFyZ2V0VHJhY2tlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy50YXJnZXRMb2NrU3RhdHVzIDwgMTApIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lcXVpcG1lbnQuQUFNU3RhdHVzLnRhcmdldExvY2tTdGF0dXMgKz0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmVxdWlwbWVudC5BQU1TdGF0dXMudGFyZ2V0TG9ja1N0YXR1cyA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF90aGlzLmVxdWlwbWVudC5BQU1TdGF0dXMudGFyZ2V0TG9ja1N0YXR1cyA9PSAxMCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy50YXJnZXRMb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy50YXJnZXRMb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5lcXVpcG1lbnQuQUFNU3RhdHVzLnRyYWNraW5nSW50ZXJ2YWxGbGFnICo9IC0xO1xyXG4gICAgICAgIH0sIDI1MCk7XHJcbiAgICB9O1xyXG4gICAgRmlnaHRlci5wcm90b3R5cGUuZmlyZUFBTSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBrZXlTaG9vdCA9IGRhdGFfMS5rZXlzW3RoaXMua2V5cy5lcXVpcG1lbnRdO1xyXG4gICAgICAgIHZhciB0YXJnZXRJZCA9ICh0aGlzLmlkID09IDEpID8gMSA6IDI7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGFwcF8xLmZpZ2h0ZXJzW3RhcmdldElkIC0gMV07XHJcbiAgICAgICAgdmFyIGNoZWNrRGlzdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZVggPSAoX3RoaXMucG9zaXRpb24ueCAtIHRhcmdldC5wb3NpdGlvbi54ID4gMCkgPyBfdGhpcy5wb3NpdGlvbi54IC0gdGFyZ2V0LnBvc2l0aW9uLnggOiB0YXJnZXQucG9zaXRpb24ueCAtIF90aGlzLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZVkgPSAoX3RoaXMucG9zaXRpb24ueSAtIHRhcmdldC5wb3NpdGlvbi55ID4gMCkgPyBfdGhpcy5wb3NpdGlvbi55IC0gdGFyZ2V0LnBvc2l0aW9uLnkgOiB0YXJnZXQucG9zaXRpb24ueSAtIF90aGlzLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLnNxcnQoZGlzdGFuY2VYICogZGlzdGFuY2VYICsgZGlzdGFuY2VZICogZGlzdGFuY2VZKSA+IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gISBTaG9vdFxyXG4gICAgICAgIGlmIChrZXlTaG9vdC5wcmVzc2VkICYmIHRoaXMuZXF1aXBtZW50LkFBTSA+IDAgJiYgIXRoaXMuQUFNZmlyZWQgJiYgY2hlY2tEaXN0YW5jZSgpICYmIHRoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy50YXJnZXRMb2NrZWRcclxuICAgICAgICAgICAgfHwga2V5U2hvb3QucHJlc3NlZCAmJiB0aGlzLmVxdWlwbWVudC5BQU0gPiAwICYmICF0aGlzLkFBTWZpcmVkICYmIGNoZWNrRGlzdGFuY2UoKSAmJiB0aGlzLmVxdWlwbWVudC5BQU1TdGF0dXMucm90YXRpb25BdmliaWxpdHkgPT0gMCkge1xyXG4gICAgICAgICAgICBpZiAoYXBwXzEuZmlnaHRlcnNbdGFyZ2V0SWQgLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNob290c18xID0gdGhpcy5lcXVpcG1lbnQuQUFNU3RhdHVzLm11bHRpcGxlU2hvb3RzO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNob290aW5nXzEgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLS1zaG9vdHNfMTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IF90aGlzLnBvc2l0aW9uLnggKyBfdGhpcy53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IF90aGlzLnBvc2l0aW9uLnkgKyBfdGhpcy5oZWlnaHQgLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmVsb2NpdHkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IDBcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtaXNzbGUgPSBuZXcgQUFNXzEuQUFNKHZlbG9jaXR5LCBwb3NpdGlvbiwgKF90aGlzLmVxdWlwbWVudC5BQU1TdGF0dXMubXVsdGlwbGVTaG9vdHMgPiAxKSA/IF90aGlzLmFuZ2VsICsgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMC4xIDogX3RoaXMuYW5nZWwsIHRhcmdldCwgX3RoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy5zcGVlZCwgX3RoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy5yb3RhdGlvbkF2aWJpbGl0eSwgX3RoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy5kYW1hZ2UsIF90aGlzLmVxdWlwbWVudC5BQU1Ta2luKTtcclxuICAgICAgICAgICAgICAgICAgICBhcHBfMS5BQU1zLnB1c2gobWlzc2xlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hvb3RzXzEgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHNob290aW5nXzEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkFBTWZpcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLkFBTWZpcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcXVpcG1lbnQuQUFNLS07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy8gISB1cGRhdGluZ1xyXG4gICAgRmlnaHRlci5wcm90b3R5cGUudXBkYXRlU3RhdHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgZ2V0RGF0YSA9IGZ1bmN0aW9uIChjaGFyKSB7IHJldHVybiBkYXRhXzIuc2VsZWN0RGF0YVtjaGFyXVtfdGhpcy51cGdyYWRlc1tjaGFyXV07IH07XHJcbiAgICAgICAgdmFyIGRhdGE7XHJcbiAgICAgICAgLy8gZmlnaHRlclxyXG4gICAgICAgIGRhdGEgPSBnZXREYXRhKCdmJyk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbkF2aWJpbGl0eSA9IGRhdGEucm90YXRpb25BdmliaWxpdHk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSBkYXRhLmhlYWx0aDtcclxuICAgICAgICB0aGlzLm1heEhlYWx0aCA9IGRhdGEuaGVhbHRoO1xyXG4gICAgICAgIHRoaXMuZXF1aXBtZW50LkFBTSA9IGRhdGEuZXF1aXBtZW50TnVtYmVyO1xyXG4gICAgICAgIHRoaXMuaW1nID0gKDAsIGdhbWVFdmVudHNfMS5jcmVhdGVJbWcpKGRhdGEuaW1nKTtcclxuICAgICAgICB0aGlzLmltZ1NhdmUgPSAoMCwgZ2FtZUV2ZW50c18xLmNyZWF0ZUltZykoZGF0YS5pbWcpO1xyXG4gICAgICAgIC8vIGVuZ2luZVxyXG4gICAgICAgIGRhdGEgPSBnZXREYXRhKCdlJyk7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IGRhdGEuc3BlZWQ7XHJcbiAgICAgICAgLy8gTWFjaGluZUd1blxyXG4gICAgICAgIGRhdGEgPSBnZXREYXRhKCdtJyk7XHJcbiAgICAgICAgdGhpcy5zcHJlYWQgPSBkYXRhLnNwcmVhZDtcclxuICAgICAgICB0aGlzLmZpcmVSYXRlID0gZGF0YS5maXJlUmF0ZTtcclxuICAgICAgICB0aGlzLmRhbWFnZSA9IGRhdGEuZGFtYWdlO1xyXG4gICAgICAgIHRoaXMubWF4T3ZlcmhlYXQgPSBkYXRhLm1heE92ZXJoZWF0O1xyXG4gICAgICAgIC8vIEFBTVxyXG4gICAgICAgIGRhdGEgPSBnZXREYXRhKCdyJyk7XHJcbiAgICAgICAgdGhpcy5lcXVpcG1lbnQuQUFNU3RhdHVzLnJvdGF0aW9uQXZpYmlsaXR5ID0gZGF0YS5yb3RhdGlvbkF2aWJpbGl0eTtcclxuICAgICAgICB0aGlzLmVxdWlwbWVudC5BQU1TdGF0dXMuc3BlZWQgPSBkYXRhLnNwZWVkO1xyXG4gICAgICAgIHRoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy5kYW1hZ2UgPSBkYXRhLmRhbWFnZTtcclxuICAgICAgICB0aGlzLmVxdWlwbWVudC5BQU1Ta2luID0gZGF0YS5za2luO1xyXG4gICAgICAgIHRoaXMuZXF1aXBtZW50LkFBTVN0YXR1cy5tdWx0aXBsZVNob290cyA9IGRhdGEubXVsdGlwbGVTaG9vdHM7XHJcbiAgICB9O1xyXG4gICAgRmlnaHRlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHBfMS5jLnNhdmUoKTtcclxuICAgICAgICBhcHBfMS5jLnRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQgLyAyKTtcclxuICAgICAgICBhcHBfMS5jLnJvdGF0ZSh0aGlzLmFuZ2VsKTtcclxuICAgICAgICBhcHBfMS5jLnRyYW5zbGF0ZSgtdGhpcy5wb3NpdGlvbi54IC0gdGhpcy53aWR0aCAvIDIsIC10aGlzLnBvc2l0aW9uLnkgLSB0aGlzLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGFwcF8xLmMuZHJhd0ltYWdlKHRoaXMuaW1nLCB0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGFwcF8xLmMucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgfTtcclxuICAgIC8vIF4gbWFpbiBmdW5jdGlvbiBjYWxsaW5nIGFub3RoZXIgZnVuY3Rpb25zIGluIGRlc2lnbmF0ZWQgb3JkZXJcclxuICAgIEZpZ2h0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoZGF0YV8xLmtleXNbdGhpcy5rZXlzLmZsYWlyc10ucHJlc3NlZCAmJiAhdGhpcy5mbGFpcnNTaG9vdClcclxuICAgICAgICAgICAgdGhpcy5sdW5jaEZsYWlycygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUm90YXRpb24oKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZlbG9jaXR5KCk7XHJcbiAgICAgICAgdGhpcy5zbW9rZSgpO1xyXG4gICAgICAgIHRoaXMuZmlyZUFBTSgpO1xyXG4gICAgICAgIC8vIHVwZGF0ZSBndW5zIHN0YXR1cyBcclxuICAgICAgICB2YXIga2V5U2hvb3QgPSBkYXRhXzEua2V5c1t0aGlzLmtleXMuc2hvb3RdO1xyXG4gICAgICAgIGlmIChrZXlTaG9vdC5wcmVzc2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvb3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm92ZXJIZWF0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdmVySGVhdCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJIZWF0IC09IDAuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vdmVySGVhdCA+PSB0aGlzLm1heE92ZXJoZWF0KSB7XHJcbiAgICAgICAgICAgIHRoaXMub3ZlckhlYXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm92ZXJIZWF0IDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy5vdmVySGVhdCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMub3ZlckhlYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiBoaXRzIHNpZGUgb2YgbWFwXHJcbiAgICAgICAgaWYgKGRhdGFfMi5ydWxlcy5tYXAuc3RvcFgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueCA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52ZWxvY2l0eS54ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5Lng7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wb3NpdGlvbi54ID4gYXBwXzEuY2FudmFzLndpZHRoIC0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52ZWxvY2l0eS54IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5Lng7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnggKz0gdGhpcy52ZWxvY2l0eS54O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi54IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gYXBwXzEuY2FudmFzLndpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnggPiBhcHBfMS5jYW52YXMud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGFfMi5ydWxlcy5tYXAuc3RvcFkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52ZWxvY2l0eS55ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSArPSB0aGlzLnZlbG9jaXR5Lnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wb3NpdGlvbi55ID4gYXBwXzEuY2FudmFzLmhlaWdodCAtIDEwMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmVsb2NpdHkueSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9IGFwcF8xLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA+IGFwcF8xLmNhbnZhcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG4gICAgLy8gISBlZmVjdHNcclxuICAgIEZpZ2h0ZXIucHJvdG90eXBlLmV4cGxvZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBuID0gTWF0aC5yYW5kb20oKSAqIDI7XHJcbiAgICAgICAgICAgIHZhciBjb2xvciA9IChuID4gMSkgPyAnZGFya2dyZXknIDogJ29yYW5nZSc7XHJcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eSA9IHtcclxuICAgICAgICAgICAgICAgIHg6IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDMsXHJcbiAgICAgICAgICAgICAgICB5OiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGFwcF8xLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZV8xLlBhcnRpY2xlKHRoaXMucG9zaXRpb24sIHZlbG9jaXR5LCBjb2xvcikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbnVtID0gKHRoaXMuaWQgPT0gMSkgPyAwIDogMTtcclxuICAgICAgICBkYXRhXzIuc2VsZWN0RGF0YS5raWxsc1tudW1dICs9IDE7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICgwLCBnYW1lRXZlbnRzXzEucmVzdGFydCkoKTtcclxuICAgICAgICAgICAgKDAsIHVzZXJJbnRlcmZhY2VfMS5lcXVpcEJlc3QpKCk7XHJcbiAgICAgICAgfSwgNTAwMCk7XHJcbiAgICB9O1xyXG4gICAgRmlnaHRlci5wcm90b3R5cGUubHVuY2hGbGFpcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmZsYWlyc1Nob290ID0gdHJ1ZTtcclxuICAgICAgICB2YXIgbHVuY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgICAgIHg6IF90aGlzLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICB5OiBfdGhpcy5wb3NpdGlvbi55XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eTEgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiAoX3RoaXMudmVsb2NpdHkueSAtIF90aGlzLnZlbG9jaXR5LnggLyAyICsgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMykgKiAxLjUsXHJcbiAgICAgICAgICAgICAgICB5OiAoX3RoaXMudmVsb2NpdHkueCAtIF90aGlzLnZlbG9jaXR5LnkgLyAyICsgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMykgKiAxLjVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIHZlbG9jaXR5MiA9IHtcclxuICAgICAgICAgICAgICAgIHg6ICgtX3RoaXMudmVsb2NpdHkueSAtIF90aGlzLnZlbG9jaXR5LnggLyAyICsgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMykgKiAxLjUsXHJcbiAgICAgICAgICAgICAgICB5OiAoLV90aGlzLnZlbG9jaXR5LnggLSBfdGhpcy52ZWxvY2l0eS55IC8gMiArIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDMpICogMS41XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBjb2xvciA9ICdyZ2IoMjUzLCAyMjUsIDEwMiknO1xyXG4gICAgICAgICAgICB2YXIgZmxhaXIxID0gbmV3IFBhcnRpY2xlXzEuUGFydGljbGUocG9zaXRpb24sIHZlbG9jaXR5MSwgY29sb3IsIDUsIHRydWUpO1xyXG4gICAgICAgICAgICB2YXIgZmxhaXIyID0gbmV3IFBhcnRpY2xlXzEuUGFydGljbGUocG9zaXRpb24sIHZlbG9jaXR5MiwgY29sb3IsIDUsIHRydWUpO1xyXG4gICAgICAgICAgICBhcHBfMS5wYXJ0aWNsZXMucHVzaChmbGFpcjEpO1xyXG4gICAgICAgICAgICBhcHBfMS5wYXJ0aWNsZXMucHVzaChmbGFpcjIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICAgICAgbHVuY2goKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChsdW5jaCwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsdW5jaGluZyA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIGx1bmNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxNjYpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGx1bmNoaW5nKTtcclxuICAgICAgICB9LCAxNTAwKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuZmxhaXJzU2hvb3QgPSBmYWxzZTtcclxuICAgICAgICB9LCA3MDAwKTtcclxuICAgIH07XHJcbiAgICBGaWdodGVyLnByb3RvdHlwZS5zbW9rZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB4ID0gdGhpcy5wb3NpdGlvbi54ICsgdGhpcy53aWR0aCAvIDI7XHJcbiAgICAgICAgdmFyIHkgPSB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodCAvIDI7XHJcbiAgICAgICAgdmFyIHNtb2tlMSA9IG5ldyBTbW9rZV8xLlNtb2tlKHgsIHksICdvcmFuZ2UnLCA1LCAxLCAxKTtcclxuICAgICAgICB2YXIgc21va2UzID0gbmV3IFNtb2tlXzEuU21va2UoeCwgeSwgJ3doaXRlJywgMzAsIDAuMSwgMjApO1xyXG4gICAgICAgIHZhciBzbW9rZTQgPSBuZXcgU21va2VfMS5TbW9rZSh4LCB5LCAnZ3JleScsIDMwLCAwLjEsIDIwKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwXzEuc21va2VzLnB1c2goc21va2UxKTtcclxuICAgICAgICAgICAgaWYgKF90aGlzLmhlYWx0aCA8IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgYXBwXzEuc21va2VzLnB1c2goc21va2UzKTtcclxuICAgICAgICAgICAgICAgIGFwcF8xLnNtb2tlcy5wdXNoKHNtb2tlNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCA1MCk7XHJcbiAgICB9O1xyXG4gICAgLy8gISBtb3ZlbWVudFxyXG4gICAgRmlnaHRlci5wcm90b3R5cGUudXBkYXRlVmVsb2NpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHR1cm5LZXlzID0gW3RoaXMua2V5cy5sZWZ0LCB0aGlzLmtleXMucmlnaHRdO1xyXG4gICAgICAgIHZhciBnZXRUdXJuS2V5c1ByZXNzU3RhdHVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIga2V5czEgPSBbXTtcclxuICAgICAgICAgICAgdHVybktleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXlzMS5wdXNoKGRhdGFfMS5rZXlzW2tleV0ucHJlc3NlZCk7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4ga2V5czE7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdHVybktleXNQcmVzc1N0YXR1cyA9IGdldFR1cm5LZXlzUHJlc3NTdGF0dXMoKTtcclxuICAgICAgICBpZiAodGhpcy5zbG93RG93biA8IDAuMiAmJiB0dXJuS2V5c1ByZXNzU3RhdHVzWzBdICYmICF0dXJuS2V5c1ByZXNzU3RhdHVzWzFdIHx8IHRoaXMuc2xvd0Rvd24gPCAwLjIgJiYgdHVybktleXNQcmVzc1N0YXR1c1sxXSAmJiAhdHVybktleXNQcmVzc1N0YXR1c1swXSkge1xyXG4gICAgICAgICAgICB0aGlzLnNsb3dEb3duICs9IDAuMDA0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2xvd0Rvd24gPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbG93RG93biA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsb3dEb3duIC09IDAuMDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRlZzM2MCA9IE1hdGguUEkgKiAyO1xyXG4gICAgICAgIC8vIGlmIDAgPCBkZWcgPCA5MFxyXG4gICAgICAgIGlmICh0aGlzLmFuZ2VsID4gMCAmJiB0aGlzLmFuZ2VsIDwgZGVnMzYwIC8gNCkge1xyXG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuYW5nZWwgLyBkZWczNjAgKiA0O1xyXG4gICAgICAgICAgICB2YXIgeCA9IDEgLSB5O1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSB4ICogdGhpcy5zcGVlZCAqICgxIC0gdGhpcy5zbG93RG93bik7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IHkgKiB0aGlzLnNwZWVkICogKDEgLSB0aGlzLnNsb3dEb3duKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgMCA+IGRlZyA+IC05MFxyXG4gICAgICAgIGlmICh0aGlzLmFuZ2VsIDwgMCAmJiB0aGlzLmFuZ2VsID4gLWRlZzM2MCAvIDQgfHwgdGhpcy5hbmdlbCA8IC1kZWczNjAgLyA0ICogMykge1xyXG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuYW5nZWwgLyBkZWczNjAgKiA0O1xyXG4gICAgICAgICAgICB2YXIgeCA9IDEgKyB5O1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSB4ICogdGhpcy5zcGVlZCAqICgxIC0gdGhpcy5zbG93RG93bik7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IHkgKiB0aGlzLnNwZWVkICogKDEgLSB0aGlzLnNsb3dEb3duKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgOTAgPCBkZWcgPCAxODBcclxuICAgICAgICBpZiAodGhpcy5hbmdlbCA+IGRlZzM2MCAvIDQpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRBbmdlbCA9IHRoaXMuYW5nZWwgLSBkZWczNjAgLyA0O1xyXG4gICAgICAgICAgICB2YXIgeCA9IGN1cnJlbnRBbmdlbCAvIGRlZzM2MCAqIDQ7XHJcbiAgICAgICAgICAgIHZhciB5ID0gMSAtIHg7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueCA9IC14ICogdGhpcy5zcGVlZCAqICgxIC0gdGhpcy5zbG93RG93bik7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSA9IHkgKiB0aGlzLnNwZWVkICogKDEgLSB0aGlzLnNsb3dEb3duKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgLTkwID4gZGVnID4gLTE4MFxyXG4gICAgICAgIGlmICh0aGlzLmFuZ2VsIDwgLWRlZzM2MCAvIDQpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRBbmdlbCA9IC10aGlzLmFuZ2VsIC0gZGVnMzYwIC8gNDtcclxuICAgICAgICAgICAgdmFyIHggPSBjdXJyZW50QW5nZWwgLyBkZWczNjAgKiA0O1xyXG4gICAgICAgICAgICB2YXIgeSA9IDEgLSB4O1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnggPSAteCAqIHRoaXMuc3BlZWQgKiAoMSAtIHRoaXMuc2xvd0Rvd24pO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnkgPSAteSAqIHRoaXMuc3BlZWQgKiAoMSAtIHRoaXMuc2xvd0Rvd24pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBGaWdodGVyLnByb3RvdHlwZS51cGRhdGVSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIga2V5TGVmdCA9IGRhdGFfMS5rZXlzW3RoaXMua2V5cy5sZWZ0XTtcclxuICAgICAgICB2YXIga2V5UmlnaHQgPSBkYXRhXzEua2V5c1t0aGlzLmtleXMucmlnaHRdO1xyXG4gICAgICAgIHZhciBrZXlzMSA9IHtcclxuICAgICAgICAgICAga2V5TGVmdDoga2V5TGVmdCxcclxuICAgICAgICAgICAga2V5UmlnaHQ6IGtleVJpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmltZyA9IHRoaXMuaW1nU2F2ZTtcclxuICAgICAgICB2YXIgZmlnaHRlckRhbWFnZSA9ICh0aGlzLmhlYWx0aCA8IDEwMCkgPyAwLjcgOiAxO1xyXG4gICAgICAgIGlmIChrZXlzMS5rZXlMZWZ0LnByZXNzZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbiA9IC10aGlzLnJvdGF0aW9uQXZpYmlsaXR5ICogZmlnaHRlckRhbWFnZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW1nLnNyYy5pbmNsdWRlcygnZjE2JykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nID0gKDAsIGdhbWVFdmVudHNfMS5jcmVhdGVJbWcpKCcuL2ltZy9mMTZ2Mi5wbmcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pbWcuc3JjLmluY2x1ZGVzKCdzdTE3JykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nID0gKDAsIGdhbWVFdmVudHNfMS5jcmVhdGVJbWcpKCcuL2ltZy9zdTE3LTIucG5nJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGtleXMxLmtleVJpZ2h0LnByZXNzZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbiA9IHRoaXMucm90YXRpb25BdmliaWxpdHkgKiBmaWdodGVyRGFtYWdlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbWcuc3JjLmluY2x1ZGVzKCdmMTYnKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWcgPSAoMCwgZ2FtZUV2ZW50c18xLmNyZWF0ZUltZykoJy4vaW1nL2YxNnYzLnBuZycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmltZy5zcmMuaW5jbHVkZXMoJ3N1MTcnKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWcgPSAoMCwgZ2FtZUV2ZW50c18xLmNyZWF0ZUltZykoJy4vaW1nL3N1MTctMy5wbmcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoa2V5czEua2V5UmlnaHQucHJlc3NlZCAmJiBrZXlzMS5rZXlMZWZ0LnByZXNzZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gdGhpcy5pbWdTYXZlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hbmdlbCA+IE1hdGguUEkpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmdlbCA9IC1NYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hbmdlbCA8IC1NYXRoLlBJKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5nZWwgPSBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFuZ2VsICs9IHRoaXMucm90YXRpb247XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEZpZ2h0ZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRmlnaHRlciA9IEZpZ2h0ZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLkVuZ2luZSA9IHZvaWQgMDtcclxudmFyIEVuZ2luZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEVuZ2luZShzcGVlZCwgcHJpY2UsIGJvdWdodCkge1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuICAgICAgICB0aGlzLnByaWNlID0gcHJpY2U7XHJcbiAgICAgICAgdGhpcy5ib3VnaHQgPSBib3VnaHQgfHwgeyBwbGF5ZXIxOiBmYWxzZSwgcGxheWVyMjogZmFsc2UgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBFbmdpbmU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRW5naW5lID0gRW5naW5lO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5NYXNoaW5ndW4gPSB2b2lkIDA7XHJcbnZhciBNYXNoaW5ndW4gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBNYXNoaW5ndW4oZmlyZVJhdGUsIHNwcmVhZCwgbWF4T3ZlcmhlYXQsIHByaWNlLCBkYW1hZ2UsIGJvdWdodCkge1xyXG4gICAgICAgIHRoaXMuZmlyZVJhdGUgPSBmaXJlUmF0ZTtcclxuICAgICAgICB0aGlzLnNwcmVhZCA9IHNwcmVhZDtcclxuICAgICAgICB0aGlzLm1heE92ZXJoZWF0ID0gbWF4T3ZlcmhlYXQ7XHJcbiAgICAgICAgdGhpcy5wcmljZSA9IHByaWNlO1xyXG4gICAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xyXG4gICAgICAgIHRoaXMuYm91Z2h0ID0gYm91Z2h0IHx8IHsgcGxheWVyMTogZmFsc2UsIHBsYXllcjI6IGZhbHNlIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTWFzaGluZ3VuO1xyXG59KCkpO1xyXG5leHBvcnRzLk1hc2hpbmd1biA9IE1hc2hpbmd1bjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMuUGxhbmUgPSB2b2lkIDA7XHJcbnZhciBQbGFuZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBsYW5lKHJvdGF0aW9uQXZpYmlsaXR5LCBoZWFsdGgsIHByaWNlLCBlcXVpcG1lbnROdW1iZXIsIGltZywgYm91Z2h0KSB7XHJcbiAgICAgICAgdGhpcy5pbWcgPSBpbWc7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbkF2aWJpbGl0eSA9IHJvdGF0aW9uQXZpYmlsaXR5O1xyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gaGVhbHRoO1xyXG4gICAgICAgIHRoaXMucHJpY2UgPSBwcmljZTtcclxuICAgICAgICB0aGlzLmVxdWlwbWVudE51bWJlciA9IGVxdWlwbWVudE51bWJlcjtcclxuICAgICAgICB0aGlzLmJvdWdodCA9IGJvdWdodCB8fCB7IHBsYXllcjE6IGZhbHNlLCBwbGF5ZXIyOiBmYWxzZSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFBsYW5lO1xyXG59KCkpO1xyXG5leHBvcnRzLlBsYW5lID0gUGxhbmU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLlJvY2tldCA9IHZvaWQgMDtcclxudmFyIFJvY2tldCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJvY2tldChzcGVlZCwgcm90YXRpb25BdmliaWxpdHksIHByaWNlLCBza2luLCBkYW1hZ2UsIG11bHRpcGxlU2hvb3RzLCBib3VnaHQpIHtcclxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbkF2aWJpbGl0eSA9IHJvdGF0aW9uQXZpYmlsaXR5O1xyXG4gICAgICAgIHRoaXMucHJpY2UgPSBwcmljZTtcclxuICAgICAgICB0aGlzLmJvdWdodCA9IGJvdWdodCB8fCB7IHBsYXllcjE6IGZhbHNlLCBwbGF5ZXIyOiBmYWxzZSB9O1xyXG4gICAgICAgIHRoaXMuc2tpbiA9IHNraW47XHJcbiAgICAgICAgdGhpcy5kYW1hZ2UgPSBkYW1hZ2U7XHJcbiAgICAgICAgdGhpcy5tdWx0aXBsZVNob290cyA9IG11bHRpcGxlU2hvb3RzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFJvY2tldDtcclxufSgpKTtcclxuZXhwb3J0cy5Sb2NrZXQgPSBSb2NrZXQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLnNlbGVjdERhdGEgPSBleHBvcnRzLmtleXMgPSBleHBvcnRzLnJ1bGVzID0gdm9pZCAwO1xyXG52YXIgUGxhbmVfMSA9IHJlcXVpcmUoXCIuL2NsYXNzZXMvUGxhbmVcIik7XHJcbnZhciBFbmdpbmVfMSA9IHJlcXVpcmUoXCIuL2NsYXNzZXMvRW5naW5lXCIpO1xyXG52YXIgTWFjaGluZUd1bl8xID0gcmVxdWlyZShcIi4vY2xhc3Nlcy9NYWNoaW5lR3VuXCIpO1xyXG52YXIgUm9ja2V0XzEgPSByZXF1aXJlKFwiLi9jbGFzc2VzL1JvY2tldFwiKTtcclxuZXhwb3J0cy5ydWxlcyA9IHtcclxuICAgIG1hcDoge1xyXG4gICAgICAgIHN0b3BYOiB0cnVlLFxyXG4gICAgICAgIHN0b3BZOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgbW9uZXk6IHtcclxuICAgICAgICBzdGFydFZhbHVlOiAyMDAsXHJcbiAgICAgICAgYWRkZWRWYWx1ZTogNTAwXHJcbiAgICB9LFxyXG4gICAgY29vcGVyYXRpb246IGZhbHNlLFxyXG4gICAgYXNrT25TZWxlY3Rpb246IGZhbHNlXHJcbn07XHJcbmV4cG9ydHMua2V5cyA9IHtcclxuICAgIGE6IHsgcHJlc3NlZDogZmFsc2UgfSxcclxuICAgIGQ6IHsgcHJlc3NlZDogZmFsc2UgfSxcclxuICAgIHc6IHsgcHJlc3NlZDogZmFsc2UgfSxcclxuICAgIHM6IHsgcHJlc3NlZDogZmFsc2UgfSxcclxuICAgIGU6IHsgcHJlc3NlZDogZmFsc2UgfSxcclxuICAgIEFycm93TGVmdDogeyBwcmVzc2VkOiBmYWxzZSB9LFxyXG4gICAgQXJyb3dSaWdodDogeyBwcmVzc2VkOiBmYWxzZSB9LFxyXG4gICAgQXJyb3dVcDogeyBwcmVzc2VkOiBmYWxzZSB9LFxyXG4gICAgQXJyb3dEb3duOiB7IHByZXNzZWQ6IGZhbHNlIH0sXHJcbiAgICBudW0wOiB7IHByZXNzZWQ6IGZhbHNlIH1cclxufTtcclxuZXhwb3J0cy5zZWxlY3REYXRhID0ge1xyXG4gICAgZjogW1xyXG4gICAgICAgIG5ldyBQbGFuZV8xLlBsYW5lKDAuMDIsIDE1MCwgMCwgMiwgJy4vaW1nL2N6ZXJ3b255LnBuZycsIHsgcGxheWVyMTogdHJ1ZSwgcGxheWVyMjogdHJ1ZSB9KSxcclxuICAgICAgICBuZXcgUGxhbmVfMS5QbGFuZSgwLjAyNSwgMjAwLCAxMDAsIDIsICcuL2ltZy9zdTE3LnBuZycpLFxyXG4gICAgICAgIG5ldyBQbGFuZV8xLlBsYW5lKDAuMDI3LCAyNTAsIDI1MCwgMywgJy4vaW1nL21pZzI5LUtpb3dHaG9zdC0yLnBuZycpLFxyXG4gICAgICAgIG5ldyBQbGFuZV8xLlBsYW5lKDAuMDMsIDM1MCwgNDUwLCAzLCAnLi9pbWcvZjE2djEucG5nJyksXHJcbiAgICAgICAgbmV3IFBsYW5lXzEuUGxhbmUoMC4wMzUsIDUwMCwgNTAwLCA0LCAnLi9pbWcvRi0zNS5wbmcnKSxcclxuICAgIF0sXHJcbiAgICBlOiBbXHJcbiAgICAgICAgbmV3IEVuZ2luZV8xLkVuZ2luZSgxMCwgMCwgeyBwbGF5ZXIxOiB0cnVlLCBwbGF5ZXIyOiB0cnVlIH0pLFxyXG4gICAgICAgIG5ldyBFbmdpbmVfMS5FbmdpbmUoMTEsIDUwKSxcclxuICAgICAgICBuZXcgRW5naW5lXzEuRW5naW5lKDEyLCAxNTApLFxyXG4gICAgICAgIG5ldyBFbmdpbmVfMS5FbmdpbmUoMTMsIDM1MCksXHJcbiAgICAgICAgbmV3IEVuZ2luZV8xLkVuZ2luZSgxNSwgNTAwKSxcclxuICAgIF0sXHJcbiAgICBtOiBbXHJcbiAgICAgICAgbmV3IE1hY2hpbmVHdW5fMS5NYXNoaW5ndW4oMSwgMC40LCAyMDAsIDAsIDIsIHsgcGxheWVyMTogdHJ1ZSwgcGxheWVyMjogdHJ1ZSB9KSxcclxuICAgICAgICBuZXcgTWFjaGluZUd1bl8xLk1hc2hpbmd1bigxLjUsIDAuNiwgMjUwLCAxNTAsIDIpLFxyXG4gICAgICAgIG5ldyBNYWNoaW5lR3VuXzEuTWFzaGluZ3VuKDAuMDUsIDAuMSwgMjUwLCA0MDAsIDMwKSxcclxuICAgICAgICBuZXcgTWFjaGluZUd1bl8xLk1hc2hpbmd1bigzLCAwLjcsIDQ1MCwgNTAwLCAzKSxcclxuICAgICAgICBuZXcgTWFjaGluZUd1bl8xLk1hc2hpbmd1big1LCAwLjUsIDUxMCwgNzAwLCAyKSxcclxuICAgIF0sXHJcbiAgICByOiBbXHJcbiAgICAgICAgbmV3IFJvY2tldF8xLlJvY2tldCg0LjUsIDAsIDAsICcuL2ltZy9BRy5qcGcnLCA3MCwgMSwgeyBwbGF5ZXIxOiB0cnVlLCBwbGF5ZXIyOiB0cnVlIH0pLFxyXG4gICAgICAgIG5ldyBSb2NrZXRfMS5Sb2NrZXQoNiwgMCwgMjAwLCAnLi9pbWcvVkwtU1JTQU0uanBnJywgMTUwLCAxKSxcclxuICAgICAgICBuZXcgUm9ja2V0XzEuUm9ja2V0KDQuNSwgMCwgMzAwLCAnLi9pbWcvQUcuanBnJywgMjAsIDcpLFxyXG4gICAgICAgIG5ldyBSb2NrZXRfMS5Sb2NrZXQoNSwgMS4yLCA0MDAsICcuL2ltZy9taXNzbGUuanBnJywgMTAwLCAxKSxcclxuICAgICAgICBuZXcgUm9ja2V0XzEuUm9ja2V0KDYsIDIuMiwgNTAwLCAnLi9pbWcvdG9wQUFNLnBuZycsIDIyNSwgMSksXHJcbiAgICBdLFxyXG4gICAgY3VycmVudFBsYXllcjogMSxcclxuICAgIG1vbmV5OiBbZXhwb3J0cy5ydWxlcy5tb25leS5zdGFydFZhbHVlLCBleHBvcnRzLnJ1bGVzLm1vbmV5LnN0YXJ0VmFsdWVdLFxyXG4gICAga2lsbHM6IFswLCAwXVxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0cy5jcmVhdGVJbWcgPSBleHBvcnRzLnN0YXJ0ID0gZXhwb3J0cy5yZXN0YXJ0ID0gdm9pZCAwO1xyXG52YXIgYXBwXzEgPSByZXF1aXJlKFwiLi4vYXBwXCIpO1xyXG52YXIgZGF0YV8xID0gcmVxdWlyZShcIi4uL2RhdGEvZGF0YVwiKTtcclxudmFyIGZpZ2h0ZXJfMSA9IHJlcXVpcmUoXCIuLi9jbGFzc2VzL2ZpZ2h0ZXJcIik7XHJcbnZhciB1c2VySW50ZXJmYWNlXzEgPSByZXF1aXJlKFwiLi91c2VySW50ZXJmYWNlXCIpO1xyXG52YXIgcmVzdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICgwLCBleHBvcnRzLnN0YXJ0KSgpO1xyXG4gICAgYXBwXzEuY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBbJyNtYWluJywgJyNtbzEnLCAnI21vMiddLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IobmFtZSk7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIH0pO1xyXG4gICAgZGF0YV8xLnNlbGVjdERhdGEubW9uZXkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGkpIHtcclxuICAgICAgICBkYXRhXzEuc2VsZWN0RGF0YS5tb25leVtpXSArPSBkYXRhXzEucnVsZXMubW9uZXkuYWRkZWRWYWx1ZTtcclxuICAgIH0pO1xyXG4gICAgKDAsIHVzZXJJbnRlcmZhY2VfMS51cGRhdGVNb25leSkoKTtcclxufTtcclxuZXhwb3J0cy5yZXN0YXJ0ID0gcmVzdGFydDtcclxudmFyIHN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHBsYXllcjEgPSBuZXcgZmlnaHRlcl8xLkZpZ2h0ZXIoMTAsIGFwcF8xLmNhbnZhcy5oZWlnaHQgLyAyLCAxMCwgJy4vaW1nL2YzNS5wbmcnLCAwLCAwLCB7XHJcbiAgICAgICAgbGVmdDogJ2EnLFxyXG4gICAgICAgIHJpZ2h0OiAnZCcsXHJcbiAgICAgICAgc2hvb3Q6ICd3JyxcclxuICAgICAgICBlcXVpcG1lbnQ6ICdzJyxcclxuICAgICAgICBmbGFpcnM6ICdlJ1xyXG4gICAgfSk7XHJcbiAgICBhcHBfMS5maWdodGVyc1swXSA9IHBsYXllcjE7XHJcbiAgICB2YXIgcGxheWVyMiA9IG5ldyBmaWdodGVyXzEuRmlnaHRlcihhcHBfMS5jYW52YXMud2lkdGggLSAxMCwgYXBwXzEuY2FudmFzLmhlaWdodCAvIDIsIC0xMCwgJy4vaW1nL2YzNS5wbmcnLCBNYXRoLlBJLCAxLCB7XHJcbiAgICAgICAgbGVmdDogJ0Fycm93TGVmdCcsXHJcbiAgICAgICAgcmlnaHQ6ICdBcnJvd1JpZ2h0JyxcclxuICAgICAgICBzaG9vdDogJ0Fycm93VXAnLFxyXG4gICAgICAgIGVxdWlwbWVudDogJ0Fycm93RG93bicsXHJcbiAgICAgICAgZmxhaXJzOiAnbnVtMCdcclxuICAgIH0pO1xyXG4gICAgYXBwXzEuZmlnaHRlcnNbMV0gPSBwbGF5ZXIyO1xyXG4gICAgYXBwXzEuZmlnaHRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZmlnaHRlcikge1xyXG4gICAgICAgIGZpZ2h0ZXIuc3RhcnRUcmFja2luZygpO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoZGF0YV8xLnJ1bGVzLmNvb3BlcmF0aW9uKSB7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuc3RhcnQgPSBzdGFydDtcclxuLy8gISBoYW5kbGluZyBleHRyYSBkYXRhXHJcbnZhciBjcmVhdGVJbWcgPSBmdW5jdGlvbiAoc3JjKSB7XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWcuc3JjID0gc3JjO1xyXG4gICAgcmV0dXJuIGltZztcclxufTtcclxuZXhwb3J0cy5jcmVhdGVJbWcgPSBjcmVhdGVJbWc7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzLmVxdWlwQmVzdCA9IGV4cG9ydHMuYWRkRXZ0cyA9IGV4cG9ydHMuY2xlYXJJbnB1dHMgPSBleHBvcnRzLnVwZGF0ZU1vbmV5ID0gZXhwb3J0cy51cGRhdGVMb29rID0gZXhwb3J0cy51cGRhdGVMb2cgPSB2b2lkIDA7XHJcbnZhciBhcHBfMSA9IHJlcXVpcmUoXCIuLi9hcHBcIik7XHJcbnZhciBkYXRhXzEgPSByZXF1aXJlKFwiLi4vZGF0YS9kYXRhXCIpO1xyXG4vLyAhIHVwZGF0ZSBsb2dcclxudmFyIGdhbWVTdGFydGVkID0gZmFsc2U7XHJcbnZhciB1cGRhdGVMb2cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbG9nMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2cxJyk7XHJcbiAgICB2YXIgbG9nMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2cyJyk7XHJcbiAgICB2YXIgbG9ncyA9IFtsb2cxLCBsb2cyXTtcclxuICAgIGxvZ3MuZm9yRWFjaChmdW5jdGlvbiAobG9nLCBpKSB7XHJcbiAgICAgICAgdmFyIGFkZExvZyA9IGZ1bmN0aW9uIChsb2csIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gXCI8cCBzdHlsZT1cXFwiY29sb3I6IFwiLmNvbmNhdChjb2xvciwgXCI7XFxcIj5cIikuY29uY2F0KGxvZywgXCI8L3A+XCIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGZpZ2h0ZXIgPSBhcHBfMS5maWdodGVyc1tpXTtcclxuICAgICAgICAvLyBoZWFsdGhcclxuICAgICAgICB2YXIgY29sb3IgPSAnZ3JlZW4nO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gJyc7XHJcbiAgICAgICAgaWYgKGZpZ2h0ZXIpIHtcclxuICAgICAgICAgICAgaWYgKGZpZ2h0ZXIuaGVhbHRoIDwgMTUwKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9ICd5ZWxsb3cnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaWdodGVyLmhlYWx0aCA8IDEyMCkge1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSAnb3JhbmdlJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmlnaHRlci5oZWFsdGggPCAxMDApIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gJ3JlZCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGhlYWx0aFN0YXRlID0gTWF0aC5yb3VuZChmaWdodGVyLmhlYWx0aCAvIGZpZ2h0ZXIubWF4SGVhbHRoICogMTAwKTtcclxuICAgICAgICAgICAgYWRkTG9nKFwiZmlnaHRlciBpbnRlZ3JpdHk6IFwiLmNvbmNhdChmaWdodGVyLmhlYWx0aCwgXCIoXCIpLmNvbmNhdChoZWFsdGhTdGF0ZSwgXCIlKVwiKSwgY29sb3IpO1xyXG4gICAgICAgICAgICBpZiAoZmlnaHRlci5oZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgYWRkTG9nKCdGSUdIVEVSIERFU1RST1lFRCcsICdyZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gXCI8cCBzdHlsZT1cXFwiY29sb3I6IFwiLmNvbmNhdChjb2xvciwgXCI7XFxcIiBjbGFzcz1cXFwiYmFyXFxcIj58PC9wPlwiKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlfMSA9IDA7IGlfMSA8IDQwOyBpXzErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoZWFsdGhTdGF0ZSAvIDEwMCAqIDQwID4gaV8xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCI8cCBzdHlsZT1cXFwiY29sb3I6IFwiLmNvbmNhdChjb2xvciwgXCI7XFxcIiBjbGFzcz1cXFwiYmFyXFxcIj58PC9wPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCI8cCBzdHlsZT1cXFwiY29sb3I6IFwiLmNvbmNhdChjb2xvciwgXCI7XFxcIiBjbGFzcz1cXFwiYmFyXFxcIj4uPC9wPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiPHAgc3R5bGU9XFxcImNvbG9yOiBcIi5jb25jYXQoY29sb3IsIFwiO1xcXCIgY2xhc3M9XFxcImJhclxcXCI+fDwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICBhZGRMb2cobWVzc2FnZSwgY29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGd1biBvdmVyaGVhdFxyXG4gICAgICAgICAgICB2YXIgZ3VuT3ZlcmhlYXRTdGF0ZSA9IE1hdGgucm91bmQoZmlnaHRlci5vdmVySGVhdCAvIGZpZ2h0ZXIubWF4T3ZlcmhlYXQgKiAxMDApO1xyXG4gICAgICAgICAgICB2YXIgb3ZlcmhlYXRDb2xvciA9ICdncmVlbic7XHJcbiAgICAgICAgICAgIGlmIChndW5PdmVyaGVhdFN0YXRlID4gMjUpIHtcclxuICAgICAgICAgICAgICAgIG92ZXJoZWF0Q29sb3IgPSAneWVsbG93JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZ3VuT3ZlcmhlYXRTdGF0ZSA+IDUwKSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyaGVhdENvbG9yID0gJ29yYW5nZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGd1bk92ZXJoZWF0U3RhdGUgPiA3NSkge1xyXG4gICAgICAgICAgICAgICAgb3ZlcmhlYXRDb2xvciA9ICdyZWQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFkZExvZyhcImd1biBvdmVyaGVhdDogXCIuY29uY2F0KGZpZ2h0ZXIub3ZlckhlYXQsIFwiKFwiKS5jb25jYXQoZ3VuT3ZlcmhlYXRTdGF0ZSwgXCIlKVwiKSwgb3ZlcmhlYXRDb2xvcik7XHJcbiAgICAgICAgICAgIGlmIChmaWdodGVyLm92ZXJIZWF0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGFkZExvZygnfHx8fHx8fHx8IGd1biBvdmVyaGVhdGVkIHx8fHx8fHx8fCcsICdyZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gXCI8cCBzdHlsZT1cXFwiY29sb3I6IFwiLmNvbmNhdChvdmVyaGVhdENvbG9yLCBcIjtcXFwiIGNsYXNzPVxcXCJiYXJcXFwiPnw8L3A+XCIpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaV8yID0gMDsgaV8yIDwgNDA7IGlfMisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGd1bk92ZXJoZWF0U3RhdGUgLyAxMDAgKiA0MCA+IGlfMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiPHAgc3R5bGU9XFxcImNvbG9yOiBcIi5jb25jYXQob3ZlcmhlYXRDb2xvciwgXCI7XFxcIiBjbGFzcz1cXFwiYmFyXFxcIj58PC9wPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCI8cCBzdHlsZT1cXFwiY29sb3I6IFwiLmNvbmNhdChvdmVyaGVhdENvbG9yLCBcIjtcXFwiIGNsYXNzPVxcXCJiYXJcXFwiPi48L3A+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCI8cCBzdHlsZT1cXFwiY29sb3I6IFwiLmNvbmNhdChvdmVyaGVhdENvbG9yLCBcIjtcXFwiIGNsYXNzPVxcXCJiYXJcXFwiPnw8L3A+XCIpO1xyXG4gICAgICAgICAgICAgICAgYWRkTG9nKG1lc3NhZ2UsIG92ZXJoZWF0Q29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGVxdWlwZWQgbWlzc2xlcyBcclxuICAgICAgICAgICAgYWRkTG9nKFwiQUFNOiBcIi5jb25jYXQoZmlnaHRlci5lcXVpcG1lbnQuQUFNKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhZGRMb2coJ0ZJR0hURVIgREVTVFJPWUVEJywgJ3JlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2cuaW5uZXJIVE1MID0gY29udGVudDtcclxuICAgIH0pO1xyXG59O1xyXG5leHBvcnRzLnVwZGF0ZUxvZyA9IHVwZGF0ZUxvZztcclxuLy8gISBVcGRhdGUgaW50ZXJmYWNlIHNjYWxlXHJcbnZhciB1cGRhdGVMb29rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbicpO1xyXG4gICAgbWFpbi5zdHlsZS5sZWZ0ID0gKGlubmVyV2lkdGggLyAyIC0gNjAwKS50b1N0cmluZygpO1xyXG4gICAgbWFpbi5zdHlsZS50b3AgPSAoaW5uZXJIZWlnaHQgLyAyIC0gMzAwKS50b1N0cmluZygpO1xyXG4gICAgWycjbWFpbicsICcjbG9nMScsICcjbG9nMicsICcjbW8xJywgJyNtbzInLCAnI29wdGlvbnMnXS5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCk7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlKFwiLmNvbmNhdChpbm5lcldpZHRoIC8gMzAxMCwgXCIpXCIpO1xyXG4gICAgfSk7XHJcbiAgICBhcHBfMS5jYW52YXMud2lkdGggPSBpbm5lcldpZHRoO1xyXG4gICAgYXBwXzEuY2FudmFzLmhlaWdodCA9IGlubmVySGVpZ2h0O1xyXG59O1xyXG5leHBvcnRzLnVwZGF0ZUxvb2sgPSB1cGRhdGVMb29rO1xyXG4vLyAhIFNob3dzIGJ1eWluZyBwcm9ncmVzc1xyXG52YXIgY2hlY2sgPSBmdW5jdGlvbiAobWFyaywgaSkge1xyXG4gICAgaWYgKGkgIT0gMCkge1xyXG4gICAgICAgIHZhciBib3VnaHQgPSBkYXRhXzEuc2VsZWN0RGF0YVttYXJrXVtpXS5ib3VnaHRbXCJwbGF5ZXJcIi5jb25jYXQoZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllcildO1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIi5jb25jYXQobWFyaykuY29uY2F0KGkgKyAxKSk7XHJcbiAgICAgICAgaWYgKGJvdWdodCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgI2ZmZic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgcmVkJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YXIgdGllcjEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1wiLmNvbmNhdChtYXJrLCBcIjFcIikpO1xyXG4gICAgICAgIHRpZXIxLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgZ3JlZW4nO1xyXG4gICAgfVxyXG59O1xyXG52YXIgdXBkYXRlTW9uZXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZGl2MSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtbzEnKTtcclxuICAgIHZhciBkaXYyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vMicpO1xyXG4gICAgdmFyIG1vbmV5ID0gZGF0YV8xLnNlbGVjdERhdGEubW9uZXk7XHJcbiAgICBkaXYxLmlubmVySFRNTCA9IFwiPHAgY2xhc3M9J2tpbGxzJz5cIi5jb25jYXQoZGF0YV8xLnNlbGVjdERhdGEua2lsbHNbMF0sIFwiPC9wPiAkXCIpLmNvbmNhdChtb25leVswXSk7XHJcbiAgICBkaXYyLmlubmVySFRNTCA9IFwiPHAgY2xhc3M9J2tpbGxzJz5cIi5jb25jYXQoZGF0YV8xLnNlbGVjdERhdGEua2lsbHNbMV0sIFwiPC9wPiAkXCIpLmNvbmNhdChtb25leVsxXSk7XHJcbn07XHJcbmV4cG9ydHMudXBkYXRlTW9uZXkgPSB1cGRhdGVNb25leTtcclxuLy8gISBIYW5kbGluZyBtZW51IGRhdGFcclxudmFyIGNsZWFySW5wdXRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgWydmJywgJ2UnLCAnbScsICdyJ10uZm9yRWFjaChmdW5jdGlvbiAoY2hhcikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNoZWNrKGNoYXIsIGkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5leHBvcnRzLmNsZWFySW5wdXRzID0gY2xlYXJJbnB1dHM7XHJcbnZhciBhZGRFdnRzID0gZnVuY3Rpb24gKGNoYXIpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG4gPSBpICsgMTtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBjaGFyICsgbik7XHJcbiAgICAgICAgLy8gZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgYnV5VXBncmFkZSk7XHJcbiAgICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNob3dTdGF0dXMpO1xyXG4gICAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdFVwZ3JhZGUpO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLmFkZEV2dHMgPSBhZGRFdnRzO1xyXG4vLyAgISBvbiBtaWRkbGUgbW91c2UgY2xpY2tcclxudmFyIHNob3dTdGF0dXMgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKGUuYnV0dG9uID09PSAxKSB7XHJcbiAgICAgICAgdmFyIGlkID0gZS50YXJnZXQuaWQ7XHJcbiAgICAgICAgdmFyIGNoYXIgPSBpZC5jaGFyQXQoMCk7XHJcbiAgICAgICAgdmFyIG51bSA9IGlkLmNoYXJBdCgxKSAtIDE7XHJcbiAgICAgICAgaWYgKGlkICE9ICcnKSB7XHJcbiAgICAgICAgICAgIHZhciB1cGdyYWRlRGF0YSA9IGRhdGFfMS5zZWxlY3REYXRhW2NoYXJdW251bV07XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVwZ3JhZGVEYXRhKTtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gXCJuYW1lOiBcIi5jb25jYXQoJ2ZpZ2h0ZXInLCBcIlxcclxcblxcclxcblwiKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAnJztcclxuICAgICAgICAgICAgLy8gYWRkIGRhdGFcclxuICAgICAgICAgICAgc3dpdGNoIChjaGFyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmaWdodGVyXHJcbiAgICAgICAgICAgICAgICBjYXNlICdmJzpcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9IFwic2hlYXRoaW5nOlxcclxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gXCItIGFybW9yIGludGVncml0eTogXCIuY29uY2F0KHVwZ3JhZGVEYXRhLmhlYWx0aCwgXCJcXHJcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSBcIi0gbWFuZXV2ZXJhYmlsaXR5OiBcIi5jb25jYXQodXBncmFkZURhdGEucm90YXRpb25BdmliaWxpdHksIFwiXFxyXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gXCJ3ZWFwb25hcnk6XFxyXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSBcIi0gQUFNIGF0dGFjaG1lbnRzOiBcIi5jb25jYXQodXBncmFkZURhdGEuZXF1aXBtZW50TnVtYmVyLCBcIlxcclxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIC8vIGVuZ2luZVxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSBcIi0gc3BlZWQ6IFwiLmNvbmNhdCh1cGdyYWRlRGF0YS5zcGVlZCwgXCJcXHJcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAvLyBtYWNoaW5lIGd1blxyXG4gICAgICAgICAgICAgICAgY2FzZSAnbSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSBcIi0gZmlyZVJhdGU6IFwiLmNvbmNhdCh1cGdyYWRlRGF0YS5maXJlUmF0ZSwgXCJcXHJcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSBcIi0gc3ByZWFkOiBcIi5jb25jYXQodXBncmFkZURhdGEuc3ByZWFkLCBcIlxcclxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9IFwiLSBkYW1hZ2U6IFwiLmNvbmNhdCh1cGdyYWRlRGF0YS5kYW1hZ2UsIFwiXFxyXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gXCItIG1heCBvdmVyaGVhdDogXCIuY29uY2F0KHVwZ3JhZGVEYXRhLm1heE92ZXJoZWF0LCBcIlxcclxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIC8vIEFBTVxyXG4gICAgICAgICAgICAgICAgY2FzZSAncic6XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSBcIi0gZGFtYWdlOiBcIi5jb25jYXQodXBncmFkZURhdGEuZGFtYWdlLCBcIlxcclxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9IFwiLSBzaG90cyBpbiBzZXJpZXM6IFwiLmNvbmNhdCh1cGdyYWRlRGF0YS5tdWx0aXBsZVNob290cywgXCJcXHJcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSBcIi0gbWFuZXV2ZXJhYmlsaXR5OiBcIi5jb25jYXQodXBncmFkZURhdGEucm90YXRpb25BdmliaWxpdHksIFwiXFxyXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gXCItc3BlZWQ6IFwiLmNvbmNhdCh1cGdyYWRlRGF0YS5zcGVlZCwgXCJcXHJcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGVudCArPSBcIlxcclxcbnByaWNlOiBcIi5jb25jYXQodXBncmFkZURhdGEucHJpY2UpO1xyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRpdGxlICsgY29udGVudDtcclxuICAgICAgICAgICAgYWxlcnQobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4vLyAhIG9uIGNsaWNrXHJcbnZhciBzZWxlY3RVcGdyYWRlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciBpZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgdmFyIGNoYXIgPSBpZC5jaGFyQXQoMCk7XHJcbiAgICB2YXIgbnVtID0gaWQuY2hhckF0KDEpO1xyXG4gICAgaWYgKGlkICE9ICcnKSB7XHJcbiAgICAgICAgdmFyIGJvdWdodCA9IGRhdGFfMS5zZWxlY3REYXRhW2NoYXJdW251bSAtIDFdLmJvdWdodFtcInBsYXllclwiLmNvbmNhdChkYXRhXzEuc2VsZWN0RGF0YS5jdXJyZW50UGxheWVyKV07XHJcbiAgICAgICAgaWYgKGJvdWdodCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IDU7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1wiLmNvbmNhdChjaGFyLCBcIjFcIikpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkICNmZmYnO1xyXG4gICAgICAgICAgICAgICAgY2hlY2soY2hhciwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCBncmVlbic7XHJcbiAgICAgICAgICAgIGFwcF8xLmZpZ2h0ZXJzW2RhdGFfMS5zZWxlY3REYXRhLmN1cnJlbnRQbGF5ZXIgLSAxXS51cGdyYWRlc1tjaGFyXSA9IG51bSAtIDE7XHJcbiAgICAgICAgICAgIGFwcF8xLmZpZ2h0ZXJzLmZvckVhY2goZnVuY3Rpb24gKGZpZ2h0ZXIpIHsgcmV0dXJuIGZpZ2h0ZXIudXBkYXRlU3RhdHMoKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4vLyAhIG9uIGRvdWJsZSBjbGlja1xyXG52YXIgYnV5VXBncmFkZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgaWQgPSBlLnRhcmdldC5pZDtcclxuICAgIHZhciBjaGFyID0gaWQuY2hhckF0KDApO1xyXG4gICAgdmFyIG51bSA9IGlkLmNoYXJBdCgxKTtcclxuICAgIGlmIChpZCAhPSAnJykge1xyXG4gICAgICAgIHZhciBib3VnaHQgPSBkYXRhXzEuc2VsZWN0RGF0YVtjaGFyXVtudW0gLSAxXS5ib3VnaHRbXCJwbGF5ZXJcIi5jb25jYXQoZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllcildO1xyXG4gICAgICAgIHZhciBkYXRhID0gZGF0YV8xLnNlbGVjdERhdGFbY2hhcl1bbnVtIC0gMV07XHJcbiAgICAgICAgaWYgKCFib3VnaHQpIHtcclxuICAgICAgICAgICAgLy8gXndoZW4gdGhpbmcgaXMgbm90IGJvdWdodFxyXG4gICAgICAgICAgICB2YXIgbW9uZXkgPSBkYXRhXzEuc2VsZWN0RGF0YS5tb25leVtkYXRhXzEuc2VsZWN0RGF0YS5jdXJyZW50UGxheWVyIC0gMV07XHJcbiAgICAgICAgICAgIHZhciBwcmljZSA9IGRhdGEucHJpY2U7XHJcbiAgICAgICAgICAgIGlmIChtb25leSA+PSBwcmljZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzQm91Z2h0ID0gZGF0YV8xLnNlbGVjdERhdGFbY2hhcl1bbnVtIC0gMl0uYm91Z2h0W1wicGxheWVyXCIuY29uY2F0KGRhdGFfMS5zZWxlY3REYXRhLmN1cnJlbnRQbGF5ZXIpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c0JvdWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoZGF0YV8xLnJ1bGVzLmFza09uU2VsZWN0aW9uKSA/IGNvbmZpcm0oXCJEbyB5b3Ugd2FudCB0byBidXkgaXQgZm9yICRcIi5jb25jYXQocHJpY2UsIFwiIHlvdSB3aWxsIHRoZW4gaGF2ZSAkXCIpLmNvbmNhdChtb25leSAtIHByaWNlLCBcIiBtb25leSBsZWZ0XCIpKSA6IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV8xLnNlbGVjdERhdGEubW9uZXlbZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllciAtIDFdIC09IHByaWNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhXzEuc2VsZWN0RGF0YVtjaGFyXVtudW0gLSAxXS5ib3VnaHRbXCJwbGF5ZXJcIi5jb25jYXQoZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllcildID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIuY29uY2F0KGNoYXIpLmNvbmNhdChudW0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgI2ZmZic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnVwZGF0ZU1vbmV5KSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxudmFyIGVxdWlwQmVzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIFsnZicsICdlJywgJ20nLCAnciddLmZvckVhY2goZnVuY3Rpb24gKG1hcmspIHtcclxuICAgICAgICB2YXIgYmVzdEVxdWlwbWVudERpdjtcclxuICAgICAgICBkYXRhXzEuc2VsZWN0RGF0YVttYXJrXS5mb3JFYWNoKGZ1bmN0aW9uIChlcXVpcG1lbnQsIGkpIHtcclxuICAgICAgICAgICAgaWYgKGVxdWlwbWVudC5ib3VnaHRbXCJwbGF5ZXJcIi5jb25jYXQoZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllcildKSB7XHJcbiAgICAgICAgICAgICAgICBiZXN0RXF1aXBtZW50RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIi5jb25jYXQobWFyaykuY29uY2F0KGkgKyAxKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWxlY3RVcGdyYWRlKHsgdGFyZ2V0OiBiZXN0RXF1aXBtZW50RGl2IH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbmV4cG9ydHMuZXF1aXBCZXN0ID0gZXF1aXBCZXN0O1xyXG4vLyAhIGtleXByZXNzIGhhbmRsaW5nXHJcbnZhciBidXR0b25TdGFydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydCcpO1xyXG52YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChjb25maXJtKCdhcmUgeW91IHN1cmUnKSkge1xyXG4gICAgICAgIHZhciBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydCcpO1xyXG4gICAgICAgIHZhciBudW0gPSAoZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllciA9PSAxKSA/IDIgOiAxO1xyXG4gICAgICAgIHN0YXJ0QnV0dG9uLmlubmVySFRNTCA9IFwiRklHSFQhIChcIi5jb25jYXQobnVtLCBcIi8yKVwiKTtcclxuICAgICAgICB2YXIgbW9uZXlDb3VudGVyMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9cIi5jb25jYXQoZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllcikpO1xyXG4gICAgICAgIHZhciBtb25leUNvdW50ZXIyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb1wiLmNvbmNhdChudW0pKTtcclxuICAgICAgICBtb25leUNvdW50ZXIxLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgI2ZmZic7XHJcbiAgICAgICAgbW9uZXlDb3VudGVyMi5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkIG9yYW5nZSc7XHJcbiAgICAgICAgLy8gc3RhcnQgdGhlIGdhbWVcclxuICAgICAgICBpZiAoZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllciA9PSAyKSB7XHJcbiAgICAgICAgICAgIFsnI21haW4nLCAnI21vMScsICcjbW8yJ10uZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYXBwXzEuY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICBhcHBfMS5maWdodGVyc1swXS5wb3NpdGlvbiA9IHsgeDogMTAsIHk6IGlubmVySGVpZ2h0IC8gMiB9O1xyXG4gICAgICAgICAgICBhcHBfMS5maWdodGVyc1swXS5hbmdlbCA9IDA7XHJcbiAgICAgICAgICAgIGFwcF8xLmZpZ2h0ZXJzWzFdLnBvc2l0aW9uID0geyB4OiBpbm5lcldpZHRoIC0gMTAsIHk6IGlubmVySGVpZ2h0IC8gMiB9O1xyXG4gICAgICAgICAgICBhcHBfMS5maWdodGVyc1sxXS5hbmdlbCA9IE1hdGguUEk7XHJcbiAgICAgICAgICAgIGlmICghZ2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICgwLCBhcHBfMS5hbmltYXRlKSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdhbWVTdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgZGF0YV8xLnNlbGVjdERhdGEuY3VycmVudFBsYXllciA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkYXRhXzEuc2VsZWN0RGF0YS5jdXJyZW50UGxheWVyID0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgKDAsIGV4cG9ydHMuY2xlYXJJbnB1dHMpKCk7XHJcbiAgICAgICAgaWYgKGRhdGFfMS5zZWxlY3REYXRhLmN1cnJlbnRQbGF5ZXIgPT0gMikge1xyXG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5lcXVpcEJlc3QpKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldEludGVydmFsKGV4cG9ydHMudXBkYXRlTG9nLCAxMDAwKTtcclxuICAgIH1cclxufTtcclxuYnV0dG9uU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuZXh0KTtcclxuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgdmFyIGtleSA9IF9hLmtleTtcclxuICAgIGlmIChrZXkgIT0gJ28nKSB7XHJcbiAgICAgICAgdmFyIGtleUJpbmQgPSBrZXk7XHJcbiAgICAgICAgaWYgKGtleSA9PSAnSW5zZXJ0JyB8fCBrZXkgPT0gJzAnKSB7XHJcbiAgICAgICAgICAgIGtleUJpbmQgPSAnbnVtMCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhXzEua2V5c1trZXlCaW5kXSkge1xyXG4gICAgICAgICAgICBkYXRhXzEua2V5c1trZXlCaW5kXS5wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YXIgYmx1ckVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbicpO1xyXG4gICAgICAgIHZhciBibHVyXzEgPSBibHVyRWxlbWVudC5zdHlsZS5maWx0ZXI7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3B0aW9ucycpO1xyXG4gICAgICAgIGlmIChibHVyXzEgIT0gJ2JsdXIoNXB4KScpIHtcclxuICAgICAgICAgICAgWycjbWFpbicsICcjbW8xJywgJyNtbzInXS5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKTtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZmlsdGVyID0gXCJibHVyKDVweClcIjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBbJyNtYWluJywgJyNtbzEnLCAnI21vMiddLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5maWx0ZXIgPSBcIlwiO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgb3B0aW9ucy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICA7XHJcbiAgICAgICAgWycjc3RvcFgnLCAnI3N0b3BZJywgJyNjb29wJywgJyNkZXZNb2RlJ10uZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKTtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXhpcyA9IGVsZW1lbnQuaWQuY2hhckF0KDQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnREYXRhID0gKGlkID09ICcjc3RvcFknIHx8IGlkID09ICcjc3RvcFgnKSA/IGRhdGFfMS5ydWxlcy5tYXBbXCJzdG9wXCIuY29uY2F0KGF4aXMpXSA6IGRhdGFfMS5ydWxlcy5jb29wZXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZCAhPSAnI2Rldk1vZGUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ2RhcmtyZWQnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPT0gJyNzdG9wWScgfHwgaWQgPT0gJyNzdG9wWCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV8xLnJ1bGVzLm1hcFtcInN0b3BcIi5jb25jYXQoYXhpcyldID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZCA9PSAnI2Nvb3AnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFfMS5ydWxlcy5jb29wZXJhdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZCA9PSAnI3N0b3BZJyB8fCBpZCA9PSAnI3N0b3BYJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhXzEucnVsZXMubWFwW1wic3RvcFwiLmNvbmNhdChheGlzKV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdkYXJrZ3JlZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPT0gJyNjb29wJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhXzEucnVsZXMuY29vcGVyYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdkYXJrZ3JlZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPT0gJyNkZXZNb2RlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtMSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIwICsgMjApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtMiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIwICsgMjApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvbXB0KFwiXCIuY29uY2F0KG51bTEsIFwiICogXCIpLmNvbmNhdChudW0yKSkgPT0gXCJcIi5jb25jYXQobnVtMSAqIG51bTIsIFwiSlNcIikgfHwgdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBjb3JyZWN0IHBhc3N3b3JkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdkYXJrZ3JlZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV8xLnNlbGVjdERhdGEubW9uZXkgPSBbMTAwMDAsIDEwMDAwXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdOb3QgdGhpcyB0aW1lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGtleSA9PSAnRW50ZXInKSB7XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgfVxyXG59KTtcclxuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgIHZhciBrZXkgPSBfYS5rZXk7XHJcbiAgICB2YXIga2V5QmluZCA9IGtleTtcclxuICAgIGlmIChrZXkgPT0gJ0luc2VydCcgfHwga2V5ID09ICcwJykge1xyXG4gICAgICAgIGtleUJpbmQgPSAnbnVtMCc7XHJcbiAgICB9XHJcbiAgICBpZiAoZGF0YV8xLmtleXNba2V5QmluZF0pIHtcclxuICAgICAgICBkYXRhXzEua2V5c1trZXlCaW5kXS5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xyXG4vLyAhIFN0YXJ0IGRpcmVjdGlvbnNcclxudmFyIHN0YXJ0RGlyZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGFsZXJ0KCd5b3UgY2FuIGNoYW5nZSBzaXplIG9mIG1hcCBieSBwcmVzc2luZyBjdHJsICsgYW5kIGN0cmwgLSBhbmQgdGhlbiByZWZyZXNoaW5nIHRoZSBwYWdlJyk7XHJcbiAgICBpZiAoY29uZmlybSgnRG8geW91IHdhbnQgdG8gc2VlIGNvbnN0cm9scycpKSB7XHJcbiAgICAgICAgYWxlcnQoJ3N0YXJ0L25leHQgcGxheWVyOiBFbnRlcicpO1xyXG4gICAgICAgIGFsZXJ0KCdvcHRpb25zOiBvJyk7XHJcbiAgICAgICAgYWxlcnQoJ3BsYXllciAxJyk7XHJcbiAgICAgICAgYWxlcnQoJ3R1cm5pbmc6IGEgZCcpO1xyXG4gICAgICAgIGFsZXJ0KCdzaG9vdGluZzogdycpO1xyXG4gICAgICAgIGFsZXJ0KCdtaXNzbGU6IHMnKTtcclxuICAgICAgICBhbGVydCgnZmxhaXJzOiBlJyk7XHJcbiAgICAgICAgYWxlcnQoJ3BsYXllciAyJyk7XHJcbiAgICAgICAgYWxlcnQoJ3R1cm5pbmc6IGFycm93TGVmdCBhcnJvd1JpZ2h0Jyk7XHJcbiAgICAgICAgYWxlcnQoJ3Nob290aW5nOiBhcnJvd1VwJyk7XHJcbiAgICAgICAgYWxlcnQoJ21pc3NsZTogYXJyb3dEb3duJyk7XHJcbiAgICAgICAgYWxlcnQoJ2ZsYWlyczogbnVtIDAnKTtcclxuICAgIH1cclxuICAgIGlmIChjb25maXJtKCdEbyB5b3Ugd2FudCB0byBzZWUgdHV0b3JpYWw/JykpIHtcclxuICAgICAgICBhbGVydCgnYnV5IHVwZ3JhZGVzJyk7XHJcbiAgICAgICAgYWxlcnQoXCJ5b3Ugd29uJ3QgZ2V0IGV4dHJhIG1vbmV5IGJ5IGRlc3Ryb2luZyBlbmVteVwiKTtcclxuICAgICAgICBhbGVydCgnWW91IGdldCBtb25leSBldmVyeSByb3VuZCcpO1xyXG4gICAgICAgIGFsZXJ0KCd0aGVuIHlvdSBjYW4gYnV5IHVwZ3JhZGVzIGFmdGVyIGV2ZXJ5IHJvdW5kJyk7XHJcbiAgICAgICAgYWxlcnQoJ2dhbWUgbmV2ZXIgZmluaXNoZXMuIFlvdSBjYW4gcGxheSBhcyBsb25nIGFzIHlvdSB3YW50Jyk7XHJcbiAgICB9XHJcbiAgICBhbGVydCgnbm93IHBsYXllcjEgYnV5cyB1cGdyYWRlcycpO1xyXG59O1xyXG4vLyBzdGFydERpcmVjdGlvbnMoKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHMuZHJhd1RyYWNraW5nSW50ZXJmYWNlID0gdm9pZCAwO1xyXG52YXIgYXBwXzEgPSByZXF1aXJlKFwiLi4vYXBwXCIpO1xyXG52YXIgZHJhd1RyYWNraW5nSW50ZXJmYWNlID0gZnVuY3Rpb24gKGZpZ2h0ZXIpIHtcclxuICAgIGlmIChhcHBfMS5maWdodGVyc1soZmlnaHRlci5pZCA9PSAxKSA/IDAgOiAxXSkge1xyXG4gICAgICAgIGlmIChmaWdodGVyLmVxdWlwbWVudC5BQU1TdGF0dXMudGFyZ2V0TG9ja1N0YXR1cyAhPSAwKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRfMSA9IGFwcF8xLmZpZ2h0ZXJzWyhmaWdodGVyLmlkID09IDEpID8gMCA6IDFdO1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tEaXN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZVggPSAoZmlnaHRlci5wb3NpdGlvbi54IC0gdGFyZ2V0XzEucG9zaXRpb24ueCA+IDApID8gZmlnaHRlci5wb3NpdGlvbi54IC0gdGFyZ2V0XzEucG9zaXRpb24ueCA6IHRhcmdldF8xLnBvc2l0aW9uLnggLSBmaWdodGVyLnBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2VZID0gKGZpZ2h0ZXIucG9zaXRpb24ueSAtIHRhcmdldF8xLnBvc2l0aW9uLnkgPiAwKSA/IGZpZ2h0ZXIucG9zaXRpb24ueSAtIHRhcmdldF8xLnBvc2l0aW9uLnkgOiB0YXJnZXRfMS5wb3NpdGlvbi55IC0gZmlnaHRlci5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguc3FydChkaXN0YW5jZVggKiBkaXN0YW5jZVggKyBkaXN0YW5jZVkgKiBkaXN0YW5jZVkpID4gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vICEgYWltaW5nIHNxdWFyZVxyXG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoKGZpZ2h0ZXIucG9zaXRpb24ueCAtIHRhcmdldF8xLnBvc2l0aW9uLngpICogKGZpZ2h0ZXIucG9zaXRpb24ueCAtIHRhcmdldF8xLnBvc2l0aW9uLngpXHJcbiAgICAgICAgICAgICAgICArIChmaWdodGVyLnBvc2l0aW9uLnkgLSB0YXJnZXRfMS5wb3NpdGlvbi55KSAqIChmaWdodGVyLnBvc2l0aW9uLnkgLSB0YXJnZXRfMS5wb3NpdGlvbi55KSk7XHJcbiAgICAgICAgICAgIHZhciBidWxsZXRTcGVlZCA9IE1hdGguc3FydChmaWdodGVyLnZlbG9jaXR5LnggKiBmaWdodGVyLnZlbG9jaXR5LnggKiA5ICsgZmlnaHRlci52ZWxvY2l0eS55ICogZmlnaHRlci52ZWxvY2l0eS55ICogOSk7XHJcbiAgICAgICAgICAgIHZhciB0cmF2ZWxUaW1lID0gZGlzdGFuY2UgLyBidWxsZXRTcGVlZDtcclxuICAgICAgICAgICAgdmFyIE1lZXRQb3MgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiB0YXJnZXRfMS5wb3NpdGlvbi54ICsgdGFyZ2V0XzEudmVsb2NpdHkueCAqIHRyYXZlbFRpbWUsXHJcbiAgICAgICAgICAgICAgICB5OiB0YXJnZXRfMS5wb3NpdGlvbi55ICsgdGFyZ2V0XzEudmVsb2NpdHkueSAqIHRyYXZlbFRpbWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gZGlmZmVyZW5jZSBiZWV0d2VuIGZpZ2h0ZXJzIHBvc2l0aW9uIGFuZCBNZWV0UG9zXHJcbiAgICAgICAgICAgIHZhciBkTWl0RmlnID0ge1xyXG4gICAgICAgICAgICAgICAgeDogTWVldFBvcy54IC0gZmlnaHRlci5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgeTogTWVldFBvcy55IC0gZmlnaHRlci5wb3NpdGlvbi55XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIGFuZ2VsIG9uIHRhcmdldFxyXG4gICAgICAgICAgICB2YXIgZ3VuQWltUG9zID0ge1xyXG4gICAgICAgICAgICAgICAgeDogZmlnaHRlci5wb3NpdGlvbi54ICsgZE1pdEZpZy54IC8gKE1hdGguYWJzKGRNaXRGaWcueCkgKyBNYXRoLmFicyhkTWl0RmlnLnkpKSAqIDIwMCxcclxuICAgICAgICAgICAgICAgIHk6IGZpZ2h0ZXIucG9zaXRpb24ueSArIGRNaXRGaWcueSAvIChNYXRoLmFicyhkTWl0RmlnLngpICsgTWF0aC5hYnMoZE1pdEZpZy55KSkgKiAyMDBcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gIGN1cnJlbnQgYW5nZWxcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRBbmdlbCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IGZpZ2h0ZXIucG9zaXRpb24ueCArIGZpZ2h0ZXIudmVsb2NpdHkueCAvIChNYXRoLmFicyhmaWdodGVyLnZlbG9jaXR5LngpICsgTWF0aC5hYnMoZmlnaHRlci52ZWxvY2l0eS55KSkgKiAyMDAsXHJcbiAgICAgICAgICAgICAgICB5OiBmaWdodGVyLnBvc2l0aW9uLnkgKyBmaWdodGVyLnZlbG9jaXR5LnkgLyAoTWF0aC5hYnMoZmlnaHRlci52ZWxvY2l0eS54KSArIE1hdGguYWJzKGZpZ2h0ZXIudmVsb2NpdHkueSkpICogMjAwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vZHJhd1xyXG4gICAgICAgICAgICBpZiAoZmlnaHRlci5lcXVpcG1lbnQuQUFNU3RhdHVzLnRyYWNraW5nSW50ZXJ2YWxGbGFnID09IDEgfHwgZmlnaHRlci5lcXVpcG1lbnQuQUFNU3RhdHVzLnRhcmdldExvY2tlZCAmJiBjaGVja0Rpc3RhbmNlKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGFuZ2VsIG9uIHRhcmdldFxyXG4gICAgICAgICAgICAgICAgYXBwXzEuYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGFwcF8xLmMuZmlsbFN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICAgICAgICAgIGFwcF8xLmMuZmlsbFJlY3QoZ3VuQWltUG9zLngsIGd1bkFpbVBvcy55LCA0MCwgNDApO1xyXG4gICAgICAgICAgICAgICAgYXBwXzEuYy5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgICAgICAgICAgYXBwXzEuYy5maWxsUmVjdChndW5BaW1Qb3MueCArIDEsIGd1bkFpbVBvcy55ICsgMSwgMzgsIDM4KTtcclxuICAgICAgICAgICAgICAgIGFwcF8xLmMuZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdGV4dFxyXG4gICAgICAgICAgICAgICAgYXBwXzEuYy5maWxsU3R5bGUgPSAnZ3JlZW4nO1xyXG4gICAgICAgICAgICAgICAgYXBwXzEuYy5mb250ID0gXCI0MHB4IExBVE9cIjtcclxuICAgICAgICAgICAgICAgIGFwcF8xLmMuZmlsbFRleHQoXCJcIi5jb25jYXQoTWF0aC5yb3VuZChkaXN0YW5jZSksIFwibVwiKSwgZ3VuQWltUG9zLnggKyA2MCwgZ3VuQWltUG9zLnkgKyAzMCk7XHJcbiAgICAgICAgICAgICAgICBhcHBfMS5jLmZpbGxUZXh0KChmaWdodGVyLmVxdWlwbWVudC5BQU1TdGF0dXMudGFyZ2V0TG9ja2VkICYmIGNoZWNrRGlzdGFuY2UoKSkgPyAnTE9DSycgOiAnJywgZ3VuQWltUG9zLnggKyA2MCwgZ3VuQWltUG9zLnkpO1xyXG4gICAgICAgICAgICAgICAgYXBwXzEuYy5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjdXJyZW50IGFuZ2VsXHJcbiAgICAgICAgICAgIGFwcF8xLmMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGFwcF8xLmMuZmlsbFN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICAgICAgYXBwXzEuYy5maWxsUmVjdChjdXJyZW50QW5nZWwueCArIDEwLCBjdXJyZW50QW5nZWwueSArIDEwLCAyMCwgMjApO1xyXG4gICAgICAgICAgICBhcHBfMS5jLmZpbGxTdHlsZSA9ICdibGFjayc7XHJcbiAgICAgICAgICAgIGFwcF8xLmMuZmlsbFJlY3QoY3VycmVudEFuZ2VsLnggKyAxNCwgY3VycmVudEFuZ2VsLnkgKyAxNCwgMTIsIDEyKTtcclxuICAgICAgICAgICAgYXBwXzEuYy5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLmRyYXdUcmFja2luZ0ludGVyZmFjZSA9IGRyYXdUcmFja2luZ0ludGVyZmFjZTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==