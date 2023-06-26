import {Color, CylinderGeometry, Mesh, MeshPhongMaterial, RepeatWrapping, Texture} from "three";

const createCatapultCylinder = (width: number, radius: number, texture: Texture): Mesh => {
    const color = 0x8A7F80;
    const geometry = new CylinderGeometry(radius, radius, width);
    texture.wrapT = RepeatWrapping;
    texture.wrapS = RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.rotation = Math.PI / 2;
    const material = new MeshPhongMaterial({ color, map: texture });
    material.emissive = new Color(color);
    material.emissiveIntensity = 0.05;

    return new Mesh(geometry, material);
}

export default createCatapultCylinder;
