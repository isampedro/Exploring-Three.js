import * as THREE from "three";
import {Color, Mesh, Texture, TextureLoader} from "three";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import {Water} from "three/examples/jsm/objects/Water";

const createBridge = (planeColor: number, grassTexture: Texture): Mesh => {
    const planeBridgeGeometry = new THREE.PlaneGeometry(10, 17);
    const geometryMaterial = new THREE.MeshPhongMaterial({color: planeColor, side: THREE.DoubleSide, map: grassTexture});
    geometryMaterial.emissive = new Color(planeColor);
    geometryMaterial.emissiveIntensity = 0.05;
    geometryMaterial.shininess = 0.9;
    const bridge = new THREE.Mesh(planeBridgeGeometry, geometryMaterial);
    bridge.position.setX(0);
    bridge.position.setZ(48);
    bridge.rotation.set(Math.PI / 2, 0, 0);
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.repeat.set(5, 5);
    grassTexture.rotation = -6*Math.PI / 12;
    grassTexture.rotation = -6*Math.PI / 12;
    return bridge;
};

const createPlanePart = (planeColor: number, grassTexture: Texture): Mesh => {
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
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.rotation = -6*Math.PI / 12;
    grassTexture.repeat.set(200, 200);

    const segments = 30;
    const phiLength = Math.PI*2;
    const geometry = new THREE.LatheGeometry(shape.getPoints(), segments, 0, phiLength);
    const geometryMaterial = new THREE.MeshPhongMaterial({color: planeColor, side: THREE.DoubleSide, map: grassTexture});
    geometryMaterial.emissive = new Color(planeColor);
    geometryMaterial.emissiveIntensity = 0.05;
    geometryMaterial.shininess = 0.9;
    return new THREE.Mesh(geometry, geometryMaterial);
};

const createWaterDisc = () => {
    const castleTerrainRadius = 40;
    const castleChannelRadius = 55;
    return new THREE.RingGeometry(castleTerrainRadius, castleChannelRadius);
};

const createPlane = (): { plane: Mesh, bridge: Mesh, water: Mesh, normals: VertexNormalsHelper[]} => {
    const planeColor = 0x3c8a3f;
    const textureLoader = new TextureLoader();
    const grassTexture = textureLoader.load("assets/leafy_grass.webp");
    const plane = createPlanePart(planeColor, new Texture().copy(grassTexture));
    const bridge = createBridge(planeColor, new Texture().copy(grassTexture));
    const waterGeom = createWaterDisc();
    const water = new Water(waterGeom, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.png', function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        } ),
        waterColor: 0x001e0f,
        distortionScale: 1,
        fog: false
    });
    water.position.setY(-0.75);
    water.rotation.set(-Math.PI / 2, 0, 0);
    const normals = [new VertexNormalsHelper(bridge), new VertexNormalsHelper(water), new VertexNormalsHelper(plane)];

    return {plane, bridge, water, normals};
};

export default createPlane;
