import { Mesh, Shape} from "three";
import {createFromExtrude} from "../Meshes";

const createCatapultStandPart = (standHeight: number): Mesh => {
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

    return createFromExtrude(shape, 0x7b5f44, .2);
}

export default createCatapultStandPart;