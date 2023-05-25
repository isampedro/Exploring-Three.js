import * as THREE from "three";


const createMeshFromLathe = (shape: THREE.Shape, color: number ) => {
    const segments = 30;
    const phiLength = Math.PI*2;

    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshBasicMaterial({color});
    return new THREE.Mesh(geometry, geometryMaterial);
}

export { createMeshFromLathe }
