import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {GUI} from "dat.gui";
import WallTower from "./objects/WallTower";
import createWallTower from "./objects/WallTower";
import createCastleTower from "./objects/CastleTower";
import createCastleTowerHead from "./objects/CastleTowerHead";

const Scene = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const Size = 500, Divisions = 50;

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
            camera: createCamera(),
            gridHelper: new THREE.GridHelper(Size, Divisions),
        };
        return {
            ...scene, ...{
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

        wholeScene.scene.add(createCastleTowerHead());

        const animate = () => {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return <div ref={sceneRef}/>;
};


export default Scene;
