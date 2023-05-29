import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";
import createWholeWall from "./objects/Wall/WholeWall";
import wholeWall from "./objects/Wall/WholeWall";
import {create} from "domain";
import createPlane from "./objects/Plane/Plane";

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
        camera.lookAt(0, 0, 0);
        return camera;
    };

    const createDirectionalLight = () => {
        const color = 0xFFFFFF;
        const intensity = 1;
        return new THREE.DirectionalLight(color, intensity);
    }

    const createAmbientLight = () => {
        const color = 0xFFFFFF;
        const intensity = 1;
        return new THREE.AmbientLight(color, intensity);
    }

    const createScene = () => {
        // @ts-ignore
        let scene = {
            scene: new THREE.Scene(),
            renderer: createRenderer(),
            camera: createCamera(),
            directionalLight: createDirectionalLight(),
            ambientLight: createAmbientLight(),
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
        wholeScene.scene.add( wholeScene.camera, wholeScene.directionalLight, planeGroup);
        const wholeWall = createWholeWall(new THREE.Vector3(0, 0, 0), 6);
        const wallGroup = new THREE.Group();
        for(const wall of wholeWall.walls) {
            wallGroup.add(wall);
        }
        for( const wallTower of wholeWall.towers ) {
            wallGroup.add(wallTower);
        }
        wholeScene.scene.add(wallGroup);
        // const normals: VertexNormalsHelper[] = [];
        // for(let i = 0; i < wholeWall.walls.length; i++) {
        //     normals.push(new VertexNormalsHelper(wholeWall.walls[i], 1));
        // }
        // for(let i = 0; i < wholeWall.towers.length; i++) {
        //     normals.push(new VertexNormalsHelper(wholeWall.towers[i], 1));
        // }
        // for( let i = 0; i < normals.length; i++ ) {
        //     wholeScene.scene.add(normals[i]);
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
