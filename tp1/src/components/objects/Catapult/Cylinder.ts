import {Color, CylinderGeometry, Mesh, MeshPhongMaterial, Shape} from "three";

const createCatapultCylinder = (width: number, radius: number): Mesh => {
    const color = 0x201313;
    const geometry = new CylinderGeometry(radius, radius, width);
    const material = new MeshPhongMaterial({color });
    material.emissive = new Color(color);
    material.emissiveIntensity = 0.05;

    return new Mesh(geometry, material);
}

export default createCatapultCylinder;