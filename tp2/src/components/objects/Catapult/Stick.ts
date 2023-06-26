import {BoxGeometry, Mesh, MeshBasicMaterial, RepeatWrapping, Texture} from "three";

const createStick = (width: number, height: number, depth: number, texture: Texture) => {
    texture.wrapT = RepeatWrapping;
    texture.wrapS = RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.rotation = Math.PI / 2;
    const geometry = new BoxGeometry( width, height, depth-.25 );
    const material = new MeshBasicMaterial( {color: 0x7b5f44, map: texture} );
    return new Mesh(geometry, material);
}

export default createStick;
