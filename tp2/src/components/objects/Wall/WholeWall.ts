import {Mesh, Shape, Vector3} from "three";
import createWallTower from "./WallTower";
import createWall from "./CastleWall";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import {createFromExtrude} from "../Meshes";

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
        const beta = (Math.PI-thetaN)/2;
        walls[n].rotation.y =  beta;
        walls[n].position.x = initialPosition.x * Math.cos(n * theta) - initialPosition.z * Math.sin(n * theta);
        walls[n].position.z = initialPosition.x * Math.sin(n * theta) + initialPosition.z * Math.cos(n * theta);
    }
};

const createWholeWall = (center: Vector3, floors: number, totalTowers: number): { walls: Mesh[], towers: Mesh[], bridge: Mesh, normals: VertexNormalsHelper[] } => {
    const towers: Mesh[] = [], walls: Mesh[] = [];
    const theta = 2 * Math.PI / totalTowers;
    const initialPosition = {x: 0, z: -30};
    const secondPosition = {
        x: initialPosition.x * Math.cos(theta) - initialPosition.z * Math.sin(theta),
        z: initialPosition.x * Math.sin(theta) + initialPosition.z * Math.cos(theta)
    };
    const wallLength = Math.sqrt((initialPosition.x - secondPosition.x) * (initialPosition.x - secondPosition.x) + (initialPosition.z - secondPosition.z) * (initialPosition.z - secondPosition.z));


    for (let i = 0; i < totalTowers; i++) {
        towers.push(createWallTower(floors));
        walls.push(createWall(floors, wallLength));
    }

    const shape = new Shape();
    shape.moveTo(0, 0);
    shape.lineTo(10, 0);
    shape.lineTo(10, .5);
    shape.lineTo(0, .2);
    shape.lineTo(0, 0);

    const planeBox = createFromExtrude(shape, 0x201313, floors * 1.3);
    planeBox.position.setZ(center.z + 30 * .7 + 1.8);
    planeBox.position.setX(center.y - 5);
    planeBox.rotation.x = -Math.PI / 2;
    positionWallTowersInScene(center, towers, initialPosition);
    positionWallsInScene(center, walls, initialPosition);

    const normals: VertexNormalsHelper[] = [];
    normals.push(new VertexNormalsHelper(planeBox));
    for (const tower of towers) {
        normals.push(new VertexNormalsHelper(tower));
    }
    for (const wall of walls) {
        normals.push(new VertexNormalsHelper(wall));
    }

    return {walls, towers, bridge: planeBox, normals};
};

export default createWholeWall;
