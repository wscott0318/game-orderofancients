import * as THREE from "three";
import * as SceneSetup from "./SceneSetting";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ANG2RAD } from "../../../helper/math";
import { CAMERA_PROPS, RENDERER_PROPS } from "../../../constants";

let aspectWidth = window.innerWidth;
let aspectHeight = window.innerHeight;

export class SceneRenderer {
    _camera: any;
    _renderer: any;
    _scene: any;
    _stats: any;
    _camControls: any;

    constructor() {
        this.initialize();
    }

    initRenderer() {
        this._renderer = SceneSetup.renderer({ antialias: true });
        this._renderer.setSize(aspectWidth, aspectHeight);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.outputEncoding = RENDERER_PROPS.outputEncoding;
        this._renderer.toneMapping = RENDERER_PROPS.toneMapping;
        this._renderer.shadowMap.enabled = RENDERER_PROPS.shadowMapEnable;
    }

    initCamera() {
        this._camera = SceneSetup.camera(aspectWidth, aspectHeight);
        this._camera.position.set(
            CAMERA_PROPS.position.x,
            CAMERA_PROPS.position.y,
            CAMERA_PROPS.position.z
        );
    }

    initScene() {
        this._scene = SceneSetup.scene();
    }

    initLights() {
        this._scene.add(SceneSetup.HemiLight());
        this._scene.add(SceneSetup.PointLight());
    }

    initStats() {
        this._stats = SceneSetup.StatGUI();
    }

    initCameraControl() {
        this._camControls = new OrbitControls(
            this._camera,
            this._renderer.domElement
        );
        this._camControls.enablePan = false;
        this._camControls.minPolarAngle = ANG2RAD(10);
        this._camControls.maxPolarAngle = ANG2RAD(65);
        this._camControls.maxDistance = 100;
        this._camControls.minDistance = 25;
    }

    onResize() {
        aspectWidth = window.innerWidth;
        aspectHeight = window.innerHeight;
        this._camera.aspect = aspectWidth / aspectHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(aspectWidth, aspectHeight);
    }

    getScene() {
        return this._scene;
    }

    initialize() {
        this.initRenderer();
        this.initCamera();
        this.initScene();
        this.initLights();
        this.initStats();
        this.initCameraControl();

        window.addEventListener("resize", this.onResize.bind(this), false);
    }

    render() {
        this._stats.update();

        this._renderer.render(this._scene, this._camera);
    }

    dispose() {
        this._renderer.domElement.remove();
        this._renderer.dispose();

        const cleanMaterial = (material: any) => {
            material.dispose();

            // dispose textures
            for (const key of Object.keys(material)) {
                const value = material[key];
                if (
                    value &&
                    typeof value === "object" &&
                    "minFilter" in value
                ) {
                    value.dispose();
                }
            }
        };

        this._scene.traverse((object: any) => {
            if (!object.isMesh) return;

            object.geometry.dispose();

            if (object.material.isMaterial) {
                cleanMaterial(object.material);
            } else {
                for (const material of object.material) cleanMaterial(material);
            }
        });
    }
}
