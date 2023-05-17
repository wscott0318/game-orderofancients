import { gsap, Circ } from "gsap";
import * as THREE from "three";
import { SpotLight } from "../rendering/SceneSetting";
export class lightAnimationManager {
    // _sceneRenderer: SceneRenderer;
    _spotLight: THREE.SpotLight;
    _hemiLight: THREE.HemisphereLight;
    constructor({ spotLight, hemiLight }: any) {
        this._spotLight = spotLight;
        this._hemiLight = hemiLight;
        this.initialize();
    }
    initialize() {
        this.initCenterAttentionAnimation();
    }
    initCenterAttentionAnimation() {
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
