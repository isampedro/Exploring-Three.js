import {Mesh, Shape, Texture, TextureLoader, Vector3} from "three";
import createWallTower from "./WallTower";
import createWall from "./CastleWall";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import {createFromExtrude} from "../Meshes";
import * as THREE from "three";

const positionWallTowersInScene = (center: Vector3, towers: Mesh[], initialPosition: {x: number, z: number}) => {
    const theta = 2 * Math.PI / towers.length;
    for (let n = 0; n < towers.length; n++) {
        towers[n].position.x = initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta);
        towers[n].position.z = initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta);
    }
};

const positionWallsInScene = (center: Vector3, walls: Mesh[], initialPosition: {x: number, z: number}) => {
    const theta = 2 * Math.PI / walls.length;
    for (let n = 0; n < walls.length; n++) {
        const thetaN = (2*n+1)*theta;
        walls[n].rotation.y =  (Math.PI - thetaN) / 2;
        walls[n].position.x = initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta);
        walls[n].position.z = initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta);
    }
};

const createWholeWall = (center: Vector3, floors: number, totalTowers: number): { walls: Mesh[], towers: Mesh[], bridge: Mesh | undefined, normals: VertexNormalsHelper[] } => {
    const textureLoader = new TextureLoader();
    const brickTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/renders/rock_wall_08/clay.png');
    const brickNormals = textureLoader.load('https://cdn.polyhaven.com/asset_img/map_previews/rock_wall_08/rock_wall_08_nor_gl_1k.jpg');
    const towers: Mesh[] = [], walls: Mesh[] = [];
    const theta = 2 * Math.PI / totalTowers;
    const initialPosition = {x: 0, z: -30};
    const secondPosition = {
        x: initialPosition.x * Math.cos(theta) - initialPosition.z * Math.sin(theta),
        z: initialPosition.x * Math.sin(theta) + initialPosition.z * Math.cos(theta)
    };
    const wallLength = Math.sqrt((initialPosition.x - secondPosition.x) * (initialPosition.x - secondPosition.x) + (initialPosition.z - secondPosition.z) * (initialPosition.z - secondPosition.z));


    for (let i = 0; i < totalTowers; i++) {
        towers.push(createWallTower(floors, new Texture().copy(brickTexture), new Texture().copy(brickNormals)));
        walls.push(createWall(floors, wallLength, new Texture().copy(brickTexture), new Texture().copy(brickNormals)));
    }

    const shape = new Shape();
    shape.moveTo(0, 0);
    shape.lineTo(10, 0);
    shape.lineTo(10, .5);
    shape.lineTo(0, .2);
    shape.lineTo(0, 0);

    positionWallTowersInScene(center, towers, initialPosition);
    positionWallsInScene(center, walls, initialPosition);

    const normals: VertexNormalsHelper[] = [];
    for (const tower of towers) {
        normals.push(new VertexNormalsHelper(tower));
    }
    for (const wall of walls) {
        normals.push(new VertexNormalsHelper(wall));
    }

    return {walls, towers, bridge: undefined, normals};
};

export default createWholeWall;
