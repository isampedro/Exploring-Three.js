import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import createWholeWall from "./objects/Wall/WholeWall";
import createPlane from "./objects/Plane/Plane";
import createWholeCaste from "./objects/Castle/WholeCastle";
import createWholeCatapult from "./objects/Catapult/WholeCatapult";
import {GUI} from "dat.gui";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

const Scene = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const Size = 500, Divisions = 50;
    const [wholeNormals, setWholeNormals] = useState<VertexNormalsHelper[]>([]);
    const [normalsEnabled, setNormalsEnabled] = useState<boolean>(false);

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

        const {plane, bridge, water, normals: planeNormals} = createPlane();
        const planeGroup = new THREE.Group();
        planeGroup.add(plane, bridge, water);
        planeGroup.castShadow = true;

        const wholeWall = createWholeWall(new THREE.Vector3(0, 0, 0), 6);
        const wallGroup = new THREE.Group();
        wallGroup.add(...wholeWall.walls, ...wholeWall.towers);
        wallGroup.castShadow = true;

        const {group: catapult, normals: catapultNormals} = createWholeCatapult();
        catapult.position.setX(50);
        catapult.position.setZ(50);
        catapult.rotation.set(0, -3*Math.PI/4, 0 );

        const wholeCastle = createWholeCaste(6);
        const castleGroup = new THREE.Group();
        castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
        castleGroup.castShadow = true;
        const normals = [...wholeCastle.normals, ...catapultNormals, ...wholeWall.normals, ...planeNormals];
        for( const normal of normals) {
            normal.update();
            normal.visible = false;
        }
        wholeScene.scene.add(castleGroup, wallGroup, wholeScene.camera, wholeScene.directionalLight, planeGroup, catapult
            ,...normals );

        wholeScene.renderingFolder.add({normalsEnabled}, "normalsEnabled").onChange((value: boolean) => {
            setNormalsEnabled(value);
            for( const normal of normals ) {
                normal.visible = value;
            }
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        const animate = () => {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return <div ref={sceneRef}/>;
};


export default Scene;
