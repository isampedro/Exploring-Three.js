import {Mesh, Shape, Texture, TextureLoader, Vector3} from "three";
import createWallTower from "./WallTower";
import createWall from "./CastleWall";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import {createSimpleTorch} from "../torches/SimpleTorch";
import createCastleGate from "./CastleGate";

const positionWallTowersInScene = (center: Vector3, towers: Mesh[], initialPosition: { x: number, z: number }) => {
    const theta = 2 * Math.PI / towers.length;
    for (let n = 0; n < towers.length; n++) {
        towers[n].position.x = initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta);
        towers[n].position.z = initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta);
    }
};

const positionWallsInScene = (center: Vector3, walls: Mesh[], initialPosition: { x: number, z: number }, torches: Mesh[], gate: Mesh) => {
    const theta = 2 * Math.PI / (walls.length - 1);
    for (let n = 0; n < walls.length; n++) {
        const thetaN = (2 * n + 1) * theta;
        if (n === 0) {
            torches[0].position.x = (initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta)) - 19;
            torches[0].position.z = (initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta)) + 13.3;
            torches[0].position.y = 5;
            torches[1].position.x = (initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta)) - 4.5;
            torches[1].position.z = (initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta)) + 5;
            torches[1].position.y = 5;
        }
        walls[n].rotation.y = (Math.PI - thetaN) / 2;
        walls[n].position.x = initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta);
        walls[n].position.z = initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta);
    }
    walls[walls.length - 1].rotation.y = -(Math.PI - ((2 * (walls.length - 1) - 1)) * theta) / 2;
    walls[walls.length - 1].position.x = initialPosition.x * Math.cos((walls.length) * theta) - initialPosition.z * Math.sin((walls.length) * theta);
    walls[walls.length - 1].position.z = initialPosition.x * Math.sin((walls.length) * theta) + initialPosition.z * Math.cos((walls.length) * theta);
};

const createWholeWall = (center: Vector3, floors: number, totalTowers: number): { walls: Mesh[], towers: Mesh[], bridge: Mesh | undefined, normals: VertexNormalsHelper[], castleGate: Mesh } => {
    const textureLoader = new TextureLoader();
    const brickTexture = textureLoader.load("https://cdn.polyhaven.com/asset_img/renders/rock_wall_08/clay.png");
    const brickNormals = textureLoader.load("https://cdn.polyhaven.com/asset_img/map_previews/rock_wall_08/rock_wall_08_nor_gl_1k.jpg");
    const woodenTexture = textureLoader.load("https://cdn.polyhaven.com/asset_img/primary/wood_planks_dirt.png");
    const towers: Mesh[] = [], walls: Mesh[] = [];
    const theta = 2 * Math.PI / totalTowers;
    const initialPosition = {x: 0, z: -30};
    const secondPosition = {
        x: initialPosition.x * Math.cos(theta) - initialPosition.z * Math.sin(theta),
        z: initialPosition.x * Math.sin(theta) + initialPosition.z * Math.cos(theta)
    };
    const wallLength = Math.sqrt((initialPosition.x - secondPosition.x) * (initialPosition.x - secondPosition.x) + (initialPosition.z - secondPosition.z) * (initialPosition.z - secondPosition.z));
    const castleGate = createCastleGate(floors, 10, woodenTexture);
    towers.push(createWallTower(floors, new Texture().copy(brickTexture), new Texture().copy(brickNormals)));
    walls.push(createWall(floors, wallLength / 2 - 5, new Texture().copy(brickTexture), new Texture().copy(brickNormals)));
    for (let i = 1; i < totalTowers; i++) {
        towers.push(createWallTower(floors, new Texture().copy(brickTexture), new Texture().copy(brickNormals)));
        walls.push(createWall(floors, wallLength, new Texture().copy(brickTexture), new Texture().copy(brickNormals)));
    }
    walls.push(createWall(floors, wallLength / 2 - 5, new Texture().copy(brickTexture), new Texture().copy(brickNormals)));
    castleGate.position.x = (initialPosition.x + walls.length - 1) * Math.cos(0) - (initialPosition.z - walls.length + 1) * Math.sin(0);
    castleGate.position.z = (initialPosition.x + walls.length - 1) * Math.sin(0) + (initialPosition.z + walls.length - 1) * Math.cos(0);
    castleGate.rotation.y = (Math.PI) / 3;

    positionWallTowersInScene(center, towers, initialPosition);
    const torches = [createSimpleTorch(), createSimpleTorch()];
    positionWallsInScene(center, walls, initialPosition, torches, castleGate);
    walls.push(...torches);

    const normals: VertexNormalsHelper[] = [];
    for (const tower of towers) {
        normals.push(new VertexNormalsHelper(tower));
        tower.geometry.computeBoundingBox();
    }
    for (const wall of walls) {
        normals.push(new VertexNormalsHelper(wall));
        wall.geometry.computeBoundingBox();
    }

    return {walls, towers, bridge: undefined, normals, castleGate};
};

export default createWholeWall;
