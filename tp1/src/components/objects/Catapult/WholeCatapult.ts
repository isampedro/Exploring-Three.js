import {Group, Mesh} from "three";
import createCatapultBase from "./Base";
import createCatapultStandPart from "./Stand";
import createCatapultCylinder from "./Cylinder";
import createWheel from "./Wheels";
import createStick from "./Stick";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

const createWheels = (wheelSize: number, width: number, depth: number, baseHeight: number): Group[] => {
    const wheels = [createWheel(wheelSize),createWheel(wheelSize),createWheel(wheelSize),createWheel(wheelSize)];

    wheels[0].position.setX(-width/2 - wheelSize/2);
    wheels[0].position.setZ(depth/4);
    wheels[0].position.setY(baseHeight);
    wheels[0].rotation.set(0,0,Math.PI/2);

    wheels[1].position.setX(-width/2 - wheelSize/2);
    wheels[1].position.setZ(-depth/4);
    wheels[1].position.setY(baseHeight);
    wheels[1].rotation.set(0,0,Math.PI/2);

    wheels[2].position.setX(width/2 + wheelSize/2);
    wheels[2].position.setZ( depth/4);
    wheels[2].position.setY(baseHeight);
    wheels[2].rotation.set(0,0,-Math.PI/2);

    wheels[3].position.setX(width/2 + wheelSize/2);
    wheels[3].position.setZ( -depth/4);
    wheels[3].position.setY(baseHeight);
    wheels[3].rotation.set(0,0,-Math.PI/2);

    return wheels;
}

const createStands = (standHeight: number, width: number, height: number, depth: number, baseHeight: number): Mesh[] => {
    const stands = [createCatapultStandPart(standHeight),createCatapultStandPart(standHeight)];
    stands[0].position.setX(-3*width/8);
    stands[0].position.setY(baseHeight + height);
    stands[0].position.setZ( depth/4);
    stands[0].rotation.set(0,Math.PI/2,0);

    stands[1].position.setX(3*width/8);
    stands[1].position.setY(baseHeight + height);
    stands[1].position.setZ( depth/4);
    stands[1].rotation.set(0,Math.PI/2,0);
    return stands;
}

const createWholeCatapult = (): {group: Group, normals: VertexNormalsHelper[]} => {
    const group = new Group();
    const width = 2.5, depth = 4,baseHeight = .5, height = .2, standHeight = 3;
    const wheelSize = baseHeight/4;
    const base = createCatapultBase(width, depth, height);
    const stickWidth = .1;

    const stands = createStands(standHeight, width, height, depth, baseHeight);
    const cylinder = createCatapultCylinder(5*width/6, .05);
    const wheels = createWheels(wheelSize, width, depth, baseHeight);
    const stick = createStick(stickWidth, stickWidth, depth);
    const normals: VertexNormalsHelper[] = [];

    stick.position.setY(standHeight + .05);
    stick.position.setX(+.1);
    stick.position.setZ( 0);

    base.position.setY(baseHeight);

    cylinder.rotation.z = Math.PI/2;
    cylinder.position.setX(+.1);
    cylinder.position.setY(standHeight);
    cylinder.position.setZ( depth/4);

    cylinder.geometry.computeTangents();
    cylinder.geometry.computeVertexNormals();
    normals.push(new VertexNormalsHelper(cylinder))
    stick.geometry.computeTangents();
    stick.geometry.computeVertexNormals();
    normals.push(new VertexNormalsHelper(stick))
    base.geometry.computeTangents();
    base.geometry.computeVertexNormals();
    normals.push(new VertexNormalsHelper(base))
    for( const stand of stands ) {
        stand.geometry.computeVertexNormals();
        stand.geometry.computeTangents();
        normals.push(new VertexNormalsHelper(stand));
    }


    group.add(base, ...stands, ...wheels, cylinder, stick);
    return {group, normals};
}

export default createWholeCatapult;