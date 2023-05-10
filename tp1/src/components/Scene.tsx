import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {GUI} from "dat.gui";

const Scene = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const Size = 500, Divisions = 50;

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
        const material = new THREE.MeshBasicMaterial({color: 0x00FF00});
        return new THREE.Mesh(geometry, material);
    };

    const createCamera = () => {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;
        camera.position.x = 25;
        camera.lookAt(0, 0, 0);
        return camera;
    };

    const createScene = () => {
        // @ts-ignore
        let scene = {
            scene: new THREE.Scene(),
            renderer: createRenderer(),
            plane: createPlane(),
            camera: createCamera(),
            gridHelper: new THREE.GridHelper( Size, Divisions ),
            gui: new GUI(),
        }
        return {...scene, ...{
                controlsFolder: scene.gui.addFolder("Controls"),
                controls: new ArcballControls(scene.camera, scene.renderer.domElement, scene.scene),
                axesHelper: new THREE.AxesHelper(1),
            }};
    }

    const setupControlsGUI = (wholeScene: any) => {
        wholeScene.controlsFolder.open();
        wholeScene.controls.addEventListener("change", function () {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
    }

    useEffect(() => {
        const wholeScene = createScene();


        wholeScene.gridHelper.rotation.x = Math.PI / 2;
        setupControlsGUI(wholeScene);
        wholeScene.scene.add(wholeScene.plane, wholeScene.gridHelper, wholeScene.axesHelper);

        const animate = () => {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return <div ref={sceneRef}/>;
};


export default Scene;
