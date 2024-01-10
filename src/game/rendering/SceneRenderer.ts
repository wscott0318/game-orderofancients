import * as THREE from "three";
import * as SceneSetup from "./SceneSetting";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { ANG2RAD } from "../../helper/math";
import { disposeMesh } from "../../helper/three";
import { BatchedRenderer } from "three.quarks";
import {
    CAMERA_PROPS,
    RENDERER_PROPS,
    SPOT_LIGHT_PROPS,
} from "../../constants/rendering";
import { LobbyInfo } from "../../contexts/game-context";
import { TOWER_POSITIONS } from "../../constants/tower";

interface SceneRendererProps {
    playerIndex: number;
    lobbyInfo: LobbyInfo;
}

export class SceneRenderer {
    _camera: any;
    _renderer: any;
    _scene: any;
    _stats: any;
    _camControls: any;
    _uiRenderer: CSS2DRenderer;
    _particleRenderer: BatchedRenderer;
    _clock: THREE.Clock;
    _gridHelper: THREE.GridHelper;
    _playerIndex: number;
    _lobbyInfo: LobbyInfo;
    _hemiLight: THREE.HemisphereLight;
    _spotLightArray: THREE.SpotLight[];

    constructor({ playerIndex, lobbyInfo }: SceneRendererProps) {
        this._uiRenderer = new CSS2DRenderer();
        this._particleRenderer = new BatchedRenderer();
        this._clock = new THREE.Clock();
        this._gridHelper = new THREE.GridHelper();

        this._playerIndex = playerIndex;
        this._lobbyInfo = lobbyInfo;

        this._hemiLight = new THREE.HemisphereLight();
        this._spotLightArray = [];

        this.initialize();
    }

    initRenderer() {
        this._renderer = SceneSetup.renderer({ antialias: true });

        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.outputEncoding = RENDERER_PROPS.outputEncoding;
        this._renderer.toneMapping = RENDERER_PROPS.toneMapping;
        this._renderer.toneMappingExposure = 1;
        this._renderer.shadowMap.enabled = RENDERER_PROPS.shadowMapEnable;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this._uiRenderer.setSize(window.innerWidth, window.innerHeight);
        this._uiRenderer.domElement.style.position = "absolute";
        this._uiRenderer.domElement.style.top = "0px";
        document.body.appendChild(this._uiRenderer.domElement);
    }

    initCamera() {
        this._camera = SceneSetup.camera(window.innerWidth, window.innerHeight);
        this._camera.position.set(
            TOWER_POSITIONS[this._playerIndex].x + CAMERA_PROPS.position.x,
            TOWER_POSITIONS[this._playerIndex].y + CAMERA_PROPS.position.y,
            TOWER_POSITIONS[this._playerIndex].z + CAMERA_PROPS.position.z
        );
    }

    initScene() {
        this._scene = SceneSetup.scene();

        this._scene.add(this._particleRenderer);
    }

    initLights() {
        this._hemiLight = SceneSetup.HemiLight();
        // this._scene.add(this._hemiLight);

        for (let i = 0; i < this._lobbyInfo.players.length; i++) {
            const light = SceneSetup.SpotLight();
            light.position.set(
                TOWER_POSITIONS[i].x + SPOT_LIGHT_PROPS.position.x,
                TOWER_POSITIONS[i].y + SPOT_LIGHT_PROPS.position.y,
                TOWER_POSITIONS[i].z + SPOT_LIGHT_PROPS.position.z
            );

            light.target.position.set(
                TOWER_POSITIONS[i].x,
                TOWER_POSITIONS[i].y,
                TOWER_POSITIONS[i].z
            );

            this._spotLightArray.push(light);
            this._scene.add(light.target);
            this._scene.add(light);
        }
    }

    initStats() {
        this._stats = SceneSetup.StatGUI();
        document.body.appendChild(this._stats.dom);
    }

    initCameraControl() {
        this._camControls = new OrbitControls(
            this._camera,
            this._uiRenderer.domElement
        );
        this._camControls.screenSpacePanning = false;
        this._camControls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
        };

        this._camControls.touches = {
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.DOLLY_ROTATE,
        };
        this._camControls.enableRotate = false;
        this._camControls.enableDamping = true;
        this._camControls.dampingFactor = 0.05;

        this._camControls.minPolarAngle = ANG2RAD(10);
        this._camControls.maxPolarAngle = ANG2RAD(65);
        this._camControls.maxDistance = 100;
        this._camControls.minDistance = 25;

        this._camControls.target.set(
            TOWER_POSITIONS[this._playerIndex].x,
            TOWER_POSITIONS[this._playerIndex].y,
            TOWER_POSITIONS[this._playerIndex].z
        );
    }

    initGridHelper() {
        const size = 500;
        const divisions = 500;

        const color = new THREE.Color(0x333333);

        const gridHelper = new THREE.GridHelper(size, divisions, color, color);
        gridHelper.position.y = 0.01;

        this._gridHelper = gridHelper;
    }

    onResize() {
        const aspectWidth = window.innerWidth;
        const aspectHeight = window.innerHeight;
        this._camera.aspect = aspectWidth / aspectHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(aspectWidth, aspectHeight);
        this._uiRenderer.setSize(aspectWidth, aspectHeight);
    }

    getScene() {
        return this._scene;
    }

    getCamera() {
        return this._camera;
    }

    addGrid() {
        this.getScene().add(this._gridHelper);
    }

    removeGrid() {
        this.getScene().remove(this._gridHelper);
    }

    initialize() {
        this.initRenderer();
        this.initCamera();
        this.initScene();
        this.initLights();
        this.initStats();
        this.initCameraControl();
        this.initGridHelper();

        window.addEventListener("resize", this.onResize.bind(this), false);
    }

    render() {
        const delta = this._clock.getDelta();
        this._particleRenderer.update(delta);

        this._stats.update();

        this._camControls.update();

        this._renderer.render(this._scene, this._camera);

        this._uiRenderer.render(this._scene, this._camera);
    }

    dispose() {
        this._renderer.domElement.remove();
        this._renderer.dispose();

        this._uiRenderer.domElement.remove();

        disposeMesh(this._scene);
    }
}
