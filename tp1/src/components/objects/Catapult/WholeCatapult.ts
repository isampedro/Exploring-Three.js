import {Group, Mesh} from "three";
import createCatapultBase from "./Base";
import createCatapultStandPart from "./Stand";
import createCatapultCylinder from "./Cylinder";
import createWheel from "./Wheels";
import createStick from "./Stick";

const createWheels = (wheelSize: number, width: number, depth: number, baseHeight: number): Group[] => {
    const wheels = [createWheel(wheelSize),createWheel(wheelSize),createWheel(wheelSize),createWheel(wheelSize)];

    wheels[0].position.x = -width/2 - wheelSize/2;
    wheels[0].position.z = depth/4;
    wheels[0].position.y = baseHeight;
    wheels[0].rotation.z = Math.PI/2;

    wheels[1].position.x = -width/2 - wheelSize/2;
    wheels[1].position.z = -depth/4;
    wheels[1].position.y = baseHeight;
    wheels[1].rotation.z = Math.PI/2;

    wheels[2].position.x = width/2 + wheelSize/2;
    wheels[2].position.z = depth/4;
    wheels[2].position.y = baseHeight;
    wheels[2].rotation.z = -Math.PI/2;

    wheels[3].position.x = width/2 + wheelSize/2;
    wheels[3].position.z = -depth/4;
    wheels[3].position.y = baseHeight;
    wheels[3].rotation.z = -Math.PI/2;

    return wheels;
}

const createStands = (standHeight: number, width: number, height: number, depth: number, baseHeight: number): Mesh[] => {
    const stands = [createCatapultStandPart(standHeight),createCatapultStandPart(standHeight)];
    stands[0].position.x = -3*width/8;
    stands[0].position.y = baseHeight + height;
    stands[0].position.z = depth/4;
    stands[0].rotation.y = Math.PI/2;

    stands[1].position.x = 3*width/8;
    stands[1].position.y = baseHeight + height;
    stands[1].position.z = depth/4;
    stands[1].rotation.y = Math.PI/2;
    return stands;
}

const createWholeCatapult = (): Group => {
    const group = new Group();
    const width = 2.5, depth = 4,baseHeight = .5, height = .2, standHeight = 3;
    const wheelSize = baseHeight/4;
    const base = createCatapultBase(width, depth, height);
    const stickWidth = .1;

    const stands = createStands(standHeight, width, height, depth, baseHeight);
    const cylinder = createCatapultCylinder(5*width/6, .05);
    const wheels = createWheels(wheelSize, width, depth, baseHeight);
    const stick = createStick(stickWidth, stickWidth, depth);

    stick.position.y = standHeight + .05;
    stick.position.x = +.1;
    stick.position.z = 0;

    base.position.y = baseHeight;

    cylinder.rotation.z = Math.PI/2;
    cylinder.position.x = +.1;
    cylinder.position.y = standHeight;
    cylinder.position.z = depth/4;

    group.add(base, ...stands, ...wheels, cylinder, stick);
    return group;
}

export default createWholeCatapult;