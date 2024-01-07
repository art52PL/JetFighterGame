import { c, fighters } from "../app";

export const drawTrackingInterface = (fighter: any) => {
    if (fighters[(fighter.id == 1) ? 0 : 1]) {
        if (fighter.equipment.AAMStatus.targetLockStatus != 0) {
            const target = fighters[(fighter.id == 1) ? 0 : 1];
            const checkDistance = () => {
                const distanceX = (fighter.position.x - target.position.x > 0) ? fighter.position.x - target.position.x : target.position.x - fighter.position.x;
                const distanceY = (fighter.position.y - target.position.y > 0) ? fighter.position.y - target.position.y : target.position.y - fighter.position.y;
                if (Math.sqrt(distanceX * distanceX + distanceY * distanceY) > 500) {
                    return true;
                }
                return false;
            }
            // ! aiming square
            const distance = Math.sqrt((fighter.position.x - target.position.x) * (fighter.position.x - target.position.x)
                + (fighter.position.y - target.position.y) * (fighter.position.y - target.position.y))
            const bulletSpeed = Math.sqrt(fighter.velocity.x * fighter.velocity.x * 9 + fighter.velocity.y * fighter.velocity.y * 9)
            const travelTime = distance / bulletSpeed;
            const MeetPos = {
                x: target.position.x + target.velocity.x * travelTime,
                y: target.position.y + target.velocity.y * travelTime
            }
            // difference beetwen fighters position and MeetPos
            const dMitFig = {
                x: MeetPos.x - fighter.position.x,
                y: MeetPos.y - fighter.position.y,
            }
            // angel on target
            const gunAimPos = {
                x: fighter.position.x + dMitFig.x / (Math.abs(dMitFig.x) + Math.abs(dMitFig.y)) * 200,
                y: fighter.position.y + dMitFig.y / (Math.abs(dMitFig.x) + Math.abs(dMitFig.y)) * 200
            }
            //  current angel
            const currentAngel = {
                x: fighter.position.x + fighter.velocity.x / (Math.abs(fighter.velocity.x) + Math.abs(fighter.velocity.y)) * 200,
                y: fighter.position.y + fighter.velocity.y / (Math.abs(fighter.velocity.x) + Math.abs(fighter.velocity.y)) * 200
            }
            //draw
            if (fighter.equipment.AAMStatus.trackingIntervalFlag == 1 || fighter.equipment.AAMStatus.targetLocked && checkDistance()) {

                // angel on target
                c.beginPath();
                c.fillStyle = 'green';
                c.fillRect(gunAimPos.x, gunAimPos.y, 40, 40);
                c.fillStyle = 'black';
                c.fillRect(gunAimPos.x + 1, gunAimPos.y + 1, 38, 38);
                c.fill();
                // text
                c.fillStyle = 'green';
                c.font = "40px LATO";
                c.fillText(`${Math.round(distance)}m`, gunAimPos.x + 60, gunAimPos.y + 30);
                c.fillText((fighter.equipment.AAMStatus.targetLocked && checkDistance()) ? 'LOCK' : '', gunAimPos.x + 60, gunAimPos.y);
                c.closePath();
            }
            // current angel
            c.beginPath();
            c.fillStyle = 'green';
            c.fillRect(currentAngel.x + 10, currentAngel.y + 10, 20, 20);
            c.fillStyle = 'black';
            c.fillRect(currentAngel.x + 14, currentAngel.y + 14, 12, 12);
            c.fill();
        }
    }
}