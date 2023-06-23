import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import createWholeWall from "./objects/Wall/WholeWall";
import createPlane from "./objects/Plane/Plane";
import createWholeCaste from "./objects/Castle/WholeCastle";
import createWholeCatapult from "./objects/Catapult/WholeCatapult";
import {GUI} from "dat.gui";
import {
    BoxGeometry,
    Group,
    Mesh,
    MeshPhongMaterial,
    MeshStandardMaterial, Object3D,
    Sphere,
    SphereGeometry,
    Vector3
} from "three";
import shovelHead from "./objects/Catapult/ShovelHead";

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

        const {group: catapult, normals: catapultNormals, cylinder, shovelHead} = createWholeCatapult();
        const cube = createCube();
        cube.add(catapult);
        catapult.position.setX(50);
        catapult.position.setZ(50);
        const center = new Vector3(0, 0, 0);
        catapult.lookAt(new Vector3(0, 0, 0));
        const updateMesh = (item: Object3D, visited = new Set()) => {
            if (visited.has(item)) {
                return; // Skip already visited objects
            }
            visited.add(item);
            if (item instanceof Mesh) {
                item.geometry.computeTangents();
                item.geometry.computeVertexNormals();
                item.geometry.computeBoundingSphere();
                item.geometry.computeBoundingBox();
            } else if (item instanceof Group) {
                item.children.forEach(child => updateMesh(child, visited));
            }
        };

        catapult.traverse(item => updateMesh(item));
        wholeWall.bridge.geometry.computeVertexNormals();

        let width = 17, depth = 13, floors = 6;
        let wholeCastle = createWholeCaste(floors, width, depth);
        const castleGroup = new THREE.Group();
        castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
        castleGroup.castShadow = true;
        const normals = [...wholeCastle.normals, ...catapultNormals, ...wholeWall.normals, ...planeNormals];
        for(let i = 0; i < normals.length; i++) {
            normals[i].update();
            normals[i].visible = false;
        }
        wholeScene.scene.add(castleGroup, wallGroup, wholeScene.camera, wholeScene.directionalLight, planeGroup, catapult
            , ...normals, wholeWall.bridge);
        wholeScene.renderingFolder.add({'Mapa de normales': normalsEnabled}, "Mapa de normales").onChange((value: boolean) => {
            setNormalsEnabled(value);
            for (const normal of normals) {
                normal.update();
                normal.visible = value;
            }
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.sceneFolder.add({'Angulo Catapulta': anguloCatapulta}, 'Angulo Catapulta', 0, 360).onChange((value: number) => {
            cube.rotation.y = degToRad(value);
            const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(cube.rotation);
            const catapultOffset = new THREE.Vector3(50, 0, 50);
            const catapultPosition = catapultOffset.applyMatrix4(rotationMatrix);
            catapult.position.copy(catapultPosition);
            catapult.lookAt(center);
            for(const normal of normals ) {
                normal.update();
            }
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.sceneFolder.add({'Posicion Catapulta': catapult.position.x}, 'Posicion Catapulta', 40, 60).onChange((value: number) => {
            catapult.position.x = value;
            catapult.lookAt(center);
            for(const normal of normals ) {
                normal.update();
            }
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.scene.add(wholeWall.bridge);
        wholeScene.sceneFolder.add({'Apertura Puerta': aperturaPuerta}, 'Apertura Puerta', 0, 90).onChange((value: number) => {
            wholeWall.bridge.rotation.x = -degToRad(90-value);
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.castleFolder.add({Ancho: width}, "Ancho", 10, 25).onChange((value: number) => {
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
            floors = value;
            castleGroup.clear();
            wholeScene.scene.remove(...normals, castleGroup);
            wholeCastle = createWholeCaste(floors, width, depth);
            castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
            for( const normal of normals) {
                normal.update();
            }
            wholeScene.scene.add(...normals);
            wholeScene.scene.add(castleGroup);
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.castleFolder.add({'Altura Murallas': floorsWall}, "Altura Murallas", 3, 10).onChange((value: number) => {
            wholeScene.scene.remove(wallGroup, wholeWall.bridge, ...normals);
            floorsWall = value;
            wallGroup.clear();
            wholeWall = createWholeWall(center, floorsWall);
            wallGroup.add(...wholeWall.walls, ...wholeWall.towers);
            wholeScene.scene.add(wallGroup, wholeWall.bridge, ...normals);
            // wholeScene.scene.traverse(updateMesh);
            // for( const normal of normals ) {
            //     normal.update();
            // }
            // wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        let isThrowing = false;
        let isGoingDown = false;
        let ball: Mesh | null;
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
            if (event.key === '1') {
                wholeScene.scene.remove(wholeScene.camera);
                wholeScene.camera.clear();
                wholeScene.camera = createCamera();
                wholeScene.controls = new ArcballControls(wholeScene.camera, wholeScene.renderer.domElement, wholeScene.scene);
                wholeScene.scene.add(wholeScene.camera);
            } else if (event.key === '2') {
                wholeScene.scene.remove(wholeScene.camera)
                wholeScene.camera.clear();
                wholeScene.camera = createCameraCatapult();
                wholeScene.controls = new ArcballControls(wholeScene.camera, wholeScene.renderer.domElement, wholeScene.scene);
                wholeScene.scene.add(wholeScene.camera);
            } else if (event.key === '3') {
                wholeScene.scene.remove(wholeScene.camera)
                wholeScene.camera.clear();
                wholeScene.camera = createCameraCitizen();
                wholeScene.scene.add(wholeScene.camera);
            }

            if ((event.key === 'W' || event.key === 'w')) {
                wholeScene.camera.position.z += 1;
            } else if ((event.key === 'A' || event.key === 'a')) {
                wholeScene.camera.position.x += 1;
            } else if ((event.key === 'S' || event.key === 's')) {
                wholeScene.camera.position.z -= 1;
            } else if ((event.key === 'D' || event.key === 'd')) {
                wholeScene.camera.position.x -= 1;
            } else if ((event.key === 'Q' || event.key === 'q')) {
                wholeScene.camera.rotation.y -= .05;
            } else if ((event.key === 'E' || event.key === 'e')) {
                wholeScene.camera.rotation.y += .05;
            } else if (event.key === 'P' || event.key === 'p') {
                isThrowing = true;
                // cylinder.rotation.x = Math.PI/4;
            } else if ((event.key === 'R' || event.key === 'r') && !isGoingDown && !isThrowing) {
                isThrowing = false;
                isGoingDown = false;
                isFlying = false;
                if( ball ) wholeScene.scene.remove(ball);
                const ballGeometry = new SphereGeometry(.2);
                const ballMaterial = new MeshPhongMaterial({color: 0xa6a7ab});
                ball = new Mesh(ballGeometry, ballMaterial);
                ball.position.y = .2;
                shovelHead.add(ball);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        let isFlying = false;
        let dir = new Vector3();
        let t = 0;
        const animate = () => {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
            if (isThrowing && cylinder.rotation.x < Math.PI / 4) {
                cylinder.rotation.x += .03;
            } else if (isThrowing && cylinder.rotation.x >= Math.PI / 4) {
                isThrowing = false;
                isGoingDown = true;
                isFlying = true;
                const worldPosition = new Vector3();
                const positionToReset = ball && ball.getWorldPosition(worldPosition);
                ball && dir.subVectors(ball.position, catapult.getWorldPosition(worldPosition)).normalize();
                ball && shovelHead.remove(ball);
                if (ball && positionToReset) {
                    ball.position.set(shovelHead.getWorldPosition(worldPosition).x,
                        shovelHead.getWorldPosition(worldPosition).y, shovelHead.getWorldPosition(worldPosition).z);
                    wholeScene.scene.add(ball);
                }
            } else if (isGoingDown && cylinder.rotation.x > 0) {
                cylinder.rotation.x -= .03;
            } else if (isGoingDown && cylinder.rotation.x <= 0) {
                isGoingDown = false;
            }
            if (isFlying && ball) {
                t += .01;
                const initialVerticalSpeed = 1;
                if (ball.position.y < 0) {
                    t = 0;
                    wholeScene.scene.remove(ball);
                    isFlying = false;
                } else {
                   // console.log(ball.position.y, (.25**2+.1**2+.1**2)/(Math.sqrt(2)*2*.001), ballIsGoingDown)
                    ball.position.x += dir.x * .5;
                    ball.position.z += dir.z * .5;
                        ball.position.y += .5 - (t**2);
                }
            }
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
