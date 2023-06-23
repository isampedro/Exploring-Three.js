import * as THREE from "three";
import {Mesh} from "three";
import {createMeshFromLathe} from "../Meshes";

const getStep = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    return {x: (to.x-from.x)/2, y: (to.y-from.y)/2};
}

const createWallTower = (floors: number): Mesh => {
    const shape = new THREE.Shape();
    const baseWidth = 3;
    const baseHeight = floors*2;
    const waistWidth = 1.2;
    const headHeight = 2;
    const headInnerWidth = 1.6;
    const headOutterWidth = 2;


    let from = {x: 0, y: 0}, to = {x: baseWidth, y: 0}, step;
    shape.moveTo(from.x, from.y);
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to
    to = { x: waistWidth, y: from.y + baseHeight};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x - step.x - .4, from.y + step.y/2, to.x, to.y);
    from = to;
    to = { x: headOutterWidth, y: from.y + headHeight/2};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x, from.y + step.y, to.x, to.y);
    from = to;
    to = { x: from.x, y: from.y + headHeight/2}
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = { x: headInnerWidth, y: from.y};
    step = getStep(from ,to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = { x: from.x, y: from.y - headHeight/2};
    step = getStep(from ,to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = { x: 0, y: from.y};
    step = getStep(from ,to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    return createMeshFromLathe(shape, 0xa6a7ab);
}

export default createWallTower;
