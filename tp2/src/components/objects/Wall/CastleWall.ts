import * as THREE from "three";
import {Mesh, Texture} from "three";
import {createFromExtrude} from "../Meshes";

const getStep = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    return {x: (to.x-from.x)/2, y: (to.y-from.y)/2};
}

const createWall = (floors: number, lenght: number, texture: Texture): Mesh => {
    const shape = new THREE.Shape();
    const baseWidth = 2;
    const baseHeight = floors*1.3;
    const headHeight = 1;
    const headInnerWidth = 1.2;
    const headOutterWidth = 1.6;
    texture.rotation = -3*Math.PI/4;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(0.5, .5);
    let from = {x: 0, y: 0}, to = {x: baseWidth, y: 0}, step;
    shape.moveTo(from.x, from.y);
    step = getStep(from, to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x, from.y + step.y, to.x, to.y);
    from = to
    to = { x: headOutterWidth, y: from.y + baseHeight};
    step = getStep(from ,to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x + 0.5, from.y + step.y, to.x, to.y);
    from = to;
    shape.lineTo(from.x, from.y + headHeight);
    from = {x: from.x, y: from.y + headHeight};
    to = {x: headInnerWidth, y: from.y};
    shape.lineTo(to.x, to.y);
    shape.lineTo(to.x, to.y - headHeight);

    to = {x: -headInnerWidth, y: to.y - headHeight};
    shape.lineTo(to.x, to.y);
    from = to;
    to = {x: from.x, y: from.y + headHeight};
    shape.lineTo(to.x, to.y);
    shape.lineTo(-headOutterWidth, to.y);
    from = {x: -headOutterWidth, y: to.y};
    to = {x: from.x, y: from.y - headHeight};
    shape.lineTo(to.x, to.y);
    from = to;
    to = { x: -baseWidth, y: 0};
    step = getStep(from ,to);
    shape.bezierCurveTo(from.x, from.y, from.x + step.x - 0.5, from.y + step.y, to.x, to.y);

    return createFromExtrude(shape, 0xa6a7ab, lenght, texture);
}

export default createWall;
