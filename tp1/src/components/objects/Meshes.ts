import * as THREE from "three";

const createMeshFromLathe = (shape: THREE.Shape, color: number ) => {
    const segments = 30;
    const phiLength = Math.PI*2;

    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshPhongMaterial({color});
    return new THREE.Mesh(geometry, geometryMaterial);
}

const createMeshFromLatheStandard = (shape: THREE.Shape, color: number ) => {
    const segments = 30;
    const phiLength = Math.PI*2;

    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshStandardMaterial({color, side: THREE.DoubleSide});
    return new THREE.Mesh(geometry, geometryMaterial);
}

const createFromExtrude = (shape: THREE.Shape, color: number, length: number ) => {
    const extrudeSettings = {
        steps: 20,
        depth: length,
        bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const material = new THREE.MeshPhongMaterial( { color } );
    return new THREE.Mesh( geometry, material ) ;
}

export { createMeshFromLathe, createFromExtrude, createMeshFromLatheStandard }
