import {Color, CylinderGeometry, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial} from "three";

const createWheel = (height: number): Group => {
    const colorGreaterWheel = 0x674e37;
    const geometry = new CylinderGeometry( .5, .5, height );
    const material = new MeshPhongMaterial( { color: colorGreaterWheel } );
    material.emissive = new Color(colorGreaterWheel);
    material.emissiveIntensity = 0.1;
    const colorGear = 0x291818;
    const greaterWheel = new Mesh( geometry, material );
    const geometryGear = new CylinderGeometry(.1, .1, .1);
    const materialGear = new MeshPhongMaterial({ color: colorGear});
    materialGear.emissive = new Color(colorGear);
    materialGear.emissiveIntensity = 0.1;
    const gear = new Mesh(geometryGear, materialGear);
    gear.position.y = height/2;
    return new Group().add(gear).add(greaterWheel);
}

export default createWheel;