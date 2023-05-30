import {BoxGeometry, Mesh, MeshBasicMaterial} from "three";

const createStick = (width: number, height: number, depth: number) => {
    const geometry = new BoxGeometry( width, height, depth );
    const material = new MeshBasicMaterial( {color: 0x7b5f44} );
    return new Mesh(geometry, material);
}

export default createStick;