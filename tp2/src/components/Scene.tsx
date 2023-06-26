import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {
    BoxGeometry, Color, DirectionalLightHelper,
    Group,
    Mesh,
    MeshPhongMaterial,
    MeshStandardMaterial,
    Object3D,
    PointLight,
    SphereGeometry, Texture, TextureLoader,
    Vector3
} from "three";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls";
import createWholeWall from "./objects/Wall/WholeWall";
import createPlane from "./objects/Plane/Plane";
import createWholeCaste from "./objects/Castle/WholeCastle";
import createWholeCatapult from "./objects/Catapult/WholeCatapult";
import {GUI} from "dat.gui";

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

    const createAmbientLight = () => {
        const intensity = 1;
        return new THREE.AmbientLight(0x5781f4, intensity);
    }

    const createDirectionalLight = () => {
        const color = 0xee5d6c;
        const intensity = 0.5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-75, 30, -75);
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
            ambientLight: createAmbientLight(),
            gridHelper: new THREE.GridHelper(Size, Divisions),
            gui: new GUI(),
        };
        scene.scene.background = new THREE.Color(0x5781f4) ;
        return {
            ...scene, ...{
                renderingFolder: scene.gui.addFolder("Rendering"),
                sceneFolder: scene.gui.addFolder("Escena"),
                castleFolder: scene.gui.addFolder('Castillo'),
                controls: new ArcballControls(scene.camera, scene.renderer.domElement, scene.scene),
                directionalLightHelper: new DirectionalLightHelper(scene.directionalLight, 5),
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
        wholeScene.controls.setGizmosVisible(false);
        wholeScene.gridHelper.visible = true;
        let wallPolygonQ = 6

        const {plane, bridge, water, normals: planeNormals} = createPlane();
        const planeGroup = new THREE.Group();

        planeGroup.add(plane, bridge, water);
        planeGroup.castShadow = true;
        let floorsWall = 6;
        let wholeWall = createWholeWall(new THREE.Vector3(0, 0, 0), floorsWall, wallPolygonQ);
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
                item.geometry.computeVertexNormals();
                item.geometry.computeBoundingSphere();
                item.geometry.computeBoundingBox();
            } else if (item instanceof Group) {
                item.children.forEach(child => updateMesh(child, visited));
            }
        };

        catapult.traverse(item => updateMesh(item));
        const rotation = 1.76;

        let width = 17, depth = 13, floors = 6;
        let wholeCastle = createWholeCaste(floors, width, depth, rotation);
        const castleGroup = new THREE.Group();
        castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
        castleGroup.castShadow = true;
        const normals = [...wholeCastle.normals, ...catapultNormals, ...wholeWall.normals, ...planeNormals];
        for(let i = 0; i < normals.length; i++) {
            normals[i].update();
            normals[i].visible = false;
        }
        wholeScene.scene.add(castleGroup, wallGroup, wholeScene.camera, wholeScene.directionalLight /*, wholeScene.directionalLightHelper*/, wholeScene.ambientLight, planeGroup, catapult
            , ...normals);
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
        wholeScene.sceneFolder.add({'Posicion Cata': 100}, 'Posicion Cata', 90, 160).onChange((value: number) => {
            const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(cube.rotation);
            const catapultOffset = new THREE.Vector3(value/2, 0, value/2);
            const catapultPosition = catapultOffset.applyMatrix4(rotationMatrix);
            catapult.position.copy(catapultPosition);
            catapult.lookAt(center);
            for(const normal of normals ) {
                normal.update();
            }
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.sceneFolder.add({'Apertura Puerta': aperturaPuerta}, 'Apertura Puerta', 0, 90).onChange((value: number) => {
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.castleFolder.add({Ancho: width}, "Ancho", 10, 25).onChange((value: number) => {
            wholeScene.scene.remove(castleGroup);
            width = value;
            castleGroup.clear();
            wholeCastle = createWholeCaste(floors, width, depth, rotation);
            castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
            wholeScene.scene.add(castleGroup);
        });
        wholeScene.castleFolder.add({Profundidad: depth}, "Profundidad", 10, 20).onChange((value: number) => {
            wholeScene.scene.remove(castleGroup);
            depth = value;
            castleGroup.clear();
            wholeCastle = createWholeCaste(floors, width, depth, rotation);
            castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
            wholeScene.scene.add(castleGroup);
        });
        wholeScene.castleFolder.add({Pisos: floors}, "Pisos", 4, 10).onChange((value: number) => {
            floors = value;
            castleGroup.clear();
            wholeScene.scene.remove(...normals, castleGroup);
            wholeCastle = createWholeCaste(floors, width, depth, rotation);
            castleGroup.add(wholeCastle.base.castleBase, wholeCastle.base.windows, wholeCastle.towers);
            for( const normal of normals) {
                normal.update();
            }
            wholeScene.scene.add(...normals);
            wholeScene.scene.add(castleGroup);
            wholeScene.renderer.render(wholeScene.scene, wholeScene.camera);
        });
        wholeScene.castleFolder.add({'Altura Murallas': floorsWall}, "Altura Murallas", 3, 10).onChange((value: number) => {
            wholeScene.scene.remove(wallGroup, ...normals);
            floorsWall = value;
            wallGroup.clear();
            wholeWall = createWholeWall(center, floorsWall, wallPolygonQ);
            wallGroup.add(...wholeWall.walls, ...wholeWall.towers);
            wholeScene.scene.add(wallGroup, ...normals);
        });
        wholeScene.castleFolder.add({'Q Paredes': wallPolygonQ}, "Q Paredes", 4, 8).onChange((value: number) => {
            wholeScene.scene.remove(wallGroup, ...normals);
            wallPolygonQ = Math.floor(value);
            wallGroup.clear();
            wholeWall = createWholeWall(center, floorsWall, wallPolygonQ);
            wallGroup.add(...wholeWall.walls, ...wholeWall.towers);
            if( wallPolygonQ % 2 == 0) {
                wallGroup.rotation.y = 5*Math.PI/6;
            }
            wholeScene.scene.add(wallGroup, ...normals);
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
                const ballLight = new PointLight(0xf07f13);
                ballLight.intensity = .5;
                ballLight.position.set(0, 0, 0);
                const ballTexture = new TextureLoader().load('https://cdn.polyhaven.com/asset_img/primary/rock_06.png');
                const ballMaterial = new MeshPhongMaterial({color: 0xF4E99B, map: ballTexture});
                ballMaterial.emissive = new Color(0xF4E99B);
                ballMaterial.emissiveIntensity = 1.5;
                ball = new Mesh(ballGeometry, ballMaterial);
                ball.position.y = .2;
                ball.add(ballLight);
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
