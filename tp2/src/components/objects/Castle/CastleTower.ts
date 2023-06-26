import * as THREE from "three";
import {Mesh, Texture} from "three";
import {createMeshFromLathe} from "../Meshes";
import {getStep} from "../AuxiliarFunctions";

const createCastleTower = (floorsCount: number, towerTexture: Texture, textureNormals: Texture, rotation: number): Mesh => {
    const narrowerPartHeight = floorsCount*2.7;
    const narrowerPartWidth = 2;
    const widerPartHeight = 3;
    const widerPartWidth = 3;
    const shape = new THREE.Shape();
    let from = {x: 0, y: 0}, to = {x: narrowerPartWidth, y: 0}, step;
    shape.moveTo(from.x, from.y);
    step = getStep(from, to);
    shape.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = {x: narrowerPartWidth, y: narrowerPartHeight};
    step = getStep(from, to);
    shape.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = {x: widerPartWidth, y: from.y + widerPartHeight/2};
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
    towerTexture.wrapT = THREE.RepeatWrapping;
    towerTexture.wrapS = THREE.RepeatWrapping;
    towerTexture.repeat.set(20,16);
    towerTexture.rotation = rotation;
    textureNormals.wrapT = THREE.RepeatWrapping;
    textureNormals.wrapS = THREE.RepeatWrapping;
    textureNormals.repeat.set(16,20);
    textureNormals.rotation = rotation;
    return createMeshFromLathe(shape, 0xc4c291, towerTexture);
}

export default createCastleTower;
