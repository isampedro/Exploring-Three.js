import * as THREE from "three";
import {Color} from "three";

const createMeshFromLathe = (shape: THREE.Shape, color: number ) => {
    const segments = 30;
    const phiLength = Math.PI*2;

    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshPhongMaterial({color});
    geometryMaterial.emissive = new Color(color);
    geometryMaterial.emissiveIntensity = 0.04;
    return new THREE.Mesh(geometry, geometryMaterial);
}

const createMeshFromLatheStandard = (shape: THREE.Shape, color: number ) => {
    const segments = 30;
    const phiLength = Math.PI*2;

    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshStandardMaterial({color, side: THREE.DoubleSide});
    geometryMaterial.emissive = new Color(color);
    geometryMaterial.emissiveIntensity = 0.05;
    return new THREE.Mesh(geometry, geometryMaterial);
}

const createFromExtrude = (shape: THREE.Shape, color: number, length: number ) => {
    const extrudeSettings = {
        steps: 20,
        depth: length,
        bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const geometryMaterial = new THREE.MeshPhongMaterial( { color } );
    geometryMaterial.emissive = new Color(color);
    geometryMaterial.emissiveIntensity = 0.05;
    return new THREE.Mesh( geometry, geometryMaterial ) ;
}

export { createMeshFromLathe, createFromExtrude, createMeshFromLatheStandard }
