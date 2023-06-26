import {Mesh, Shape, Texture} from "three";
import {createFromExtrude} from "../Meshes";
import * as THREE from "three";

const createCatapultStandPart = (standHeight: number, texture: Texture): Mesh => {
    const baseWidth = 1;
    const topWidth = .5;
    const shape = new Shape();

    let from = {x: 0, y: 0}, to = {x: -baseWidth / 2, y: 0};
    shape.moveTo(from.x, from.y);
    shape.lineTo(to.x, to.y);
    to = {x: -topWidth / 2, y: standHeight};
    shape.lineTo(to.x, to.y);
    to = {x: topWidth / 2, y: to.y};
    shape.lineTo(to.x, to.y);
    to = {x: baseWidth / 2, y: 0};
    shape.lineTo(to.x, to.y);
    shape.lineTo(from.x, from.y);
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    return createFromExtrude(shape, 0x8A7F80, .2, texture);
}

export default createCatapultStandPart;
