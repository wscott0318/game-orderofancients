import * as THREE from "three";
import { ANG2RAD } from "../../../helper/math";

export class Environment {
    _sceneRenderer: any;
    _scene: any;
    _models: any;

    constructor({ _sceneRenderer, _models }: any) {
        this._sceneRenderer = _sceneRenderer;
        this._scene = this._sceneRenderer.getScene();
        this._models = _models;

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
        texture.repeat.set(100, 100);
        texture.anisotropy = 16;
        texture.encoding = THREE.sRGBEncoding;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        const geometry = new THREE.PlaneGeometry(250, 250);
        const material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            map: texture,
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(ANG2RAD(90));
        plane.position.y = -0.1;

        this._scene.add(plane);
    }

    initialize() {
        this.initGround();
        this.initSkyBox();

        this._models.environment.position.x = -10;
        this._models.environment.position.z = 30;

        this._scene.add(this._models.environment);
    }

    render() {}
}
