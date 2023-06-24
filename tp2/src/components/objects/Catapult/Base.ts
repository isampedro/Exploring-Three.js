import {BoxGeometry, Color, Mesh, MeshPhongMaterial, Texture} from "three";
import * as THREE from "three";

const createCatapultBase = (width: number, depth: number, height: number, texture: Texture): Mesh => {
    const geometry = new BoxGeometry(width, height, depth);
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(2,2);
    texture.rotation = -Math.PI/4;
    const material = new MeshPhongMaterial({color: 0x7b5f44 , map: texture});
    material.emissive = new Color(0x7b5f44 );
    material.emissiveIntensity = 0.05;

    return new Mesh(geometry, material);
};

export default createCatapultBase;
