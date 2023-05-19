import { gsap, Circ } from "gsap";
import { SceneRenderer } from "../rendering/SceneRenderer";
import * as THREE from "three";
import { CAMERA_POS } from "../../../constants";

export class CameraAnimationManager {
    _sceneRenderer: SceneRenderer;
    _camera: THREE.Camera;
    _towserPosition: THREE.Vector3;

    _cameraDown: any;
    _rotateAroundToser: any;

    constructor({ sceneRenderer, towerPosition }: any) {
        this._sceneRenderer = sceneRenderer;
        this._camera = sceneRenderer._camera;
        this._towserPosition = towerPosition;
        this.initialize();
    }
    initialize() {
        // this.initDownAnimation();
        this.dioramaAnimation();
    }

    initDownAnimation() {
        gsap.to(this._camera.position, {
            ...CAMERA_POS.sideView,
            duration: 3,
            ease: Circ.easeIn,
            onUpdate: () => {
                this._camera.lookAt(this._towserPosition);
            },
            // onComplete: this.initRotateAroundToserAnimation.bind(this),
        });
    }

    initRotateAroundToserAnimation() {
        const camera2DPos = new THREE.Vector2(
            this._camera.position.x,
            this._camera.position.y
        );
        const tower2DPos = new THREE.Vector2(
            this._towserPosition.x,
            this._towserPosition.y
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
                this._camera.lookAt(this._towserPosition);
            },
        });
    }

    dioramaAnimation() {
        const camPos = this._camera.position;
        gsap.to(camPos, {
            x: Math.random() * 60 - 30,
            z: Math.random() * 60 - 30,
            y: Math.random() * 10 + 10,
            duration: 4,

            onUpdate: () => {
                this._camera.lookAt(this._towserPosition);
            },

            onComplete: this.dioramaAnimation.bind(this),
        });
    }
}
