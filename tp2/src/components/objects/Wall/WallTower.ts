import * as THREE from "three";
import {Mesh, Texture} from "three";
import {createMeshFromLathe} from "../Meshes";

const getStep = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    return {x: (to.x-from.x)/3, y: (to.y-from.y)/3};
}

const createWallTower = (floors: number, texture: Texture, textureNormals: Texture): Mesh => {
    const shape = new THREE.Shape();
    const baseWidth = 5;
    const baseHeight = floors*2;
    const waistWidth = 3.5;
    const waistMidWidth = 2.5;
    const headHeight = 2;
    const headInnerWidth = 3.5;
    const headOutterWidth = 4.5;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(10,20);
    texture.rotation = 1.76;
    textureNormals.wrapT = THREE.RepeatWrapping;
    textureNormals.wrapS = THREE.RepeatWrapping;
    textureNormals.repeat.set(10,20);
    textureNormals.rotation = 1.76 + Math.PI/4;
    let from = {x: 0, y: 1}, to = {x: baseWidth, y: 0}, step;
    shape.moveTo(from.x, from.y);
    step = getStep(from, to);
    // PISO
    shape.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to
    to = { x: waistWidth, y: from.y + baseHeight};
    const stepWider = getStep(from, {x: waistMidWidth, y: to.y })
    // BASE
    step = getStep(from, to);
    shape.bezierCurveTo(from.x - stepWider.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = { x: headOutterWidth, y: from.y + headHeight/2};
    step = getStep(from, to);
    // CURVA PARA ARRIBA
    shape.bezierCurveTo(from.x, from.y + step.y, from.x + step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = { x: from.x, y: from.y + headHeight/2}
    step = getStep(from, to);
    // RECRO HASTA ARRIBA
    shape.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = { x: headInnerWidth, y: from.y};
    step = getStep(from ,to);
    // RECTO HASTA BORDE INTERNO
    shape.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = { x: from.x, y: from.y - headHeight/2};
    step = getStep(from ,to);
    // RECTO HASTA BORDE INFERIOR INTERNO
    shape.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = { x: 0, y: from.y};
    step = getStep(from ,to);
    // RECTO HASTA EL CENTRO
    shape.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    return createMeshFromLathe(shape, 0xa6a7ab, texture, textureNormals);
}

export default createWallTower;
