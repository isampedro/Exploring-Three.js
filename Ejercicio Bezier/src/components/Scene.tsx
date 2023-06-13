import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import createPlane from "./objects/Plane/Plane";
import {GUI} from "dat.gui";
import createNumber from "./objects/Wall/Number";

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

    const createCamera = () => {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;
        camera.position.x = 25;
        camera.position.y = 50;
        camera.lookAt(0, 0, 0);
        return camera;
    };

    const createDirectionalLight = () => {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);

        light.castShadow = true;
        return light;
    }

    const createScene = () => {
        // @ts-ignore
        let scene = {
            scene: new THREE.Scene(),
            renderer: createRenderer(),
            camera: createCamera(),
            directionalLight: createDirectionalLight(),
            gridHelper: new THREE.GridHelper(Size, Divisions),
            gui: new GUI(),
        };
        return {
            ...scene, ...{
                renderingFolder: scene.gui.addFolder("Rendering"),
                sceneFolder: scene.gui.addFolder("Escena"),
                castleFolder: scene.gui.addFolder('Castillo'),
                controls: new ArcballControls(scene.camera, scene.renderer.domElement, scene.scene),
                axesHelper: new THREE.AxesHelper(1),
            }
        };
    };

    useEffect(() => {
        const wholeScene = createScene();
        wholeScene.renderer.shadowMap.enabled = true;
        wholeScene.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        sceneRef.current?.appendChild(wholeScene.renderer.domElement);
        wholeScene.gridHelper.visible = true;

        const {plane, bridge, water} = createPlane();
        const planeGroup = new THREE.Group();
        planeGroup.add(plane, bridge, water);
        planeGroup.castShadow = true;

        const number = createNumber(3)
        wholeScene.scene.add(wholeScene.camera, wholeScene.directionalLight, planeGroup, number);

        const animate = () => {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            wholeScene.renderer.dispose();
        };
    }, []);

    return <div ref={sceneRef}/>;
};


export default Scene;
