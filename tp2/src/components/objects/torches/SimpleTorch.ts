import {Color, Mesh, MeshPhongMaterial, PointLight, SphereGeometry, TextureLoader} from "three";

const createSimpleTorch = () : Mesh => {
    const ballGeometry = new SphereGeometry(.2);
    const ballLight = new PointLight(0xf07f13);
    ballLight.intensity = .5;
    ballLight.position.set(0, 0, 0);
    ballLight.distance = 10;
    const ballTexture = new TextureLoader().load('https://cdn.polyhaven.com/asset_img/primary/rock_06.png');
    const ballMaterial = new MeshPhongMaterial({color: 0xF4E99B, map: ballTexture});
    ballMaterial.emissive = new Color(0xF4E99B);
    ballMaterial.emissiveIntensity = 1.5;
    const ball = new Mesh(ballGeometry, ballMaterial);
    return ball;
}

export {
    createSimpleTorch
}
