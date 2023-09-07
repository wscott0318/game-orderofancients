import { gsap, Circ } from "gsap";
import { SceneRenderer } from "./rendering/SceneRenderer";
import * as THREE from "three";
import { CAMERA_POS } from "../../constants";
import { TOWER_POSITION } from "../../constants/tower";

export class AnimationManager {
    _sceneRenderer: SceneRenderer;
    _towerPosition: THREE.Vector3;
    _camera: THREE.Camera;
    _spotLight: THREE.SpotLight;
    _hemiLight: THREE.HemisphereLight;

    constructor({ sceneRenderer }: any) {
        this._sceneRenderer = sceneRenderer;
        this._camera = sceneRenderer._camera;

        this._towerPosition = new THREE.Vector3(
            TOWER_POSITION.x,
            TOWER_POSITION.y,
            TOWER_POSITION.z
        );

        this._spotLight = this._sceneRenderer._scene.children[1];
        this._hemiLight = this._sceneRenderer._scene.children[2];
    }

    camera_Down() {
        gsap.to(this._camera.position, {
            ...CAMERA_POS.sideView,
            duration: 3,
            ease: Circ.easeIn,
            onUpdate: () => {
                this._camera.lookAt(this._towerPosition);
            },
        });
    }

    camera_Rotate() {
        const camera2DPos = new THREE.Vector2(
            this._camera.position.x,
            this._camera.position.y
        );
        const tower2DPos = new THREE.Vector2(
            this._towerPosition.x,
            this._towerPosition.y
        );
        const rotPos = {
            radius: camera2DPos.distanceTo(tower2DPos),
            angle: 0,
        };

        gsap.to(rotPos, {
            angle: -Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: "none",
            onUpdate: () => {
                this._camera.position.x =
                    Math.cos(rotPos.angle) * rotPos.radius;
                this._camera.position.z =
                    Math.sin(rotPos.angle) * rotPos.radius;
                this._camera.lookAt(this._towerPosition);
            },
        });
    }

    camera_diorama() {
        const camPos = this._camera.position;
        gsap.to(camPos, {
            x: Math.random() * 60 - 30,
            z: Math.random() * 60 - 30,
            y: Math.random() * 10 + 10,
            duration: 10,
            repeat: -1,
            onUpdate: () => {
                this._camera.lookAt(this._towerPosition);
            },
        });
    }

    light_attention() {
        gsap.from(this._spotLight, {
            angle: Math.PI / 50,
            duration: 3,
            ease: Circ.easeIn,
        });
        gsap.from(this._hemiLight, {
            intensity: 0,
            duration: 3,
            ease: Circ.easeIn,
        });
    }
}
