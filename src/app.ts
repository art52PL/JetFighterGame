import { updateLook, addEvts, clearInputs } from './gameHandling/userInterface';
import { start } from './gameHandling/gameEvents';
import { drawTrackingInterface } from './gameHandling/weaponaryInterface';

import { Particle } from './classes/Particle';

export const canvas = document.querySelector('canvas');
export const c = canvas.getContext('2d');

updateLook();
setInterval(updateLook, 1)

export const AAMs = [];
export const projectiles = [];
export const smokes = [];
export const particles = [];
export const fighters = [];

// !animate
// Is called every animation frame
export const animate = () =>
{
    // prepare map
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.beginPath();
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fill();
    c.closePath();
    // draw tracking interface
    fighters.forEach(drawTrackingInterface)
    fighters.forEach((fighter, i) =>
    {
        if (fighter.health <= 0)
        {
            fighter.explode();
            fighters.splice(i, 1);
        }
        fighter.update();
    })
    // ! update projectiles
    projectiles.forEach((projectile, i) =>
    {
        projectile.update();
        if (
            projectile.position.x < 0 ||
            projectile.position.x > canvas.width ||
            projectile.position.y < 0 ||
            projectile.position.y > canvas.height)
        {
            projectiles.splice(i, 1);
        } else
        {
            fighters.forEach((fighter, j) =>
            {
                // ^on hit
                if (
                    projectile.position.x > fighter.position.x &&
                    projectile.position.x < fighter.position.x + fighter.width &&

                    projectile.position.y > fighter.position.y &&
                    projectile.position.y < fighter.position.y + fighter.height && j !=
                    projectile.target)
                {

                    projectiles.splice(i, 1);
                    fighter.health -= projectile.damage;
                    for (let i = 0; i < 3; i++)
                    {
                        const n = Math.random() * 2;
                        const color = (n > 1) ? 'darkgrey' : 'orange';
                        const position = {
                            x: fighter.position.x + fighter.width / 2,
                            y: fighter.position.y + fighter.height / 2
                        }
                        const velocity = {
                            x: (Math.random() - 0.5) * 4 + fighter.velocity.x / 2,
                            y: (Math.random() - 0.5) * 4 + fighter.velocity.y / 2
                        }
                        particles.push(new Particle(position, velocity, color));
                    }
                }
            })
        }
    })
    particles.forEach((particle, i) =>
    {
        if (particle.throwsSmoke)
        {
            particle.smoke();
        }
        if (particle.alpha <= 0)
        {
            particles.splice(i, 1);
        } else
        {
            particle.update();
        }
    })
    smokes.forEach((smoke, i) =>
    {
        smoke.draw();
        if (smoke.alpha <= 0)
        {
            smokes.splice(i, 1);
        } else
        {
            const n = 0.1 / smoke.lenght;
            smoke.alpha -= n;
        }
    })
    AAMs.forEach((missle, i) =>
    {
        missle.smoke();
        missle.update();
        // ^when escapes the map
        if (missle.position.x < 0 || missle.position.x + missle.width > canvas.width ||
            missle.position.y < 0 || missle.position.y + missle.height > canvas.height)
        {
            AAMs.splice(i, 1);
        }
        const targetPos = missle.target.position;
        // ^when hits the target
        if (missle.position.x > targetPos.x - 20 && missle.position.x < targetPos.x + missle.target.width + 20 &&
            missle.position.y > targetPos.y - 20 && missle.position.y < targetPos.y + missle.target.height + 20)
        {
            missle.target.health -= missle.damage;
            missle.explode();
            AAMs.splice(i, 1);
        }
    })
    requestAnimationFrame(animate);
}

// ! Handle menu selection 
['f', 'e', 'm', 'r'].forEach(char => addEvts(char))

clearInputs();
start();

fighters.forEach((fighter) =>
{
    fighter.startTracking();
})

// --- NOTES ---

// TO DO
// - Targeting system
// 1 - gun
// 2 - missle
// equipment setup
// - Game types
// -  missle classes
// - another tiers