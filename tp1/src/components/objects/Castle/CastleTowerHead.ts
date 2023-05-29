import {Mesh} from "three";
import * as THREE from "three";
import {getStep} from "../AuxiliarFunctions";
import {createMeshFromLathe, createMeshFromLatheStandard} from "../Meshes";

const createCastleTowerHead = (): Mesh => {
    const height = 4;
    const narrowerPartWidth = 0.1;
    const widerPartWidth = 1.7;
    const shape = new THREE.Shape();
    let from = {x: 0, y: 0}, to = {x: -widerPartWidth, y: 0}, step;
    shape.moveTo(from.x, from.y);
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: -widerPartWidth/2 + narrowerPartWidth, y: height/2}
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: -narrowerPartWidth, y: height};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: 0, y: height};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);

    return createMeshFromLathe(shape, 0x2e5797);
}

export default createCastleTowerHead;
