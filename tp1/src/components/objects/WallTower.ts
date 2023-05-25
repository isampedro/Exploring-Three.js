import * as THREE from "three";
import {Mesh} from "three";

const getStep = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    return {x: (to.x-from.x)/2, y: (to.y-from.y)/2};
}

const createWallTower = (): Mesh => {
    const shape = new THREE.Shape();
    let from = {x: 0, y: -1}, to = {x: -2, y: -1}, step;
    shape.moveTo(from.x, from.y);
    from.x = -.5;
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from.x = -1.6;
    from.y = .5;
    to.x = from.x + 1.1;
    to.y = from.y + 1.5;
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from.x = -.5;
    from.y = 2;
    to.x =  from.x - .75;
    to.y = from.y + .5;
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from.x = -1.25;
    from.y = 2.5;
    to.x = from.x;
    to.y = 3;
    step = getStep(from, to)
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from.x = -.75;
    from.y = 3;
    to.x = from.x;
    to.y = from.y - .5;
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from.x = -.75;
    from.y = 2.5;
    to.x = from.x + .75;
    to.y = from.y;
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);

    const segments = 30;
    const phiLength = Math.PI*2;

    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
    return new THREE.Mesh(geometry, geometryMaterial);
}

export default createWallTower;
