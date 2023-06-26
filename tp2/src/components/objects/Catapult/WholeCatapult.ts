import {BoxGeometry, Color, Group, Mesh, MeshPhongMaterial, RepeatWrapping, Texture, TextureLoader} from "three";
import createCatapultBase from "./Base";
import createCatapultStandPart from "./Stand";
import createCatapultCylinder from "./Cylinder";
import createWheel from "./Wheels";
import createStick from "./Stick";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import createShovelHead from "./ShovelHead";

const createWheels = (wheelSize: number, width: number, depth: number, baseHeight: number, texture: Texture): Group[] => {
    const wheels = [];
    for( let i = 0; i < 4; i++) {
        wheels.push(createWheel(wheelSize, new Texture().copy(texture)));
    }

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

const createStands = (standHeight: number, width: number, height: number, depth: number, baseHeight: number, texture: Texture): Mesh[] => {
    const stands = [createCatapultStandPart(standHeight, texture),createCatapultStandPart(standHeight, texture)];
    stands[0].position.setX(-3*width/8 - width/16);
    stands[0].position.setY(baseHeight);
    stands[0].position.setZ( depth/4);
    stands[0].rotation.set(0,Math.PI/2,0);

    stands[1].position.setX(3*width/8- width/32);
    stands[1].position.setY(baseHeight);
    stands[1].position.setZ( depth/4);
    stands[1].rotation.set(0,Math.PI/2,0);
    return stands;
}

const createWholeCatapult = (): {group: Group, normals: VertexNormalsHelper[], cylinder: Mesh, shovelHead: Mesh} => {
    const textureLoader = new TextureLoader();
    const woodenTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/wood_planks_dirt.png?height=780');
    const rustTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/rust_coarse_01.png');
    const group = new Group();
    const width = 2, depth = 4,baseHeight = .5, height = .2, standHeight = 3;
    const wheelSize = baseHeight/4;
    const base = createCatapultBase(width, depth, height, new Texture().copy(woodenTexture));
    const stickWidth = .1;
    const shovelHeadWidth =  .4;

    const stands = createStands(standHeight, width, height, depth, baseHeight, new Texture().copy(rustTexture));
    const cylinder = createCatapultCylinder(5*width/6, .05, new Texture().copy(rustTexture));
    const wheels = createWheels(wheelSize, width, depth, baseHeight, woodenTexture);
    const stick = createStick(stickWidth, stickWidth, depth, woodenTexture);
    const shovelHead = createShovelHead(shovelHeadWidth, stickWidth, shovelHeadWidth, new Texture().copy(woodenTexture));
    const counterweightDim = .5;
    const counterweightGeometry = new BoxGeometry(counterweightDim, counterweightDim, counterweightDim);
    const counterweightRust = new Texture().copy(rustTexture);
    counterweightRust.wrapT = RepeatWrapping;
    counterweightRust.wrapS = RepeatWrapping;
    counterweightRust.repeat.set(1, 1);
    counterweightRust.rotation = Math.PI / 2;
    const counterweightMaterial = new MeshPhongMaterial({color: 0xc4c291, map: counterweightRust});
    counterweightMaterial.emissive = new Color(0xc4c291);
    counterweightMaterial.emissiveIntensity = 0.05;
    const counterweight = new Mesh(counterweightGeometry, counterweightMaterial);

    const standsCounterWeightGeometry = new BoxGeometry(counterweightDim/4, counterweightDim/2, counterweightDim/8);
    const standsCounterWeightMaterial = new MeshPhongMaterial({color: 0x7b5f44, map: counterweightRust});
    standsCounterWeightMaterial.emissive = new Color(0x7b5f44);
    standsCounterWeightMaterial.emissiveIntensity = 0.05
    const standsCounterWeight = new Mesh(standsCounterWeightGeometry,standsCounterWeightMaterial)
    const normals: VertexNormalsHelper[] = [];

    stick.position.setY(0);
    stick.position.setX(+.05);
    stick.position.setZ(-1);
    shovelHead.position.setY(.02);
    shovelHead.position.setX(+.05);
    shovelHead.position.setZ(-3);
    shovelHead.rotation.z = -Math.PI/2

    base.position.setY(baseHeight);

    cylinder.rotation.z = Math.PI/2;
    cylinder.position.setX(0);
    cylinder.position.setY(standHeight);
    cylinder.position.setZ( depth/4);

    cylinder.geometry.computeVertexNormals();
    normals.push(new VertexNormalsHelper(cylinder));
    stick.geometry.computeVertexNormals();
    normals.push(new VertexNormalsHelper(stick));
    shovelHead.geometry.computeVertexNormals();
    normals.push(new VertexNormalsHelper(shovelHead));
    base.geometry.computeVertexNormals();
    normals.push(new VertexNormalsHelper(base));
    for( const stand of stands ) {
        stand.geometry.computeVertexNormals();
        normals.push(new VertexNormalsHelper(stand));
    }

    cylinder.add(stick, shovelHead, counterweight, standsCounterWeight);
    counterweight.position.z += .85;
    counterweight.position.x -= .3;
    standsCounterWeight.position.z +=.85;
    standsCounterWeight.position.y +=.02;
    group.add(base, ...stands, ...wheels, cylinder);
    return {group, normals, cylinder, shovelHead};
}

export default createWholeCatapult;
