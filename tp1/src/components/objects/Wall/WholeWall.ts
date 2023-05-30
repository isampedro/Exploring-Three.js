import {BoxGeometry, Material, Mesh, MeshPhongMaterial, Scene, Vector3} from "three";
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

    walls[6].position.x = center.x - 20*0.7;
    walls[6].position.z = center.z + 30*0.7;
    walls[6].rotation.y = Math.PI/2;
}

const createWholeWall = (center: Vector3, floors: number): {walls: Mesh[], towers: Mesh[], bridge: Mesh, normals: VertexNormalsHelper[]} => {
    const wallLength = 34*0.7;
    const towers = [createWallTower(floors), createWallTower(floors), createWallTower(floors),
        createWallTower(floors), createWallTower(floors), createWallTower(floors)];
    const walls = [createWall(floors, wallLength), createWall(floors, wallLength), createWall(floors, wallLength/2 - 4*.7),
        createWall(floors, wallLength), createWall(floors, wallLength), createWall(floors, wallLength + 4*0.7), createWall(floors, wallLength/2 - 4*.7)];
    const planeBoxGeometry = new BoxGeometry(10, floors*1.3, 1);
    const planeBoxMaterial = new MeshPhongMaterial({color: 0x201313});
    const planeBox = new Mesh(planeBoxGeometry, planeBoxMaterial);
    planeBox.position.setZ(center.z + 30*0.7 + 1);
    planeBox.position.setY(floors*1.3/2);
    positionWallTowersInScene(center, towers);
    positionWallsInScene(center, walls);

    const normals: VertexNormalsHelper[] = [];
    normals.push(new VertexNormalsHelper(planeBox));
    for( const tower of towers ) {
        normals.push(new VertexNormalsHelper(tower));
    }
    for( const wall of walls ) {
        normals.push(new VertexNormalsHelper(wall));
    }

    return {walls, towers, bridge: planeBox, normals};
}

export default createWholeWall;