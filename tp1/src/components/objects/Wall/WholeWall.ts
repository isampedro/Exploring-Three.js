import {Mesh, Scene, Vector3} from "three";
import createWallTower from "./WallTower";
import createWall from "./CastleWall";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";


const positionWallTowersInScene = (center: Vector3, towers: Mesh[]) => {
    towers[0].position.x = center.x + 40*0.7;

    towers[1].position.x = center.x + -40*0.7;

    towers[2].position.x = center.x + -20*0.7;
    towers[2].position.z = center.z + -30*0.7;

    towers[3].position.x = center.x + 20*0.7;
    towers[3].position.z = center.z + -30*0.7;

    towers[4].position.x = center.x + -20*0.7;
    towers[4].position.z = center.z + 30*0.7;

    towers[5].position.x = center.x + 20*0.7;
    towers[5].position.z = center.z + 30*0.7;
}

const positionWallsInScene = (center: Vector3, walls: Mesh[]) => {
    walls[0].position.x = center.x + 40*0.7;
    walls[0].rotation.y = -Math.PI/6 - .05*0.7;

    walls[1].position.x = center.x + 40*0.7;
    walls[1].rotation.y = -5*Math.PI/6 + .05*0.7;

    walls[2].position.x = center.x + 20*0.7;
    walls[2].position.z = center.z + 30*0.7;
    walls[2].rotation.y = -Math.PI/2;

    walls[3].position.x = center.x + -40*0.7;
    walls[3].rotation.y = Math.PI/6 + .05;

    walls[4].position.x = center.x + -40*0.7;
    walls[4].rotation.y = 5*Math.PI/6 - .05;

    walls[5].position.x = center.x - 20*0.7;
    walls[5].position.z = center.z - 30*0.7;
    walls[5].rotation.y = Math.PI/2;
}

const createWholeWall = (center: Vector3, floors: number): {walls: Mesh[], towers: Mesh[], normals: VertexNormalsHelper[]} => {
    const wallLength = 34*0.7;
    const towers = [createWallTower(floors), createWallTower(floors), createWallTower(floors),
        createWallTower(floors), createWallTower(floors), createWallTower(floors)];
    const walls = [createWall(floors, wallLength), createWall(floors, wallLength), createWall(floors, wallLength + 4*0.7),
        createWall(floors, wallLength), createWall(floors, wallLength), createWall(floors, wallLength + 4*0.7)];

    positionWallTowersInScene(center, towers);
    positionWallsInScene(center, walls);

    const normals: VertexNormalsHelper[] = [];
    for( const tower of towers ) {
        normals.push(new VertexNormalsHelper(tower));
    }
    for( const wall of walls ) {
        normals.push(new VertexNormalsHelper(wall));
    }

    return {walls, towers, normals};
}

export default createWholeWall;