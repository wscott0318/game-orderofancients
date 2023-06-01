import * as THREE from "three";
import { ANG2RAD } from "../../../helper/math";
import { SceneRenderer } from "./SceneRenderer";

export class Environment {
    _sceneRenderer: SceneRenderer;
    _scene: THREE.Scene;
    _models: any;

    constructor({ sceneRenderer, models }: any) {
        this._sceneRenderer = sceneRenderer;
        this._scene = this._sceneRenderer.getScene();
        this._models = models;

        this.initialize();
    }

    initSkyBox() {
        const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
        const texturesString = [
            "./assets/images/textures/sky/tour_px.jpg",
            "./assets/images/textures/sky/tour_nx.jpg",
            "./assets/images/textures/sky/tour_py.jpg",
            "./assets/images/textures/sky/tour_ny.jpg",
            "./assets/images/textures/sky/tour_pz.jpg",
            "./assets/images/textures/sky/tour_nz.jpg",
        ];
        const materialArray = texturesString.map((textureString: string) => {
            const texture = new THREE.TextureLoader().load(textureString);
            const material = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide,
                map: texture,
            });

            return material;
        });

        const skyMesh = new THREE.Mesh(geometry, materialArray);
        this._scene.add(skyMesh);
    }

    initGround() {
        const texture = new THREE.TextureLoader().load(
            "/assets/textures/ground/small2.png"
        );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(200, 200);
        texture.anisotropy = 16;
        texture.encoding = THREE.sRGBEncoding;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        const geometry = new THREE.PlaneGeometry(500, 500);
        const material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            map: texture,
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow = true;
        plane.rotateX(ANG2RAD(90));
        plane.position.y = -0.1;

        this._scene.add(plane);
    }

    initialize() {
        this.initGround();
        this.initSkyBox();
        // this._scene.add(this._models.environment.scene);
    }

    render() {}
}
