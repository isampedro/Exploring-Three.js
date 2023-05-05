import React, {useRef, useEffect, useState} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {GUI} from "dat.gui";

const Scene = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [arcBallEnabled, setArcBallEnabled] = useState(true);
    const [selectedLight, setSelectedLight] = useState(false);

    const createSpotlight = (color: number) => {
        const newObj = new THREE.SpotLight(color, 100);

        newObj.castShadow = true;
        // Dispersion
        newObj.angle = 0.3;
        newObj.penumbra = 0.2;
        newObj.decay = 2;
        newObj.position.x = 100;
        newObj.position.z = 50;
        newObj.castShadow = true;
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
        const geometry = new THREE.PlaneGeometry(2000, 2000);
        const material = new THREE.MeshStandardMaterial({color: 0x808080});
        const plane = new THREE.Mesh(geometry, material);
        plane.castShadow = true;
        plane.receiveShadow = true;
        return plane;
    };

    const createCamera = () => {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;
        camera.position.x = 25;
        camera.lookAt(0, 0, 0);
        return camera;
    };

    useEffect(() => {
        const scene = new THREE.Scene();
        const renderer = createRenderer();
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;// RENDERER
        sceneRef.current?.appendChild(renderer.domElement);
        const plane = createPlane();                            // PLANE
        scene.add(plane);
        const camera = createCamera();                          // CAMERA

        // To rotate scene
        const controls = new ArcballControls(camera, renderer.domElement, scene);

        // GUI controls
        const gui = new GUI();

        // SPOTLIGHT #1
        const spotLight1 = createSpotlight(0x00FF00);
        // SPOTLIGHT #2
        const spotLight2 = createSpotlight(0xFF0000);
        spotLight2.position.y = 60;
        // SPOTLIGHT #3
        const spotLight3 = createSpotlight(0x0000FF);
        spotLight3.position.y = -60;

        // GUI folders
        const controlsFolder = gui.addFolder("Controls");

        // ADD spotlights colors variation AND spotlights angle variation
        controlsFolder.addColor(spotLight1, "color").onChange(() => renderer.render(scene, camera));
        controlsFolder.add({'spotlight 1 angle': spotLight1.angle}, 'spotlight 1 angle', 0, Math.PI/4).onChange((value) => {
            spotLight1.angle = value;
            renderer.render(scene, camera);
        });
        controlsFolder.addColor(spotLight2, "color").onChange(() => renderer.render(scene, camera));
        controlsFolder.add({'spotlight 2 angle': spotLight2.angle}, 'spotlight 2 angle', 0, Math.PI/4).onChange((value) => {
            spotLight2.angle = value;
            renderer.render(scene, camera);
        });
        controlsFolder.addColor(spotLight3, "color").onChange(() => renderer.render(scene, camera));
        controlsFolder.add({'spotlight 3 angle': spotLight1.angle}, 'spotlight 3 angle', 0, Math.PI/4).onChange((value) => {
            spotLight3.angle = value;
            renderer.render(scene, camera);
        });
        controlsFolder.add({arcBallEnabled}, "arcBallEnabled").onChange((value) => {
            setArcBallEnabled(value);
            controls.enabled = value;
        });
        controlsFolder.open();

        scene.add(spotLight1, spotLight2, spotLight3);

        controls.addEventListener("change", function () {
            renderer.render(scene, camera);
        });

        // HELPERS
        //  |   AXES
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        //  |   SPOTLIGHT
        const lightHelper1 = new THREE.SpotLightHelper(spotLight1);
        const lightHelper2 = new THREE.SpotLightHelper(spotLight2);
        const lightHelper3 = new THREE.SpotLightHelper(spotLight3);
        scene.add(lightHelper1, lightHelper2, lightHelper3);

        const animate = () => {
            if (arcBallEnabled) {
                controls.update();
            }
            if (lightHelper1) lightHelper1.update();
            if (lightHelper2) lightHelper2.update();
            if (lightHelper3) lightHelper3.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return <div ref={sceneRef}/>;
};


export default Scene;
