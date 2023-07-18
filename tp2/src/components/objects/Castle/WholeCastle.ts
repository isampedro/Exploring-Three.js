import createCastleBase from "./CastleBase";
import {Group, Mesh, Texture, TextureLoader} from "three";
import createCastleTower from "./CastleTower";
import createCastleTowerHead from "./CastleTowerHead";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

const createWholeCaste = (floors: number, width: number, depth: number): { base: { castleBase: Mesh, windows: Group }, towers: Group, normals: VertexNormalsHelper[] } => {
    const textureLoader = new TextureLoader();
    const brickTexture = textureLoader.load('assets/clay.webp');
    const towerHeadTexture = textureLoader.load('assets/japanese_stone_wall.webp');

    const base = createCastleBase(floors, width, depth, new Texture().copy(brickTexture));
    base.castleBase.geometry.computeBoundingBox();
    base.castleBase.geometry.computeVertexNormals();

    const towerGroup1 = new Group(), towerGroup2 = new Group(), towerGroup3 = new Group(), towerGroup4 = new Group();
    const towers = new Group();
    const towerHeads = []
    const towerObjects = []
    for ( let i = 0; i < 4; i++) {
        towerObjects.push(createCastleTower(floors, new Texture().copy(brickTexture)));
        towerHeads.push(createCastleTowerHead(towerHeadTexture));
    }

    towerHeads[0].position.setY(floors*2.7 + 4 + .5);
    towerHeads[1].position.setY(floors*2.7 + 4 + .5);
    towerHeads[2].position.setY(floors*2.7 + 4 + .5);
    towerHeads[3].position.setY(floors*2.7 + 4 + .5);

    towerGroup1.add(towerObjects[0], towerHeads[0]);
    towerGroup2.add(towerObjects[1], towerHeads[1]);
    towerGroup3.add(towerObjects[2], towerHeads[2]);
    towerGroup4.add(towerObjects[3], towerHeads[3]);

    towerGroup1.position.setX(width/2);
    towerGroup1.position.setZ(depth/2);
    towerGroup2.position.setX(-width/2);
    towerGroup2.position.setZ(depth/2);
    towerGroup3.position.setX(-width/2);
    towerGroup3.position.setZ(-depth/2);
    towerGroup4.position.setX(width/2);
    towerGroup4.position.setZ(-depth/2);

    towers.add(towerGroup1, towerGroup2, towerGroup3, towerGroup4);
    towers.traverse(tower => {
        if( tower instanceof Group ) {
            tower.traverse(object => {
                if( object instanceof Mesh ) {
                    object.geometry.computeVertexNormals();
                    object.geometry.computeBoundingBox();
                }
            })
        } else if( tower instanceof Mesh ) {
            tower.geometry.computeVertexNormals();
            tower.geometry.computeBoundingBox();
        }
    });

    const windows = new Group();
    for( const window of base.windows) {
        windows.add(window);
    }

    const vertexNormalsHelpers: VertexNormalsHelper[] = [];
    for( const tower of towerObjects ) {
        tower.children.forEach(child => {
            if (child instanceof Mesh) {
                child.geometry.computeBoundingBox()
                vertexNormalsHelpers.push(new VertexNormalsHelper(child));
            }
        });
    }
    for( const towerHead of towerHeads ) {
        vertexNormalsHelpers.push(new VertexNormalsHelper(towerHead));
    }
    for( const window of base.windows ) {
        window.geometry.computeBoundingBox();
        vertexNormalsHelpers.push(new VertexNormalsHelper(window));
    }
    vertexNormalsHelpers.push(new VertexNormalsHelper(base.castleBase));

    return {base: {castleBase: base.castleBase, windows}, towers, normals: vertexNormalsHelpers};
}

export default createWholeCaste;
