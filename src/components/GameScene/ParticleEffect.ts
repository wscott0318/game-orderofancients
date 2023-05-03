import AssetsManager from "./AssetsManager";
import { createExplosion } from "./Particles/Explosion2";
import { SceneRenderer } from "./rendering/SceneRenderer";

export * as THREE from "three";

export class ParticleEffect {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;

    constructor({ sceneRenderer, assetsManager }: any) {
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;
    }

    addExplosion(position: THREE.Vector3) {
        const explosion = createExplosion(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        explosion.position.x = position.x;
        explosion.position.y = position.y;
        explosion.position.z = position.z;

        explosion.scale.set(0.1, 0.1, 0.1);

        this.sceneRenderer.getScene().add(explosion);
    }

    tick() {}
}
