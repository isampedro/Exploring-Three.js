import {Group, Mesh, Shape, Texture, TextureLoader, Vector3} from "three";
import createWallTower from "./WallTower";
import createWall from "./CastleWall";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import {createSimpleTorch} from "../torches/SimpleTorch";
import createCastleGate from "./CastleGate";

const positionWallTowersInScene = (center: Vector3, towers: Group[], initialPosition: { x: number, z: number }) => {
    const theta = 2 * Math.PI / towers.length;
    for (let n = 0; n < towers.length; n++) {
        towers[n].position.x = initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta);
        towers[n].position.z = initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta);
    }
};

const positionWallsInScene = (center: Vector3, walls: Mesh[], initialPosition: { x: number, z: number }, torches: Mesh[], gate: Mesh, wallLength: number) => {
    const theta = 2 * Math.PI / (walls.length - 1);
    for (let n = 0; n < walls.length; n++) {
        const thetaN = (2 * n + 1) * theta;
        if (n === 0) {
            const positionTorch1 = {x: initialPosition.x + 5*Math.cos(Math.PI/6), z: initialPosition.z + 5*Math.sin(Math.PI/6)};
            torches[0].position.x = (positionTorch1.x * Math.cos(0));
            torches[0].position.z = (positionTorch1.z * Math.cos(0));
            torches[0].position.y = 5;
            torches[1].position.x = (initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta)) - 4.5;
            torches[1].position.z = (initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta)) + 5;
            torches[1].position.y = 5;
            const gatePosition = {x: initialPosition.x + wallLength-1, z: initialPosition.z + (wallLength-1)/2};
            gate.position.x = gatePosition.x * Math.cos(n * theta) - gatePosition.z * Math.sin(n * theta);
            gate.position.z = gatePosition.x * Math.sin(n * theta) + gatePosition.z * Math.cos(n * theta);
            gate.rotation.y = (Math.PI - thetaN) / 2;
        }
        walls[n].position.x = initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta);
        walls[n].position.z = initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta);
        walls[n].rotation.y = (Math.PI - thetaN) / 2;
    }
    walls[walls.length - 1].rotation.y = -(Math.PI - ((2 * (walls.length - 1) - 1)) * theta) / 2;
    walls[walls.length - 1].position.x = initialPosition.x * Math.cos((walls.length) * theta) - initialPosition.z * Math.sin((walls.length) * theta);
    walls[walls.length - 1].position.z = initialPosition.x * Math.sin((walls.length) * theta) + initialPosition.z * Math.cos((walls.length) * theta);
};

const createWholeWall = (center: Vector3, floors: number, totalTowers: number): { walls: Mesh[], towers: Group[], bridge: Mesh | undefined, normals: VertexNormalsHelper[], castleGate: Mesh } => {
    const textureLoader = new TextureLoader();
    const brickTexture = textureLoader.load("assets/clay.webp");
    const woodenTexture = textureLoader.load("assets/woodenBoards.jpg");
    const towers: Group[] = [], walls: Mesh[] = [];
    const theta = 2 * Math.PI / totalTowers;
    const initialPosition = {x: 0, z: -30};
    const secondPosition = {
        x: initialPosition.x * Math.cos(theta) - initialPosition.z * Math.sin(theta),
        z: initialPosition.x * Math.sin(theta) + initialPosition.z * Math.cos(theta)
    };
    const wallLength = Math.sqrt((initialPosition.x - secondPosition.x) * (initialPosition.x - secondPosition.x) + (initialPosition.z - secondPosition.z) * (initialPosition.z - secondPosition.z));
    const castleGate = createCastleGate(floors, 10, woodenTexture);
    towers.push(createWallTower(floors, new Texture().copy(brickTexture)));
    walls.push(createWall(floors, wallLength / 2 - 5, new Texture().copy(brickTexture)));
    for (let i = 1; i < totalTowers; i++) {
        towers.push(createWallTower(floors, new Texture().copy(brickTexture)));
        walls.push(createWall(floors, wallLength, new Texture().copy(brickTexture)));
    }
    walls.push(createWall(floors, wallLength / 2 - 5, new Texture().copy(brickTexture)));
    positionWallTowersInScene(center, towers, initialPosition);
    const torches = [createSimpleTorch(), createSimpleTorch()];
    positionWallsInScene(center, walls, initialPosition, torches, castleGate, wallLength / 2 - 5);
    walls.push(...torches);

    const normals: VertexNormalsHelper[] = [];
    for (const tower of towers) {
        tower.children.forEach(child => {
            if (child instanceof Mesh) {
                child.geometry.computeBoundingBox()
                normals.push(new VertexNormalsHelper(child));
            }
        });
    }
    for (const wall of walls) {
        normals.push(new VertexNormalsHelper(wall));
        wall.geometry.computeBoundingBox();
    }

    return {walls, towers, bridge: undefined, normals, castleGate};
};

export default createWholeWall;
