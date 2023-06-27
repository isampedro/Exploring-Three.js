import * as THREE from "three";
import {Mesh, Texture} from "three";
import {createFromExtrude} from "../Meshes";

const createCastleGate = (floors: number, length: number, texture: Texture): Mesh => {
    const shape = new THREE.Shape();
    const baseWidth = 1;
    const baseHeight = floors*1.3;
    texture.rotation = -3*Math.PI/4;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(0.5, .5);
    let from = {x: 0, y: 0}, to = {x: baseWidth, y: 0}
    shape.moveTo(from.x, from.y);
    shape.lineTo(to.x, to.y);
    from = to
    to = { x: baseWidth, y: from.y + baseHeight};
    shape.lineTo(to.x, to.y);
    from = to;
    to = {x: -baseWidth, y: from.y};
    shape.lineTo(to.x, to.y);
    to = {x: -baseWidth, y: 0};
    shape.lineTo(to.x, to.y);
    to = {x: 0, y: 0};
    shape.lineTo(to.x, to.y);

    return createFromExtrude(shape, 0xa6a7ab, length, texture);
}

export default createCastleGate;
