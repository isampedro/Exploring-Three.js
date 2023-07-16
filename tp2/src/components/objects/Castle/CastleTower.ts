import * as THREE from "three";
import {Group, Mesh, Shape, Texture} from "three";
import {createMeshFromLathe} from "../Meshes";
import {getStep} from "../AuxiliarFunctions";

const createCastleTower = (floorsCount: number, towerTexture: Texture): Group => {
    const upperTowerTexture = new Texture().copy(towerTexture);
    const upperTowerShape = new Shape();
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
    upperTowerShape.moveTo(to.x, to.y)
    from = to;
    to = {x: widerPartWidth, y: from.y + widerPartHeight/2};
    step = getStep(from, to);
    upperTowerShape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: from.x, y: from.y + widerPartHeight};
    step = getStep(from, to);
    upperTowerShape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to;
    to = {x: 0, y: from.y};
    step = getStep(from, to);
    upperTowerShape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    towerTexture.wrapT = THREE.RepeatWrapping;
    towerTexture.wrapS = THREE.RepeatWrapping;
    towerTexture.repeat.set(8,8);
    towerTexture.rotation = -Math.PI/4;
    upperTowerTexture.wrapT = THREE.RepeatWrapping;
    upperTowerTexture.wrapS = THREE.RepeatWrapping;
    upperTowerTexture.repeat.set(3,3);
    upperTowerTexture.rotation = -Math.PI/4;
    const base = createMeshFromLathe(shape, 0xc4c291, towerTexture);
    const head = createMeshFromLathe(upperTowerShape, 0xc4c291, upperTowerTexture)
    return new Group().add(base).add(head);
}

export default createCastleTower;
