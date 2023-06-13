import * as THREE from "three";
import {Mesh} from "three";
import {createFromExtrude} from "../Meshes";

const createNumber = (lenght: number): Mesh => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-2/6, 0, -4/6, 0, -1, 0);
    shape.bezierCurveTo(-1, 1/6, -1, 1/3, -1, 1/2);
    shape.bezierCurveTo(-3/4, 1/2, -5/8, 4/5, -5/8, 1);
    shape.bezierCurveTo(-5/8, 2, -5/8, 3, -5/8, 4);
    shape.bezierCurveTo(-8/10, 7/2, -1, 7/2, -5/4, 7/2);
    shape.bezierCurveTo(-5/4, 11/3, -5/4, 23/6, -5/4, 4);
    shape.bezierCurveTo(-9/10, 4, -3/4, 4, -5/8, 9/2);
    shape.bezierCurveTo(-5/24, 9/2, 5/24, 9/2, 5/8, 9/2);
    shape.bezierCurveTo(5/8, 10/3, 5/8, 13/6, 5/8, 1);
    shape.bezierCurveTo(5/8, 4/5, 3/4, 1/2, 1, 1/2);
    shape.bezierCurveTo(1, 1/3, 1, 1/6, 1, 0);
    shape.bezierCurveTo(4/6, 0, 2/6, 0, 0, 0);
    return createFromExtrude(shape, 0xa6a7ab, lenght);
}

export default createNumber;
