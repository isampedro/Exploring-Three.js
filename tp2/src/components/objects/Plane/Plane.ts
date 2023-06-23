import * as THREE from "three";
import {Color, Mesh, Texture, TextureLoader, Vector3} from "three";
import {createMeshFromLatheStandard} from "../Meshes";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import {Water} from "three/examples/jsm/objects/Water";

const createBridge = (planeColor: number, grassTexture: Texture, grassNormalMap: Texture): Mesh => {
    const planeBridgeGeometry = new THREE.PlaneGeometry(10, 17);
    const geometryMaterial = new THREE.MeshPhongMaterial({color: planeColor, side: THREE.DoubleSide, map: grassTexture, normalMap: grassNormalMap});
    geometryMaterial.emissive = new Color(planeColor);
    geometryMaterial.emissiveIntensity = 0.05;
    const bridge = new THREE.Mesh(planeBridgeGeometry, geometryMaterial);
    bridge.position.setX(0);
    bridge.position.setZ(47);
    bridge.rotation.set(Math.PI / 2, 0, 0);
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.repeat.set(25, 50);
    return bridge;
};

const createPlanePart = (planeColor: number, grassTexture: Texture, grassNormalMap: Texture): Mesh => {
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
    grassTexture.rotation = -2*Math.PI / 3;
    grassTexture.repeat.set(12, 9);

    return createMeshFromLatheStandard(shape, planeColor, grassTexture, grassNormalMap);
};

const createWaterDisc = () => {
    const castleTerrainRadius = 40;
    const castleChannelRadius = 55;
    const geometry = new THREE.RingGeometry(castleTerrainRadius, castleChannelRadius);
    return geometry;
};

const createPlane = (): { plane: Mesh, bridge: Mesh, water: Mesh, normals: VertexNormalsHelper[]} => {
    const planeColor = 0x3c8a3f;
    const textureLoader = new TextureLoader();
    const grassTexture = textureLoader.load("https://cdn.polyhaven.com/asset_img/primary/leafy_grass.png");
    const grassNormalMap = textureLoader.load("https://cdn.polyhaven.com/asset_img/map_previews/leafy_grass/leafy_grass_nor_gl_1k.jpg");
    const plane = createPlanePart(planeColor, grassTexture, grassNormalMap);
    const bridge = createBridge(planeColor, grassTexture, grassNormalMap);
    const waterGeom = createWaterDisc();
    const water = new Water(waterGeom, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
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
