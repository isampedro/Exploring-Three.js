import * as THREE from "three";
import {Color, Mesh} from "three";
import {createFromExtrude} from "../Meshes";

const createWindow = (): Mesh => {
    const shape = new THREE.Shape();
    let from = {x: 0, y: 0}, to = {x: -1, y: 0};
    shape.moveTo(from.x, from.y);
    shape.lineTo(to.x, to.y);
    from = to;
    to = {x: from.x, y: from.y + 3};
    shape.lineTo(to.x, to.y);
    from = to;
    to = {x: 1, y: to.y};
    let step = {x: 0, y: to.y + 1};
    shape.bezierCurveTo(from.x, from.y, step.x, step.y, to.x, to.y);
    from = to;
    to = { x: from.x, y: 0 };
    shape.lineTo(to.x, to.y);
    from = to;
    to = { x: 0, y: from.y };
    shape.lineTo(to.x, to.y);

    return createFromExtrude(shape, 0x43483e, 0.2);
}

const createWindowsAtFront = (z: number, height: number, width: number, wss: number, wsh: number): Mesh[] => {
    const windows: Mesh[] = [];
    for( let i = wsh; i < height; i+= wsh) {
        for( let j = wss/2; j < width-wss/2; j+= wss) {
            const window = createWindow();
            window.position.setY(i);
            window.position.setX(j-width/2);
            window.position.setZ(z);
            windows.push(window)
        }
    }
    return windows;
}

const createWindowsAtSides = (x: number, height: number, depth: number, wss: number, wsh: number): Mesh[] => {
    const windows: Mesh[] = [];
    for( let i = wsh; i < height; i+= wsh) {
        for( let j = wss; j < depth-wss; j+= wss) {
            const window = createWindow();
            window.position.setY(i);
            window.position.setZ(j-depth/2);
            window.position.setX(x);
            window.rotation.set(0, Math.PI/2, 0);
            windows.push(window)
        }
    }
    return windows;
}

const createCastleBase = (floorsCount: number, width: number, depth: number): { castleBase: Mesh, windows: Mesh[] } => {
    const height = floorsCount*3;

    const geometry = new THREE.BoxGeometry( width, height, depth );
    const material = new THREE.MeshPhongMaterial( {color: 0xc4c291} );
    material.emissive = new Color(0xc4c291);
    material.emissiveIntensity = 0.05;
    const castleBase = new THREE.Mesh( geometry, material );
    castleBase.position.setY(height/2);

    const windowsSeparationSides = 3.0, windowsSeparationHeight = 4.0;
    const windows: Mesh[] = [];
    windows.push(...createWindowsAtFront(depth/2, height-3, width-1.5-2, windowsSeparationSides, windowsSeparationHeight));
    windows.push(...createWindowsAtFront(-depth/2-.2, height-3, width-1.5-2, windowsSeparationSides, windowsSeparationHeight));
    windows.push(...createWindowsAtSides(width/2, height-3, depth-1.5-2, windowsSeparationSides, windowsSeparationHeight));
    windows.push(...createWindowsAtSides(-width/2-.2, height-3, depth-1.5-2, windowsSeparationSides, windowsSeparationHeight));

    return {castleBase, windows};
}

export default createCastleBase;