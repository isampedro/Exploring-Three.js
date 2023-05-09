import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {GUI} from "dat.gui";

const Scene = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const Size = 500, Divisions = 50;
    const [arcBallEnabled, setArcBallEnabled] = useState<boolean>(true);
    const [cylinderRadius, setCylinderRadius] = useState<number>(1);
    const [seePlane, setSeePlane] = useState<boolean>(false);
    const [gridEnabled, setGridEnabled] = useState<boolean>(true);
    const [diffuse, setDiffuse] = useState<boolean>(true);

    const createSpotlight = (color: number, y: number) => {
        const newObj = new THREE.SpotLight(color, 100);
        newObj.castShadow = true;
        newObj.angle = 0.3;
        newObj.penumbra = 0.2;
        newObj.decay = 2;
        newObj.position.x = 300;
        newObj.position.z = 50;
        newObj.castShadow = true;
        newObj.position.y = y;
        newObj.target.position.set(25, y, 20);
        newObj.target.updateMatrixWorld();
        newObj.lookAt(newObj.target.position);
        return newObj;
    };

    const createRenderer = () => {
        const renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    };

    const createPlane = () => {
        const geometry = new THREE.PlaneGeometry(200, 500);
        const material = new THREE.MeshBasicMaterial({color: 0x000000});
        return new THREE.Mesh(geometry, material);
    };

    const createCamera = () => {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;
        camera.position.x = 25;
        camera.lookAt(0, 0, 0);
        return camera;
    };

    const createCylinder = () => {
        const cylinderGeometry = new THREE.CylinderGeometry( cylinderRadius, cylinderRadius, 500, 32 );
        const cylinderMaterial = new THREE.MeshStandardMaterial( {color: 0x808080} );
        cylinderMaterial.roughness = 1; // DIFFUSE
        const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
        cylinder.position.set(0, 0, 0);
        cylinder.castShadow = true;
        return cylinder;
    }

    const createScene = () => {
        // @ts-ignore
        let scene = {
            scene: new THREE.Scene(),
            renderer: createRenderer(),
            plane: createPlane(),
            camera: createCamera(),
            cylinder: createCylinder(),
            gridHelper: new THREE.GridHelper( Size, Divisions ),
            spotLight1: createSpotlight(0xFF0000, 80),
            spotLight2: createSpotlight(0x00FF00, 0),
            spotLight3: createSpotlight(0x0000FF, -80),
            gui: new GUI(),
        }
        return {...scene, ...{
                controlsFolder: scene.gui.addFolder("Controls"),
                controls: new ArcballControls(scene.camera, scene.renderer.domElement, scene.scene),
                axesHelper: new THREE.AxesHelper(1),
                // lightHelper1: new THREE.SpotLightHelper(scene.spotLight1),
                // lightHelper2: new THREE.SpotLightHelper(scene.spotLight2),
                // lightHelper3: new THREE.SpotLightHelper(scene.spotLight3),
            }};
    }

    const setupControlsGUI = (wholeScene: any) => {
        wholeScene.controlsFolder.add({'Set Diffuse': wholeScene.cylinder.material.roughness}, 'Set Diffuse', 0, 1).onChange((value: number) => {
            wholeScene.cylinder.material.roughness = value;
        });
        wholeScene.controlsFolder.addColor(wholeScene.spotLight1, "color").onChange(() => wholeScene.renderer.render(wholeScene.scene, wholeScene.camera));
        wholeScene.controlsFolder.add({'spotlight 1 angle': wholeScene.spotLight1.angle}, 'spotlight 1 angle', 0, Math.PI/4).onChange((value: number) => {
            wholeScene.spotLight1.angle = value;
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.controlsFolder.addColor(wholeScene.spotLight2, "color").onChange(() => wholeScene.renderer.render(wholeScene.scene, wholeScene.camera));
        wholeScene.controlsFolder.add({'spotlight 2 angle': wholeScene.spotLight2.angle}, 'spotlight 2 angle', 0, Math.PI/4).onChange((value: number) => {
            wholeScene.spotLight2.angle = value;
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.controlsFolder.addColor(wholeScene.spotLight3, "color").onChange(() => wholeScene.renderer.render(wholeScene.scene, wholeScene.camera));
        wholeScene.controlsFolder.add({'spotlight 3 angle': wholeScene.spotLight1.angle}, 'spotlight 3 angle', 0, Math.PI/4).onChange((value: number) => {
            wholeScene.spotLight3.angle = value;
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.controlsFolder.add({cylinderRadius}, "cylinderRadius").onChange((value: number) => {
            setCylinderRadius(value);
            wholeScene.cylinder.geometry.dispose();
            wholeScene.cylinder.geometry = new THREE.CylinderGeometry(value, value, 1000, 32);
        });
        wholeScene.controlsFolder.add({arcBallEnabled}, "arcBallEnabled").onChange((value: boolean) => {
            setArcBallEnabled(value);
            wholeScene.controls.enabled = value;
        });
        wholeScene.controlsFolder.add({ seePlane }, 'seePlane').onChange((value: boolean) => {
            setSeePlane(value);
            wholeScene.plane.material.dispose();
            wholeScene.plane.material = value ? new THREE.MeshPhongMaterial({color: 0x808080}): new THREE.MeshBasicMaterial({color: 0x000000});
            wholeScene.plane.castShadow = value;
        });
        wholeScene.controlsFolder.add({ gridEnabled }, 'gridEnabled').onChange((value: boolean) => {
            setGridEnabled(value);
            wholeScene.gridHelper.visible = value;
        });
        wholeScene.controlsFolder.open();
        wholeScene.controls.addEventListener("change", function () {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
    }

    useEffect(() => {
        const wholeScene = createScene();

        wholeScene.renderer.shadowMap.enabled = true;
        wholeScene.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        sceneRef.current?.appendChild(wholeScene.renderer.domElement);

        wholeScene.gridHelper.rotation.x = Math.PI / 2;
        setupControlsGUI(wholeScene);
        wholeScene.scene.add(wholeScene.plane, wholeScene.cylinder, wholeScene.gridHelper, wholeScene.spotLight3,
            wholeScene.spotLight2, wholeScene.spotLight1, wholeScene.axesHelper,/* wholeScene.lightHelper3, wholeScene.lightHelper2, wholeScene.lightHelper1*/);

        const animate = () => {
            if (arcBallEnabled) {
                wholeScene.controls.update();
            }
            // if (wholeScene.lightHelper1) wholeScene.lightHelper1.update();
            // if (wholeScene.lightHelper2) wholeScene.lightHelper2.update();
            // if (wholeScene.lightHelper3) wholeScene.lightHelper3.update();
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return <div ref={sceneRef}/>;
};


export default Scene;
