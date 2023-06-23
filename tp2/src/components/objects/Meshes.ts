import * as THREE from "three";
import {Color, CubeRefractionMapping, Texture} from "three";

const createMeshFromLathe = (shape: THREE.Shape, color: number, texture?: Texture, normalMap?: Texture ) => {
    const segments = 30;
    const phiLength = Math.PI*2;
    if( !!texture ) {
        texture.mapping = CubeRefractionMapping;
    }
    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshPhongMaterial({color, map: texture, normalMap});
    geometryMaterial.emissive = new Color(color);
    geometryMaterial.emissiveIntensity = 0.05;
    return new THREE.Mesh(geometry, geometryMaterial);
}

const createMeshFromLatheStandard = (shape: THREE.Shape, color: number, texture?: Texture, normalMap?: Texture ) => {
    const segments = 30;
    const phiLength = Math.PI*2;
    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshPhongMaterial({color, side: THREE.DoubleSide, map: texture, normalMap});
    geometryMaterial.emissive = new Color(color);
    geometryMaterial.emissiveIntensity = 0.05;
    return new THREE.Mesh(geometry, geometryMaterial);
}

const createFromExtrude = (shape: THREE.Shape, color: number, length: number, texture?: Texture, normalMap?: Texture ) => {
    const extrudeSettings = {
        steps: 20,
        depth: length,
        bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const geometryMaterial = new THREE.MeshPhongMaterial( {color, map: texture, normalMap } );
    geometryMaterial.emissive = new Color(color);
    geometryMaterial.emissiveIntensity = 0.05;
    return new THREE.Mesh( geometry, geometryMaterial ) ;
}

const createFromExtrudeBevel = (shape: THREE.Shape, color: number, length: number, texture?: Texture, normalMap?: Texture ) => {
    const extrudeSettings = {
        steps: 20,
        depth: length,
        bevelThickness: 5,
        bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const geometryMaterial = new THREE.MeshPhongMaterial( {color, map: texture, normalMap } );
    geometryMaterial.emissive = new Color(color);
    geometryMaterial.emissiveIntensity = 0.05;
    return new THREE.Mesh( geometry, geometryMaterial ) ;
}

export { createMeshFromLathe, createFromExtrude, createMeshFromLatheStandard, createFromExtrudeBevel }
