import {Group, RepeatWrapping, Shape, Texture} from "three";
import {createMeshFromLathe} from "../Meshes";

const getStep = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    return {x: (to.x-from.x)/3, y: (to.y-from.y)/3};
}

const createWallTower = (floors: number, texture: Texture): Group => {
    const upperTowerTexture = new Texture().copy(texture);
    const biggerCylinderTexture = new Texture().copy(texture);
    const shape = new Shape();
    const baseWidth = 5;
    const baseHeight = floors*2;
    const waistWidth = 3.5;
    const waistMidWidth = 2.5;
    const headHeight = 3;
    const headInnerWidth = 3.5;
    const headOuterWidth = 4.5;
    upperTowerTexture.wrapS = RepeatWrapping;
    upperTowerTexture.wrapT = RepeatWrapping;
    upperTowerTexture.repeat.set(4.5,1.2);
    upperTowerTexture.rotation = 3;
    biggerCylinderTexture.wrapT = RepeatWrapping;
    biggerCylinderTexture.wrapS = RepeatWrapping;
    biggerCylinderTexture.repeat.set(3,4.5);
    biggerCylinderTexture.rotation = 2.5;
    texture.wrapT = RepeatWrapping;
    texture.wrapS = RepeatWrapping;
    texture.repeat.set(9,9);
    texture.rotation = -Math.PI/4;
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
    const upperTowerShape = new Shape();
    upperTowerShape.moveTo(to.x, to.y);
    from = to;
    to = { x: headOuterWidth, y: from.y + headHeight/2};
    step = getStep(from, to);
    // CURVA PARA ARRIBA
    upperTowerShape.bezierCurveTo(from.x, from.y + step.y, from.x + step.x, from.y + 2*step.y, to.x, to.y);
    const biggerCylinder = new Shape();
    biggerCylinder.moveTo(to.x, to.y);
    from = to;
    to = { x: from.x, y: from.y + headHeight/2}
    step = getStep(from, to);
    // RECTO HASTA ARRIBA
    biggerCylinder.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = { x: headInnerWidth, y: from.y};
    step = getStep(from ,to);
    // RECTO HASTA BORDE INTERNO
    biggerCylinder.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = { x: from.x, y: from.y - headHeight/2};
    step = getStep(from ,to);
    // RECTO HASTA BORDE INFERIOR INTERNO
    biggerCylinder.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    from = to;
    to = { x: 0, y: from.y};
    step = getStep(from ,to);
    // RECTO HASTA EL CENTRO
    biggerCylinder.bezierCurveTo(from.x + step.x, from.y + step.y, from.x + 2*step.x, from.y + 2*step.y, to.x, to.y);
    const towerBase = createMeshFromLathe(shape, 0xa6a7ab, texture);
    const towerHead = createMeshFromLathe(upperTowerShape, 0xa6a7ab, upperTowerTexture);
    const towerHeadLines = createMeshFromLathe(biggerCylinder, 0xa6a7ab, biggerCylinderTexture)
    return new Group().add(towerBase).add(towerHead).add(towerHeadLines);
}

export default createWallTower;
