import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import createWholeWall from "./objects/Wall/WholeWall";
import createPlane from "./objects/Plane/Plane";
import createWholeCaste from "./objects/Castle/WholeCastle";
import createCatapultBase from "./objects/Catapult/Base";
import createCatapultStandPart from "./objects/Catapult/Stand";
import createWholeCatapult from "./objects/Catapult/WholeCatapult";

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
        const {plane, bridge, water} = createPlane();
        const planeGroup = new THREE.Group();
        planeGroup.add(plane, bridge, water);
        planeGroup.castShadow = true;
        wholeScene.scene.add( wholeScene.camera, wholeScene.directionalLight, planeGroup);
        const wholeWall = createWholeWall(new THREE.Vector3(0, 0, 0), 6);
        const wallGroup = new THREE.Group();
        wallGroup.add(...wholeWall.walls, ...wholeWall.towers);
        wallGroup.castShadow = true;
        wholeScene.scene.add(wallGroup);

        const base = createWholeCatapult();
        base.position.x = 50;
        base.position.z = 50;
        base.rotation.y = -3*Math.PI/4;
        wholeScene.scene.add(base);

        const wholeCastle = createWholeCaste(6);
        const castleGroup = new THREE.Group();
        castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
        castleGroup.castShadow = true;
        wholeScene.scene.add(castleGroup);
        // const normals: VertexNormalsHelper[] = [];
        // for(let i = 0; i < wholeWall.walls.length; i++) {
        //     normals.push(new VertexNormalsHelper(wholeWall.walls[i], 1));
        // }
        const animate = () => {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return <div ref={sceneRef}/>;
};


export default Scene;
