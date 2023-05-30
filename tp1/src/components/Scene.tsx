import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import createWholeWall from "./objects/Wall/WholeWall";
import createPlane from "./objects/Plane/Plane";
import createWholeCaste from "./objects/Castle/WholeCastle";
import createWholeCatapult from "./objects/Catapult/WholeCatapult";
import {GUI} from "dat.gui";
import {BoxGeometry, Group, Mesh, MeshStandardMaterial, Vector3} from "three";

const Scene = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const Size = 500, Divisions = 50;
    const [anguloCatapulta] = useState<number>(0);
    const [aperturaPuerta] = useState<number>(0);
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
                sceneFolder: scene.gui.addFolder("Escena"),
                castleFolder: scene.gui.addFolder('Castillo'),
                controls: new ArcballControls(scene.camera, scene.renderer.domElement, scene.scene),
                axesHelper: new THREE.AxesHelper(1),
            }
        };
    };

    const createCube = () => {
        const geometry = new BoxGeometry();
        const material = new MeshStandardMaterial();
        return new Mesh(geometry, material);
    }

    function degToRad(degrees: number) {
        return degrees * (Math.PI / 180);
    }

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
        let floorsWall = 6;
        let wholeWall = createWholeWall(new THREE.Vector3(0, 0, 0), floorsWall);
        const wallGroup = new THREE.Group();
        wallGroup.add(...wholeWall.walls, ...wholeWall.towers);
        wallGroup.castShadow = true;

        const {group: catapult, normals: catapultNormals} = createWholeCatapult();
        const cube = createCube();
        cube.add(catapult);
        catapult.position.setX(50);
        catapult.position.setZ(50);
        const center = new Vector3(0,0,0);
        catapult.lookAt(new Vector3(0,0,0));

        let width = 17,depth = 13, floors = 6;
        let wholeCastle = createWholeCaste(floors, width, depth);
        const castleGroup = new THREE.Group();
        castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
        castleGroup.castShadow = true;
        const normals = [...wholeCastle.normals, ...catapultNormals, ...wholeWall.normals, ...planeNormals];
        for( const normal of normals) {
            normal.update();
            normal.visible = false;
        }
        wholeScene.scene.add(castleGroup, wallGroup, wholeScene.camera, wholeScene.directionalLight, planeGroup, catapult
            ,...normals, wholeWall.bridge );
        wholeScene.renderingFolder.add({'Mapa de normales': normalsEnabled}, "Mapa de normales").onChange((value: boolean) => {
            setNormalsEnabled(value);
            for( const normal of normals ) {
                normal.visible = value;
            }
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.sceneFolder.add({'Angulo Catapulta':anguloCatapulta}, 'Angulo Catapulta', 0, 360).onChange((value: number) => {
            cube.rotation.y = degToRad(value);
            const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(cube.rotation);
            const catapultOffset = new THREE.Vector3(50, 0, 50);
            const catapultPosition = catapultOffset.applyMatrix4(rotationMatrix);
            catapult.position.copy(catapultPosition);
            catapult.lookAt(center);
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        const parent = new THREE.Object3D();
        parent.position.setX(wholeWall.bridge.position.x);
        parent.position.setZ(wholeWall.bridge.position.z);
        const group = new Group().add(parent, wholeWall.bridge);
        wholeScene.scene.add(group);
        wholeScene.sceneFolder.add({'Apertura Puerta':aperturaPuerta}, 'Apertura Puerta', 0, 90).onChange((value: number) => {
            group.rotation.x = degToRad(value);
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.castleFolder.add({Anchura: width}, "Anchura", 10, 20).onChange((value: number) => {
            wholeScene.scene.remove(castleGroup);
            width = value;
            castleGroup.clear();
            wholeCastle = createWholeCaste(floors, width, depth);
            castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
            wholeScene.scene.add(castleGroup);
        });
        wholeScene.castleFolder.add({Profundidad: depth}, "Profundidad", 10, 20).onChange((value: number) => {
            wholeScene.scene.remove(castleGroup);
            depth = value;
            castleGroup.clear();
            wholeCastle = createWholeCaste(floors, width, depth);
            castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
            wholeScene.scene.add(castleGroup);
        });
        wholeScene.castleFolder.add({Pisos: floors}, "Pisos", 4, 10).onChange((value: number) => {
            wholeScene.scene.remove(castleGroup);
            floors = value;
            castleGroup.clear();
            wholeCastle = createWholeCaste(floors, width, depth);
            castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
            wholeScene.scene.add(castleGroup);
        });
        wholeScene.castleFolder.add({'Altura Murallas': floorsWall}, "Altura Murallas", 3, 10).onChange((value: number) => {
            wholeScene.scene.remove(wallGroup, wholeWall.bridge);
            floorsWall = value;
            wallGroup.clear();
            wholeWall = createWholeWall(center, floorsWall);
            wallGroup.add(...wholeWall.walls, ...wholeWall.towers);
            wholeScene.scene.add(wallGroup, wholeWall.bridge);
        });

        const handleKeyPress = (event: KeyboardEvent) => {
            const createCameraCatapult = () => {
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.z = catapult.position.z + 4;
                camera.position.x = catapult.position.x + 4;
                camera.position.y = catapult.position.y + 5;
                camera.lookAt(catapult.position.x, catapult.position.y, catapult.position.z);
                return camera;
            }
            const createCameraCitizen = () => {
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.z = -60;
                camera.position.x = 0;
                camera.position.y = 2;
                camera.lookAt(center.x, center.y, center.z);
                return camera;
            }
            //let isCameraCitizen = false;
            if (event.key === '1') {
                wholeScene.scene.remove(wholeScene.camera);
                wholeScene.camera.clear();
                //catapult.remove(wholeScene.camera);
                wholeScene.camera = createCamera();
                wholeScene.controls = new ArcballControls(wholeScene.camera, wholeScene.renderer.domElement, wholeScene.scene);
                wholeScene.scene.add(wholeScene.camera);
            } else if (event.key === '2') {
                wholeScene.scene.remove(wholeScene.camera)
                wholeScene.camera.clear();
                wholeScene.camera = createCameraCatapult();
                //catapult.add(wholeScene.camera);
                wholeScene.controls = new ArcballControls(wholeScene.camera, wholeScene.renderer.domElement, wholeScene.scene);
                wholeScene.scene.add(wholeScene.camera);
            } else if (event.key === '3') {
                wholeScene.scene.remove(wholeScene.camera)
                wholeScene.camera.clear();
                wholeScene.camera = createCameraCitizen();
                //catapult.add(wholeScene.camera);
                wholeScene.scene.add(wholeScene.camera);
            }

            if( (event.key === 'W' || event.key === 'w') ) {
                wholeScene.camera.position.z += 1;
            } else if( (event.key === 'A' || event.key === 'a')) {
                wholeScene.camera.position.x += 1;
            } else if( (event.key === 'S' || event.key === 's')) {
                wholeScene.camera.position.z -= 1;
            } else if( (event.key === 'D' || event.key === 'd')) {
                wholeScene.camera.position.x -= 1;
            } else if( (event.key === 'Q' || event.key === 'q')) {
                wholeScene.camera.rotation.y -= .05;
            } else if( (event.key === 'E' || event.key === 'e')) {
                wholeScene.camera.rotation.y += .05;
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        const animate = () => {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            wholeScene.renderer.dispose();
            wholeScene.scene.remove(cube);
        };
    }, []);

    return <div ref={sceneRef}/>;
};


export default Scene;
