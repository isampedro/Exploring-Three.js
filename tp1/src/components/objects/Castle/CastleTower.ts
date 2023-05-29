import * as THREE from "three";
import {Mesh} from "three";
import {createMeshFromLathe} from "../Meshes";
import {getStep} from "../AuxiliarFunctions";

const createCastleTower = (floorsCount: number): Mesh => {
    const narrowerPartHeight = floorsCount*2;
    const narrowerPartWidth = 1;
    const widerPartHeight = 2;
    const widerPartWidth = 1.5;
    const shape = new THREE.Shape();
    let from = {x: 0, y: 0}, to = {x: -narrowerPartWidth, y: 0}, step;
    shape.moveTo(from.x, from.y);
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: -narrowerPartWidth, y: narrowerPartHeight};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: -widerPartWidth, y: from.y + widerPartHeight/2};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: from.x, y: from.y + widerPartHeight};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: 0, y: from.y};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    return createMeshFromLathe(shape, 0xFF0000);
}

export default createCastleTower;
