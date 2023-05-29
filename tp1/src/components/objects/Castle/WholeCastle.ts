import createCastleBase from "./CastleBase";
import {Group, Mesh} from "three";
import createCastleTower from "./CastleTower";
import createCastleTowerHead from "./CastleTowerHead";

const createWholeCaste = (floors: number): { base: { castleBase: Mesh, windows: Group }, towers: Group } => {
    const base = createCastleBase(floors);
    const width = 17;
    const depth = 13;

    const towerGroup1 = new Group(), towerGroup2 = new Group(), towerGroup3 = new Group(), towerGroup4 = new Group();
    const towers = new Group();
    const towerHeads = [createCastleTowerHead(), createCastleTowerHead(), createCastleTowerHead(), createCastleTowerHead()];
    towerHeads[0].position.y = floors*3 + 4 + .5;
    towerHeads[1].position.y = floors*3 + 4 + .5;
    towerHeads[2].position.y = floors*3 + 4 + .5;
    towerHeads[3].position.y = floors*3 + 4 + .5;

    towerGroup1.add(createCastleTower(floors), towerHeads[0]);
    towerGroup2.add(createCastleTower(floors), towerHeads[1]);
    towerGroup3.add(createCastleTower(floors), towerHeads[2]);
    towerGroup4.add(createCastleTower(floors), towerHeads[3]);

    towerGroup1.position.x = width/2;
    towerGroup1.position.z = depth/2;
    towerGroup2.position.x = -width/2;
    towerGroup2.position.z = depth/2;
    towerGroup3.position.x = -width/2;
    towerGroup3.position.z = -depth/2;
    towerGroup4.position.x = width/2;
    towerGroup4.position.z = -depth/2;

    towers.add(towerGroup1, towerGroup2, towerGroup3, towerGroup4);

    const windows = new Group();
    for( const window of base.windows) {
        windows.add(window);
    }

    return {base: {castleBase: base.castleBase, windows}, towers};
}

export default createWholeCaste;