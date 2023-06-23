import * as THREE from "three";
import {Mesh} from "three";
import {createMeshFromLatheStandard} from "../Meshes";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

const createBridge = (): Mesh => {
    const planeBridgeGeometry = new THREE.PlaneGeometry(10, 17);
    const geometryMaterial = new THREE.MeshStandardMaterial({color: 0x3c8a3f, side: THREE.DoubleSide})
    const bridge = new THREE.Mesh(planeBridgeGeometry, geometryMaterial);
    bridge.position.setX(0);
    bridge.position.setZ(47);
    bridge.rotation.set( Math.PI / 2, 0, 0);

    return bridge;
}

const createPlanePart = (): Mesh => {
    const shape = new THREE.Shape();
    const castleTerrainRadius = 40;
    const castleChannelRadius = 55;
    const castleChannelDepth = 10;
    const totalTerrain = 300;

    let from = {x: 0, y: 0}, to = {x: castleTerrainRadius, y: 0}, step;
    shape.moveTo(from.x, from.y);
    shape.lineTo(to.x, to.y);
    to = {x: castleTerrainRadius + (castleChannelRadius - castleTerrainRadius) / 4, y: -castleChannelDepth};
    shape.lineTo(to.x, to.y);
    to = {x: castleChannelRadius - (castleChannelRadius - castleTerrainRadius) / 4, y: -castleChannelDepth};
    shape.lineTo(to.x, to.y);
    to = {x: castleChannelRadius, y: 0};
    shape.lineTo(to.x, to.y);
    to = {x: totalTerrain, y: 0};
    shape.lineTo(to.x, to.y);

    return createMeshFromLatheStandard(shape, 0x3c8a3f);
}

const createWaterDisc = () => {
    const castleTerrainRadius = 40;
    const castleChannelRadius = 55;
    const geometry = new THREE.RingGeometry( castleTerrainRadius, castleChannelRadius);
    const material = new THREE.MeshPhongMaterial( { color: 0x65aebf, side: THREE.DoubleSide } );
    const waterDisc = new THREE.Mesh( geometry, material );
    waterDisc.position.setY(-1);
    waterDisc.rotation.set(Math.PI/2,0,0);
    return waterDisc;
}

const createPlane = (): { plane: Mesh, bridge: Mesh, water: Mesh, normals: VertexNormalsHelper[] } => {
    const plane = createPlanePart();
    const bridge = createBridge();
    const water = createWaterDisc();
    const normals = [new VertexNormalsHelper(bridge), new VertexNormalsHelper(water), new VertexNormalsHelper(plane)]

    return {plane, bridge, water, normals}
}

export default createPlane;